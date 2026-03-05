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

    if (window.innerWidth > 768) {
        document.querySelectorAll(".image-link img").forEach(img => {
            img.addEventListener("click", function (event) {
                event.preventDefault();
                openModal(this.src);
            });
        });
    }

    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", function (e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// Open modal with selected image
function openModal(imageSrc) {
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("modal-img");

    if (modal && modalImg) {
        modal.style.display = "flex";
        modalImg.src = imageSrc;
    }
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
    initializeIcons();
    setProjectTitle();
    setNextProject();
    setupImageModal();
    setupWorkProjectsToggle();
});
