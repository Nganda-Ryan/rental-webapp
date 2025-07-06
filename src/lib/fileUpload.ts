import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const R2 = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_BUCKET_DOMAIN,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function uploadFile(file: File, filePath: string) {
  if (!file) {
    return { error: "No file provided", filePath: null, code: "no-file-provided" };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const bucket = process.env.ASSET_BUCKET_NAME!; // ex: "rentaldev"

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: filePath, // ex: Documents/Assets/AS-1751704976291/Verification/DEED_SALE.pdf
    Body: buffer,
    ContentType: file.type,
    ACL: "public-read",
  });

  try {
    await R2.send(command);
    return { error: null, filePath, code: null };
  } catch (error: any) {
    return {
      filePath: null,
      error: "A technical error occurred. Please try again.",
      code: error.code ?? "unknown",
    };
  }
}