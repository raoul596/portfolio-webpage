const projects = [
    { title: "High Voltage DC-DC Converter", link: "HV_DC_DC_converter.html" },
    { title: "Grid Tie Inverter", link: "grid_tie_inverter.html" },
    { title: "High Voltage BMS System", link: "high_voltage_BMS_system.html" },
    { title: "Yacht door lock", link: "door_lock.html" },
    { title: "Television Elevator", link: "television_elevator.html" },
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
    const currentPage = window.location.pathname.split("/").pop();
    const currentIndex = projects.findIndex(p => p.link === currentPage);
    
    if (nextProjectBtn && currentIndex !== -1 && currentIndex < projects.length - 1) {
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
            img.addEventListener("click", function(event) {
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

// Initialize everything on page load
document.addEventListener("DOMContentLoaded", function () {
    initializeIcons();
    setProjectTitle();
    setNextProject();
    setupImageModal();
});
