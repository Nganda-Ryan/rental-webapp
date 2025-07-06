"use server";


import { createSession, decrypt, deleteSession, verifySession } from "@/lib/session";
import { redirect } from "next/navigation";
import { signIn, signUp } from "@/lib/auth";
import { loginSchema, signUpSchema } from "@/lib/validations";
import { CreateUserType } from "@/types/user";
import axios, { isAxiosError } from "axios";
import { FirebaseError } from "firebase/app";
import { getCloudflareUser } from "@/database/userService";
import { SessionPayload } from "@/types/authTypes";
import { cookies } from 'next/headers'
import { PROFILE_LIST } from "@/constant";



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
      'RENTER': '/tenants',
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
              redirectTo: "/tenants"
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
        'RENTER': '/tenants',
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
    return {
      data: {
        roles: sortedRoles,
        userId: session?.Code,
        Profiles: session?.Profiles,
        activeRole: sortedRoles[0],
        expiresAt: session?.expiresAt,
        firstname: session?.Firstname,
        lastname: session?.Lastname,
        email: session?.Email,
        avatarUrl: session?.AvatarUrl,
        phone: session?.Phone,
        address: session?.Address,
      },
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
  redirect("/signin");
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