import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import { SignInResult } from '@/types/authTypes';


export async function signUp(email: string, password: string): Promise<SignInResult> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userInfo = {
      uid: userCredential.user.uid,
      accessToken: await userCredential.user.getIdToken(),
      email: userCredential.user.email,
      refreshToken: userCredential.user.refreshToken,
    }
    return {
      user: userInfo,
      error: null,
      code: null,
    };
  } catch (err: any) {
    const code = err.code;

    let message = "A technical error occurred. Please try again.";

    if (code === "auth/email-already-in-use") {
      message = "This email address is already in use.";
    } else if (code === "auth/weak-password") {
      message = "The password is too weak.";
    } else if (code === "auth/invalid-email") {
      message = "Invalid email address.";
    } else if (code === "auth/operation-not-allowed") {
      message = "Email sign-up is disabled.";
    } else if (code === "auth/missing-password") {
      message = "Password is required.";
    } else if (code === "auth/internal-error") {
      message = "Internal error. Please check the fields and try again.";
    }

    // console.error("Firebase signUp error:", err);

    return {
      user: null,
      error: message,
      code: code ?? "unknown",
    };
  }
}



export async function signIn(email: string, password: string): Promise<SignInResult> {
  try {
    const signInInfo = await signInWithEmailAndPassword(auth, email, password);
    const userInfo = {
      uid: signInInfo.user.uid,
      accessToken: await signInInfo.user.getIdToken(),
      email: signInInfo.user.email,
      refreshToken: signInInfo.user.refreshToken,
    }
    
    return {
      user: userInfo,
      error: null,
      code: null,
    };
  } catch (err: any) {
    const code = err.code;

    let message = "Unable to sign in. Please try again.";

    if (code === "auth/user-not-found") {
      message = "No account is associated with this email.";
    } else if (code === "auth/wrong-password") {
      message = "Incorrect password.";
    } else if (code === "auth/invalid-email") {
      message = "Invalid email address.";
    } else if (code === "auth/too-many-requests") {
      message = "Too many attempts. Please try again later.";
    } else if (code === "auth/user-disabled") {
      message = "This account has been disabled.";
    } else if (code === "auth/invalid-credential") {
      message = "Incorrect email or password";
    }

    // console.error("Firebase signIn error:", err);

    return {
      user: null,
      error: message,
      code: code ?? "unknown",
    };
  }
}