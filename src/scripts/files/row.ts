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
        <td class="col-actions">
        <button class="more-button" data-action="more"><img width="16" height="32" src="/static/more.svg" alt="More" /></button>
            <div class="actions-wrap"> 
                <button class="download-button" data-action="download">
                    <img src="/static/download.svg" alt="Download" />
                </button>
            
            
                <button class="del-button" data-action="delete"><img src="/static/delete.svg" alt="Delete" /></button>
            
            
                <button class="rename-button" data-action="rename">
                    <img src="/static/pen-square.svg" alt="Rename" />
                </button>
            </div>
        </td>
    </tr>
    `;
}