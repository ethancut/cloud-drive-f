import { renameFile, type FileItem } from "./api";

const modal = document.getElementById("rename-modal") as HTMLDialogElement;
const form = document.getElementById("rename-form") as HTMLFormElement;
const input = form.elements.namedItem("name") as HTMLInputElement;

let current = null as { file: FileItem; onRenamed: (name: string) => void } | null;

document.getElementById("rename-cancel")!.addEventListener("click", () => modal.close());
modal.addEventListener("click", (e) => { if (e.target === modal) modal.close(); });

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const target = current;
    if (!target) return;

    const newName = input.value.trim();
    if (!newName || newName === target.file.filename) return modal.close();

    if (await renameFile(target.file.id, newName)) {
        target.file.filename = newName;
        target.onRenamed(newName)
        modal.close();
    }
})

export function openRenameModal(file: FileItem, onRenamed: (name: string) => void) {
    current = { file, onRenamed };
    input.value = file.filename;
    modal.showModal();
    input.select();
}