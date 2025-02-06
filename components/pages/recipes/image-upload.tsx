import Image from "next/image";
import React from "react";
import placeholderImage from "@/assets/images/recipe-image-placeholder.png";
import uploadIcon from "@/public/upload.svg";

type ImageUploadProps = {
  imageUrl?: string;
  selectedImage?: File | null;
  onChange: (file: File | null) => void;
};

export default function ImageUpload(props: ImageUploadProps) {
  const { imageUrl, selectedImage, onChange } = props;

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    onChange(file ?? null);
  };

  const hasImage = imageUrl || selectedImage;

  return (
    <div className="aspect-square relative inset-0 w-full rounded-2xl overflow-hidden">
      <>
        <div className="absolute inset-0 bg-white/70 w-full h-full" />
        <div className="absolute inset-0 flex items-center justify-center flex-col gap-3 text-sm text-center">
          <div className="bg-gray-100 p-2 rounded-full">
            <div className="absolute inset-0 flex items-center justify-center">
              {hasImage && (
                <Image
                  src={
                    selectedImage
                      ? URL.createObjectURL(selectedImage)
                      : imageUrl
                      ? imageUrl
                      : ""
                  }
                  alt=""
                  fill
                  className="h-full object-cover"
                  priority
                  sizes="100%"
                />
              )}
            </div>
          </div>
          <Image src={uploadIcon} alt="Upload" />
          <div className="p-1">
            <span className="font-semibold">Klõpsa </span>
            <span>või lohista fail</span>
            <div>PNG, JPG või JPEG (max. 5MB)</div>
          </div>
        </div>
        {!hasImage && (
          <Image
            src={placeholderImage}
            alt=""
            className="h-full object-cover"
            priority
          />
        )}
        <input
          type="file"
          onChange={handleImageChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </>
    </div>
  );
}
