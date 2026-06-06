let items = [];
let currentStart = 0;

async function loadGallery() {
    try {
        items = await fetch("images.json").then(response => response.json());

        if (items.length === 0) {
            console.error("No images found in images.json.");
            return;
        }

        padWithPlaceholders();
        showRandomFour();

    } catch (error) {
        console.error("Failed to load images.json", error);
    }
}

function padWithPlaceholders() {
    const remainder = items.length % 4;

    if (remainder === 0) {
        return;
    }

    const placeholdersNeeded = 4 - remainder;

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

    const visibleImages = items.slice(startIndex, startIndex + 4);

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

function showRandomFour() {
    const maxStart = Math.max(0, items.length - 4);
    const randomStart = Math.floor(Math.random() * (maxStart + 1));

    renderGallery(randomStart);
}

function showNextFour() {
    const maxStart = Math.max(0, items.length - 4);
    const nextStart = Math.min(currentStart + 4, maxStart);

    renderGallery(nextStart);
}

function showPreviousFour() {
    const previousStart = Math.max(currentStart - 4, 0);

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

document.getElementById("shuffleBtn").addEventListener("click", showRandomFour);
document.getElementById("nextBtn").addEventListener("click", showNextFour);
document.getElementById("prevBtn").addEventListener("click", showPreviousFour);
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
        showNextFour();
    }

    if (event.key === "ArrowLeft") {
        showPreviousFour();
    }
});

loadGallery();