"use server";

import axios, { AxiosInstance, isAxiosError } from "axios";
import { CreatePropertyType, IPropertyVerification, SeachPropertyParams } from "@/types/Property";
import { verifySession } from "@/lib/session";
import path from "node:path";
import { uploadFile } from "@/lib/fileUpload";

const testUser = {
  id: "1",
  username: "contact@cosdensolutions.io",
  password: "12345678",
};





export async function createAsset(asset: CreatePropertyType, coverFile: any) {
  try {
    const session = await verifySession();

    const token = session.accessToken;
    const cover = coverFile[0] as File;

    const coverPath = `${process.env.ASSET_FILE_NAME_SRC}/AS-${Date.now()}/COVER${path.extname(cover.name)}`;
    const R2CoverPath = `Assets/AS-${Date.now()}/COVER${path.extname(cover.name)}`;
    const uploadedCover = await uploadFile(cover, R2CoverPath);
    
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
    return {
      code: error.code ?? "unknown",
      error: error.response?.data?.message ?? "An unexpected error occurred",
      asset: null
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
    return {
      code: error.code ?? "unknown",
      error: error.response?.data?.message ?? "An unexpected error occurred",
      data: null
    }
  }
}

export async function searchAsset(params: SeachPropertyParams) {
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
      url: '/api/v1/Asset',
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
