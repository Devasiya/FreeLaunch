const body = document.querySelector("body"),
    sidebar = body.querySelector(".sidebar"),
    toggle = body.querySelector(".toggle"),
    searchbtn = body.querySelector(".search-box"),
    modeSwitch = body.querySelector(".toggle-switch"),
    modeText = body.querySelector(".mode-text");

// Sidebar Toggle
toggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
    toggle.classList.toggle("rotate");
});

// Open sidebar when search is clicked
searchbtn.addEventListener("click", () => {
    sidebar.classList.remove("close");
});

// Dark Mode Toggle
modeSwitch.addEventListener("click", () => {
    body.classList.toggle("dark");

    // Apply dark mode to all elements
    document.querySelectorAll("*").forEach((el) => {
        el.classList.toggle("dark", body.classList.contains("dark"));
    });

    // Save dark mode state in localStorage
    localStorage.setItem("darkMode", body.classList.contains("dark") ? "enabled" : "disabled");

    // Update toggle text
    modeText.innerText = body.classList.contains("dark") ? "Light Mode" : "Dark Mode";
});

// Apply saved dark mode on page load
if (localStorage.getItem("darkMode") === "enabled") {
    body.classList.add("dark");
    document.querySelectorAll("*").forEach((el) => el.classList.add("dark"));
    modeText.innerText = "Light Mode";
}