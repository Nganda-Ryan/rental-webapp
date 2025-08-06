"use server";

import axios, { AxiosInstance } from "axios";
import { verifySession } from "@/lib/session";
import { ICreateUserParam, SeachUserParams } from "@/types/user";
import { signIn, signUp } from "@/lib/auth";
import { getCloudflareUser } from "@/database/userService";
import { IPlanSubscription } from "@/types/PaymentTypes";


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


export async function createUser(payload: ICreateUserParam){
  try {
    const session = await verifySession();
    const token = session.accessToken;
    let tempUserInfo = null;
    const firebaseSignUpResult = await signUp(payload.email, payload.password);
    if(firebaseSignUpResult.error){
      //email already in use
      if(firebaseSignUpResult.code == "auth/email-already-in-use"){
        console.log('email exist inside firebase');
        const firebaseSignInResult = await signIn(payload.email, payload.password);
        return {
            code: firebaseSignInResult.code,
            error: "This email address is already in use by another account. Use another one.",
            data: null
          };
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
      console.log('Create CF user payload', {User: {...payload, userId: tempUserInfo.user.uid}});
      const createdCfUser =  await axios.post(`${process.env.USER_WORKER_ENDPOINT}/api/v1/User`, {
        User: {...payload, userId: tempUserInfo.user.uid}
      },{
        headers: {
          Authorization: `Bearer ${tempUserInfo.user.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('-->createdCfUser', createdCfUser);
      const cfUserResponse = await getCloudflareUser(tempUserInfo.user.uid, token);
    
      return {
        error: null,
        data: firebaseSignUpResult.user,
        code: "",
      }
    }
    
  } catch (error: any) {
    console.log('-->userAction.createUser.error', error)
    
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

export async function generatePaymentLink(planInfo: IPlanSubscription) {
  try {
    const session = await verifySession();
    const token = session.accessToken;
    
    const { price } = planInfo;

    // Validation manuelle
    if (!price || price <= 0) {
      return {
        code: 'invalid-amount',
        error: "Invalid amount",
        data: null
      };
    }

  
    
    const response = await axios.post(`${process.env.TRANSACTION_ENDPOINT}/Plan/Subscription`, {
      Subcription: {
        ...planInfo,
        userId: session.userId
      }
    },{
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return {
      error: null,
      data: response.data,
      code: "success",
    }
    
    
  } catch (error: any) {
    
    console.log('-->userAction.createUser.error', error)
    
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


