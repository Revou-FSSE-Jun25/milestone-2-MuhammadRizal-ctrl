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
    // Load user data from localStorage
    loadUserData();
    
    // Initialize navigation
    initializeNavigation();
    
    // Add fade-in animation to main content
    addFadeInAnimation();
    
    // Initialize any game-specific functionality if on a game page
    initializeGamePage();
});

/**
 * Load user data and scores from localStorage
 */
function loadUserData() {
    try {
        // Load current user
        const savedUser = localStorage.getItem('revoFunUser');
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
        }
        
        // Load game scores
        const savedScores = localStorage.getItem('revoFunScores');
        if (savedScores) {
            gameScores = JSON.parse(savedScores);
        }
    } catch (error) {
        console.error('Error loading user data:', error);
        // Reset to defaults if there's an error
        currentUser = null;
        gameScores = {};
    }
}

/**
 * Save user data to localStorage
 */
function saveUserData() {
    try {
        if (currentUser) {
            localStorage.setItem('revoFunUser', JSON.stringify(currentUser));
        }
        localStorage.setItem('revoFunScores', JSON.stringify(gameScores));
    } catch (error) {
        console.error('Error saving user data:', error);
    }
}

/**
 * Set the current user
 * @param {string} name - User's name
 */
function setCurrentUser(name) {
    currentUser = {
        name: name.trim(),
        joinDate: new Date().toISOString(),
        totalGamesPlayed: 0
    };
    saveUserData();
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
    // Add click handlers for navigation links
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add smooth transition effect
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Handle smooth scrolling for anchor links
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // Add back to home functionality
    const backButtons = document.querySelectorAll('.back-to-home');
    backButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            // Add loading effect
            this.textContent = 'Loading...';
            this.disabled = true;
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 300);
        });
    });
    
    // Add smooth scrolling to all internal links
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
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
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.game-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message element
    const messageElement = document.createElement('div');
    messageElement.className = `game-message ${type}`;
    messageElement.textContent = message;
    
    // Add to game area
    const gameArea = document.querySelector('.game-area');
    if (gameArea) {
        gameArea.insertBefore(messageElement, gameArea.firstChild);
        
        // Auto-remove after duration
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, duration);
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

// Export functions for use in other scripts (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        setCurrentUser,
        getCurrentUser,
        saveGameScore,
        getLeaderboard,
        showMessage,
        formatNumber,
        getRandomNumber,
        shuffleArray,
        debounce,
        isMobile,
        setButtonLoading,
        removeButtonLoading,
        createLeaderboard
    };
}
