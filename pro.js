
import { dictionary } from "./dictionary.js";

function translateText(text) {
    const trimmed = text.trim();

    // 1. Dictionary translation
    if (dictionary[trimmed]) {
        return dictionary[trimmed];
    }

    // 2. Fallback translation (local)
    return localTranslate(trimmed);
}

function localTranslate(text) {
    // Example: split by spaces and translate known fragments
    const words = text.split(" ");
    const translatedWords = words.map(w => dictionary[w] || w);
    return translatedWords.join(" ");
}

function translatePage() {
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );

    let node;
    while ((node = walker.nextNode())) {
        const original = node.nodeValue.trim();
        if (original.length === 0) continue;

        const translated = translateText(original);
        if (translated !== original) {
            node.nodeValue = translated;
        }
    }
}

function applyForsideUI() {
    // Inject CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = chrome.runtime.getURL("forside.css");
    document.head.appendChild(link);

    // Hide original Lectio boxes
    document.querySelectorAll(".s2box, .s2bgbox").forEach(el => {
        el.style.display = "none";
    });

    // Create your own dashboard
    const dash = document.createElement("div");
    dash.id = "modern-forside";
    dash.innerHTML = `
        <h1>Dashboard</h1>
        <div class="card">Today's Schedule</div>
        <div class="card">Upcoming Assignments</div>
        <div class="card">Unread Messages</div>
    `;
    document.body.prepend(dash);
}











if (window.location.pathname.endsWith("forside.aspx")) {
    applyForsideUI();
}


if (window.location.pathname.startsWith("https://www.lectio.dk/")) {
    translatePage();
}



