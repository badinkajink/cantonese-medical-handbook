# Cantonese Medical Handbook

A comprehensive guide to medical Cantonese phrases with audio pronunciation and English translations. This handbook helps healthcare providers communicate effectively with Cantonese-speaking patients.

## Features

- **235 Medical Phrases** across 14 categories
- **Audio Pronunciation** for every phrase
- **Offline-First** - Works without internet connection
- **Fast Search** - Client-side search with fuzzy matching
- **Dark Mode** - Toggle between light and dark themes
- **Keyboard Shortcuts** - Power user navigation
- **Mobile Responsive** - Works on all devices
- **Accessibility** - WCAG compliant with screen reader support

## Quick Start

1. Open `index.html` in your browser
2. Browse categories or use search
3. Click play buttons to hear pronunciation
4. Press `?` to see keyboard shortcuts

## Site Structure

```
cantonese-medical-handbook/
├── index.html                     # Home page with category cards
├── medical-book/
│   ├── mb-*.html                 # Section pages (11 medical categories)
│   ├── mb-search.html            # Search page
│   ├── mb-header.html            # Shared navigation bar
│   ├── data_loader.js            # Loads data from JSON files
│   ├── search_engine.js          # Client-side search functionality
│   ├── keyboard-shortcuts.js     # Keyboard navigation
│   ├── common-styles.css         # Shared styles
│   ├── data/                     # JSON data files (auto-generated)
│   │   ├── all_data.json        # Combined data (235 entries)
│   │   ├── introductions.json   # 23 entries
│   │   ├── complaints.json      # 16 entries
│   │   └── ...                  # Other sections
│   └── *_audio/                  # MP3 audio files by section
└── build_data.js                 # Build script to export from Google Sheets
```

## Medical Categories

1. **Introductions** (23 phrases) - Basic greetings and introductory phrases
2. **Complaints** (16 phrases) - Common patient complaints and symptoms
3. **Medications** (10 phrases) - Medicine names and types
4. **Allergies** (6 phrases) - Common allergies
5. **History Questions** (15 phrases) - Medical history questions
6. **Family History** (9 phrases) - Family medical history questions
7. **Prior Illnesses** (23 phrases) - Previous medical conditions
8. **Cardiology** (13 phrases) - Cardiac terms and concepts
9. **Cardiovascular Illnesses** (6 phrases) - Heart disease conditions
10. **Anatomy** (36 phrases) - Body part anatomy terms
11. **Emergency** (19 phrases) - Emergency medical terminology
12. **Dermatology** (16 phrases) - Skin condition terminology
13. **Endocrinology** (12 phrases) - Endocrine system terms
14. **Gastroenterology** (31 phrases) - Digestive system terms

## Search Functionality

The search feature supports:
- **English search** - Search by English phrases
- **Cantonese search** - Search by Jyutping romanization
- **Chinese characters** - Search by traditional characters
- **Fuzzy matching** - Finds partial matches
- **Category filtering** - Filter results by section
- **Real-time results** - Instant search as you type

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `/` | Focus search bar |
| `?` | Show keyboard shortcuts |
| `Esc` | Close modals/hints |
| `h` | Go to home page |
| `s` | Go to search page |

## Data Management

### Current Setup (Offline Mode)

The site currently loads all data from local JSON files in `/medical-book/data/`. This provides:
- Fast loading times
- Offline capability
- No API rate limits
- Consistent performance

### Rebuilding Data from Google Sheets

If you need to update the data from the source Google Sheet:

```bash
node build_data.js
```

This will:
1. Fetch all sections from Google Sheets
2. Export to individual JSON files
3. Create a combined `all_data.json` file
4. Generate metadata with build timestamp

**Note:** You need Node.js installed to run the build script.

### Audio File Management

Audio files are generated using Azure Cognitive Services Speech API for Cantonese text-to-speech.

**Check which sections need audio:**
```bash
cd medical-book
python generate_audio.py --check
```

**Generate missing audio:**
```bash
python generate_audio.py
```

**Generate for specific sections:**
```bash
python generate_audio.py emergency dermatology
```

**Regenerate all audio:**
```bash
python generate_audio.py --all --force
```

**Requirements:**
- Python 3.7+
- Azure Cognitive Services Speech SDK: `pip install azure-cognitiveservices-speech`
- Valid Azure subscription key (configured in script)

**Current Status:**
- ✅ 232 audio files across 14 sections
- ✅ All valid entries have audio
- ✅ Voice: zh-HK-HiuGaaiNeural (Hong Kong Cantonese, Female)
- ✅ Format: 16kHz MP3

See [AUDIO_GENERATION_SUMMARY.md](medical-book/AUDIO_GENERATION_SUMMARY.md) for detailed information.

### Data Structure

Each phrase entry contains:
```json
{
  "id": "1",
  "english": "Hello",
  "cantonese": "nei5 hou2",
  "characters": "你好",
  "see_more": "Additional notes or context"
}
```

## Dark Mode

Dark mode preference is saved in localStorage and persists across sessions. Toggle using the moon/sun button in the navbar.

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## Accessibility

- ARIA labels on interactive elements
- Keyboard navigation support
- Screen reader friendly
- High contrast colors
- Skip-to-content link
- Focus indicators

## Audio Files

Audio files are stored in section-specific directories:
- `/medical-book/introductions_audio/`
- `/medical-book/complaints_audio/`
- etc.

Each audio file is named by its entry ID (e.g., `1.mp3`, `2.mp3`).

## Development

### Local Development

Simply open `index.html` in a browser. No build process required for basic development.

For a local server:
```bash
# Python
python -m http.server 8000

# Node.js
npx http-server
```

### Updating Sections

To add a new medical section:

1. Add data to Google Sheet
2. Run `node build_data.js`
3. Create `mb-newsection.html` page
4. Add audio files to `newsection_audio/`
5. Update `index.html` with new category card
6. Update navbar in `mb-header.html`

## Performance

- **Initial Load**: ~50KB (HTML/CSS/JS)
- **Data Load**: ~30KB (all_data.json - gzipped)
- **Search Index**: Built in <100ms
- **Search Speed**: <10ms for typical queries

## Contributing

This is an open-source educational resource. Contributions are welcome:

- Add more medical categories
- Improve translations
- Add audio recordings
- Fix bugs
- Enhance UI/UX

## License

Open source educational project. Free to use and modify.

## Credits

Created to help healthcare providers communicate better with Cantonese-speaking patients.

Built with:
- Bootstrap 5
- jQuery
- Vanilla JavaScript
- Google Sheets API (for data export)

## Changelog

### Version 2.0 (2026-02-01)
- ✨ Added client-side search across all sections
- 🚀 Converted to offline-first architecture
- 🌙 Added dark mode
- ⌨️ Added keyboard shortcuts
- 📱 Improved mobile responsiveness
- ♿ Enhanced accessibility
- 🎨 Modernized UI with gradient headers
- 🔊 Maintained audio playback for all phrases

### Version 1.0 (Original)
- Basic section pages
- Google Sheets integration
- Audio playback
- Simple navigation
