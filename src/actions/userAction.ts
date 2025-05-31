"use server";

import axios, { AxiosInstance } from "axios";
import { verifySession } from "@/lib/session";
import { SeachUserParams } from "@/types/user";


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

export const runtime = "edge";