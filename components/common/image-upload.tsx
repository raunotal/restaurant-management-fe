import Image from "next/image";
import React from "react";
import recipePlaceholder from "@/assets/images/recipe-image-placeholder.png";
import ingredientPlaceholder from "@/assets/images/ingredient-image-placeholder.jpg";
import uploadIcon from "@/public/upload.svg";
import { TrashIcon } from "@heroicons/react/24/solid";

type ImageUploadProps = {
  imageUrl?: string;
  selectedImage?: File | null;
  type: "recipe" | "ingredient";
  onChange: (file: File | null) => void;
  onRemove?: () => void;
};

export default function ImageUpload(props: ImageUploadProps) {
  const { imageUrl, selectedImage, type, onChange, onRemove } = props;

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    onChange(file ?? null);
  };

  const handleRemoveImage = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
    onRemove?.();
  };

  const hasImage = imageUrl || selectedImage;

  return (
    <div className="aspect-square relative inset-0 w-full rounded-2xl overflow-hidden">
      <>
        <div className="absolute inset-0 bg-white/80 w-full h-full" />
        <div className="absolute inset-0 flex items-center justify-center flex-col gap-3 text-sm text-center">
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
          <Image src={uploadIcon} alt="Upload" />
          <div className="p-1">
            <span className="font-semibold">Klõpsa </span>
            <span>või lohista fail</span>
            <div>PNG, JPG või JPEG (max. 5MB)</div>
          </div>
        </div>
        {!hasImage && (
          <Image
            src={type === "recipe" ? recipePlaceholder : ingredientPlaceholder}
            alt=""
            className="h-full object-cover"
            priority
          />
        )}
        {hasImage && onRemove && (
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black"
          >
            <TrashIcon className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Kustuta pilt</span>
          </button>
        )}
        <input
          type="file"
          onChange={handleImageChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept="image/*"
        />
      </>
    </div>
  );
}
