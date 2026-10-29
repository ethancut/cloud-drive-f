const modal = document.getElementById("modal");
const openBtn = document.getElementById("openBtn");
const closeBtn = document.getElementById("closeBtn");



document.querySelectorAll<HTMLButtonElement>("[data-close-modal]").forEach((btn) => {
  btn.addEventListener("click", () => btn.closest("dialog")?.close())
})
document.querySelectorAll<HTMLDialogElement>("dialog.modal").forEach((dialog) => {
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  })
})
