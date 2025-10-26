"use server";


import { createSession, deleteSession, verifySession } from "@/lib/session";
import { getAuth as getAdminAuth } from "firebase-admin/auth";
import { signIn, signUp } from "@/lib/auth";
import { loginSchema, signUpSchema } from "@/lib/validations";
import { CreateUserType, ISetSecurityQuestion, IUserData } from "@/types/user";
import axios, { AxiosInstance } from "axios";
import { getCloudflareUser, me } from "@/database/userService";
import { ProfileDetail, SessionPayload } from "@/types/authTypes";
import { PROFILE_LIST } from "@/constant";
import { auth } from "@/lib/firebase";
import { adminAuth } from "@/lib/firebaseAdmin";



export async function login(formData: FormData) {
  try {
    const formatResult = loginSchema.safeParse(Object.fromEntries(formData));
    if (!formatResult.success) {
      return {
        code: "validation",
        error: formatResult.error.flatten().fieldErrors,
        user: null
      };
    }

    const { username, password } = formatResult.data;
    const firebaseResult = await signIn(username, password);
    if(firebaseResult.error || firebaseResult.user == null){
      return {
        code: firebaseResult.code,
        error: firebaseResult.error,
        user: null
      };
    }

    const token = firebaseResult.user.accessToken;
    const userId = firebaseResult.user.uid;
    const cfUserResult = await getCloudflareUser(userId, token);
    if(cfUserResult.error){
      return {
        code: cfUserResult.code,
        error: cfUserResult.error,
        user: null
      };
    }
    const cfUserInfo = cfUserResult.user.body.userData;
    // const cfUserInfo2: IUserData = cfUserResult2.data.body.userData;
    const roles = cfUserInfo.Profiles
      .filter((p: any) => p.IsActive)
      .map((p: any) => p.RoleCode);
    
    const rolePriority = ['ADMIN', 'SUPPORT', 'LANDLORD', 'RENTER'];
    const activeRole = rolePriority.find(role => roles.includes(role)) ?? roles[0];

    const sessionInfo = {
      ...cfUserInfo,
      accessToken: firebaseResult.user.accessToken,
      refreshToken: firebaseResult.user.refreshToken,
      userId,
      roles,
      activeRole,
    } as SessionPayload;
    await createSession(sessionInfo);
    const redirectMap: Record<string, string> = {
      'ADMIN': '/support',
      'SUPPORT': '/support',
      'LANDLORD': '/landlord',
      'RENTER': '/renter',
    };
    console.log('--->redirectMap[activeRole]', redirectMap[activeRole])
    return {
      error: null,
      user: firebaseResult.user.uid,
      code: "redirect",
      redirectTo: redirectMap[activeRole] ?? '/'
    }
  } catch (error: any) {
    console.log('-->login.Cloudflare', error.response)
    return {
      user: null,
      code: "unknown",
      message: error.message,
    };
  }
}

export async function signUpAction(_payload: any){
  try {
    const formatResult = signUpSchema.safeParse(_payload);
    let tempUserInfo = null;
    if (!formatResult.success) {
      return {
        code: "validation",
        error: formatResult.error.flatten().fieldErrors,
        user: null
      };
    }
  
    const payload = {
      email: _payload.email,
      firstname: _payload.firstname,
      lastname: _payload.lastname,
      gender: _payload.gender,
      phone: _payload.phone,
      password: _payload.password,
      userId: _payload.userId,
      addressData: {
        street: _payload.street,
        city: _payload.city,
        country: _payload.country,
      },
    } as CreateUserType
    const firebaseSignUpResult = await signUp(payload.email, payload.password);
    if(firebaseSignUpResult.error){
      //email already in use
      if(firebaseSignUpResult.code == "auth/email-already-in-use"){
        console.log('email exist inside firebase');
        const firebaseSignInResult = await signIn(payload.email, payload.password);
        //try to sign in the user but got wrong credential
        if(firebaseSignInResult.code == "auth/invalid-credential"){
          console.log('email exist inside firebase, but sign with wrong password');
          return {
            code: firebaseSignInResult.code,
            error: "This email address is already in use by another account. Use another one.",
            user: null
          };
        } //successfully sign in the user 
        else if(firebaseSignInResult.code == null && firebaseSignInResult.user !== null){
          tempUserInfo = firebaseSignInResult;
          console.log('email exist inside firebase, and signed in with good password');
          const cfUserResponse = await getCloudflareUser(firebaseSignInResult.user?.uid, firebaseSignInResult.user?.accessToken);
          console.log('cfUserResponse', cfUserResponse);
          if(cfUserResponse.user){
            console.log('email exist inside firebase, and signed in with good password, Cloudflare user exist');
            return {
              user: null,
              error: null,
              code: "redirect",
              redirectTo: "/renter"
            }
          }

          console.log('email exist inside firebase, and signed in with good password, Cloudflare user doesnt exist');
        }
      } else {
        return {
          code: firebaseSignUpResult.code,
          error: firebaseSignUpResult.error,
          user: null
        };
      }  
    } else {
      tempUserInfo = firebaseSignUpResult;
    }
    
    console.log("tempUserInfo", tempUserInfo)

    if(tempUserInfo && tempUserInfo.user !== null && firebaseSignUpResult.user !== null){
      const userId = firebaseSignUpResult.user.uid;
      const token = tempUserInfo.user.accessToken;
      const createdCfUser =  await axios.post(`${process.env.USER_WORKER_ENDPOINT}/api/v1/User`, {
        User: {...payload, userId: tempUserInfo.user.uid}
      },{
        headers: {
          Authorization: `Bearer ${tempUserInfo.user.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      const cfUserResponse = await getCloudflareUser(tempUserInfo.user.uid, token);
      const cfUserInfo = cfUserResponse.user.body.userData;
      const roles = cfUserInfo.Profiles
      .filter((p: any) => p.IsActive)
      .map((p: any) => p.RoleCode);
    
      const activeRole = PROFILE_LIST.find(role => roles.includes(role)) ?? roles[0];
    
      const sessionInfo = {
        ...cfUserInfo,
        accessToken: firebaseSignUpResult.user.accessToken,
        refreshToken: firebaseSignUpResult.user.refreshToken,
        userId,
        roles,
        activeRole,
      } as SessionPayload;
      await createSession(sessionInfo);
      const redirectMap: Record<string, string> = {
        'ADMIN': '/support',
        'SUPPORT': '/support',
        'LANDLORD': '/landlord',
        'RENTER': '/renter',
      };
      console.log('--->redirectMap[activeRole]', redirectMap[activeRole])
      return {
        error: null,
        user: firebaseSignUpResult.user,
        code: "redirect",
        redirectTo: redirectMap[activeRole] ?? '/'
      }
    }
    
  } catch (error: any) {
    // console.log('-->signUpAction.Cloudflare', error)
    return {
      user: null,
      code: "unknown",
      message: error.message,
    };
  }
}

export async function getProfile(){
  try {
    const session = await verifySession();
    const rolePriority = PROFILE_LIST;
    // console.log('-->session', session)
    const sortedRoles = [...(session?.roles || [])].sort(
      (a, b) => rolePriority.indexOf(a) - rolePriority.indexOf(b)
    );
    const _data: ProfileDetail = session;
    _data.roles = sortedRoles;
    return {
      data: _data,
      error: null,
      code: null
    };
  } catch (error: any) {
    console.log('-->error', error)
    const isRedirect = error.digest?.startsWith('NEXT_REDIRECT');
    if (isRedirect) {
      return {
        data: null,
        error: 'Session expired',
        code: 'SESSION_EXPIRED',
      };
    }
    return {
      code: error.code ?? "unknown",
      error: error.response?.data?.message ?? "An unexpected error occurred",
      data: null
    }
  }
}


export async function logout() {
  await deleteSession();
  // redirect("/signin");
}

export async function changePassword(currentPassword: string, newPassword: string) {
  try {
    // Vérifier la session et récupérer le token
    const session = await verifySession();
    const token = session.accessToken;

    // Vérifier le token pour obtenir le uid
    const decodedToken = await getAdminAuth().verifyIdToken(token);
    const uid = decodedToken.uid;

    // Mettre à jour le mot de passe côté serveur
    await getAdminAuth().updateUser(uid, { password: newPassword });

    return {
      data: "success",
      error: null,
      code: null,
    };
  } catch (error: any) {
    console.error("-->error", error);

    const isRedirect = error.digest?.startsWith("NEXT_REDIRECT");
    if (isRedirect) {
      return {
        data: null,
        error: "Session expired",
        code: "SESSION_EXPIRED",
      };
    }

    let message = "An unexpected error occurred";
    switch (error.code) {
      case "auth/requires-recent-login":
        message = "Please log in again to change your password.";
        break;
      case "auth/weak-password":
        message = "The new password is too weak. Minimum 6 characters required.";
        break;
      case "auth/wrong-password":
        message = "The current password is incorrect.";
        break;
      default:
        message = "Failed to change password. Please try again.";
    }

    return {
      code: error.code ?? "unknown",
      error: error.message ?? message,
      data: null,
    };
  }
}

export async function changeEmail(newEmail: string) {
  try {
    const session = await verifySession();
    const decodedToken = await adminAuth.verifyIdToken(session.accessToken);

    await adminAuth.updateUser(decodedToken.uid, {
      email: newEmail,
    });

    return {
      data: "success",
      error: null,
      code: null,
    };
  } catch (error: any) {
    console.error("-->error", error);

    let message = "An unexpected error occurred";
    switch (error.code) {
      case "auth/email-already-in-use":
        message = "This email is already in use.";
        break;
      case "auth/invalid-email":
        message = "The provided email is invalid.";
        break;
      default:
        message = "Failed to change email. Please try again.";
    }

    return {
      code: error.code ?? "unknown",
      error: error.message ?? message,
      data: null,
    };
  }
}

export async function getSecurityQuestion () {
  try {
    const session = await verifySession();
    const token = session.accessToken;
    // console.log('token', token)

    const apiClient: AxiosInstance = axios.create({
      baseURL: process.env.USER_WORKER_ENDPOINT,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const response = await apiClient.request({
      method: 'GET',
      url: '/api/v1/User/Security'
    });

    
    return {
      code: 'success',
      error: null,
      data: response.data
    }
  } catch (error: any) {
    console.log('-->error', error.response)
    const isRedirect = error.digest?.startsWith('NEXT_REDIRECT');
    if (isRedirect) {
      return {
        data: null,
        error: 'Session expired',
        code: 'SESSION_EXPIRED',
      };
    }
    return {
      code: error.code ?? "unknown",
      error: error.response?.data?.message ?? "An unexpected error occurred",
      data: null
    }
  }
}

export async function setSecurityQuestion (param: ISetSecurityQuestion) {
  try {
    const session = await verifySession();
    const token = session.accessToken;

    const response = await axios.post(`${process.env.USER_WORKER_ENDPOINT}/api/v1/User/Security`, {
      Request : {
        ...param
      }
    },{
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return {
      code: 'success',
      error: null,
      data: response.data
    }
  } catch (error: any) {
    console.log('-->inviteManager.error', error)
    const isRedirect = error.digest?.startsWith('NEXT_REDIRECT');
    if (isRedirect) {
      return {
        data: null,
        error: 'Session expired',
        code: 'SESSION_EXPIRED',
      };
    }
    return {
      code: error.code ?? "unknown",
      error: error.response?.data?.message ?? "An unexpected error occurred",
      data: null
    }
  }

}

export async function sendPasswordResetEmail(email: string) {
  try {
    const { sendPasswordResetEmail: firebaseSendPasswordResetEmail } = await import('firebase/auth');
    const { auth } = await import('@/lib/firebase');

    await firebaseSendPasswordResetEmail(auth, email);

    return {
      success: true,
      error: null,
      code: null
    };
  } catch (error: any) {
    console.error('-->sendPasswordResetEmail.error', error);

    let message = "Failed to send password reset email";
    switch (error.code) {
      case "auth/user-not-found":
        message = "No account found with this email address";
        break;
      case "auth/invalid-email":
        message = "Invalid email address";
        break;
      case "auth/too-many-requests":
        message = "Too many requests. Please try again later";
        break;
      default:
        message = error.message || "An unexpected error occurred";
    }

    return {
      success: false,
      error: message,
      code: error.code ?? "unknown"
    };
  }
}
/*
  SESSION TEMPLATE
  {
    Code: 'xxxxx',
    AddressCode: '',
    Email: 'steveloicnganda@gmail.com',
    Firstname: 'Ryan',
    Gender: 'MALE',
    Lastname: 'NGANDA',
    NIU: 'NIU0VEK3MB25120',
    OtherEmail: null,
    OtherPhone: null,
    Phone: '+237690924753',
    Status: 'ACTIVE',
    AvatarUrl: '',
    IsVerified: 0,
    Profiles: [
      {
        Code: 'xxxxx@RENTER',
        UserCode: 'xxxxx',
        RoleCode: 'RENTER',
        IsActive: 1,
        Status: 'ACTIVE',
        CreatedAt: '2025-04-24'
      }
    ],
    Address: {
      Code: '',
      City: '',
      Country: '',
      Street: ''
    },
    Subscriptions: [],
    accessToken: '',
    refreshToken: ''
  }
*/