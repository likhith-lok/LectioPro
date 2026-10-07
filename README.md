# Kolding Gymnasium Browser Extension

This repository contains a custom browser extension built for students at Kolding Gymnasium.  
The goal is simple: make everyday digital tasks a little easier, a little faster, and a lot less annoying.  
The extension is lightweight, transparent, and fully open‑source so anyone can inspect, modify, or improve it.

This project is not published on the Chrome Web Store.  
Instead, it is distributed manually so students can install it without needing a developer account or payment.

---

## Overview

The extension is designed to run on any Chromium‑based browser, including Chrome, Edge, Brave, Opera, and Vivaldi.  
It does not collect data, send analytics, or communicate with external servers. Everything happens locally on your device.

Typical use cases include:
- Streamlining repetitive browser actions
- Adding small quality‑of‑life improvements to school workflows
- Providing quick access to tools directly inside the browser
- Offering a simple, distraction‑free interface

If you are curious about how it works, all source code is available in this repository.

---

## Installation Guide (Manual)

Since this extension is not available on the Chrome Web Store, you will need to install it manually.  
The process takes less than a minute and does not require any special permissions.

### Step 1: Download the extension files
Click the green **Code** button at the top of this page and select **Download ZIP**.  
Alternatively, you can clone the repository if you prefer using Git.

### Step 2: Extract the ZIP file
Unzip the downloaded file to any folder on your computer.  
Make sure the folder contains `manifest.json` and the rest of the extension files.

### Step 3: Open the Extensions page in your browser
In Chrome or any Chromium browser, enter the following in the address bar: chrome://extensions

In the Microsoft Edge browser, enter the  following in the address bar: edge://extensions/

This will open the extension management page.

### Step 4: Enable Developer Mode
In the top‑right corner, toggle **Developer mode** on.  
This unlocks the ability to load extensions that are not from the Chrome Web Store.

### Step 5: Load the extension
Click **Load unpacked**.  
Select the folder you extracted in Step 2.

The extension should now appear in your list of installed extensions and be ready to use.

---

## Updating the Extension

Manual installations do not auto‑update.  
If a new version is released:

1. Download the latest ZIP from this repository  
2. Remove the old version from `chrome://extensions`  
3. Load the new version using **Load unpacked**

This ensures you always have the most recent features and fixes.

---

## Screenshots

If you want to see how the extension looks, check the `screenshots` folder in this repository.  
You can add your own screenshots there if you want to document new features or UI changes.

---

## Privacy and Security

This extension is intentionally minimal.  
It does not:
- collect personal data  
- track browsing activity  
- send information to external servers  
- include remote code  
- use analytics or advertising  

All logic runs locally in your browser.  
Anyone can review the source code to verify how it works.

---

## Contributing

If you want to improve the extension or add new features, feel free to contribute.

To do so:
1. Fork this repository  
2. Make your changes  
3. Submit a pull request  

You can also open an Issue if you find bugs or have suggestions.

---

## Contact

If you have questions, feedback, or ideas, you can reach out directly or open an Issue on GitHub.

Developer: Likhith Lokanadham
Contact: likhith.lokanadham@outlook.com


---

## License

This project is released under the MIT License.  
You are free to use, modify, and distribute it as long as the license text is included.

