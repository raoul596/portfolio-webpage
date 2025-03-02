const projects = [
    { title: "High Voltage DC-DC Converter", link: "HV_DC_DC_converter.html" },
    { title: "Grid Tie Inverter", link: "grid_tie_inverter.html" },
    { title: "High Voltage BMS System", link: "high_voltage_BMS_system.html" },
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

document.addEventListener("DOMContentLoaded", function () {
    const currentPage = window.location.pathname.split("/").pop();
    const currentIndex = projects.findIndex(p => p.link === currentPage);

    if (currentIndex !== -1) {
        // Set project title
        document.getElementById("project-title").textContent = projects[currentIndex].title;

        // Set next project link (loops to first project if at the last one)
        const nextProject = projects[(currentIndex + 1) % projects.length];
        document.getElementById("next-project").href = nextProject.link;
    }
});

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("current-year").textContent = new Date().getFullYear();
});


