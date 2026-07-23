const CONFIG = {
    frameCount: 2354,
    startFrame: 1,
    extension: "jpg",
    folder: "Frames",
    smoothing: 0.12,
    maxDpr: 1.5,
};

const frameCanvas = document.getElementById("frame-canvas");
const frameCtx = frameCanvas.getContext("2d");

const loader = document.getElementById("loader");
const loaderFill = document.getElementById("loader-fill");
const loaderText = document.getElementById("loader-text");

const journeyProgress = document.getElementById("journey-progress");
const sceneMarkers = document.querySelectorAll(".scene-marker");

const images = new Array(CONFIG.frameCount);

let loaded = 0;
let canvasWidth = 0;
let canvasHeight = 0;
let targetFrame = 0;
let currentFrame = 0;
let animationStarted = false;
let dpr = 1;
let lastDrawnFrame = -1;

function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
}

/* ---------- FILE PATH ---------- */

function framePath(index) {
    return `${CONFIG.folder}/frame-${String(index).padStart(4, "0")}.${CONFIG.extension}`;
}

/* ---------- CANVAS ---------- */

function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, CONFIG.maxDpr);

    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;

    frameCanvas.width = canvasWidth * dpr;
    frameCanvas.height = canvasHeight * dpr;

    frameCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

    lastDrawnFrame = -1;

    drawFrame(Math.round(currentFrame));
}

/* ---------- PRELOAD ---------- */

function preloadFrames() {

    for (let i = 0; i < CONFIG.frameCount; i++) {

        const img = new Image();

        img.onload = () => {

            loaded++;

            const percent = Math.round((loaded / CONFIG.frameCount) * 100);

            loaderFill.style.width = percent + "%";
            loaderText.textContent = percent + "%";

            if (i === 0) {
                drawFrame(0);
            }

            if (!animationStarted && loaded >= 20) {
                animationStarted = true;
                loader.classList.add("hidden");
                requestAnimationFrame(animate);
            }

            if (loaded === CONFIG.frameCount) {
                loader.classList.add("hidden");
            }

        };

        img.onerror = () => {
            console.error("Missing:", img.src);
            loaded++;
        };

        img.src = framePath(CONFIG.startFrame + i);

        images[i] = img;
    }
}

/* ---------- DRAW ---------- */

function drawFrame(index) {

    if (index === lastDrawnFrame) return;

    const img = images[index];

    if (!img || !img.complete || img.naturalWidth === 0) return;

    frameCtx.clearRect(0, 0, canvasWidth, canvasHeight);

    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = canvasWidth / canvasHeight;

    let drawWidth;
    let drawHeight;

    if (imgRatio > canvasRatio) {
        drawHeight = canvasHeight;
        drawWidth = drawHeight * imgRatio;
    } else {
        drawWidth = canvasWidth;
        drawHeight = drawWidth / imgRatio;
    }

    const x = (canvasWidth - drawWidth) / 2;
    const y = (canvasHeight - drawHeight) / 2;

    frameCtx.drawImage(img, x, y, drawWidth, drawHeight);

    lastDrawnFrame = index;
}

/* ---------- SCROLL ---------- */

function updateTarget() {

    const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

    const progress = clamp(
        window.scrollY / Math.max(1, maxScroll),
        0,
        1
    );

    targetFrame = progress * (CONFIG.frameCount - 1);

    if (journeyProgress) {
        journeyProgress.textContent = `${Math.round(progress * 100)}%`;
    }

}

/* ---------- TEXT REVEAL ---------- */

const observer = new IntersectionObserver(

    entries => {

        entries.forEach(entry => {

            const content = entry.target.querySelector(".scene-content");

            if (!content) return;

            content.classList.toggle("visible", entry.isIntersecting);

        });

    },

    {
        rootMargin: "-45% 0px -45% 0px"
    }

);

sceneMarkers.forEach(marker => observer.observe(marker));

/* ---------- ANIMATION ---------- */

function animate() {

    currentFrame += (targetFrame - currentFrame) * CONFIG.smoothing;

    const frame = clamp(
        Math.round(currentFrame),
        0,
        CONFIG.frameCount - 1
    );

    drawFrame(frame);

    requestAnimationFrame(animate);

}

/* ---------- EVENTS ---------- */

window.addEventListener("resize", () => {
    resize();
    updateTarget();
});

window.addEventListener("scroll", updateTarget, {
    passive: true
});

/* ---------- START ---------- */

resize();
updateTarget();
preloadFrames();