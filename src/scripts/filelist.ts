import { formatSize } from "../utils/formatSize";
import { authFetch, getAccessToken } from "../utils/auth";

let fileList = document.getElementById(
    "file-list-body",
) as HTMLTableSectionElement;


async function fetchFiles() {
    const token = localStorage.getItem("token");
    const fileTable = document.getElementById(
        "file-list-body",
    ) as HTMLTableSectionElement;
    if (!getAccessToken()) {
    console.error("No token found");
    return;
  }
    try {
        const response = await authFetch(`${import.meta.env.PUBLIC_API_URL}/api/files/list`);
        if (!response.ok) {
            console.error("Failed to fetch file list:", response.statusText);
            return;
        }
        const data = await response.json();

        for (const file of data.files) {
            console.log(
                "Name:",
                file.filename,
                "Size:",
                formatSize(file.size),
            );
            const fileRow = document.createElement("tr");
            const NameCell = document.createElement("td");
            const SizeCell = document.createElement("td");
            const ModTimeCell = document.createElement("td");

            const DelCell = document.createElement("td");
            const DelButton = document.createElement("button");
            DelButton.className = "del-button";

            const DownloadCell = document.createElement("td");
            const DownloadButton = document.createElement('button')
            const DownloadIcon: HTMLImageElement = document.createElement("img")
            DownloadIcon.src = "/static/download.svg"
            DownloadButton.className = 'download-button';

            DownloadButton.appendChild(DownloadIcon)
            DownloadCell.appendChild(DownloadButton);
            DownloadButton.addEventListener("click", async () => {
                const token = localStorage.getItem("token")
                if (!token) return;

                try {
                    const response = await authFetch(
                        `${import.meta.env.PUBLIC_API_URL}/api/files/download/${encodeURIComponent(file.filename)}`);
                    if (!response.ok) {
                        console.log("failed to download file:", response.statusText);
                        return
                    }
                    const blob = await response.blob();
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a")
                    a.href = url;
                    a.download = file.filename;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    URL.revokeObjectURL(url);

                } catch (error) {
                    console.log("Error downloading file:", error);
                    return
                }
            })

            NameCell.colSpan = 3;
            NameCell.textContent = file.filename;
            NameCell.className = "col-name"

            SizeCell.colSpan = 1;
            SizeCell.textContent = formatSize(file.size);
            SizeCell.className = "col-size"

            ModTimeCell.colSpan = 1;
            const date = new Date(file.modtime);
            ModTimeCell.textContent = date.toLocaleDateString();
            ModTimeCell.className = "col-mod"

            DelCell.colSpan = 1;
            DelButton.textContent = "X";

            DelButton.addEventListener("click", async () => {
                const token = localStorage.getItem("token");
                if (!token) return;

                try {
                    const response = await authFetch(
                        `${import.meta.env.PUBLIC_API_URL}/api/files/delete/${encodeURIComponent(file.filename)}`,
                        {
                            method: "DELETE",
                        },
                    );
                    if (response.ok) {
                        fileRow.remove();
                        checkList();
                    } 
                } catch (error) {
                    console.log("Error deleting file:", error);
                }
            });

            fileRow.appendChild(NameCell);
            fileRow.appendChild(SizeCell);
            fileRow.appendChild(ModTimeCell);
            fileRow.appendChild(DownloadCell);
            DelCell.appendChild(DelButton);
            fileRow.appendChild(DelCell);

            fileTable?.appendChild(fileRow);
        }
    } catch (error) {
        console.error("Error fetching file list:", error);
        return;
    }
}

fetchFiles().then(checkList);

async function checkList() {
    if (fileList.children.length === 0) {
        const noFilesRow = document.createElement("tr");
        const noFilesCell = document.createElement("td");
        noFilesCell.colSpan = 6;
        noFilesCell.textContent = "No files found";
        noFilesRow.appendChild(noFilesCell);
        fileList.appendChild(noFilesRow);
    }
}


function sortTable(n: number) {
    var table, rows, switching, i, x, y, xVal, yVal, shouldSwitch, dir, switchCount = 0;
    table = document.getElementById("file-list-table") as HTMLTableElement;
    switching = true;
    //sorting direction
    dir = "asc";
    while (switching) {
        switching = false;
        rows = table.rows;

        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;

            x = rows[i].getElementsByTagName("TD")[n] as HTMLTableCellElement;
            y = rows[i + 1].getElementsByTagName("TD")[n] as HTMLTableCellElement;

            if (!x || !y) continue;
            xVal = getCellValue(x, n);
            yVal = getCellValue(y, n);
            if (dir == "asc") {
                if (xVal > yVal) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (xVal < yVal) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode?.insertBefore(rows[i + 1], rows[i]);
            switching = true;

            switchCount++;
        } else {
            if (switchCount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }

}
document.querySelectorAll<HTMLElement>("#file-list-table th").forEach((th, i) => {
    th.addEventListener("click", () => sortTable(i));
});
// Parse into bytes for comparison
function parseSize(text: string): number {
    const match = text.trim().match(/^([\d.]+)\s*(B|KB|MB|GB)?$/i);
    if (!match) return NaN;
    const value = parseFloat(match[1]);
    const unit = (match[2] || "B").toUpperCase();
    const multipliers: Record<string, number> = {
        B: 1,
        KB: 1024,
        MB: 1024 * 1024,
        GB: 1024 * 1024 * 1024,
    };
    return value * (multipliers[unit] ?? 1);
}
function parseDate(text: string): number {
    const t = Date.parse(text);
    return isNaN(t) ? NaN : t;
}
// Column-specific value extractor
function getCellValue(cell: HTMLTableCellElement, n: number): string | number {
    const text = cell.innerHTML.trim();

    if (n === 1) {
        const size = parseSize(text);
        return isNaN(size) ? text.toLowerCase() : size;
    }

    if (n === 2) {
        const date = parseDate(text);
        return isNaN(date) ? text.toLowerCase() : date;
    }

    return text.toLowerCase();
}
document.addEventListener("files:refresh", () => { refreshFiles() });

async function refreshFiles() {
    const fileTable = document.getElementById("file-list-body") as HTMLTableSectionElement;
    fileTable.innerHTML = "";
    await fetchFiles();
    checkList();
}