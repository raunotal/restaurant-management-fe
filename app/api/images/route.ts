import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  region: process.env.AWS_REGION,
});

const compressImage = async (buffer: Buffer, contentType: string) => {
  const MAX_SIZE = 500 * 1024;
  let quality = 80;
  let compressedBuffer = buffer;

  try {
    if (buffer.length <= MAX_SIZE) return buffer;

    if (contentType === "image/jpeg" || contentType === "image/jpg") {
      while (compressedBuffer.length > MAX_SIZE && quality > 10) {
        compressedBuffer = await sharp(buffer).jpeg({ quality }).toBuffer();
        quality -= 10;
      }
    } else if (contentType === "image/png") {
      while (compressedBuffer.length > MAX_SIZE && quality > 10) {
        compressedBuffer = await sharp(buffer)
          .png({ compressionLevel: 9, quality })
          .toBuffer();
        quality -= 10;
      }
    } else if (contentType === "image/webp") {
      while (compressedBuffer.length > MAX_SIZE && quality > 10) {
        compressedBuffer = await sharp(buffer).webp({ quality }).toBuffer();
        quality -= 10;
      }
    }

    if (compressedBuffer.length > MAX_SIZE) {
      throw new Error("Could not compress image to under 500KB");
    }

    return compressedBuffer;
  } catch (error) {
    throw new Error("Error compressing image: " + error);
  }
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File;

    if (!image) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await image.arrayBuffer());
    const compressedBuffer = await compressImage(buffer, image.type);
    const fileName = `${Date.now()}-${image.name}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: fileName,
      Body: compressedBuffer,
      ContentType: image.type,
    });

    await s3.send(command);

    const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    return NextResponse.json({ success: true, imageUrl });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Error uploading image" },
      { status: 500 }
    );
  }
}
