import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import path from "path"; // Pour gérer l'extension

const R2 = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_BUCKET_DOMAIN,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const bucket = process.env.ASSET_BUCKET_NAME!;

  // Récupérer l'extension depuis le nom d'origine du fichier
  const originalFileName = file.name;
  const extension = path.extname(originalFileName); // e.g. ".jpg"
  const fileName = `${process.env.ASSET_FILE_NAME_SRC}/AS-${Date.now()}/COVER${extension}`;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: fileName,
    Body: buffer,
    ContentType: file.type,
    ACL: "public-read",
  });

  try {
    await R2.send(command);

    // const fileUrl = `${bucket}/${fileName}`;
    return NextResponse.json({ success: true, url: fileName });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
