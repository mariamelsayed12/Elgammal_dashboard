"use server";

import cloudinary from "../lib/cloudinary";


export async function uploadImageAction(file: string) {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: "products",
    });

    return {
      ok: true,
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error(error);

    return {
      ok: false,
      message: "Failed to upload image",
    };
  }
}