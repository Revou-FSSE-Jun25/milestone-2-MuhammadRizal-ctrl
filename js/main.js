/**
 * RevoFun Gaming Company - Main JavaScript File
 * Handles navigation, shared utilities, and common game functionality
 */

// Global variables for shared functionality
let currentUser = null;
let gameScores = {};

/**
 * Initialize the application when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Load user data from localStorage
        loadUserData();
        
        // Initialize navigation
        initializeNavigation();
        
        // Add fade-in animation to main content
        addFadeInAnimation();
        
        // Initialize any game-specific functionality if on a game page
        initializeGamePage();
        
        console.log('RevoFun application initialized successfully');
    } catch (error) {
        console.error('Error initializing RevoFun application:', error);
        showErrorMessage('Failed to initialize the application. Please refresh the page.');
    }
});

/**
 * Load user data and scores from localStorage
 */
function loadUserData() {
    try {
        // Check if localStorage is available
        if (!isLocalStorageAvailable()) {
            console.warn('localStorage is not available. Data will not persist.');
            currentUser = null;
            gameScores = {};
            return;
        }

        // Load current user
        const savedUser = localStorage.getItem('revoFunUser');
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            // Validate user data structure
            if (parsedUser && typeof parsedUser === 'object' && parsedUser.name) {
                currentUser = parsedUser;
            } else {
                console.warn('Invalid user data found, resetting to null');
                currentUser = null;
            }
        }
        
        // Load game scores
        const savedScores = localStorage.getItem('revoFunScores');
        if (savedScores) {
            const parsedScores = JSON.parse(savedScores);
            // Validate scores data structure
            if (parsedScores && typeof parsedScores === 'object') {
                gameScores = parsedScores;
            } else {
                console.warn('Invalid scores data found, resetting to empty object');
                gameScores = {};
            }
        }
    } catch (error) {
        console.error('Error loading user data:', error);
        // Reset to defaults if there's an error
        currentUser = null;
        gameScores = {};
        showErrorMessage('Failed to load saved data. Starting fresh.');
    }
}

/**
 * Save user data to localStorage
 */
function saveUserData() {
    try {
        // Check if localStorage is available
        if (!isLocalStorageAvailable()) {
            console.warn('localStorage is not available. Data will not be saved.');
            return;
        }

        // Validate data before saving
        if (currentUser && typeof currentUser === 'object' && currentUser.name) {
            localStorage.setItem('revoFunUser', JSON.stringify(currentUser));
        }
        
        if (gameScores && typeof gameScores === 'object') {
            localStorage.setItem('revoFunScores', JSON.stringify(gameScores));
        }
    } catch (error) {
        console.error('Error saving user data:', error);
        showErrorMessage('Failed to save data. Your progress may not be saved.');
    }
}

/**
 * Set the current user
 * @param {string} name - User's name
 */
function setCurrentUser(name) {
    try {
        // Validate input
        if (!name || typeof name !== 'string') {
            throw new Error('Invalid name provided');
        }

        const trimmedName = name.trim();
        if (trimmedName.length === 0) {
            throw new Error('Name cannot be empty');
        }

        if (trimmedName.length > 50) {
            throw new Error('Name is too long (max 50 characters)');
        }

        currentUser = {
            name: trimmedName,
            joinDate: new Date().toISOString(),
            totalGamesPlayed: 0
        };
        saveUserData();
        console.log('User set successfully:', trimmedName);
    } catch (error) {
        console.error('Error setting user:', error);
        showErrorMessage('Failed to set user name. Please try again.');
        throw error; // Re-throw to allow calling code to handle
    }
}

/**
 * Get the current user
 * @returns {Object|null} Current user object or null
 */
function getCurrentUser() {
    return currentUser;
}

/**
 * Update user's game count
 */
function incrementGamesPlayed() {
    if (currentUser) {
        currentUser.totalGamesPlayed++;
        saveUserData();
    }
}

/**
 * Save a game score
 * @param {string} gameName - Name of the game
 * @param {number} score - Score achieved
 * @param {Object} additionalData - Additional game data
 */
function saveGameScore(gameName, score, additionalData = {}) {
    if (!gameScores[gameName]) {
        gameScores[gameName] = [];
    }
    
    const scoreEntry = {
        player: currentUser ? currentUser.name : 'Anonymous',
        score: score,
        date: new Date().toISOString(),
        ...additionalData
    };
    
    gameScores[gameName].push(scoreEntry);
    
    // Keep only top 10 scores
    gameScores[gameName].sort((a, b) => b.score - a.score);
    gameScores[gameName] = gameScores[gameName].slice(0, 10);
    
    saveUserData();
    return scoreEntry;
}

/**
 * Get leaderboard for a specific game
 * @param {string} gameName - Name of the game
 * @returns {Array} Array of top scores
 */
function getLeaderboard(gameName) {
    return gameScores[gameName] || [];
}

/**
 * Initialize navigation functionality
 */
function initializeNavigation() {
    try {
        // Add click handlers for navigation links
        const navLinks = document.querySelectorAll('.nav-menu a');
        if (navLinks.length === 0) {
            console.warn('No navigation links found');
            return;
        }

        navLinks.forEach((link, index) => {
            try {
                link.addEventListener('click', function(e) {
                    try {
                        // Add smooth transition effect
                        this.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            try {
                                this.style.transform = 'scale(1)';
                            } catch (error) {
                                console.warn('Error resetting transform:', error);
                            }
                        }, 150);
                        
                        // Handle smooth scrolling for anchor links
                        const href = this.getAttribute('href');
                        if (href && href.startsWith('#')) {
                            e.preventDefault();
                            const targetId = href.substring(1);
                            const targetElement = document.getElementById(targetId);
                            if (targetElement) {
                                targetElement.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'start'
                                });
                            } else {
                                console.warn(`Target element with id '${targetId}' not found`);
                            }
                        }
                    } catch (error) {
                        console.error('Error handling navigation click:', error);
                    }
                });
            } catch (error) {
                console.error(`Error adding event listener to nav link ${index}:`, error);
            }
        });
        
        // Add back to home functionality
        const backButtons = document.querySelectorAll('.back-to-home');
        backButtons.forEach((button, index) => {
            try {
                button.addEventListener('click', function(e) {
                    try {
                        e.preventDefault();
                        // Add loading effect
                        this.textContent = 'Loading...';
                        this.disabled = true;
                        
                        setTimeout(() => {
                            try {
                                window.location.href = 'index.html';
                            } catch (error) {
                                console.error('Error navigating to home:', error);
                                this.textContent = 'Back to Home';
                                this.disabled = false;
                                showErrorMessage('Failed to navigate to home page');
                            }
                        }, 300);
                    } catch (error) {
                        console.error('Error handling back button click:', error);
                    }
                });
            } catch (error) {
                console.error(`Error adding event listener to back button ${index}:`, error);
            }
        });
        
        // Add smooth scrolling to all internal links
        const internalLinks = document.querySelectorAll('a[href^="#"]');
        internalLinks.forEach((link, index) => {
            try {
                link.addEventListener('click', function(e) {
                    try {
                        e.preventDefault();
                        const href = this.getAttribute('href');
                        if (href) {
                            const targetId = href.substring(1);
                            const targetElement = document.getElementById(targetId);
                            if (targetElement) {
                                targetElement.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'start'
                                });
                            } else {
                                console.warn(`Target element with id '${targetId}' not found`);
                            }
                        }
                    } catch (error) {
                        console.error('Error handling internal link click:', error);
                    }
                });
            } catch (error) {
                console.error(`Error adding event listener to internal link ${index}:`, error);
            }
        });
    } catch (error) {
        console.error('Error initializing navigation:', error);
        showErrorMessage('Failed to initialize navigation. Some features may not work properly.');
    }
}

/**
 * Add fade-in animation to elements
 */
function addFadeInAnimation() {
    const elements = document.querySelectorAll('.game-card, .hero, .game-container');
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s ease-out';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

/**
 * Initialize game page specific functionality
 */
function initializeGamePage() {
    const gameContainer = document.querySelector('.game-container');
    if (gameContainer) {
        // Add game-specific initialization based on current page
        const currentPage = window.location.pathname.split('/').pop();
        
        switch (currentPage) {
            case 'number-guessing.html':
                // Number guessing game will initialize itself
                break;
            case 'rock-paper-scissors.html':
                // RPS game will initialize itself
                break;
            case 'memory-game.html':
                // Memory game will initialize itself
                break;
        }
    }
}

/**
 * Show a message to the user
 * @param {string} message - Message to display
 * @param {string} type - Type of message (success, error, info)
 * @param {number} duration - Duration to show message (ms)
 */
function showMessage(message, type = 'info', duration = 3000) {
    try {
        // Validate inputs
        if (!message || typeof message !== 'string') {
            console.error('Invalid message provided to showMessage');
            return;
        }

        if (!['success', 'error', 'info', 'warning'].includes(type)) {
            type = 'info';
        }

        // Remove existing messages
        const existingMessages = document.querySelectorAll('.game-message');
        existingMessages.forEach(msg => {
            try {
                msg.remove();
            } catch (e) {
                console.warn('Error removing existing message:', e);
            }
        });
        
        // Create new message element
        const messageElement = document.createElement('div');
        messageElement.className = `game-message ${type}`;
        messageElement.textContent = message;
        
        // Add to game area or body if game area not found
        const gameArea = document.querySelector('.game-area');
        const targetContainer = gameArea || document.body;
        
        if (targetContainer) {
            targetContainer.insertBefore(messageElement, targetContainer.firstChild);
            
            // Auto-remove after duration
            setTimeout(() => {
                try {
                    if (messageElement.parentNode) {
                        messageElement.remove();
                    }
                } catch (e) {
                    console.warn('Error removing message element:', e);
                }
            }, duration);
        } else {
            console.error('No suitable container found for message display');
        }
    } catch (error) {
        console.error('Error showing message:', error);
        // Fallback to alert if DOM manipulation fails
        alert(message);
    }
}

/**
 * Show error message with enhanced styling
 * @param {string} message - Error message to display
 */
function showErrorMessage(message) {
    showMessage(message, 'error', 5000);
}

/**
 * Check if localStorage is available
 * @returns {boolean} True if localStorage is available
 */
function isLocalStorageAvailable() {
    try {
        const test = '__localStorage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * Format a number with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Generate a random number between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random number
 */
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array
 */
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Check if user is on mobile device
 * @returns {boolean} True if mobile device
 */
function isMobile() {
    return window.innerWidth <= 768;
}

/**
 * Add loading state to a button
 * @param {HTMLElement} button - Button element
 * @param {string} loadingText - Text to show while loading
 */
function setButtonLoading(button, loadingText = 'Loading...') {
    button.disabled = true;
    button.dataset.originalText = button.textContent;
    button.textContent = loadingText;
}

/**
 * Remove loading state from a button
 * @param {HTMLElement} button - Button element
 */
function removeButtonLoading(button) {
    button.disabled = false;
    button.textContent = button.dataset.originalText || 'Submit';
    delete button.dataset.originalText;
}

/**
 * Create a leaderboard display
 * @param {string} gameName - Name of the game
 * @param {HTMLElement} container - Container to add leaderboard to
 */
function createLeaderboard(gameName, container) {
    const leaderboard = getLeaderboard(gameName);
    
    if (leaderboard.length === 0) {
        container.innerHTML = '<p>No scores yet. Be the first to play!</p>';
        return;
    }
    
    const leaderboardHTML = `
        <div class="leaderboard">
            <h3>🏆 High Scores</h3>
            <ul class="leaderboard-list">
                ${leaderboard.map((entry, index) => `
                    <li class="leaderboard-item">
                        <span class="leaderboard-rank">#${index + 1}</span>
                        <span class="leaderboard-name">${entry.player}</span>
                        <span class="leaderboard-score">${formatNumber(entry.score)}</span>
                    </li>
                `).join('')}
            </ul>
        </div>
    `;
    
    container.innerHTML = leaderboardHTML;
}

/**
 * Global error handler for unhandled errors
 */
window.addEventListener('error', function(event) {
    console.error('Unhandled error:', event.error);
    showErrorMessage('An unexpected error occurred. Please refresh the page if problems persist.');
});

/**
 * Global error handler for unhandled promise rejections
 */
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    showErrorMessage('An unexpected error occurred. Please refresh the page if problems persist.');
});

/**
 * Validate DOM element exists and is accessible
 * @param {HTMLElement} element - Element to validate
 * @param {string} name - Name of element for error messages
 * @returns {boolean} True if element is valid
 */
function validateElement(element, name) {
    if (!element) {
        console.error(`Element '${name}' not found`);
        return false;
    }
    if (!element.isConnected) {
        console.error(`Element '${name}' is not connected to DOM`);
        return false;
    }
    return true;
}

/**
 * Safe DOM query selector with error handling
 * @param {string} selector - CSS selector
 * @param {string} name - Name for error messages
 * @returns {HTMLElement|null} Found element or null
 */
function safeQuerySelector(selector, name) {
    try {
        const element = document.querySelector(selector);
        if (!element) {
            console.warn(`Element '${name}' not found with selector: ${selector}`);
        }
        return element;
    } catch (error) {
        console.error(`Error querying selector '${selector}' for '${name}':`, error);
        return null;
    }
}

/**
 * Safe DOM query selector all with error handling
 * @param {string} selector - CSS selector
 * @param {string} name - Name for error messages
 * @returns {NodeList} Found elements or empty NodeList
 */
function safeQuerySelectorAll(selector, name) {
    try {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
            console.warn(`No elements found with selector: ${selector} for '${name}'`);
        }
        return elements;
    } catch (error) {
        console.error(`Error querying selector '${selector}' for '${name}':`, error);
        return document.querySelectorAll(''); // Return empty NodeList
    }
}

// Export functions for use in other scripts (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        setCurrentUser,
        getCurrentUser,
        saveGameScore,
        getLeaderboard,
        showMessage,
        showErrorMessage,
        formatNumber,
        getRandomNumber,
        shuffleArray,
        debounce,
        isMobile,
        setButtonLoading,
        removeButtonLoading,
        createLeaderboard,
        isLocalStorageAvailable,
        validateElement,
        safeQuerySelector,
        safeQuerySelectorAll
    };
}
