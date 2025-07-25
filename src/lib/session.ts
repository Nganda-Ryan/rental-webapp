import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { SessionPayload } from "@/types/authTypes";

const secretKey = process.env.AUTH_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

const MAX_REFRESH_WINDOW_MS = 30 * 60 * 1000;



export async function createSession(userInfo: SessionPayload) {
  try {
    const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000);
    const cookieStore = await cookies()

    const session = await encrypt({ ...userInfo, expiresAt });

    cookieStore.set('session', session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',//secure: true,
      expires: expiresAt,
      sameSite: 'lax',
      path: '/',
    })
  } catch (error:any) {
    console.log('@createSession', error, ' stack', error.stack)
  }
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}

export async function updateSession() {
  const session = (await cookies()).get('session')?.value
  const payload = await decrypt(session)
 
  if (!session || !payload) {
    return null
  }
 
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
 
  const cookieStore = await cookies()
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',//secure: true,
    expires: expires,
    sameSite: 'lax',
    path: '/',
  })
}


export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as SessionPayload;
  } catch (error) {
    console.log("Failed to verify session");
    return null;
  }
}
export const verifySession = cache(async () => {
  const cookie = (await cookies()).get('session')?.value;
  const session = cookie ? await decrypt(cookie) : null;

  const now = new Date();
  const expiresAt = session?.expiresAt ? new Date(session.expiresAt) : null;

  
  if (!session || !expiresAt) {
    redirect('/signin');
  }

  
  if (expiresAt > now) {
    return session;
  }

  
  const expiredSinceMs = now.getTime() - expiresAt.getTime();
  const withinGracePeriod = expiredSinceMs <= 30 * 60 * 1000;

  

  redirect('/signin');
});
