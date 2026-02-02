#!/usr/bin/env node

/**
 * Update all section pages to use new template with:
 * - Modern HTML5 structure
 * - Common styles
 * - Keyboard shortcuts
 * - Better accessibility
 * - Offline data loading
 */

const fs = require('fs');
const path = require('path');

const sections = [
    { file: 'mb-complaints.html', title: 'Complaints', subtitle: 'Common Patient Complaints and Symptoms', section: 'complaints' },
    { file: 'mb-medications.html', title: 'Medications & Allergies', subtitle: 'Medicine Names and Allergy Information', section: 'medications', multiSection: ['medications', 'allergies'] },
    { file: 'mb-history.html', title: 'Medical History', subtitle: 'History Questions and Family History', section: 'history_questions', multiSection: ['history_questions', 'family_history'] },
    { file: 'mb-prior-illnesses.html', title: 'Prior Illnesses', subtitle: 'Previous Medical Conditions', section: 'prior_illnesses' },
    { file: 'mb-cardiology.html', title: 'Cardiology', subtitle: 'Heart and Cardiovascular Terms', section: 'cardiology', multiSection: ['cardiology', 'cardiovascular_illnesses'] },
    { file: 'mb-anatomy.html', title: 'Anatomy', subtitle: 'Body Parts and Anatomical Terms', section: 'anatomy' },
    { file: 'mb-emergency.html', title: 'Emergency', subtitle: 'Urgent Care and Emergency Procedures', section: 'emergency' },
    { file: 'mb-dermatology.html', title: 'Dermatology', subtitle: 'Skin Conditions and Terminology', section: 'dermatology' },
    { file: 'mb-endocrinology.html', title: 'Endocrinology', subtitle: 'Endocrine System and Hormones', section: 'endocrinology' },
    { file: 'mb-gastroenterology.html', title: 'Gastroenterology', subtitle: 'Digestive System and GI Terms', section: 'gastroenterology' }
];

function generatePageHTML(config) {
    const { file, title, subtitle, section, multiSection } = config;

    const sections = multiSection || [section];
    const loadSections = sections.map(s => `        load_data("${s}")`).join('.then(() => {\n            console.log("${s} loaded");\n            return ');
    const sectionDivs = sections.map(s => `            <div id="${s}">
                <!-- Loading state -->
                <div class="loading">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="mt-3">Loading phrases...</p>
                </div>
            </div>`).join('\n\n');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Cantonese Medical Handbook</title>

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Common Styles -->
    <link rel="stylesheet" href="common-styles.css">
</head>
<body>
    <!-- Skip to content for accessibility -->
    <a href="#main-content" class="skip-to-content">Skip to content</a>

    <!-- Load navbar -->
    <div id="includedContent"></div>

    <!-- Page Header -->
    <div class="page-header">
        <div class="container">
            <h1>${title}</h1>
            <p>${subtitle}</p>
        </div>
    </div>

    <!-- Main Content -->
    <main id="main-content">
        <div class="container-md">
${sectionDivs}
        </div>
    </main>

    <!-- jQuery -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"></script>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>

    <!-- Load navbar -->
    <script>
        $(function() {
            $("#includedContent").load("mb-header.html");
        });
    </script>

    <!-- Data Loader -->
    <script src="data_loader.js"></script>
    <script>
        // Load data when page is ready
${loadSections}${sections.length > 1 ? '\n        })' : ''})
            .then(() => {
                console.log('${title} loaded successfully');
            })
            .catch(err => {
                console.error('Failed to load ${title}:', err);
            });
    </script>

    <!-- Keyboard Shortcuts -->
    <script src="keyboard-shortcuts.js"></script>
</body>
</html>
`;
}

// Update all pages
console.log('Updating section pages...\n');

sections.forEach(config => {
    const filePath = path.join(__dirname, 'medical-book', config.file);
    const html = generatePageHTML(config);

    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`✓ Updated ${config.file}`);
});

console.log('\n✅ All section pages updated!');
console.log('\nUpdated pages now include:');
console.log('  • Modern HTML5 structure');
console.log('  • Common styles (common-styles.css)');
console.log('  • Keyboard shortcuts (keyboard-shortcuts.js)');
console.log('  • Better accessibility');
console.log('  • Offline data loading');
console.log('  • Loading states');
