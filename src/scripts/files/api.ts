import { inferRemoteSize } from "astro:assets";
import { authFetch } from "../../utils/auth";

const API = import.meta.env.PUBLIC_API_URL;

export type FileItem = {
    id: string;
    filename: string;
    size: number;
    modtime: string;
};

export async function listFiles(): Promise<FileItem[] | null> {
    try {
        const response = await authFetch(`${API}/api/files/list`);
        if (!response.ok) {
            console.error("Failed to fetch file list:", response.statusText)
            return null;
        }
        const data = await (response.json()) as { files: FileItem[] };
        return data.files;
    } catch (err) {
        console.error("Error fetching file list:", err);
        return null;
    }
}

export async function deleteFile(id: string): Promise<Boolean> {
    try {
        const response = await authFetch(
            `${API}/api/files/delete/${encodeURIComponent(id)}`,
            {
                method: "DELETE",
            },
        );
        return response.ok;
    } catch (err) {
        console.log("Error deleting file:", err);
        return false;
    }
}
export async function renameFile(id: string, filename: string): Promise<boolean> {
    try {
        const response = await authFetch(
            `${API}/api/files/rename/${encodeURIComponent(id)}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filename }),
        });
        if (!response.ok) {
            console.log("Failed to rename:", response.statusText);
        }
        return response.ok;
    } catch (err) {
        console.log("Error renaming file:", err);
        return false;
    }
}
export async function downloadFile(file: FileItem): Promise<void> {
    try {
        const response = await authFetch(`${API}/api/files/download/${encodeURIComponent(file.id)}`);
        if (!response.ok) {
            console.error("Failed to download file:", response.statusText)
            return;
        }
        const url = URL.createObjectURL(await response.blob());
        const a = document.createElement("a");
        a.href = url;
        a.download = file.filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    } catch (err) {
        console.error("Error downloading file:", err)
    }
}

//preview cache
const cache = new Map<string, string>();
const inFlight = new Map<string, Promise<string>>();

export function getPreviewUrl(id: string): Promise<string> {
    const cached = cache.get(id);
    if (cached) return Promise.resolve(cached);

    const pending = inFlight.get(id);
    if (pending) return pending;

    const promise = (async () => {
        try {
            const response = await authFetch(`${API}/api/files/preview/${encodeURIComponent(id)}`, {
                cache: "default",
            });
            if (!response.ok) {
                return "";
            }
            const url = URL.createObjectURL(await response.blob())
            cache.set(id, url);
            inFlight.delete(id);
            return url;
        } catch (err) {
            console.error("Error fetching preview:", err)
            return ""
        } finally {
            inFlight.delete(id);
        }
    })();
    inFlight.set(id, promise);
    return promise;
}
