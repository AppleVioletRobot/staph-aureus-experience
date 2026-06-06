let items = [];
let currentStart = 0;
const imagesPerPage = 6;

async function loadGallery() {
    try {
        items = await fetch("images.json").then(response => response.json());

        if (items.length === 0) {
            console.error("No images found in images.json.");
            return;
        }

        padWithPlaceholders();
        showRandomSix();

    } catch (error) {
        console.error("Failed to load images.json", error);
    }
}

function padWithPlaceholders() {
    const remainder = items.length % imagesPerPage;

    if (remainder === 0) {
        return;
    }

    const placeholdersNeeded = imagesPerPage - remainder;

    for (let i = 0; i < placeholdersNeeded; i++) {
        items.push({
            file: "images/polaroid_placeholder.png",
            title: "Placeholder",
            placeholder: true
        });
    }
}

function renderGallery(startIndex) {
    currentStart = startIndex;

    const grid = document.getElementById("grid");
    grid.innerHTML = "";

    const visibleImages = items.slice(startIndex, startIndex + imagesPerPage);

    visibleImages.forEach(item => {
        const image = document.createElement("img");

        image.src = item.file;
        image.alt = item.title || "";

        if (!item.placeholder) {
            image.addEventListener("click", () => {
                openLightbox(item.file);
            });
        }

        grid.appendChild(image);
    });
}

function showRandomSix() {
    const maxStart = Math.max(0, items.length - imagesPerPage);
    const randomPage = Math.floor(Math.random() * Math.floor((maxStart + imagesPerPage) / imagesPerPage));
    const randomStart = randomPage * imagesPerPage;

    renderGallery(randomStart);
}

function showNextSix() {
    const maxStart = Math.max(0, items.length - imagesPerPage);
    let nextStart = currentStart + imagesPerPage;

    if (nextStart > maxStart) {
        nextStart = 0;
    }

    renderGallery(nextStart);
}

function showPreviousSix() {
    let previousStart = currentStart - imagesPerPage;

    if (previousStart < 0) {
        previousStart = Math.max(0, items.length - imagesPerPage);
    }

    renderGallery(previousStart);
}

function openLightbox(imagePath) {
    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightboxImage");

    lightboxImage.src = imagePath;

    lightbox.classList.remove("hidden");
    lightbox.setAttribute("aria-hidden", "false");
}

function closeLightbox() {
    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightboxImage");

    lightbox.classList.add("hidden");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.src = "";
}

function returnToAVR() {
    window.location.href = "https://applevioletrobot.com";
}

document.getElementById("returnBtn").addEventListener("click", returnToAVR);
document.getElementById("nextBtn").addEventListener("click", showNextSix);
document.getElementById("prevBtn").addEventListener("click", showPreviousSix);
document.getElementById("closeBtn").addEventListener("click", closeLightbox);

document.getElementById("lightbox").addEventListener("click", event => {
    if (event.target.id === "lightbox") {
        closeLightbox();
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeLightbox();
    }

    if (event.key === "ArrowRight") {
        showNextSix();
    }

    if (event.key === "ArrowLeft") {
        showPreviousSix();
    }
});

loadGallery();