"use server"


import { uploadFile } from '@/lib/fileUpload';
import { verifySession } from '@/lib/session';
import { getExtension } from '@/lib/utils';
import { IPropertyVerification } from '@/types/Property';
import { GetRequestsParams, ProfileApplication_T, VerifyRequestType } from '@/types/requestTypes';
import axios, { AxiosInstance } from 'axios';
import path from "node:path";

/**
 * Pre-configured Axios instance for API calls.
 * - baseURL: your API root URL
 * - timeout: request timeout in milliseconds
 * - headers: default headers for all requests
*/


/**
 * Performs a HTTP GET request to the `/requests` endpoint.
 *
 * @param params - Optional query parameters (undefined values are omitted)
 * @returns The JSON payload returned by the API
 * @throws Error with HTTP status and message if the request fails
 */
export async function getRequests(params: GetRequestsParams = {}): Promise<any> {
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
      url: '/api/v1/Request',
      params
    });

    return {
      code: null,
      error: null,
      data: response.data
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

export async function geRequestDetail(requestId: string): Promise<any> {
  try {
    const session = await verifySession();
    const apiClient: AxiosInstance = axios.create({
        baseURL: process.env.REQUEST_DETAIL_WORKER_ENDPOINT,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`,
        },
    });
    const response = await apiClient.request({
      method: 'GET',
      url: `/api/v1/Request?Code=${requestId}`,
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

export async function verifyRequest(verifInfo: VerifyRequestType, requestType: string): Promise<any> {
  try {
    const session = await verifySession();
    const apiClient: AxiosInstance = axios.create({
        baseURL: process.env.VERIFY_SEARCH_WORKER_ENDPOINT,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`,
        },
    });
    const response = await apiClient.request({
      method: 'POST',
      url: `/api/v1/${requestType}/Verification`,
      data: {
        Approval: verifInfo
      }
    });

    return {
      code: null,
      error: null,
      data: response.data
    }
  } catch (error: any) {
    console.log('-->error',error?.response?.data)
    
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

export async function requestLessorProfile(application: ProfileApplication_T){
  try {
    const session = await verifySession();
    const idCardRectoPath = `${process.env.PROFILE_FILE_NAME_SRC}/${session.Code}/CNI_RECTO${getExtension(application.idCardRecto.name)}`;
    const idCardVersoPath = `${process.env.PROFILE_FILE_NAME_SRC}/${session.Code}/CNI_VERSO${getExtension(application.idCardVerso.name)}`;
    const selfiePath = `${process.env.PROFILE_FILE_NAME_SRC}/${session.Code}/SELFIE${getExtension(application.selfie.name)}`;

    console.log('-->idCardRectoPath', idCardRectoPath);
    console.log('-->idCardVersoPath', idCardVersoPath);
    console.log('-->selfiePath', selfiePath);

    const uploadedIdCardRecto = await uploadFile(application.idCardRecto, idCardRectoPath);
    if(uploadedIdCardRecto.error) return {error: "error while uploading ID CARD RECTO", code:uploadedIdCardRecto.code, data: null}
    const uploadedIdCardVerso = await uploadFile(application.idCardVerso, idCardVersoPath);
    if(uploadedIdCardVerso.error) return {error: "error while uploading ID CARD VERSO", code:uploadedIdCardVerso.code, data: null}
    const uploadedSelfie = await uploadFile(application.selfie, selfiePath);
    if(uploadedSelfie.error) return {error: "error while uploading SELFIE", code:uploadedSelfie.code, data: null}

    const payload = {
      "description":application.description,
      "userId":session.Code,
      "body":[
        { 
            "Title": `CNI RECTO of ${session.Firstname} ${session.Lastname}`,
            "ContentUrl": uploadedIdCardRecto.filePath,
            "Type": "CNI_RECTO"
        },
        { 
            "Title": `CNI VERSO of ${session.Firstname} ${session.Lastname}`,
            "ContentUrl": uploadedIdCardVerso.filePath,
            "Type": "CNI_VERSO"
        },
        { 
            "Title": `SELFIE of ${session.Firstname} ${session.Lastname}`,
            "ContentUrl": uploadedSelfie.filePath,
            "Type": "SELFIE"
        } 
      ]
    }
    const response = await axios.post(`${process.env.USER_WORKER_ENDPOINT!}/api/v1/User/Request/Verification`,
      {
        Request: {...payload }
      },
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    )
    // console.log('-->response', response);
    return {
      code: null,
      error: null,
      data: response.data
    }
  } catch (error: any) {
    console.log('-->requestLessorProfile.error', error)
    
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

export async function requestPropertyVerification(application: IPropertyVerification) {
  try {
    const session = await verifySession();

    const docPathList = application.body.map(doc => {
      return doc.ContentUrl instanceof File ? `${process.env.ASSET_FILE_NAME_SRC}/${session.Code}/${doc.Type} ${getExtension(doc.ContentUrl.name)}` : '';
    });

    let uploadedDocs:  string [] = [];
    for(let index = 0; index < docPathList.length; index++) {
      const contentUrl = application.body[index].ContentUrl;
        
      if (contentUrl instanceof File) {
        const uploadedDoc = await uploadFile(contentUrl, docPathList[index]);
        if(uploadedDoc.error) console.log('-->error', uploadedDoc.error)
        uploadedDocs.push(`Asset/${session.Code}/${application.body[index].Type}${getExtension(contentUrl.name)}`);
      } else {
        uploadedDocs.push(contentUrl as string);
      }
    }



    const payload = {
      "userId":session.Code,
      "title": application.title,
      "assetCode": application.assetCode,
      "notes": application.notes,
      // "description":"please approve my property",
      "body": application.body.map((doc, index) => {
        return {
          "Title": doc.Title,
          "ContentUrl": uploadedDocs[index],
          "Type": doc.Type
        }
      })
    }
    
    console.log('-->payload', payload);

    const response = await axios.post(`${process.env.ASSET_WORKER_ENDPOINT!}/api/v1/Asset/Request/Verification`,
      {
        Request: {...payload }
      },
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    )

    
    return {
      code: null,
      error: null,
      data: response.data
    }
  } catch (error: any) {
    console.log('-->requestLessorProfile.error', error)
    
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
