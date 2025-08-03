"use server";

import axios, { AxiosInstance } from "axios";
import { CreatePropertyType, IAssetApplication, IContractForm, IDashBoardParams, IInvoice, IPropertyApplication, IPropertyVerification, IUpdateAssetRequest, IUpdateInvoiceParam, SeachInvoiceParams, SeachPropertyParams } from "@/types/Property";
import { verifySession } from "@/lib/session";
import { getExtension } from "@/lib/utils";
import { uploadFile } from "@/lib/fileUpload";
import { IInviteManagerRequest } from "@/types/user";





export async function createAsset(asset: CreatePropertyType, coverFile: any) {
  try {
    const session = await verifySession();
    
    const token = session.accessToken;
    const cover = coverFile[0] as File;
    
    const coverPath = `${process.env.ASSET_MAIN_FILE_NAME_SRC}/AS-${Date.now()}/COVER${getExtension(cover.name)}`;
    const uploadedCoverPath = await uploadFile(cover, coverPath);
    if(uploadedCoverPath.error) return {error: "error while uploading ID CARD VERSO", code:uploadedCoverPath.code, data: null}
    
    const response = await axios.post(`${process.env.ASSET_WORKER_ENDPOINT}/api/v1/Asset`, {
      Asset: {
        ...asset,
        coverUrl: coverPath
      }
    },{
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('-->result', response);
    
    return {
      code: 200,
      error: null,
      asset: response.data
    }
  } catch (error: any) {
    console.log('-->createAsset.error', error)
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
      asset: null
    }
  }
}

export async function updateAsset(asset: IUpdateAssetRequest) {
  try {
    const session = await verifySession();
    const token = session.accessToken;

    console.log('typeOf', typeof asset.coverUrl);
    if(typeof asset.coverUrl == 'object') {
      const cover = asset.coverUrl as File[];
      console.log('FILE', cover);
      const coverPath = `${process.env.ASSET_FILE_NAME_SRC}/AS-${Date.now()}/COVER${getExtension(cover[0].name)}`;
      const uploadedCoverPath = await uploadFile(cover[0], coverPath);
      if(uploadedCoverPath.error) return {error: "error while uploading ID CARD VERSO", code:uploadedCoverPath.code, data: null}
      console.log('-->uploadedCoverPath', uploadedCoverPath);
      console.log('-->coverPath', coverPath);
      asset.coverUrl = 'Documents/' + coverPath;
    } else {
      asset.coverUrl = 'Documents/' + asset.coverUrl.split('/Documents/').at(-1)
    }
    console.log('-->payload', {
      ...asset,
      tag: (asset.tag.length > 0 && typeof asset.tag == "string") ? asset.tag.split(';') : [],
    })
    const response = await axios.put(`${process.env.ASSET_WORKER_ENDPOINT}/api/v1/Asset`, {
      Asset: {
        ...asset,
        tag: (asset.tag.length > 0 && typeof asset.tag == "string") ? asset.tag.split(';') : [],
      }
    },{
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    
    return {
      code: 200,
      error: null,
      data: response.data
    }
  } catch (error: any) {
    console.log('-->updateAsset.error', error)
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
      asset: null
    }
  }
}

export async function createContract(contract: IContractForm) {
  try {
    const session = await verifySession();
    const userProfile = session.Profiles.find((p: any) => p.RoleCode === 'RENTER');
    // console.log('-->Session:', session.Profiles.find((p: any) => p.RoleCode === 'RENTER'));
    
    const token = session.accessToken;
    
    console.log('-->payload', {
      ...contract,
      profilCode: session.Code
    })
    
    const response = await axios.post(`${process.env.CONTRACT_INVOICE_WORKER_ENDPOINT}/api/v1/Contract`, {
      Contract: {
        ...contract,
        profilCode: userProfile?.Code
      }
    },{
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('-->result', response);
    
    return {
      code: 200,
      error: null,
      contract: response.data
    }
  } catch (error: any) {
    console.log('-->createContract.error', error);
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
      contract: null
    }
  }
}

export async function getAsset(assetCode: string): Promise<any> {
  try {
    const session = await verifySession();
    const token = session.accessToken;
    const apiClient: AxiosInstance = axios.create({
      baseURL: process.env.ASSET_WORKER_ENDPOINT,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const response = await apiClient.request({
      method: 'GET',
      url: '/api/v1/Asset',
      params: {
        Code: assetCode
      },
    });
    
    return {
      code: null,
      error: null,
      data: response.data
    }
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

export async function searchAsset(params: SeachPropertyParams, profile: string) {
  try {
    console.log("-->profile", profile)
    const session = await verifySession();
    // console.log('-->session', session);
    const apiClient: AxiosInstance = axios.create({
      baseURL: process.env.SEARCH_WORKER_ENDPOINT,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });
    const response = await apiClient.request({
      method: 'GET',
      url: '/api/v1/Asset',
      params: {
        ...params,
        profileCode: session.Profiles.find(p => p.RoleCode === profile)?.Code
      }
    });
    
    return {
      code: null,
      error: null,
      data: response.data
    }
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

export async function getContract(contractCode: string) {
  try {
    const session = await verifySession();
    const token = session.accessToken;
    const apiClient: AxiosInstance = axios.create({
      baseURL: process.env.CONTRACT_INVOICE_WORKER_ENDPOINT,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const response = await apiClient.request({
      method: 'GET',
      url: '/api/v1/Contract',
      params: {
        Code: contractCode
      },
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

export async function createInvoice(invoice: IInvoice) {
  try {
    const session = await verifySession();
    const userProfile = session.Profiles.find((p: any) => p.RoleCode === 'LANDLORD');
    // console.log('-->Session:', userProfile);
    
    const token = session.accessToken;
    
    console.log({
      ...invoice,
      profilCode: userProfile?.Code
    })
    const response = await axios.post(`${process.env.CONTRACT_INVOICE_WORKER_ENDPOINT}/api/v1/Contract/Invoice`, {
      Invoice: {
        ...invoice,
        profilCode: userProfile?.Code
      }
    },{
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('-->result', response);
    
    return {
      code: 200,
      error: null,
      data: response.data
    }
  } catch (error: any) {
    console.log('-->createContract.error', error)
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

export async function updateInvoice(invoice: IUpdateInvoiceParam) {
  try {
    const session = await verifySession();
    const userProfile = session.Profiles.find((p: any) => p.RoleCode === 'LANDLORD');
    // console.log('-->Session:', userProfile);
    
    const token = session.accessToken;
    
    const payload = {
      ...invoice,
      profilCode: userProfile?.Code,
    };
    
    console.log(payload);
    
    const response = await axios.put(
      `${process.env.CONTRACT_INVOICE_WORKER_ENDPOINT}/api/v1/Contract/Invoice`,
      {
        Invoice: payload,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log('-->result', response);
    
    return {
      code: 200,
      error: null,
      data: response.data,
    };
  } catch (error: any) {
    console.log('-->updateInvoice.error', error);
    const isRedirect = error.digest?.startsWith('NEXT_REDIRECT');
    if (isRedirect) {
      return {
        data: null,
        error: 'Session expired',
        code: 'SESSION_EXPIRED',
      };
    }
    return {
      code: error.code ?? 'unknown',
      error: error.response?.data?.message ?? 'An unexpected error occurred',
      data: null,
    };
  }
}

export async function searchInvoice(params: SeachInvoiceParams) {
  try {
    const session = await verifySession();
    const token = session.accessToken;
    
    
    const response = await axios.post(`${process.env.SEARCH_WORKER_ENDPOINT}/api/v1/Invoices`, {
      query: {
        ...params
      }
    },{
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    return {
      code: null,
      error: null,
      data: response.data
    }
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

export async function terminateLease(contractCode: string) {
  try {
    const session = await verifySession();
    const token = session.accessToken;
    
    const response = await axios.delete(`${process.env.CONTRACT_INVOICE_WORKER_ENDPOINT}/api/v1/Contract`, {
      data: {
        Contract: {
          Code: contractCode
        }
      },
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    
    return {
      code: null,
      error: null,
      data: response.data
    }
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

export async function inviteManager (param: IInviteManagerRequest) {
  try {
    const session = await verifySession();
    const token = session.accessToken;
    
    const response = await axios.post(`${process.env.ASSET_WORKER_ENDPOINT}/api/v1/Asset/Request/Manager`, {
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
      code: 200,
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

export async function dashboard (params: IDashBoardParams) {
  try {
    const session = await verifySession();
    const token = session.accessToken;

    const apiClient: AxiosInstance = axios.create({
      baseURL: process.env.DASHBOARD_WORKER_ENDPOINT,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const response = await apiClient.request({
      method: 'GET',
      url: '/api/v1/Dashboard',
      params: {
        ...params
      },
    });

    
    return {
      code: null,
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

export async function applyHouse (param: IPropertyApplication ) {
  try {
    const session = await verifySession();
    
    const token = session.accessToken;

    const response = await axios.post(`${process.env.ASSET_WORKER_ENDPOINT}/api/v1/Asset/Apply`, {
      Request: {
        ...param,
        typeCode: ""
      }
    },{
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('-->result', response);
    
    return {
      code: 200,
      error: null,
      data: response.data
    }
  } catch (error: any) {
    console.log('-->createAsset.error', error)
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