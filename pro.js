
//import { dictionary } from "./dictionary.js";



//document.querySelector(".ls-master-header-institution-name").style.display = "none";

console.log("Current frame URL:", window.location.href);

if (window.location.pathname.endsWith("forside.aspx")) {
    const el = document.querySelector(".ls-master-header-institution-name");
    if (el) {
        el.textContent = "KOLDING GYMNASIUM";
        el.classList.add("lp-header-name");
    }
}


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












if (window.location.pathname.startsWith("https://www.lectio.dk/")) {
    translatePage();
}

if (window.location.pathname.endsWith("forside.aspx")) {
    replaceForsideUI();
}


