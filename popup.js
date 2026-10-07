const DEFAULT_PREFERENCES = {
    translationEnabled: true,
    modernUiEnabled: true,
    darkModeEnabled: true
};

const status = document.getElementById("status");
const toggles = Object.entries(DEFAULT_PREFERENCES).map(([key]) => ({
    key,
    element: document.getElementById(key)
}));

function setStatus(message, isError = false) {
    status.textContent = message;
    status.classList.toggle("error", isError);
}

function updatePopupTheme(enabled) {
    document.documentElement.classList.toggle("dark-mode", enabled);
}

function updatePopup(settings) {
    toggles.forEach(({ key, element }) => {
        element.checked = settings[key] === true;
        element.disabled = false;
    });
    updatePopupTheme(settings.darkModeEnabled === true);
}

chrome.storage.local.get(DEFAULT_PREFERENCES, (settings) => {
    if (chrome.runtime.lastError) {
        setStatus("Could not load preferences.", true);
        console.error("LectioPro could not load preferences:", chrome.runtime.lastError.message);
        return;
    }

    updatePopup(settings);
});

toggles.forEach(({ key, element }) => {
    element.disabled = true;
    element.addEventListener("change", () => {
        const enabled = element.checked;
        element.disabled = true;
        setStatus("Saving...");

        chrome.storage.local.set({ [key]: enabled }, () => {
            element.disabled = false;

            if (chrome.runtime.lastError) {
                element.checked = !enabled;
                if (key === "darkModeEnabled") {
                    updatePopupTheme(!enabled);
                }
                setStatus("Could not save this preference.", true);
                console.error(`LectioPro could not save ${key}:`, chrome.runtime.lastError.message);
                return;
            }

            if (key === "darkModeEnabled") {
                updatePopupTheme(enabled);
            }
            setStatus("Preferences saved.");
        });
    });
});
