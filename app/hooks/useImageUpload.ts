import { useState } from "react";
import { UseFormSetValue, UseFormGetValues } from "react-hook-form";
import toast from "react-hot-toast";
import { uploadImageAction } from "../actions/upload.actions";

export const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        const MAX_DIM = 1000;
        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get 2D context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

interface Variant {
  colorHex: string | null;
  images: string[];
}

export function useImageUpload(
  setValue: UseFormSetValue<any>,
  getValues: UseFormGetValues<any>,
  watchedVariants: Variant[]
) {
  const [uploadingCount, setUploadingCount] = useState(0);
  const [uploadingImages, setUploadingImages] = useState<Record<string, boolean>>({});

  const handleFileSelectForVariant = async (index: number, files: FileList) => {
    const fileArray = Array.from(files);
    const currentImages = watchedVariants[index]?.images || [];

    if (currentImages.length + fileArray.length > 4) {
      toast.error("You can upload a maximum of 4 images for a single color.");
      return;
    }

    const validFiles = fileArray.filter((file) => {
      const isValidType = ["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      return isValidType && isValidSize;
    });

    if (validFiles.length < fileArray.length) {
      toast.error("Some files were skipped. Only PNG, JPG, and WEBP under 5MB are allowed.");
    }

    if (validFiles.length === 0) return;

    // Load and compress files
    const compressPromises = validFiles.map((file) => compressImage(file));

    try {
      const base64Urls = await Promise.all(compressPromises);

      // Add base64 placeholders to form state to show preview instantly
      const latestImages = getValues(`variants.${index}.images`) || [];
      const updatedImages = [...latestImages, ...base64Urls];
      setValue(`variants.${index}.images`, updatedImages, { shouldValidate: true });

      // Mark the placeholder URLs as uploading
      setUploadingCount((prev) => prev + base64Urls.length);
      setUploadingImages((prev) => {
        const next = { ...prev };
        base64Urls.forEach((url) => {
          next[url] = true;
        });
        return next;
      });

      // Upload files in parallel
      base64Urls.forEach(async (base64Url) => {
        try {
          const res = await uploadImageAction(base64Url);

          if (res.ok && res.url) {
            // Replace base64 URL with secure_url in form state
            const currentList: string[] = getValues(`variants.${index}.images`) || [];
            const indexInList = currentList.indexOf(base64Url);
            if (indexInList !== -1) {
              const nextList = [...currentList];
              nextList[indexInList] = res.url;
              setValue(`variants.${index}.images`, nextList, { shouldValidate: true });
            }
          } else {
            toast.error(res.message || "Failed to upload image to Cloudinary.");
            const currentList: string[] = getValues(`variants.${index}.images`) || [];
            const nextList = currentList.filter((img) => img !== base64Url);
            setValue(`variants.${index}.images`, nextList, { shouldValidate: true });
          }
        } catch (uploadError) {
          console.error("Upload error:", uploadError);
          toast.error("Failed to upload image.");
          const currentList: string[] = getValues(`variants.${index}.images`) || [];
          const nextList = currentList.filter((img) => img !== base64Url);
          setValue(`variants.${index}.images`, nextList, { shouldValidate: true });
        } finally {
          // Clean up uploading state for this file
          setUploadingImages((prev) => {
            const next = { ...prev };
            delete next[base64Url];
            return next;
          });
          setUploadingCount((prev) => Math.max(0, prev - 1));
        }
      });
    } catch (err) {
      console.error("Error processing images:", err);
      toast.error("Failed to process images.");
    }
  };

  return {
    uploadingCount,
    uploadingImages,
    handleFileSelectForVariant,
  };
}
