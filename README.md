🌐 ZZZ Drive Disc Tool

A clean and powerful web application for managing Zenless Zone Zero character builds and disc inventories—all stored locally in your browser.

✨ Features

📊 Character Management
Track characters with preferred disc sets and stat priorities

💿 Disc Inventory
Maintain a sortable, filterable list of discs

⚖️ Disc Comparison
Compare up to 4 discs side-by-side

📈 Smart Scoring
Discs are automatically rated based on each character’s preferences

🎯 Equipment System
Equip discs to characters and see set bonuses in real time

💾 Data Portability
Export or import your entire collection as JSON

🚀 Quick Start
1️⃣ Add a Character

Go to Characters → + Add Character

Enter name, preferred sets, and stat priorities
Note: Stats in priority positions 1–2 receive higher weight.

2️⃣ Add Discs

Go to Discs → + Add Disc

Select:

Set

Slot

Main stat

Sub-stats

3️⃣ Equip Discs

Open a character page

Select a slot → Equip Disc

Discs will be automatically scored and ranked

4️⃣ Compare Discs

On the Discs page, click Compare

Compare up to four discs simultaneously

Comparison panel stays visible while browsing

⌨️ Keyboard Shortcuts
Key	Action
Tab	Move focus
Enter / Space	Select focused element
Esc	Close modals
Arrow Keys	Navigate dropdowns
📂 Data Management
📥 Export Data

Click Export to download your entire database as JSON.

📤 Import Data

Click Import and select a previously exported file.
⚠️ Import replaces current data. A backup is created automatically.

♻️ Restore Backup

If something goes wrong during import, open the browser console and run:

__debug.restoreBackup() // Development mode only

⚙️ Performance Tips

Score caching improves loading speed automatically

Use filters to quickly narrow down large inventories

Sort results to surface the most relevant discs first

🌍 Browser Support

✔ Chrome 90+
✔ Firefox 88+
✔ Safari 14+
✔ Edge 90+
✔ Mobile browsers (Chrome Mobile, iOS Safari)

🧠 How Scoring Works

Discs earn points based on how well they match character preferences.

🧮 Scoring

High-priority stats (positions 1–2):
1.0 × roll count

Low-priority stats (positions 3–4):
0.5 × roll count

Main Stat Bonus:
+2 points if it matches a priority stat

📊 Grade Thresholds
Grade	Score
S	7.0+
A	5.0 – 6.99
B	3.0 – 4.99
C	1.5 – 2.99
D	< 1.5
🧪 Local Development

This is a static site—no build step required.

# Serve locally
python -m http.server 8000

# or
npx serve


Then open:

http://localhost:8000

🔧 Debug Tools (Localhost Only)

Open the browser console and use:

__debug.help()                  // Show all debug commands
__debug.getScoreCacheStats()    // Score cache analytics
__debug.clearScoreCache()       // Reset cache
__debug.enablePerfMonitor()     // Performance logging
__debug.getStorageInfo()        // Storage usage overview

🔒 Privacy & Storage

All data is stored locally in localStorage

No data is sent to any server

Max storage: ~5–10MB (browser limit)

Planned future improvements:

Cloud sync

Collaboration features

🏗️ Tech Stack

Vanilla JavaScript

CSS (Grid & Flexbox)

HTML

Browser LocalStorage

Game mechanics and data © HoYoverse.

📜 License

MIT License – Fork it, build on it, improve it!
