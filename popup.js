const darkModeToggle = document.getElementById("darkModeEnabled");
const status = document.getElementById("status");

function setStatus(message, isError = false) {
    status.textContent = message;
    status.classList.toggle("error", isError);
}

function updatePopupTheme(enabled) {
    document.documentElement.classList.toggle("dark-mode", enabled);
}

chrome.storage.local.get({ darkModeEnabled: false }, (settings) => {
    if (chrome.runtime.lastError) {
        setStatus("Could not load preferences.", true);
        console.error("LectioPro could not load preferences:", chrome.runtime.lastError.message);
        return;
    }

    darkModeToggle.checked = settings.darkModeEnabled === true;
    updatePopupTheme(darkModeToggle.checked);
});

darkModeToggle.addEventListener("change", () => {
    const enabled = darkModeToggle.checked;
    darkModeToggle.disabled = true;
    setStatus("Saving...");

    chrome.storage.local.set({ darkModeEnabled: enabled }, () => {
        darkModeToggle.disabled = false;

        if (chrome.runtime.lastError) {
            darkModeToggle.checked = !enabled;
            updatePopupTheme(darkModeToggle.checked);
            setStatus("Could not save this preference.", true);
            console.error("LectioPro could not save the dark mode setting:", chrome.runtime.lastError.message);
            return;
        }

        updatePopupTheme(enabled);
        setStatus(enabled ? "Dark appearance is on." : "Dark appearance is off.");
    });
});
