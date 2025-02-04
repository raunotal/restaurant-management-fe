import Image from "next/image";
import React, { useState } from "react";
import placeholderImage from "@/assets/images/recipe-image-placeholder.png";
import uploadIcon from "@/public/upload.svg";

type ImageUploadProps = {
  selectedImage?: File | null;
  onChange: (file: File) => void;
};

export default function ImageUpload(props: ImageUploadProps) {
  const { onChange } = props;
  const [previewImage, setPreviewImage] = useState<
    string | ArrayBuffer | null
  >();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setPreviewImage(null);
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewImage(fileReader.result);
    };
    fileReader.readAsDataURL(file);
    onChange(file);
  };

  return (
    <div className="aspect-square relative inset-0 w-full h-full rounded-2xl overflow-hidden">
      {previewImage && (
        <Image
          src={typeof previewImage === "string" ? previewImage : ""}
          alt=""
          fill
          className="h-full object-cover"
        />
      )}
      {!previewImage && (
        <>
          <div className="absolute inset-0 bg-white/70 w-full h-full" />
          <div className="absolute inset-0 flex items-center justify-center flex-col gap-3 text-sm text-center">
            <div className="bg-gray-100 p-2 rounded-full">
              <Image src={uploadIcon} alt="Upload" />
            </div>
            <div className="p-1">
              <span className="font-semibold">Klõpsa </span>
              <span>või lohista fail</span>
              <div>PNG, JPG või JPEG (max. 5MB)</div>
            </div>
          </div>
          <Image
            src={placeholderImage}
            alt=""
            className="h-full object-cover"
          />
          <input
            type="file"
            onChange={handleImageChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </>
      )}
    </div>
  );
}
