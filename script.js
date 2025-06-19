const modal = document.getElementById("modal");
const overlay = document.getElementById("modal-overlay");

document.getElementById("how-to-play-btn").addEventListener("click", openModal);

document.getElementById("modal-close-btn").addEventListener("click", closeModal);

// Optionally close when clicking outside the modal
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) {
    closeModal();
  }
});

function openModal() {
  overlay.classList.remove('hidden');

  // Slight delay ensures DOM has time to apply the transition cleanly
  setTimeout(() => {
    modal.classList.add('show');
  }, 10);
}

// Close modal with animation
function closeModal() {
  modal.classList.remove('show');

  // Wait for the transition to finish before hiding the overlay
  setTimeout(() => {
    overlay.classList.add('hidden');
  }, 150); // same as CSS transition duration
}