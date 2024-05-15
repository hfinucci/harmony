export const ORG_IMAGE_DEFAULT =
    "http://localhost:54321/storage/v1/object/public/orgs_images/org-default-image.png";

export const toBase64 = (file: File) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
