import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  region: process.env.AWS_REGION,
});

const MAX_SIZE = 500 * 1024;

const compressImage = async (buffer: Buffer, contentType: string) => {
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
      throw new Error("IMAGE_TOO_LARGE_AFTER_COMPRESSION");
    }

    return compressedBuffer;
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "IMAGE_TOO_LARGE_AFTER_COMPRESSION"
    ) {
      throw error;
    }

    throw new Error("IMAGE_COMPRESSION_FAILED");
  }
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File;

    if (!image) {
      return NextResponse.json(
        { error: { code: "IMAGE_NO_FILE" } },
        { status: 400 }
      );
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

    let code = "IMAGE_UPLOAD_FAILED";

    if (error instanceof Error) {
      if (error.message === "IMAGE_TOO_LARGE_AFTER_COMPRESSION") {
        code = "IMAGE_TOO_LARGE_AFTER_COMPRESSION";
      } else if (error.message === "IMAGE_COMPRESSION_FAILED") {
        code = "IMAGE_COMPRESSION_FAILED";
      }
    }

    return NextResponse.json({ error: { code } }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: { code: "IMAGE_URL_REQUIRED" } },
        { status: 400 }
      );
    }

    let key: string;

    try {
      const url = new URL(imageUrl);
      key = url.pathname.replace(/^\//, "");
    } catch {
      key = imageUrl.split("/").pop() ?? imageUrl;
    }

    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    });

    await s3.send(command);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: { code: "IMAGE_DELETE_FAILED" } },
      { status: 500 }
    );
  }
}
