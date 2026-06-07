let originalItems = [];
let shuffledItems = [];
let currentStart = 0;

const imagesPerPage = 6;
const placeholderFile = "images/polaroid_placeholder.png";

async function loadGallery() {
    try {
        originalItems = await fetch("images.json").then(response => response.json());

        if (originalItems.length === 0) {
            console.error("No images found in images.json.");
            return;
        }

        startNewShuffle();

    } catch (error) {
        console.error("Failed to load images.json", error);
    }
}

function startNewShuffle() {
    shuffledItems = shuffleArray([...originalItems]);
    currentStart = 0;
    renderGallery();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }

    return array;
}

function getCurrentPageItems() {
    const pageItems = shuffledItems.slice(currentStart, currentStart + imagesPerPage);

    while (pageItems.length < imagesPerPage) {
        pageItems.push({
            file: placeholderFile,
            alt: "",
            placeholder: true
        });
    }

    return pageItems;
}

function renderGallery() {
    const grid = document.getElementById("grid");
    grid.innerHTML = "";

    const visibleImages = getCurrentPageItems();

    visibleImages.forEach(item => {
        const image = document.createElement("img");

        image.src = item.file;
        image.alt = item.alt || "";

        if (!item.placeholder) {
            image.addEventListener("click", () => {
                openLightbox(item.file, item.alt);
            });
        }

        grid.appendChild(image);
    });
}

function showNextSix() {
    const nextStart = currentStart + imagesPerPage;

    if (nextStart >= shuffledItems.length) {
        startNewShuffle();
        return;
    }

    currentStart = nextStart;
    renderGallery();
}

function showPreviousSix() {
    const previousStart = currentStart - imagesPerPage;

    if (previousStart < 0) {
        currentStart = Math.max(
            0,
            shuffledItems.length - (shuffledItems.length % imagesPerPage || imagesPerPage)
        );

        renderGallery();
        return;
    }

    currentStart = previousStart;
    renderGallery();
}

function openLightbox(imagePath, altText) {
    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightboxImage");

    lightboxImage.src = imagePath;
    lightboxImage.alt = altText || "";

    lightbox.classList.remove("hidden");
    lightbox.setAttribute("aria-hidden", "false");
}

function closeLightbox() {
    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightboxImage");

    lightbox.classList.add("hidden");
    lightbox.setAttribute("aria-hidden", "true");

    lightboxImage.src = "";
    lightboxImage.alt = "";
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