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
    return { error: "No file provided", filePath: null, code: "no-file-provided"};
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const bucket = process.env.ASSET_BUCKET_NAME!;

  const command = new PutObjectCommand({
    Bucket: "Documents",
    Key: filePath,
    Body: buffer,
    ContentType: file.type,
    ACL: "public-read",
  });

  try {
    const result = await R2.send(command);
    // console.log("Bucket:", bucket);
    // console.log("Key:", filePath);
    // console.log("ContentType:", file.type);
    // console.log("Buffer size:", buffer.length);

    return { error: null, filePath: filePath, code: null };
  } catch (error: any) {
    console.error(error);
    return {
        filePath: null,
        error: "A technical error occurred. Please try again.",
        code: error.code ?? "unknown",
    };
  }
}
