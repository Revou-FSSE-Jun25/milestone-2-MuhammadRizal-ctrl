/**
 * Memory Card Game - JavaScript Implementation
 * A game where players match pairs of cards by memory
 */

// Game state variables
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moveCount = 0;
let gameStarted = false;
let gameEnded = false;
let startTime = 0;
let timerInterval = null;

// Game configuration
const TOTAL_PAIRS = 4;
const CARD_SYMBOLS = ['🎯', '🌟', '🎨', '🎪', '🎭', '🎪', '🎨', '🌟', '🎯', '🎪', '🎨', '🌟', '🎯', '🎪', '🎨', '🌟'];

// DOM elements
let memoryGrid, gameStatus, moveCountDisplay, timerDisplay, matchCountDisplay;
let gameControls, startGameBtn, newGameBtn, backToHomeBtn;
let gameComplete, finalScoreDisplay;
let userNameSection, setNameBtn, playerNameInput;
let leaderboardContainer;

/**
 * Initialize the game when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Get DOM elements
        initializeElements();
        
        // Set up event listeners
        setupEventListeners();
        
        // Check if user is already set
        checkUserStatus();
        
        // Create leaderboard
        createLeaderboard();
        
        // Initialize game grid
        initializeGameGrid();
        
        console.log('Memory Card Game initialized successfully');
    } catch (error) {
        console.error('Error initializing Memory Card Game:', error);
        showErrorMessage('Failed to initialize the Memory Card Game. Please refresh the page.');
    }
});

/**
 * Initialize DOM elements
 */
function initializeElements() {
    memoryGrid = document.getElementById('memoryGrid');
    gameStatus = document.getElementById('gameStatus');
    moveCountDisplay = document.getElementById('moveCount');
    timerDisplay = document.getElementById('timer');
    matchCountDisplay = document.getElementById('matchCount');
    gameControls = document.getElementById('gameControls');
    startGameBtn = document.getElementById('startGameBtn');
    newGameBtn = document.getElementById('newGameBtn');
    backToHomeBtn = document.getElementById('backToHomeBtn');
    gameComplete = document.getElementById('gameComplete');
    finalScoreDisplay = document.getElementById('finalScore');
    userNameSection = document.getElementById('userNameSection');
    setNameBtn = document.getElementById('setNameBtn');
    playerNameInput = document.getElementById('playerName');
    leaderboardContainer = document.getElementById('leaderboardContainer');
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
    // Start game button
    startGameBtn.addEventListener('click', startGame);
    
    // New game button
    newGameBtn.addEventListener('click', startNewGame);
    
    // Back to home button
    backToHomeBtn.addEventListener('click', function() {
        window.location.href = 'index.html';
    });
    
    // Set name button
    setNameBtn.addEventListener('click', handleSetName);
    
    // Enter key in name input
    playerNameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSetName();
        }
    });
}

/**
 * Check if user is already set
 */
function checkUserStatus() {
    const currentUser = getCurrentUser();
    if (currentUser) {
        // User already exists, show start button
        startGameBtn.style.display = 'inline-block';
    } else {
        // Show name input
        userNameSection.style.display = 'block';
    }
}

/**
 * Handle setting user name
 */
function handleSetName() {
    const name = playerNameInput.value.trim();
    
    if (name.length === 0) {
        showMessage('Please enter your name or click "Skip" to play as Anonymous', 'error');
        return;
    }
    
    if (name.length > 20) {
        showMessage('Name must be 20 characters or less', 'error');
        return;
    }
    
    // Set the user
    setCurrentUser(name);
    
    // Hide name section and show start button
    userNameSection.style.display = 'none';
    startGameBtn.style.display = 'inline-block';
}

/**
 * Initialize the game grid with cards
 */
function initializeGameGrid() {
    // Clear existing cards
    memoryGrid.innerHTML = '';
    
    // Create card data (pairs of symbols)
    const cardData = [];
    for (let i = 0; i < TOTAL_PAIRS; i++) {
        const symbol = CARD_SYMBOLS[i];
        cardData.push({ id: i * 2, symbol: symbol, matched: false });
        cardData.push({ id: i * 2 + 1, symbol: symbol, matched: false });
    }
    
    // Shuffle the cards
    cards = shuffleArray(cardData);
    
    // Create card elements
    cards.forEach((card, index) => {
        const cardElement = createCardElement(card, index);
        memoryGrid.appendChild(cardElement);
    });
}

/**
 * Create a card element
 * @param {Object} card - Card data
 * @param {number} index - Card index
 * @returns {HTMLElement} Card element
 */
function createCardElement(card, index) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'memory-card';
    cardDiv.dataset.cardId = card.id;
    cardDiv.dataset.index = index;
    
    // Card back
    const cardBack = document.createElement('div');
    cardBack.className = 'card-face card-back';
    cardBack.textContent = '?';
    
    // Card front
    const cardFront = document.createElement('div');
    cardFront.className = 'card-face card-front';
    cardFront.textContent = card.symbol;
    
    cardDiv.appendChild(cardBack);
    cardDiv.appendChild(cardFront);
    
    // Add click event
    cardDiv.addEventListener('click', function() {
        if (gameStarted && !gameEnded) {
            handleCardClick(this);
        }
    });
    
    return cardDiv;
}

/**
 * Start the game
 */
function startGame() {
    // Reset game state
    flippedCards = [];
    matchedPairs = 0;
    moveCount = 0;
    gameStarted = true;
    gameEnded = false;
    startTime = Date.now();
    
    // Reset all cards
    cards.forEach(card => {
        card.matched = false;
    });
    
    // Reset card elements
    const cardElements = document.querySelectorAll('.memory-card');
    cardElements.forEach(cardEl => {
        cardEl.classList.remove('flipped', 'matched', 'disabled');
    });
    
    // Update UI
    updateGameStats();
    updateGameStatus('Find all the matching pairs! Click on two cards to flip them.');
    
    // Hide start button, show new game button
    startGameBtn.style.display = 'none';
    newGameBtn.style.display = 'inline-block';
    
    // Start timer
    startTimer();
    
    // Hide game complete message
    gameComplete.style.display = 'none';
}

/**
 * Handle card click
 * @param {HTMLElement} cardElement - Clicked card element
 */
function handleCardClick(cardElement) {
    try {
        // Validate card element
        if (!cardElement) {
            console.error('Invalid card element provided');
            return;
        }

        // Validate game state
        if (!gameStarted || gameEnded) {
            console.warn('Attempted to click card when game is not active');
            return;
        }

        // Don't allow clicking if card is already flipped or matched
        if (cardElement.classList.contains('flipped') || 
            cardElement.classList.contains('matched') ||
            cardElement.classList.contains('disabled')) {
            return;
        }
        
        // Don't allow clicking if two cards are already flipped
        if (flippedCards.length >= 2) {
            return;
        }

        // Validate card data
        const cardIndex = parseInt(cardElement.dataset.index);
        if (isNaN(cardIndex) || cardIndex < 0 || cardIndex >= cards.length) {
            console.error('Invalid card index:', cardIndex);
            showErrorMessage('Invalid card data. Please refresh the game.');
            return;
        }

        if (!cards[cardIndex]) {
            console.error('Card data not found for index:', cardIndex);
            showErrorMessage('Card data corrupted. Please refresh the game.');
            return;
        }
        
        // Flip the card
        flipCard(cardElement);
        
        // Add to flipped cards
        flippedCards.push({
            element: cardElement,
            card: cards[cardIndex]
        });
        
        // Check if two cards are flipped
        if (flippedCards.length === 2) {
            // Increment move count
            moveCount++;
            updateGameStats();
            
            // Disable all cards temporarily
            disableAllCards();
            
            // Check for match after a short delay
            setTimeout(() => {
                try {
                    checkForMatch();
                } catch (error) {
                    console.error('Error checking for match:', error);
                    showErrorMessage('Error processing card match. Please try again.');
                }
            }, 1000);
        }
    } catch (error) {
        console.error('Error handling card click:', error);
        showErrorMessage('An error occurred while processing your card selection. Please try again.');
    }
}

/**
 * Flip a card
 * @param {HTMLElement} cardElement - Card element to flip
 */
function flipCard(cardElement) {
    cardElement.classList.add('flipped');
}

/**
 * Disable all cards
 */
function disableAllCards() {
    const cardElements = document.querySelectorAll('.memory-card');
    cardElements.forEach(cardEl => {
        if (!cardEl.classList.contains('flipped') && !cardEl.classList.contains('matched')) {
            cardEl.classList.add('disabled');
        }
    });
}

/**
 * Enable all unflipped cards
 */
function enableAllCards() {
    const cardElements = document.querySelectorAll('.memory-card');
    cardElements.forEach(cardEl => {
        if (!cardEl.classList.contains('matched')) {
            cardEl.classList.remove('disabled');
        }
    });
}

/**
 * Check if the two flipped cards match
 */
function checkForMatch() {
    const [card1, card2] = flippedCards;
    
    if (card1.card.symbol === card2.card.symbol) {
        // Match found!
        handleMatch(card1, card2);
    } else {
        // No match, flip cards back
        handleNoMatch(card1, card2);
    }
    
    // Clear flipped cards
    flippedCards = [];
}

/**
 * Handle a successful match
 * @param {Object} card1 - First card
 * @param {Object} card2 - Second card
 */
function handleMatch(card1, card2) {
    // Mark cards as matched
    card1.element.classList.add('matched');
    card2.element.classList.add('matched');
    card1.card.matched = true;
    card2.card.matched = true;
    
    // Increment matched pairs
    matchedPairs++;
    updateGameStats();
    
    // Check if game is complete
    if (matchedPairs === TOTAL_PAIRS) {
        endGame();
    } else {
        // Enable remaining cards
        enableAllCards();
        updateGameStatus(`Great match! ${TOTAL_PAIRS - matchedPairs} pairs remaining.`);
    }
}

/**
 * Handle no match
 * @param {Object} card1 - First card
 * @param {Object} card2 - Second card
 */
function handleNoMatch(card1, card2) {
    // Flip cards back
    card1.element.classList.remove('flipped');
    card2.element.classList.remove('flipped');
    
    // Enable all cards
    enableAllCards();
    
    updateGameStatus('No match! Try again.');
}

/**
 * End the game
 */
function endGame() {
    gameEnded = true;
    const endTime = Date.now();
    const timeTaken = Math.round((endTime - startTime) / 1000);
    
    // Stop timer
    stopTimer();
    
    // Calculate final score
    const finalScore = calculateFinalScore(timeTaken);
    
    // Show completion message
    gameComplete.style.display = 'block';
    finalScoreDisplay.innerHTML = `
        <div>Final Score: <strong>${formatNumber(finalScore)}</strong></div>
        <div>Moves: ${moveCount}</div>
        <div>Time: ${formatTime(timeTaken)}</div>
    `;
    
    // Save score
    saveGameScore('memoryGame', finalScore, {
        moves: moveCount,
        time: timeTaken,
        pairs: TOTAL_PAIRS
    });
    
    // Update leaderboard
    createLeaderboard();
    
    // Increment games played
    incrementGamesPlayed();
    
    showMessage('Congratulations! You completed the memory game!', 'success');
}

/**
 * Calculate final score
 * @param {number} timeTaken - Time taken in seconds
 * @returns {number} Final score
 */
function calculateFinalScore(timeTaken) {
    let score = 1000; // Base score
    
    // Bonus for fewer moves (max 500 points)
    const moveBonus = Math.max(0, 500 - (moveCount - TOTAL_PAIRS) * 25);
    
    // Bonus for faster completion (max 500 points)
    const timeBonus = Math.max(0, 500 - timeTaken * 5);
    
    // Perfect game bonus
    if (moveCount === TOTAL_PAIRS) {
        score += 1000; // Perfect score bonus
    }
    
    return score + moveBonus + timeBonus;
}

/**
 * Start the timer
 */
function startTimer() {
    timerInterval = setInterval(() => {
        const currentTime = Date.now();
        const elapsed = Math.round((currentTime - startTime) / 1000);
        timerDisplay.textContent = formatTime(elapsed);
    }, 1000);
}

/**
 * Stop the timer
 */
function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

/**
 * Format time in MM:SS format
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time
 */
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Update game statistics
 */
function updateGameStats() {
    moveCountDisplay.textContent = moveCount;
    matchCountDisplay.textContent = `${matchedPairs}/${TOTAL_PAIRS}`;
}

/**
 * Update game status message
 * @param {string} message - Status message
 */
function updateGameStatus(message) {
    gameStatus.textContent = message;
}

/**
 * Create leaderboard display
 */
function createLeaderboard() {
    createLeaderboard('memoryGame', leaderboardContainer);
}

/**
 * Start a new game
 */
function startNewGame() {
    // Reset game state
    gameStarted = false;
    gameEnded = false;
    
    // Stop timer
    stopTimer();
    
    // Reset UI
    gameComplete.style.display = 'none';
    newGameBtn.style.display = 'none';
    startGameBtn.style.display = 'inline-block';
    
    // Reset game grid
    initializeGameGrid();
    
    // Reset stats
    moveCount = 0;
    matchedPairs = 0;
    updateGameStats();
    timerDisplay.textContent = '00:00';
    
    // Reset status
    updateGameStatus('Click "Start Game" to begin!');
}

/**
 * Show message to user
 * @param {string} message - Message to show
 * @param {string} type - Type of message
 */
function showMessage(message, type = 'info') {
    // Use the main.js showMessage function
    if (typeof showMessage === 'function') {
        showMessage(message, type);
    } else {
        // Fallback if main.js not loaded
        alert(message);
    }
}
