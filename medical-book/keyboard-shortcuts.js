/**
 * Keyboard Shortcuts for Cantonese Medical Handbook
 * Adds keyboard navigation for better accessibility and power user features
 */

(function() {
    'use strict';

    const shortcuts = {
        '/': { action: focusSearch, description: 'Focus search bar' },
        '?': { action: showShortcuts, description: 'Show keyboard shortcuts' },
        'Escape': { action: closeModals, description: 'Close modals/hints' },
        'h': { action: goHome, description: 'Go to home page' },
        's': { action: goToSearch, description: 'Go to search page' }
    };

    let shortcutHintElement = null;

    // Initialize keyboard shortcuts
    function init() {
        document.addEventListener('keydown', handleKeyPress);
        createShortcutHint();
        console.log('⌨️ Keyboard shortcuts enabled. Press ? to see available shortcuts.');
    }

    // Handle key presses
    function handleKeyPress(e) {
        // Don't trigger shortcuts when typing in input fields
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            // Allow Escape to work in input fields
            if (e.key === 'Escape') {
                e.target.blur();
                closeModals();
            }
            return;
        }

        const key = e.key;
        const shortcut = shortcuts[key];

        if (shortcut) {
            e.preventDefault();
            shortcut.action();
        }
    }

    // Focus search bar
    function focusSearch() {
        const searchInput = document.getElementById('navbarSearchInput') ||
                          document.getElementById('searchInput') ||
                          document.getElementById('homeSearchInput');

        if (searchInput) {
            searchInput.focus();
            searchInput.select();
            showMessage('Search bar focused', 'info');
        }
    }

    // Show keyboard shortcuts
    function showShortcuts() {
        if (!shortcutHintElement) {
            createShortcutHint();
        }

        const content = `
            <div style="font-weight: bold; margin-bottom: 0.5rem;">Keyboard Shortcuts</div>
            ${Object.entries(shortcuts).map(([key, data]) => `
                <div style="margin: 0.25rem 0;">
                    <kbd>${key}</kbd> - ${data.description}
                </div>
            `).join('')}
            <div style="margin-top: 0.5rem; opacity: 0.8; font-size: 0.8rem;">
                Press <kbd>Esc</kbd> to close
            </div>
        `;

        shortcutHintElement.innerHTML = content;
        shortcutHintElement.classList.add('show');

        // Auto-hide after 10 seconds
        setTimeout(() => {
            shortcutHintElement.classList.remove('show');
        }, 10000);
    }

    // Close modals and hints
    function closeModals() {
        if (shortcutHintElement) {
            shortcutHintElement.classList.remove('show');
        }

        // Close any open Bootstrap collapses
        document.querySelectorAll('.collapse.show').forEach(el => {
            const bsCollapse = bootstrap.Collapse.getInstance(el);
            if (bsCollapse) {
                bsCollapse.hide();
            }
        });
    }

    // Navigate to home
    function goHome() {
        if (!window.location.pathname.endsWith('index.html') &&
            !window.location.pathname.endsWith('/')) {
            window.location.href = '/';
        }
    }

    // Navigate to search
    function goToSearch() {
        if (!window.location.pathname.includes('mb-search.html')) {
            window.location.href = '/medical-book/mb-search.html';
        }
    }

    // Create shortcut hint element
    function createShortcutHint() {
        shortcutHintElement = document.createElement('div');
        shortcutHintElement.className = 'keyboard-hint';
        document.body.appendChild(shortcutHintElement);
    }

    // Show status message
    function showMessage(message, type = 'info') {
        const messageEl = document.createElement('div');
        messageEl.className = `status-message ${type}`;
        messageEl.textContent = message;
        document.body.appendChild(messageEl);

        setTimeout(() => {
            messageEl.style.opacity = '0';
            setTimeout(() => {
                messageEl.remove();
            }, 300);
        }, 2000);
    }

    // Add play audio with keyboard shortcut for focused rows
    function enhanceDataRows() {
        document.querySelectorAll('.data-row').forEach((row, index) => {
            row.setAttribute('tabindex', '0');
            row.setAttribute('role', 'button');

            row.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const playButton = row.querySelector('.btn-primary');
                    if (playButton) {
                        playButton.click();
                    }
                }
            });
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            init();
            setTimeout(enhanceDataRows, 1000); // Wait for data to load
        });
    } else {
        init();
        setTimeout(enhanceDataRows, 1000);
    }

    // Show welcome hint on first visit
    if (!localStorage.getItem('keyboardHintsShown')) {
        setTimeout(() => {
            if (shortcutHintElement) {
                shortcutHintElement.innerHTML = `
                    <div style="font-weight: bold; margin-bottom: 0.5rem;">💡 Tip</div>
                    <div>Press <kbd>?</kbd> to see keyboard shortcuts</div>
                    <div style="margin-top: 0.5rem; opacity: 0.8; font-size: 0.8rem;">
                        Press <kbd>Esc</kbd> to close
                    </div>
                `;
                shortcutHintElement.classList.add('show');
                localStorage.setItem('keyboardHintsShown', 'true');

                setTimeout(() => {
                    shortcutHintElement.classList.remove('show');
                }, 5000);
            }
        }, 2000);
    }

})();
