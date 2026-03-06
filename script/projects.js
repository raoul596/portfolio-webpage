const projects = [
    { title: "High Voltage DC-DC Converter", link: "HV_DC_DC_converter.html" },
    { title: "Grid Tie Inverter", link: "grid_tie_inverter.html" },
    { title: "High Voltage BMS System", link: "high_voltage_BMS_system.html", workExperience: true },
    { title: "Yacht door lock", link: "door_lock.html", workExperience: true },
    { title: "Television Elevator", link: "television_elevator.html", workExperience: true },
    { title: "Project Car", link: "project_car.html" },
    { title: "School Project Game Board", link: "school_project_game_board.html" },
    { title: "Electric Skateboard", link: "electric_skateboard.html" },
    { title: "RC Weight Scale", link: "rc_weight_scale.html" },
    { title: "Robot Vacuum", link: "robot_vacuum.html" },
    { title: "FDM Core XY 3D Printer", link: "fdm_core_xy_3d_printer.html" },
    { title: "Race Drone", link: "race_drone.html" },
    { title: "Camera Drone", link: "camera_drone.html" }
];

let modalGalleryItems = [];
let modalCurrentIndex = 0;

// Thumbnail convention:
// Full image:  images/folder/photo.jpg
// Thumbnail:   images/thumbs/folder/photo.jpg
function toThumbnailPath(src) {
    if (!src || /^(https?:|data:|blob:)/i.test(src)) {
        return src;
    }

    const normalized = src.replace(/\\/g, "/");
    if (normalized.includes("images/thumbs/")) {
        return normalized;
    }

    if (normalized.includes("images/")) {
        return normalized.replace("images/", "images/thumbs/");
    }

    return src;
}

function toFullSizePathFromThumb(src) {
    if (!src) {
        return src;
    }

    return src
        .replace(/\\/g, "/")
        .replace("/images/thumbs/", "/images/")
        .replace("images/thumbs/", "images/");
}

function setupThumbnailImages() {
    const images = document.querySelectorAll(".project-tile img, #project-gallery .image-link img");
    images.forEach(img => {
        img.loading = "lazy";
        img.decoding = "async";

        const explicitFullSrc = img.getAttribute("data-full-src");
        const currentSrc = img.getAttribute("src");
        const inferredFullSrc = currentSrc && currentSrc.includes("images/thumbs/")
            ? toFullSizePathFromThumb(currentSrc)
            : currentSrc;
        const fullSrc = img.dataset.fullSrc || explicitFullSrc || inferredFullSrc;
        if (!fullSrc) {
            return;
        }

        img.dataset.fullSrc = fullSrc;
        const thumbnailSrc = img.dataset.thumbSrc || currentSrc || toThumbnailPath(fullSrc);

        const fallbackToFull = function () {
            img.removeEventListener("error", fallbackToFull);
            img.src = fullSrc;
        };

        img.addEventListener("error", fallbackToFull);

        // Keep provided thumbnail path when present; otherwise swap to derived thumbnail.
        if (!currentSrc || !currentSrc.includes("images/thumbs/")) {
            const derivedThumbSrc = toThumbnailPath(fullSrc);
            if (derivedThumbSrc && derivedThumbSrc !== fullSrc) {
                img.src = derivedThumbSrc;
            }
        } else if (!thumbnailSrc) {
            img.src = fullSrc;
        }
    });
}

function ensureFontAwesomeForProjectPages() {
    const hasProjectGallery = !!document.getElementById("project-gallery");
    if (!hasProjectGallery) {
        return;
    }

    const alreadyLoaded = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
        .some(link => (link.href || "").includes("font-awesome"));

    if (alreadyLoaded) {
        return;
    }

    const faLink = document.createElement("link");
    faLink.rel = "stylesheet";
    faLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css";
    document.head.appendChild(faLink);
}

function setupImageHoverCursor() {
    const hasProjectGallery = !!document.getElementById("project-gallery");
    if (!hasProjectGallery) {
        return;
    }

    const links = document.querySelectorAll("#project-gallery .image-link");
    if (!links.length) {
        return;
    }

    links.forEach(link => {
        link.style.cursor = "zoom-in";
    });
}

function setupIndexProjectHoverCursor() {
    const hasProjectGrid = !!document.querySelector("#projects .project-grid");
    if (!hasProjectGrid) {
        return;
    }

    const links = document.querySelectorAll("#projects .project-tile a");
    if (!links.length) {
        return;
    }

    links.forEach(link => {
        link.style.cursor = "pointer";
    });
}

// Initialize Lucide icons
function initializeIcons() {
    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    } else {
        console.warn("Lucide library is not loaded.");
    }
}

// Set project title dynamically
function setProjectTitle() {
    const titleElement = document.getElementById("project-title");
    const currentPage = window.location.pathname.split("/").pop();
    const project = projects.find(p => p.link === currentPage);

    if (titleElement && project) {
        titleElement.textContent = project.title;
    } else {
        console.warn("Project title could not be set.");
    }
}

// Set next project button
function setNextProject() {
    const nextProjectBtn = document.getElementById("next-project");
    if (!nextProjectBtn) {
        return;
    }

    const currentPage = window.location.pathname.split("/").pop();
    const currentIndex = projects.findIndex(p => p.link === currentPage);

    if (currentIndex !== -1 && currentIndex < projects.length - 1) {
        nextProjectBtn.href = projects[currentIndex + 1].link;
    } else {
        nextProjectBtn.style.display = "none"; // Hide button if no next project
    }
}

// Set up image modal functionality
function setupImageModal() {
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("modal-img");
    const closeBtn = document.querySelector(".close");

    if (!modal || !modalImg || !closeBtn) {
        console.warn("Modal elements not found in the DOM.");
        return;
    }

    let prevBtn = modal.querySelector(".modal-nav-left");
    let nextBtn = modal.querySelector(".modal-nav-right");

    if (!prevBtn) {
        prevBtn = document.createElement("button");
        prevBtn.type = "button";
        prevBtn.className = "modal-nav modal-nav-left";
        prevBtn.setAttribute("aria-label", "Previous image");
        prevBtn.textContent = "\u2039";
        modal.appendChild(prevBtn);
    }

    if (!nextBtn) {
        nextBtn = document.createElement("button");
        nextBtn.type = "button";
        nextBtn.className = "modal-nav modal-nav-right";
        nextBtn.setAttribute("aria-label", "Next image");
        nextBtn.textContent = "\u203A";
        modal.appendChild(nextBtn);
    }

    if (window.innerWidth > 768) {
        document.querySelectorAll(".image-link img").forEach(img => {
            img.addEventListener("click", function (event) {
                event.preventDefault();
                const galleryItems = buildModalGalleryItems();
                const startIndex = findModalStartIndex(galleryItems, this);
                openModal(galleryItems, startIndex);
            });
        });
    }

    prevBtn.addEventListener("click", event => {
        event.stopPropagation();
        navigateModal(-1);
    });

    nextBtn.addEventListener("click", event => {
        event.stopPropagation();
        navigateModal(1);
    });

    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", function (e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    if (!modal.dataset.keyboardBound) {
        document.addEventListener("keydown", event => {
            if (modal.style.display !== "flex") {
                return;
            }

            if (event.key === "Escape") {
                closeModal();
                return;
            }

            if (event.key === "ArrowLeft") {
                navigateModal(-1);
                return;
            }

            if (event.key === "ArrowRight") {
                navigateModal(1);
            }
        });
        modal.dataset.keyboardBound = "true";
    }
}

function getBaseFileName(path) {
    if (!path) {
        return "";
    }

    const normalized = path.replace(/\\/g, "/");
    const fileName = normalized.substring(normalized.lastIndexOf("/") + 1);
    return decodeURIComponent(fileName).toLowerCase();
}

function getDirectoryPath(path) {
    if (!path) {
        return "";
    }

    const normalized = path.replace(/\\/g, "/");
    const idx = normalized.lastIndexOf("/");
    return idx === -1 ? "" : normalized.substring(0, idx + 1);
}

function extractStepToken(path) {
    const baseName = getBaseFileName(path);
    const match = baseName.match(/^(step[0-9a-z_-]*)/i);
    return match ? match[1].toLowerCase() : "";
}

function uniqueEntriesByFullSrc(entries) {
    const seen = new Set();

    const normalizePathKey = path => {
        if (!path) {
            return "";
        }

        try {
            return decodeURIComponent(path)
                .replace(/\\/g, "/")
                .replace(/[?#].*$/, "")
                .toLowerCase();
        } catch {
            return path
                .replace(/\\/g, "/")
                .replace(/[?#].*$/, "")
                .toLowerCase();
        }
    };

    return entries.filter(entry => {
        if (!entry || !entry.fullSrc) {
            return false;
        }

        const key = normalizePathKey(entry.fullSrc);
        if (seen.has(key)) {
            return false;
        }

        seen.add(key);
        return true;
    });
}

async function collectStepImagesFromDirectory(directoryPath, stepId) {
    if (!directoryPath || !stepId) {
        return [];
    }

    try {
        const response = await fetch(directoryPath, { cache: "no-store" });
        if (!response.ok) {
            return [];
        }

        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, "text/html");
        const links = Array.from(doc.querySelectorAll("a[href]"));
        const files = [];

        links.forEach(link => {
            const href = link.getAttribute("href");
            if (!href || href.endsWith("/")) {
                return;
            }

            const decodedName = decodeURIComponent(href);
            if (extractStepToken(decodedName) !== stepId) {
                return;
            }

            const fullSrc = `${directoryPath}${href}`;
            files.push({
                fullSrc,
                thumbSrc: toThumbnailPath(fullSrc),
                alt: `${stepId} image`
            });
        });

        return files;
    } catch {
        return [];
    }
}

function setupSlideshowForStepRow(stepId, anchorRow, slideshowEntries) {
    const entries = uniqueEntriesByFullSrc(slideshowEntries);
    if (entries.length < 2) {
        return;
    }

    const targetImg = anchorRow.querySelector(".image-link img");
    const imageContainer = anchorRow.querySelector(".image-container");
    if (!targetImg || !imageContainer) {
        return;
    }

    targetImg.dataset.galleryEntries = JSON.stringify(
        entries.map(entry => ({
            fullSrc: entry.fullSrc,
            thumbSrc: entry.thumbSrc || entry.fullSrc
        }))
    );

    let currentIndex = 0;
    let pauseOnDotHover = false;
    let dots = [];

    const applySlide = entry => {
        targetImg.dataset.fullSrc = entry.fullSrc;
        targetImg.src = entry.thumbSrc || entry.fullSrc;
        targetImg.alt = entry.alt;
        dots.forEach((dot, index) => {
            dot.classList.toggle("active", index === currentIndex);
        });
    };

    const dotsContainer = document.createElement("div");
    dotsContainer.className = "slideshow-dots";
    dotsContainer.setAttribute("aria-label", `${stepId} slideshow navigation`);

    dots = entries.map((entry, index) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "slideshow-dot";
        dot.setAttribute("aria-label", `Show ${stepId} image ${index + 1}`);

        dot.addEventListener("mouseenter", () => {
            pauseOnDotHover = true;
            currentIndex = index;
            applySlide(entries[currentIndex]);
        });

        dot.addEventListener("focus", () => {
            pauseOnDotHover = true;
            currentIndex = index;
            applySlide(entries[currentIndex]);
        });

        dot.addEventListener("click", () => {
            currentIndex = index;
            applySlide(entries[currentIndex]);
        });

        return dot;
    });

    dots.forEach(dot => dotsContainer.appendChild(dot));
    dotsContainer.addEventListener("mouseleave", () => {
        pauseOnDotHover = false;
    });
    imageContainer.appendChild(dotsContainer);

    applySlide(entries[currentIndex]);

    setInterval(() => {
        if (pauseOnDotHover) {
            return;
        }

        currentIndex = (currentIndex + 1) % entries.length;
        applySlide(entries[currentIndex]);
    }, 2500);
}

async function setupStepSlideshows() {
    const rows = Array.from(document.querySelectorAll("#project-gallery .image-row"));
    if (!rows.length) {
        return;
    }

    const stepRows = rows.filter(row => {
        const stepId = (row.dataset.stepId || "").trim().toLowerCase();
        return stepId.startsWith("step");
    });
    if (!stepRows.length) {
        return;
    }

    const stepGroups = new Map();
    stepRows.forEach(row => {
        const stepId = row.dataset.stepId.trim().toLowerCase();
        if (!stepGroups.has(stepId)) {
            stepGroups.set(stepId, []);
        }
        stepGroups.get(stepId).push(row);
    });

    for (const [stepId, groupedRows] of stepGroups.entries()) {
        const anchorRow = groupedRows[0];
        const extraRows = groupedRows.slice(1);

        const rowImages = rows.map(row => {
            const img = row.querySelector(".image-link img");
            if (!img) {
                return null;
            }

            const fullSrc = img.dataset.fullSrc || img.getAttribute("data-full-src") || img.getAttribute("src");
            const thumbOrSrc = img.getAttribute("src") || "";
            const fullStepToken = extractStepToken(fullSrc);
            const thumbStepToken = extractStepToken(thumbOrSrc);
            const stepToken = fullStepToken || thumbStepToken;
            if (stepToken !== stepId) {
                return null;
            }

            // If data-full-src does not belong to this step but src does, prefer src-derived full path.
            const canonicalFullSrc = (!fullStepToken && thumbStepToken === stepId)
                ? toFullSizePathFromThumb(thumbOrSrc)
                : fullSrc;

            return {
                fullSrc: canonicalFullSrc,
                thumbSrc: img.getAttribute("src"),
                alt: img.getAttribute("alt") || `${stepId} image`
            };
        });
        const slideshowEntries = rowImages.filter(Boolean);

        const anchorImg = anchorRow.querySelector(".image-link img");
        const anchorFullSrc = anchorImg
            ? (anchorImg.dataset.fullSrc || anchorImg.getAttribute("data-full-src") || anchorImg.getAttribute("src"))
            : "";
        const stepDirectory = getDirectoryPath(anchorFullSrc || (slideshowEntries[0] && slideshowEntries[0].fullSrc) || "");
        const folderEntries = await collectStepImagesFromDirectory(stepDirectory, stepId);

        const combinedEntries = uniqueEntriesByFullSrc([
            ...slideshowEntries,
            ...folderEntries
        ]);

        if (combinedEntries.length < 2) {
            continue;
        }

        extraRows.forEach(row => row.remove());
        setupSlideshowForStepRow(stepId, anchorRow, combinedEntries);
    }
}

function normalizeModalPath(path) {
    if (!path) {
        return "";
    }

    try {
        return decodeURIComponent(path)
            .replace(/\\/g, "/")
            .replace(/[?#].*$/, "")
            .toLowerCase();
    } catch {
        return path
            .replace(/\\/g, "/")
            .replace(/[?#].*$/, "")
            .toLowerCase();
    }
}

function buildModalGalleryItems() {
    const images = Array.from(document.querySelectorAll("#project-gallery .image-link img"));
    const items = [];
    const seen = new Set();

    images.forEach(img => {
        let entries = [];

        if (img.dataset.galleryEntries) {
            try {
                const parsed = JSON.parse(img.dataset.galleryEntries);
                if (Array.isArray(parsed)) {
                    entries = parsed;
                }
            } catch {
                entries = [];
            }
        }

        if (!entries.length) {
            const fullSrc = img.dataset.fullSrc || img.getAttribute("data-full-src") || img.currentSrc || img.src;
            const thumbSrc = img.currentSrc || img.src;
            entries = [{ fullSrc, thumbSrc }];
        }

        entries.forEach(entry => {
            const fullSrc = entry.fullSrc;
            const previewSrc = entry.thumbSrc || entry.previewSrc || fullSrc;
            const key = normalizeModalPath(fullSrc);
            if (!key || seen.has(key)) {
                return;
            }

            seen.add(key);
            items.push({ fullSrc, previewSrc });
        });
    });

    return items;
}

function findModalStartIndex(items, clickedImg) {
    const clickedFullSrc = clickedImg.dataset.fullSrc || clickedImg.getAttribute("data-full-src") || clickedImg.currentSrc || clickedImg.src;
    const clickedCurrentSrc = clickedImg.currentSrc || clickedImg.src;

    const fullIndex = items.findIndex(item => normalizeModalPath(item.fullSrc) === normalizeModalPath(clickedFullSrc));
    if (fullIndex !== -1) {
        return fullIndex;
    }

    const previewIndex = items.findIndex(item => normalizeModalPath(item.previewSrc) === normalizeModalPath(clickedCurrentSrc));
    return previewIndex === -1 ? 0 : previewIndex;
}

function renderModalImage() {
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("modal-img");
    const prevBtn = modal ? modal.querySelector(".modal-nav-left") : null;
    const nextBtn = modal ? modal.querySelector(".modal-nav-right") : null;

    if (!modal || !modalImg || !modalGalleryItems.length) {
        return;
    }

    const item = modalGalleryItems[modalCurrentIndex];
    modal.style.display = "flex";
    modalImg.src = item.previewSrc || item.fullSrc;

    if (item.previewSrc && item.previewSrc !== item.fullSrc) {
        const fullImage = new Image();
        fullImage.onload = function () {
            if (modal.style.display === "flex") {
                modalImg.src = item.fullSrc;
            }
        };
        fullImage.src = item.fullSrc;
    }

    const showNav = modalGalleryItems.length > 1;
    if (prevBtn) {
        prevBtn.style.display = showNav ? "flex" : "none";
    }
    if (nextBtn) {
        nextBtn.style.display = showNav ? "flex" : "none";
    }
}

function navigateModal(direction) {
    if (modalGalleryItems.length < 2) {
        return;
    }

    modalCurrentIndex = (modalCurrentIndex + direction + modalGalleryItems.length) % modalGalleryItems.length;
    renderModalImage();
}

// Open modal with selected image set
function openModal(galleryItems, startIndex = 0) {
    if (!Array.isArray(galleryItems) || !galleryItems.length) {
        return;
    }

    modalGalleryItems = galleryItems;
    modalCurrentIndex = Math.min(Math.max(startIndex, 0), modalGalleryItems.length - 1);
    renderModalImage();
}

// Close modal
function closeModal() {
    const modal = document.getElementById("image-modal");
    if (modal) {
        modal.style.display = "none";
    }
}

// Show/hide work-hour projects on the index page
function setupWorkProjectsToggle() {
    const toggle = document.getElementById("show-work-experience");
    if (!toggle) {
        return;
    }

    const projectCards = document.querySelectorAll(".project-grid .project");
    const workExperienceLinks = new Set(
        projects.filter(project => project.workExperience).map(project => project.link)
    );

    projectCards.forEach(card => {
        const projectLink = card.querySelector(".project-tile a")?.getAttribute("href")?.split("/").pop();
        const isWorkProject = projectLink ? workExperienceLinks.has(projectLink) : false;
        card.dataset.workProject = isWorkProject ? "true" : "false";
    });

    const transitionMs = 260;
    const hideTimers = new WeakMap();
    const moveTransitionMs = 320;

    const getVisibleRects = () => {
        const rects = new Map();
        projectCards.forEach(card => {
            if (!card.classList.contains("project-hidden")) {
                rects.set(card, card.getBoundingClientRect());
            }
        });
        return rects;
    };

    const animateReflow = firstRects => {
        projectCards.forEach(card => {
            if (card.classList.contains("project-hidden")) {
                return;
            }

            const first = firstRects.get(card);
            if (!first) {
                return;
            }

            const last = card.getBoundingClientRect();
            const deltaX = first.left - last.left;
            const deltaY = first.top - last.top;

            if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) {
                return;
            }

            card.animate(
                [
                    { transform: `translate(${deltaX}px, ${deltaY}px)` },
                    { transform: "translate(0, 0)" }
                ],
                {
                    duration: moveTransitionMs,
                    easing: "cubic-bezier(0.22, 1, 0.36, 1)"
                }
            );
        });
    };

    const clearHideTimer = project => {
        const timer = hideTimers.get(project);
        if (timer) {
            clearTimeout(timer);
            hideTimers.delete(project);
        }
    };

    const hideProject = project => {
        if (project.classList.contains("project-hidden")) {
            return;
        }

        clearHideTimer(project);
        project.classList.add("project-hiding");

        const timer = setTimeout(() => {
            const firstRects = getVisibleRects();
            project.classList.add("project-hidden");
            animateReflow(firstRects);
            hideTimers.delete(project);
        }, transitionMs);

        hideTimers.set(project, timer);
    };

    const showProject = project => {
        clearHideTimer(project);

        if (!project.classList.contains("project-hidden") && !project.classList.contains("project-hiding")) {
            return;
        }

        const firstRects = getVisibleRects();
        project.classList.remove("project-hidden");
        animateReflow(firstRects);
        project.classList.add("project-hiding");

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                project.classList.remove("project-hiding");
            });
        });
    };

    const applyVisibility = () => {
        projectCards.forEach(project => {
            const isWorkProject = project.dataset.workProject === "true";
            const shouldHide = toggle.checked && isWorkProject;
            if (shouldHide) {
                hideProject(project);
            } else {
                showProject(project);
            }
        });
    };

    toggle.addEventListener("change", applyVisibility);
    applyVisibility();
}

// Initialize everything on page load
document.addEventListener("DOMContentLoaded", function () {
    setupThumbnailImages();
    setupStepSlideshows();
    ensureFontAwesomeForProjectPages();
    setupImageHoverCursor();
    setupIndexProjectHoverCursor();
    initializeIcons();
    setProjectTitle();
    setNextProject();
    setupImageModal();
    setupWorkProjectsToggle();
});
