// lib/firebaseAdmin.ts
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function getPrivateKey() {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!privateKey) {
    throw new Error("Missing FIREBASE_PRIVATE_KEY environment variable");
  }

  let normalizedKey = privateKey.trim();

  if (
    (normalizedKey.startsWith('"') && normalizedKey.endsWith('"')) ||
    (normalizedKey.startsWith("'") && normalizedKey.endsWith("'"))
  ) {
    normalizedKey = normalizedKey.slice(1, -1);
  }

  if (normalizedKey.includes("BEGIN PRIVATE KEY")) {
    return normalizedKey.replace(/\\n/g, "\n");
  }

  try {
    const decodedKey = Buffer.from(normalizedKey, "base64").toString("utf8").replace(/\\n/g, "\n");

    if (decodedKey.includes("BEGIN PRIVATE KEY")) {
      return decodedKey;
    }

    return normalizedKey.replace(/\\n/g, "\n");
  } catch {
    return normalizedKey.replace(/\\n/g, "\n");
  }
}

function initializeFirebaseAdmin() {
  if (getApps().length) {
    return;
  }

  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: getPrivateKey(),
    }),
  });
}

export function getFirebaseAdminAuth() {
  initializeFirebaseAdmin();
  return getAuth();
}
