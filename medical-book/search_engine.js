/**
 * Search Engine for Cantonese Medical Handbook
 *
 * Provides fast, fuzzy search across all medical sections with highlighting
 * and filtering capabilities.
 */

class SearchEngine {
    constructor() {
        this.allData = {};
        this.searchIndex = [];
        this.isIndexed = false;
    }

    /**
     * Initialize and build search index
     */
    async initialize() {
        if (this.isIndexed) {
            return;
        }

        console.log('Building search index...');

        try {
            // Load all data
            const response = await fetch('data/all_data.json');
            this.allData = await response.json();

            // Build search index
            this.buildIndex();
            this.isIndexed = true;

            console.log('✓ Search index built');

        } catch (error) {
            console.error('Failed to build search index:', error);
            throw error;
        }
    }

    /**
     * Build searchable index from all data
     */
    buildIndex() {
        this.searchIndex = [];

        Object.entries(this.allData).forEach(([sectionName, items]) => {
            items.forEach(item => {
                this.searchIndex.push({
                    section: sectionName,
                    sectionDisplay: this.formatSectionName(sectionName),
                    ...item,
                    // Create searchable text fields
                    searchText: [
                        item.english,
                        item.cantonese,
                        item.characters,
                        item.see_more
                    ].filter(Boolean).join(' ').toLowerCase()
                });
            });
        });

        console.log(`Indexed ${this.searchIndex.length} entries across ${Object.keys(this.allData).length} sections`);
    }

    /**
     * Format section name for display
     */
    formatSectionName(sectionName) {
        const nameMap = {
            'introductions': 'Introductions',
            'complaints': 'Complaints',
            'medications': 'Medications',
            'allergies': 'Allergies',
            'history_questions': 'History Questions',
            'family_history': 'Family History',
            'prior_illnesses': 'Prior Illnesses',
            'cardiology': 'Cardiology',
            'cardiovascular_illnesses': 'Cardiovascular Illnesses',
            'anatomy': 'Anatomy',
            'emergency': 'Emergency',
            'dermatology': 'Dermatology',
            'endocrinology': 'Endocrinology',
            'gastroenterology': 'Gastroenterology'
        };

        return nameMap[sectionName] || sectionName;
    }

    /**
     * Get section page URL
     */
    getSectionUrl(sectionName) {
        const urlMap = {
            'introductions': 'mb-introductions.html',
            'complaints': 'mb-complaints.html',
            'medications': 'mb-medications.html',
            'allergies': 'mb-medications.html',
            'history_questions': 'mb-history.html',
            'family_history': 'mb-history.html',
            'prior_illnesses': 'mb-prior-illnesses.html',
            'cardiology': 'mb-cardiology.html',
            'cardiovascular_illnesses': 'mb-cardiology.html',
            'anatomy': 'mb-anatomy.html',
            'emergency': 'mb-emergency.html',
            'dermatology': 'mb-dermatology.html',
            'endocrinology': 'mb-endocrinology.html',
            'gastroenterology': 'mb-gastroenterology.html'
        };

        return urlMap[sectionName] || '#';
    }

    /**
     * Search with fuzzy matching and ranking
     */
    search(query, options = {}) {
        if (!this.isIndexed) {
            console.warn('Search index not built yet');
            return [];
        }

        if (!query || query.trim().length === 0) {
            return [];
        }

        const {
            maxResults = 50,
            sections = null, // Filter by specific sections
            fields = ['english', 'cantonese', 'characters'], // Which fields to search
            fuzzy = true
        } = options;

        const searchTerm = query.toLowerCase().trim();
        const results = [];

        this.searchIndex.forEach(item => {
            // Section filter
            if (sections && !sections.includes(item.section)) {
                return;
            }

            let score = 0;
            let matchedFields = [];

            // Search in specified fields
            fields.forEach(field => {
                const value = (item[field] || '').toLowerCase();

                if (!value) return;

                // Exact match (highest score)
                if (value === searchTerm) {
                    score += 100;
                    matchedFields.push({ field, type: 'exact', value });
                }
                // Starts with (high score)
                else if (value.startsWith(searchTerm)) {
                    score += 50;
                    matchedFields.push({ field, type: 'prefix', value });
                }
                // Contains (medium score)
                else if (value.includes(searchTerm)) {
                    score += 25;
                    matchedFields.push({ field, type: 'contains', value });
                }
                // Fuzzy match (low score)
                else if (fuzzy && this.fuzzyMatch(value, searchTerm)) {
                    score += 10;
                    matchedFields.push({ field, type: 'fuzzy', value });
                }
            });

            // Also search in see_more field (lower weight)
            const seeMore = (item.see_more || '').toLowerCase();
            if (seeMore.includes(searchTerm)) {
                score += 5;
                matchedFields.push({ field: 'see_more', type: 'contains', value: seeMore });
            }

            // If we have matches, add to results
            if (score > 0) {
                results.push({
                    ...item,
                    score,
                    matchedFields,
                    query: searchTerm
                });
            }
        });

        // Sort by score (highest first)
        results.sort((a, b) => b.score - a.score);

        // Limit results
        return results.slice(0, maxResults);
    }

    /**
     * Simple fuzzy matching algorithm
     */
    fuzzyMatch(text, pattern) {
        const textLen = text.length;
        const patternLen = pattern.length;

        if (patternLen > textLen) {
            return false;
        }

        let patternIdx = 0;
        let textIdx = 0;

        while (patternIdx < patternLen && textIdx < textLen) {
            if (pattern[patternIdx] === text[textIdx]) {
                patternIdx++;
            }
            textIdx++;
        }

        return patternIdx === patternLen;
    }

    /**
     * Get suggestions for autocomplete
     */
    getSuggestions(query, limit = 10) {
        if (!query || query.trim().length < 2) {
            return [];
        }

        const results = this.search(query, { maxResults: limit });

        // Extract unique suggestions
        const suggestions = new Set();

        results.forEach(result => {
            suggestions.add(result.english);
            suggestions.add(result.characters);
        });

        return Array.from(suggestions).slice(0, limit);
    }

    /**
     * Highlight search term in text
     */
    highlightMatch(text, query) {
        if (!text || !query) {
            return text;
        }

        const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    /**
     * Escape special regex characters
     */
    escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * Get all available sections
     */
    getSections() {
        return Object.keys(this.allData).map(section => ({
            id: section,
            name: this.formatSectionName(section),
            url: this.getSectionUrl(section),
            count: this.allData[section].length
        }));
    }
}

// Create global search engine instance
const searchEngine = new SearchEngine();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        searchEngine.initialize().catch(err => {
            console.error('Search initialization failed:', err);
        });
    });
} else {
    searchEngine.initialize().catch(err => {
        console.error('Search initialization failed:', err);
    });
}
