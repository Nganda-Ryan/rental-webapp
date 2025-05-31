import axios from "axios";

export async function getCloudflareUser(userId: string, token: string) {
    try {
        const response = await axios.get(`${process.env.USER_WORKER_ENDPOINT!}/api/v1/User?Code=${userId}`,{
            headers: {
              Authorization: `Bearer ${token}`,
            },
        })
        
        return {
            code: null,
            error: null,
            user: response.data
        };
    } catch (error: any) {
        console.log('-->getCloudflareUser.error', error.toJSON())
        return {
            code: error.code ?? "unknown",
            error: error.response?.data?.message ?? "An unexpected error occurred",
            user: null
        }
    }
}