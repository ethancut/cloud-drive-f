document.querySelectorAll<HTMLElement>("#file-list-table th").forEach((th, i) => {

    th.addEventListener("click", () => sortTable(th, i));
})

function updateArrows(active: HTMLElement, dir: "asc" | "desc") {
    document.querySelectorAll<HTMLElement>("#file-list-table th").forEach((th) => {
        const label = th.dataset.header;
        if (label === undefined) return; // skip columns without a label
        th.textContent = th === active ? label + (dir === "asc" ? " ↑" : " ↓") : label;
    });
}

function sortTable(header: HTMLElement, n: number) {
    var table, rows, switching, i, x, y, xVal, yVal, shouldSwitch, switchCount = 0;
    table = document.getElementById("file-list-table") as HTMLTableElement;
    switching = true;
    //sorting direction
    let dir: "asc" | "desc" = "asc";
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
    updateArrows(header, dir);
}

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