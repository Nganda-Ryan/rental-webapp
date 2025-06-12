"use server";

import axios, { AxiosInstance } from "axios";
import { createSession, verifySession } from "@/lib/session";
import { ICreateUserParam, SeachUserParams } from "@/types/user";
import { signIn, signUp } from "@/lib/auth";
import { getCloudflareUser } from "@/database/userService";
import { SessionPayload } from "@/types/authTypes";


export async function searchUser(params: SeachUserParams) {
  try {
    const session = await verifySession();
    const apiClient: AxiosInstance = axios.create({
        baseURL: process.env.SEARCH_WORKER_ENDPOINT,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`,
        },
    });
    const response = await apiClient.request({
      method: 'GET',
      url: '/api/v1/User',
      params
    });

    return {
      code: null,
      error: null,
      data: response.data
    }
  } catch (error: any) {
    console.log('-->error', error)
    return {
      code: error.code ?? "unknown",
      error: error.response?.data?.message ?? "An unexpected error occurred",
      data: null
    }
  }
}


export async function createUser(payload: ICreateUserParam){
  try {
    let tempUserInfo = null;
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
            data: null
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
              data: cfUserResponse.user,
              error: null,
              code: "",
            }
          }

          console.log('email exist inside firebase, and signed in with good password, Cloudflare user doesnt exist');
        }
      } else {
        return {
          code: firebaseSignUpResult.code,
          error: firebaseSignUpResult.error,
          data: null
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
    
      const rolePriority = ['ADMIN', 'SUPPORT', 'LANDLORD', 'RENTER'];
      const activeRole = rolePriority.find(role => roles.includes(role)) ?? roles[0];
    
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
        data: firebaseSignUpResult.user,
        code: "",
      }
    }
    
  } catch (error: any) {
    return {
      data: null,
      code: "unknown",
      message: error.message,
    };
  }
}
