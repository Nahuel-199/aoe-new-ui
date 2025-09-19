export interface UploadedTypes {
    public_id: string;
    url: string;
}

export interface CloudinaryResponse {
    public_id: string;
    secure_url: string;
    error?: { message: string };
}