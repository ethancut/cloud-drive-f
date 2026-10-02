import type { FileItem } from "./api";
import { formatSize } from "../../utils/formatSize";

function escapeHtml(s: string): string {
    return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

export function renderRow(file: FileItem): string {
    return `
    <tr data-id="${escapeHtml(file.id)}">
        <td class="col-name">${escapeHtml(file.filename)}</td>
        <td class="col-size">${escapeHtml(formatSize(file.size))}</td>
        <td class="col-mod">${escapeHtml(new Date(file.modtime).toLocaleDateString())}</td>
        <td>
            <button class="download-button" data-action="download">
                <img src="/static/download.svg" alt="Download" />
            </button>
        </td>
        <td>
            <button class="del-button" data-action="delete">X</button>
        </td>
        <td>
            <button class="rename-button" data-action="rename">
                <img src="/static/pen-square.svg" alt="Rename" />
            </button>
        </td>
    </tr>
    `;
}