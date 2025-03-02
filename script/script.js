document.addEventListener("DOMContentLoaded", function () {
    // Initialize Lucide Icons
    lucide.createIcons();

    // Dark Mode Toggle
    const themeToggle = document.createElement("button");
    themeToggle.classList.add("theme-toggle");
    themeToggle.textContent = "🌙 Dark Mode";
    document.body.appendChild(themeToggle);

    // Load user preference for dark/light mode
    if (localStorage.getItem("theme") === "light") {
        document.body.classList.remove("dark-mode");
        document.body.classList.add("light-mode");
        themeToggle.textContent = "☀️ Light Mode";
    }

    themeToggle.addEventListener("click", function () {
        if (document.body.classList.contains("dark-mode")) {
            document.body.classList.remove("dark-mode");
            document.body.classList.add("light-mode");
            localStorage.setItem("theme", "light");
            themeToggle.textContent = "☀️ Light Mode";
        } else {
            document.body.classList.remove("light-mode");
            document.body.classList.add("dark-mode");
            localStorage.setItem("theme", "dark");
            themeToggle.textContent = "🌙 Dark Mode";
        }
    });
});
