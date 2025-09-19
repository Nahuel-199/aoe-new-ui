import { UploadedTypes } from "@/types/uploadImage";


export const imageUpload = async (images: File[]): Promise<UploadedTypes[]> => {
    const imgArr: UploadedTypes[] = [];

    for (const item of images) {
        const formData = new FormData();
        formData.append("file", item);
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUD_UPDATE_PRESET || "");
        formData.append("cloud_name", process.env.NEXT_PUBLIC_CLOUD_NAME || "");

        try {
            const res = await fetch(process.env.NEXT_PUBLIC_CLOUD_API || "", {
                method: "POST",
                body: formData,
            });

            console.log("Cloud API:", process.env.NEXT_PUBLIC_CLOUD_API);

            if (!res.ok) {
                throw new Error(`Cloudinary upload failed with status: ${res.status}`);
            }

            const data = await res.json();

            if (data.error) {
                throw new Error(`Error subiendo la imagen: ${data.error.message}`);
            }

            imgArr.push({ public_id: data.public_id, url: data.secure_url });

        } catch (error) {
            console.error("Error uploading image to Cloudinary:", error);
        }
    }

    return imgArr;
};
