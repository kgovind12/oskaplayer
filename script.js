document.getElementById("how-to-play-btn").addEventListener("click", () => {
    document.getElementById("modal-overlay").classList.remove("hidden");
});

document.getElementById("modal-close-btn").addEventListener("click", () => {
    document.getElementById("modal-overlay").classList.add("hidden");
});