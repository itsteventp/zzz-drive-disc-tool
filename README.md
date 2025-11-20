# ZZZ Drive Disc Tool

A web application for managing Zenless Zone Zero character builds and disc inventory.

## Features

- 📊 **Character Management** - Track characters with preferred disc sets and stat priorities
- 💿 **Disc Inventory** - Manage your disc collection with advanced filtering
- ⚖️ **Disc Comparison** - Compare up to 4 discs side-by-side
- 📈 **Smart Scoring** - Automatic disc scoring based on character preferences
- 🎯 **Equipment System** - Equip discs to characters and track set bonuses
- 💾 **Data Portability** - Export/import your entire collection as JSON

## Quick Start

1. **Add a Character**
   - Click "+ Add Character" on the Characters page
   - Fill in name, preferred sets, and stat priorities
   - Stats at positions 1-2 in priority list are weighted higher

2. **Add Discs**
   - Navigate to "Discs" page
   - Click "+ Add Disc"
   - Select set, slot, main stat, and sub-stats

3. **Equip Discs**
   - Open a character's detail page
   - Click "Equip Disc" on any slot
   - Discs are automatically scored based on character preferences

4. **Compare Discs**
   - On the Discs page, click "Compare" on any disc
   - Compare up to 4 discs at once
   - Panel stays visible while browsing

## Keyboard Shortcuts

- `Tab` - Navigate between elements
- `Enter` / `Space` - Select focused item
- `Escape` - Close modals
- Arrow keys - Navigate dropdowns

## Data Management

### Export Data
Click the "📥 Export" button to download your entire collection as JSON.

### Import Data
Click the "📤 Import" button and select a previously exported JSON file.
⚠️ **Warning**: This will replace your current data. A backup is created automatically.

### Restore Backup
If import goes wrong, open browser console and run:
```javascript
__debug.restoreBackup() // Development mode only

Performance Tips
Score Caching: Disc scores are cached automatically for faster loading
Filters: Use filters to narrow down large collections
Sorting: Sort by relevance to find what you need quickly
Browser Support
✅ Chrome 90+
✅ Firefox 88+
✅ Safari 14+
✅ Edge 90+
✅ Mobile browsers (iOS Safari, Chrome Mobile)
Scoring System
Discs are scored based on how well they match a character's preferences:

High Priority Stats (positions 1-2): 1.0 × roll count
Low Priority Stats (positions 3-4): 0.5 × roll count
Main Stat Bonus: +2 points if it matches any priority stat
Grade Thresholds:
S: 7.0+
A: 5.0 - 6.99
B: 3.0 - 4.99
C: 1.5 - 2.99
D: < 1.5
Local Development
This is a static site - no build process required!

bash
# Serve locally
python -m http.server 8000
# or
npx serve
Then open http://localhost:8000

Debug Tools (Development Mode)
Open browser console when running on localhost:

javascript
__debug.help()                  // Show all commands
__debug.getScoreCacheStats()    // View cache performance
__debug.clearScoreCache()       // Clear score cache
__debug.enablePerfMonitor()     // Enable performance logging
__debug.getStorageInfo()        // View storage statistics
Privacy
All data is stored locally in your browser's localStorage. Nothing is sent to any server.

Known Limitations
Maximum ~5-10MB of data (browser localStorage limit)
No cloud sync (planned for future)
No collaborative features
Desktop-optimized (mobile works but has smaller screens)
Credits
Built with vanilla JavaScript, CSS Grid/Flexbox, and LocalStorage.
Game data and mechanics from Zenless Zone Zero by HoYoverse.

License
MIT License - Feel free to fork and modify!