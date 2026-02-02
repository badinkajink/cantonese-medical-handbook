#!/usr/bin/env node

/**
 * Build Script: Export Google Sheets data to local JSON files
 *
 * This script fetches all medical handbook data from Google Sheets
 * and saves it as static JSON files for offline use.
 *
 * Usage: node build_data.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Google Sheets configuration
const SHEET_ID = '1o5w3Hqk-s7hBLSgaOdow-1h0wW2xamoJvn8STS6PZek';
const API_KEY = 'AIzaSyBYpORJpEgNr3ZmsCMqjPSmtufx-DJX1Oo';

// All sections to export
const SECTIONS = [
    'introductions',
    'complaints',
    'medications',
    'allergies',
    'history_questions',
    'family_history',
    'prior_illnesses',
    'cardiology',
    'cardiovascular_illnesses',
    'anatomy',
    'emergency',
    'dermatology',
    'endocrinology',
    'gastroenterology'
];

// Output directory
const DATA_DIR = path.join(__dirname, 'medical-book', 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

/**
 * Fetch data from Google Sheets for a specific section
 */
function fetchSheetData(sheetName) {
    return new Promise((resolve, reject) => {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetName}!A1:Z?key=${API_KEY}`;

        console.log(`Fetching ${sheetName}...`);

        https.get(url, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                if (res.statusCode === 200) {
                    try {
                        const json = JSON.parse(data);
                        resolve(json);
                    } catch (err) {
                        reject(new Error(`Failed to parse JSON for ${sheetName}: ${err.message}`));
                    }
                } else {
                    reject(new Error(`HTTP ${res.statusCode} for ${sheetName}: ${data}`));
                }
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

/**
 * Process raw sheet data into structured format
 */
function processSheetData(rawData, sheetName) {
    if (!rawData.values || rawData.values.length < 3) {
        console.warn(`Warning: ${sheetName} has insufficient data`);
        return [];
    }

    const rows = rawData.values;
    const processedData = [];

    // Skip first 2 rows (headers), process from index 2 onwards
    for (let i = 2; i < rows.length; i++) {
        const row = rows[i];

        // Skip empty rows
        if (!row || row.length === 0 || !row[0]) {
            continue;
        }

        processedData.push({
            id: row[0] || '',
            english: row[1] || '',
            cantonese: row[2] || '',
            characters: row[3] || '',
            see_more: row[4] || ''
        });
    }

    return processedData;
}

/**
 * Main build function
 */
async function buildAllData() {
    console.log('='.repeat(60));
    console.log('Building Cantonese Medical Handbook Data');
    console.log('='.repeat(60));
    console.log('');

    const allData = {};
    const errors = [];

    for (const section of SECTIONS) {
        try {
            const rawData = await fetchSheetData(section);
            const processedData = processSheetData(rawData, section);
            allData[section] = processedData;

            // Save individual section file
            const sectionFile = path.join(DATA_DIR, `${section}.json`);
            fs.writeFileSync(sectionFile, JSON.stringify(processedData, null, 2));

            console.log(`✓ ${section}: ${processedData.length} entries saved to ${path.basename(sectionFile)}`);
        } catch (err) {
            console.error(`✗ ${section}: ${err.message}`);
            errors.push({ section, error: err.message });
        }
    }

    // Save combined data file
    const combinedFile = path.join(DATA_DIR, 'all_data.json');
    fs.writeFileSync(combinedFile, JSON.stringify(allData, null, 2));
    console.log('');
    console.log(`✓ Combined data saved to ${path.basename(combinedFile)}`);

    // Create metadata file
    const metadata = {
        buildDate: new Date().toISOString(),
        sections: SECTIONS,
        totalEntries: Object.values(allData).reduce((sum, arr) => sum + arr.length, 0),
        errors: errors
    };

    const metadataFile = path.join(DATA_DIR, 'metadata.json');
    fs.writeFileSync(metadataFile, JSON.stringify(metadata, null, 2));

    console.log('');
    console.log('='.repeat(60));
    console.log(`Build complete! Total entries: ${metadata.totalEntries}`);
    console.log(`Build date: ${metadata.buildDate}`);

    if (errors.length > 0) {
        console.log(`\nWarning: ${errors.length} section(s) failed to build`);
    }

    console.log('='.repeat(60));
}

// Run the build
buildAllData().catch((err) => {
    console.error('Build failed:', err);
    process.exit(1);
});
