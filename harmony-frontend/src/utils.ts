import {useEffect, useRef} from "react";

export const BASE_URI = "http://127.0.0.1:3000";

export const ORG_IMAGE_DEFAULT =
    "http://localhost:54321/storage/v1/object/public/orgs_images/org-default-image.png";

export const ALBUM_IMAGE_DEFAULT
    = "http://localhost:54321/storage/v1/object/public/orgs_images/album-default-image.png";

export const toBase64 = (file: File) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

export function useInterval(callback: () => void, delay) {
    const savedCallback = useRef<()=>void>();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            if(savedCallback.current != undefined)
                savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}


export function formatDate(dateString: string): string {
    const date = new Date(dateString);

    const day = date.getDate();
    const month = date.toLocaleString(localStorage.getItem("i18nextLng"), { month: 'short' });
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day} ${month} ${year} ${hours}:${minutes}`;
}
