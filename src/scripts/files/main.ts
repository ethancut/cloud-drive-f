import { getAccessToken, redirectToLogin } from "../../utils/auth";
import { deleteFile, downloadFile, getPreviewUrl, listFiles, type FileItem } from "./api";
import { renderRow } from "./row";
import { openRenameModal } from "./renameModal";
import "./sort"


const tbody = document.getElementById('file-list-body') as HTMLTableSectionElement;
const previewDiv = document.getElementById("file-preview") as HTMLDivElement;
const previewImg = document.querySelector("#file-preview img") as HTMLImageElement;
const previewClose = document.querySelector("#file-preview button") as HTMLButtonElement;

const files = new Map<string, FileItem>();

function closePreview() {
    previewDiv.style.display = "none";
    previewImg.src = "";
    for (const row of Array.from(tbody.rows)) row.classList.remove("selected");
}


function showEmptyIfNeeded() {
    if (tbody.rows.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6">No files found</td></tr>`;
    }
}
async function loadFiles() {
    if (!getAccessToken()) {
        redirectToLogin();
        return;
    }
    const list = await listFiles();
    files.clear();
    tbody.innerHTML = "";
    for (const f of list ?? []) files.set(f.id, f);
    tbody.insertAdjacentHTML("beforeend", (list ?? []).map(renderRow).join(""));
    showEmptyIfNeeded();
}

previewClose.addEventListener("click", closePreview);

tbody.addEventListener("click", async (e) => {
    const button = (e.target as HTMLElement).closest<HTMLButtonElement>("button[data-action]");
    if (!button) return;

    const row = button.closest("tr")!;
    const file = files.get(row.dataset.id ?? "");
    if (!file) return;

    switch (button.dataset.action) {
        case "download":
            await downloadFile(file);
            break;
        case "delete":
            if (await deleteFile(file.id)) {
                files.delete(file.id);
                row.remove();
                showEmptyIfNeeded();
            }
            break;
        case "rename":
            openRenameModal(file, (name) => {
                row.querySelector(".col-name")!.textContent = name;
            });
            break;
    }
})

tbody.addEventListener("dblclick", async (e) => {
    const row = (e.target as HTMLElement).closest("tr");
    const file = row && files.get(row.dataset.id ?? "");
    if (!row || !file) return;

    for (const r of Array.from(tbody.rows)) r.classList.toggle("selected", r === row);

    const url = await getPreviewUrl(file.id);
    if (!url) return;
    previewImg.src = url;
    previewDiv.style.display = "inline-block";
})

document.addEventListener("files:refresh", loadFiles);

loadFiles();