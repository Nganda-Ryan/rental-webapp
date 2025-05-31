// app/api/upload-image/route.ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

const R2 = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_BUCKET_DOMAIN,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function uploadFile(file: File) {

  try {
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
  
    const buffer = Buffer.from(await file.arrayBuffer());
    const bucket = `${process.env.ASSET_BUCKET_NAME!}AS-${Date.now()}`;
    const fileName = "COVER"
  
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
      ACL: "public-read", // optional
    });
    await R2.send(command);

    const fileUrl = `${bucket}/${fileName}`;
    return{ success: true, url: fileUrl };
  } catch (error) {
    console.error(error);
    throw error
  }
}
