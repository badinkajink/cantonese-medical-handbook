/**
 * Data Loader - Loads medical handbook data from local JSON files
 *
 * This replaces the old Google Sheets API loading for faster, offline-capable performance.
 * Data is loaded from pre-built JSON files in the /data directory.
 */

// Cache for loaded data to avoid re-fetching
const dataCache = {};

/**
 * Load data for a specific section and render it to the page
 * @param {string} sectionName - Name of the section to load (e.g., "introductions", "complaints")
 */
async function load_data(sectionName) {
    console.log(`Loading ${sectionName} from local JSON...`);

    try {
        // Check cache first
        if (dataCache[sectionName]) {
            console.log(`Using cached data for ${sectionName}`);
            renderSection(sectionName, dataCache[sectionName]);
            return;
        }

        // Fetch from local JSON file
        const response = await fetch(`data/${sectionName}.json`);

        if (!response.ok) {
            throw new Error(`Failed to load ${sectionName}: ${response.statusText}`);
        }

        const data = await response.json();

        // Cache the data
        dataCache[sectionName] = data;

        // Render the section
        renderSection(sectionName, data);

        console.log(`✓ Loaded ${data.length} entries for ${sectionName}`);

    } catch (error) {
        console.error(`Error loading ${sectionName}:`, error);

        // Display error message to user
        const container = document.getElementById(sectionName);
        if (container) {
            container.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    <h4 class="alert-heading">Error Loading Data</h4>
                    <p>Failed to load ${sectionName} data. Please refresh the page.</p>
                    <hr>
                    <p class="mb-0">Error: ${error.message}</p>
                </div>
            `;
        }
    }
}

/**
 * Render a section's data to the DOM
 * @param {string} sectionName - Name of the section
 * @param {Array} data - Array of data objects to render
 */
function renderSection(sectionName, data) {
    const container = document.getElementById(sectionName);

    if (!container) {
        console.error(`Container element #${sectionName} not found`);
        return;
    }

    // Clear existing content
    container.innerHTML = '';

    // Build header row
    const header = `
        <div class="row data-header" style="background-color: #f0f0f0; font-weight: bold;">
            <div class="col-1">Audio</div>
            <div class="col-3">English</div>
            <div class="col-4">Jyutping</div>
            <div class="col-3">Characters</div>
            <div class="col-1">See More</div>
        </div>
    `;

    container.innerHTML = header;

    // Build data rows
    data.forEach((item, index) => {
        const rowNum = index + 1;
        const bgcolor = rowNum % 2 === 0 ? "#ffffff" : "#f0f0f0";

        // Audio play function (inline)
        const playAudio = `(function(){var music = new Audio('./${sectionName}_audio/${item.id}.mp3'); music.play();})();`;

        // Build row HTML
        const rowHTML = `
            <div class="row p-2 data-row" style="background-color: ${bgcolor}" data-search-english="${item.english.toLowerCase()}" data-search-cantonese="${item.cantonese.toLowerCase()}" data-search-characters="${item.characters}">
                <div class="col-1 my-auto">
                    <button class="btn btn-primary btn-sm" type="button" onclick="${playAudio}" aria-label="Play audio for ${item.english}">
                        <span aria-hidden="true">▶</span>
                        <span class="visually-hidden">Play</span>
                    </button>
                </div>

                <div class="col-3 my-auto search-english">${item.english}</div>
                <div class="col-4 my-auto search-cantonese">${item.cantonese.toLowerCase()}</div>
                <div class="col-3 my-auto search-characters">${item.characters}</div>

                <div class="col-1 my-auto">
                    ${item.see_more ? `
                        <button class="btn btn-primary btn-sm" type="button" data-bs-toggle="collapse" data-bs-target="#r${item.id}" aria-expanded="false" aria-label="See more information">
                            +
                        </button>
                    ` : ''}
                </div>

                ${item.see_more ? `
                    <div class="collapse accordion-collapse" id="r${item.id}">
                        <div class="col-12 p-3 bg-light">
                            ${item.see_more}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;

        container.innerHTML += rowHTML;
    });

    // Add data attributes for search functionality
    container.setAttribute('data-section-loaded', 'true');
    container.setAttribute('data-section-name', sectionName);
}

/**
 * Preload all data for faster search
 * Call this on search page or when user opens search
 */
async function preloadAllData() {
    const sections = [
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

    console.log('Preloading all sections for search...');

    try {
        const response = await fetch('data/all_data.json');
        const allData = await response.json();

        // Cache all sections
        Object.assign(dataCache, allData);

        console.log('✓ All data preloaded');
        return allData;

    } catch (error) {
        console.error('Error preloading data:', error);

        // Fallback: load sections individually
        const promises = sections.map(section =>
            fetch(`data/${section}.json`)
                .then(r => r.json())
                .then(data => ({ section, data }))
                .catch(err => {
                    console.error(`Failed to load ${section}:`, err);
                    return null;
                })
        );

        const results = await Promise.all(promises);
        const loadedData = {};

        results.forEach(result => {
            if (result) {
                loadedData[result.section] = result.data;
                dataCache[result.section] = result.data;
            }
        });

        return loadedData;
    }
}

/**
 * Get cached data for a section (useful for search)
 */
function getCachedData(sectionName) {
    return dataCache[sectionName] || null;
}

/**
 * Get all cached data (useful for global search)
 */
function getAllCachedData() {
    return dataCache;
}
