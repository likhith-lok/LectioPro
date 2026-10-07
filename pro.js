
//import { dictionary } from "./dictionary.js";



//document.querySelector(".ls-master-header-institution-name").style.display = "none";

console.log("Current frame URL:", window.location.href);

const DEFAULT_PREFERENCES = {
    translationEnabled: true,
    modernUiEnabled: true,
    darkModeEnabled: true
};
const stylesheetId = "lectiopro-stylesheet";
const preferences = { ...DEFAULT_PREFERENCES };
// Retain source text so disabling translation restores the page without a reload.
const translationOriginals = new WeakMap();
// Keep editable fields and user-written message threads in their original language.
const translationSkipSelector = [
    "script", "style", "noscript", "textarea", "input", "select", "option",
    "[contenteditable]", ".message-thread-message"
].join(",");
// Match full phrases before shorter dictionary words.
const dictionaryEntries = Object.entries(dictionary)
    .sort(([left], [right]) => right.length - left.length);
const dictionaryLookup = new Map(
    dictionaryEntries.map(([source, translated]) => [source.toLocaleLowerCase(), translated])
);
const dictionaryPattern = dictionaryEntries.length
    ? new RegExp(
        `(^|[^\\p{L}\\p{N}_])(${dictionaryEntries
            .map(([source]) => source.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
            .join("|")})(?=$|[^\\p{L}\\p{N}_])`,
        "giu"
    )
    : null;
let translationEnabled = false;
let translationObserver;

function translateText(text) {
    if (!dictionaryPattern) return text;

    dictionaryPattern.lastIndex = 0;
    return text.replace(dictionaryPattern, (match, prefix, source) =>
        `${prefix}${dictionaryLookup.get(source.toLocaleLowerCase())}`
    );
}

function isTranslatableTextNode(node) {
    const parent = node.parentElement;
    return Boolean(parent && !parent.closest(translationSkipSelector));
}

function restoreTranslation(node) {
    const previous = translationOriginals.get(node);
    if (previous && node.nodeValue === previous.translated) {
        node.nodeValue = previous.original;
    }
    translationOriginals.delete(node);
}

function translateTextNode(node) {
    const current = node.nodeValue;
    const previous = translationOriginals.get(node);
    const original = previous && current === previous.translated
        ? previous.original
        : current;

    if (!translationEnabled) {
        restoreTranslation(node);
        return;
    }

    const translated = translateText(original);
    if (translated === original) {
        translationOriginals.delete(node);
        return;
    }

    translationOriginals.set(node, { original, translated });
    if (current !== translated) {
        node.nodeValue = translated;
    }
}

function forEachTranslatableText(root, callback) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
            return isTranslatableTextNode(node)
                ? NodeFilter.FILTER_ACCEPT
                : NodeFilter.FILTER_REJECT;
        }
    });
    let node;

    while ((node = walker.nextNode())) {
        callback(node);
    }
}

function setTranslation(enabled) {
    translationEnabled = enabled;
    if (enabled) {
        forEachTranslatableText(document.body, translateTextNode);
        if (!translationObserver) {
            translationObserver = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === "characterData") {
                        if (isTranslatableTextNode(mutation.target)) {
                            translateTextNode(mutation.target);
                        } else {
                            restoreTranslation(mutation.target);
                        }
                        return;
                    }

                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.TEXT_NODE) {
                            if (isTranslatableTextNode(node)) {
                                translateTextNode(node);
                            } else {
                                restoreTranslation(node);
                            }
                        } else if (node.nodeType === Node.ELEMENT_NODE &&
                            !node.matches(translationSkipSelector) &&
                            !node.closest(translationSkipSelector)) {
                            forEachTranslatableText(node, translateTextNode);
                        }
                    });
                });
            });
            translationObserver.observe(document.body, {
                childList: true,
                characterData: true,
                subtree: true
            });
        }
        return;
    }

    if (translationObserver) {
        translationObserver.disconnect();
        translationObserver = undefined;
    }
    forEachTranslatableText(document.body, translateTextNode);
}

function applyPreferences() {
    const rawLectio = preferences.modernUiEnabled === true;
    let stylesheet = document.getElementById(stylesheetId);

    if (rawLectio && stylesheet) {
        stylesheet.remove();
    } else if (!rawLectio && !stylesheet) {
        stylesheet = document.createElement("link");
        stylesheet.id = stylesheetId;
        stylesheet.rel = "stylesheet";
        stylesheet.href = chrome.runtime.getURL("forside.css");
        document.head.appendChild(stylesheet);
    }

    document.body.classList.toggle("dark-mode", !rawLectio && preferences.darkModeEnabled === true);
    setTranslation(!rawLectio && preferences.translationEnabled === true);
}

chrome.storage.local.get(DEFAULT_PREFERENCES, (settings) => {
    if (chrome.runtime.lastError) {
        console.error("LectioPro could not load preferences:", chrome.runtime.lastError.message);
        return;
    }

    Object.assign(preferences, settings);
    applyPreferences();
});

chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "local") return;

    Object.entries(changes).forEach(([key, change]) => {
        if (Object.prototype.hasOwnProperty.call(preferences, key)) {
            preferences[key] = change.newValue;
        }
    });
    applyPreferences();
});

//function wipeForside() {
//    document.body.innerHTML = "";
//}

//function replaceForsideUI() {
//    const original = document.documentElement.cloneNode(true);
//    wipeForside();
//    buildForsideUI(original);
//}

//function buildForsideUI(original) {
//    const root = document.createElement("div");
//    root.id = "lp-forside";
//
//    root.innerHTML = `
//        <div class="lp-header">Dashboard</div>
//
//        <div class="lp-section" id="lp-today"></div>
//        <div class="lp-section" id="lp-assignments"></div>
//        <div class="lp-section" id="lp-messages"></div>
//    `;
//
//    document.body.appendChild(root);
//
//    // Fill sections with parsed data
//    loadForsideData(original);
//}

function parseToday(original) {
    const todayBox = original.querySelector("#s_m_Content_s_m_DagligtIndhold");
    if (!todayBox) return;

    const lessons = [...todayBox.querySelectorAll("tr")].map(row => row.innerText.trim());

    const target = document.querySelector("#lp-today");
    target.innerHTML = `
        <h2>Today's Schedule</h2>
        ${lessons.map(l => `<div class="lp-item">${l}</div>`).join("")}
    `;
}

function parseAssignments(original) {
    const box = original.querySelector("#s_m_Content_s_m_Opgaver");
    if (!box) return;

    const items = [...box.querySelectorAll("tr")].map(row => row.innerText.trim());

    const target = document.querySelector("#lp-assignments");
    target.innerHTML = `
        <h2>Upcoming Assignments</h2>
        ${items.map(i => `<div class="lp-item">${i}</div>`).join("")}
    `;
}

function parseMessages(original) {
    const box = original.querySelector("#s_m_Content_s_m_Beskeder");
    if (!box) return;

    const msgs = [...box.querySelectorAll("tr")].map(row => row.innerText.trim());

    const target = document.querySelector("#lp-messages");
    if (!target) return;

    target.innerHTML = `
        <h2>Unread Messages</h2>
        ${msgs.map(m => `<div class="lp-item">${m}</div>`).join("")}
    `;
}


function loadForsideData(original) {
    parseToday(original);
    parseAssignments(original);
    parseMessages(original);
}
