
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



