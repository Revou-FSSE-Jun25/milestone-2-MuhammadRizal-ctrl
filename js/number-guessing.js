/**
 * Number Guessing Game - JavaScript Implementation
 * A game where players guess a number between 1-100 with 5 attempts
 */

// Game state variables
let secretNumber = 0;
let attemptsLeft = 5;
let gameStarted = false;
let gameEnded = false;
let startTime = 0;

// DOM elements
let guessInput, submitBtn, hintDisplay, attemptsDisplay, bestScoreDisplay;
let userNameSection, setNameBtn, playerNameInput;
let gameControls, newGameBtn, backToHomeBtn;
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
        
        // Load best score
        loadBestScore();
        
        // Create leaderboard
        createLeaderboard();
        
        console.log('Number Guessing Game initialized successfully');
    } catch (error) {
        console.error('Error initializing Number Guessing Game:', error);
        showErrorMessage('Failed to initialize the Number Guessing Game. Please refresh the page.');
    }
});

/**
 * Initialize DOM elements
 */
function initializeElements() {
    try {
        // Required elements
        const requiredElements = [
            'guessInput', 'submitGuess', 'hintDisplay', 'attemptsLeft', 
            'bestScore', 'userNameSection', 'setNameBtn', 'playerName', 
            'gameControls', 'newGameBtn', 'backToHomeBtn', 'leaderboardContainer'
        ];

        const missingElements = [];

        // Get all elements and check for missing ones
        guessInput = document.getElementById('guessInput');
        submitBtn = document.getElementById('submitGuess');
        hintDisplay = document.getElementById('hintDisplay');
        attemptsDisplay = document.getElementById('attemptsLeft');
        bestScoreDisplay = document.getElementById('bestScore');
        userNameSection = document.getElementById('userNameSection');
        setNameBtn = document.getElementById('setNameBtn');
        playerNameInput = document.getElementById('playerName');
        gameControls = document.getElementById('gameControls');
        newGameBtn = document.getElementById('newGameBtn');
        backToHomeBtn = document.getElementById('backToHomeBtn');
        leaderboardContainer = document.getElementById('leaderboardContainer');

        // Check for missing elements
        if (!guessInput) missingElements.push('guessInput');
        if (!submitBtn) missingElements.push('submitBtn');
        if (!hintDisplay) missingElements.push('hintDisplay');
        if (!attemptsDisplay) missingElements.push('attemptsDisplay');
        if (!bestScoreDisplay) missingElements.push('bestScoreDisplay');
        if (!userNameSection) missingElements.push('userNameSection');
        if (!setNameBtn) missingElements.push('setNameBtn');
        if (!playerNameInput) missingElements.push('playerNameInput');
        if (!gameControls) missingElements.push('gameControls');
        if (!newGameBtn) missingElements.push('newGameBtn');
        if (!backToHomeBtn) missingElements.push('backToHomeBtn');
        if (!leaderboardContainer) missingElements.push('leaderboardContainer');

        if (missingElements.length > 0) {
            throw new Error(`Missing required DOM elements: ${missingElements.join(', ')}`);
        }

        console.log('All DOM elements initialized successfully');
    } catch (error) {
        console.error('Error initializing DOM elements:', error);
        showErrorMessage('Failed to initialize game elements. Please check the page structure.');
        throw error;
    }
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
    try {
        // Submit guess button
        if (submitBtn) {
            submitBtn.addEventListener('click', function(e) {
                try {
                    e.preventDefault();
                    handleGuess();
                } catch (error) {
                    console.error('Error handling guess submission:', error);
                    showErrorMessage('Failed to process your guess. Please try again.');
                }
            });
        }
        
        // Enter key in input field
        if (guessInput) {
            guessInput.addEventListener('keypress', function(e) {
                try {
                    if (e.key === 'Enter' && !submitBtn.disabled) {
                        e.preventDefault();
                        handleGuess();
                    }
                } catch (error) {
                    console.error('Error handling keypress:', error);
                }
            });
            
            // Input validation
            guessInput.addEventListener('input', function(e) {
                try {
                    validateInput();
                } catch (error) {
                    console.error('Error validating input:', error);
                }
            });
        }
        
        // Set name button
        if (setNameBtn) {
            setNameBtn.addEventListener('click', function(e) {
                try {
                    e.preventDefault();
                    handleSetName();
                } catch (error) {
                    console.error('Error handling name setting:', error);
                    showErrorMessage('Failed to set your name. Please try again.');
                }
            });
        }
        
        // Enter key in name input
        if (playerNameInput) {
            playerNameInput.addEventListener('keypress', function(e) {
                try {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSetName();
                    }
                } catch (error) {
                    console.error('Error handling name input keypress:', error);
                }
            });
        }
        
        // New game button
        if (newGameBtn) {
            newGameBtn.addEventListener('click', function(e) {
                try {
                    e.preventDefault();
                    startNewGame();
                } catch (error) {
                    console.error('Error starting new game:', error);
                    showErrorMessage('Failed to start new game. Please try again.');
                }
            });
        }
        
        // Back to home button
        if (backToHomeBtn) {
            backToHomeBtn.addEventListener('click', function(e) {
                try {
                    e.preventDefault();
                    window.location.href = 'index.html';
                } catch (error) {
                    console.error('Error navigating to home:', error);
                    showErrorMessage('Failed to navigate to home page.');
                }
            });
        }

        console.log('Event listeners set up successfully');
    } catch (error) {
        console.error('Error setting up event listeners:', error);
        showErrorMessage('Failed to set up game controls. Some features may not work.');
    }
}

/**
 * Check if user is already set
 */
function checkUserStatus() {
    const currentUser = getCurrentUser();
    if (currentUser) {
        // User already exists, start game immediately
        startGame();
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
    
    // Hide name section and start game
    userNameSection.style.display = 'none';
    startGame();
}

/**
 * Start a new game
 */
function startGame() {
    // Reset game state
    secretNumber = getRandomNumber(1, 100);
    attemptsLeft = 5;
    gameStarted = true;
    gameEnded = false;
    startTime = Date.now();
    
    // Update UI
    updateAttemptsDisplay();
    updateHintDisplay('I\'m thinking of a number between 1 and 100. I\'ll give you helpful hints about its mathematical properties! What\'s your first guess?');
    
    // Enable input
    guessInput.disabled = false;
    submitBtn.disabled = false;
    guessInput.focus();
    
    // Hide game controls
    gameControls.style.display = 'none';
    
    // Clear input
    guessInput.value = '';
    
    console.log('Secret number:', secretNumber); // For debugging
}

/**
 * Handle guess submission
 */
function handleGuess() {
    try {
        // Validate game state
        if (!gameStarted || gameEnded) {
            console.warn('Attempted to guess when game is not active');
            return;
        }

        // Validate input element
        if (!guessInput) {
            throw new Error('Guess input element not found');
        }

        const inputValue = guessInput.value;
        if (!inputValue || inputValue.trim() === '') {
            showMessage('Please enter a number before submitting', 'error');
            return;
        }

        const guess = parseInt(inputValue);
        
        // Validate guess
        if (isNaN(guess)) {
            showMessage('Please enter a valid number', 'error');
            return;
        }

        if (guess < 1 || guess > 100) {
            showMessage('Please enter a number between 1 and 100', 'error');
            return;
        }

        // Validate secret number
        if (!secretNumber || secretNumber < 1 || secretNumber > 100) {
            throw new Error('Invalid secret number state');
        }
        
        // Decrease attempts
        attemptsLeft--;
        updateAttemptsDisplay();
        
        // Check if guess is correct
        if (guess === secretNumber) {
            handleCorrectGuess();
        } else if (attemptsLeft === 0) {
            handleGameOver();
        } else {
            handleWrongGuess(guess);
        }
        
        // Clear input for next guess
        guessInput.value = '';
        if (guessInput.focus) {
            guessInput.focus();
        }
    } catch (error) {
        console.error('Error handling guess:', error);
        showErrorMessage('An error occurred while processing your guess. Please try again.');
    }
}

/**
 * Handle correct guess
 */
function handleCorrectGuess() {
    gameEnded = true;
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    const score = calculateScore(attemptsLeft, timeTaken);
    
    // Update hint display
    updateHintDisplay(`🎉 Congratulations! You guessed it right! The number was ${secretNumber}. You took ${5 - attemptsLeft} attempts in ${timeTaken} seconds!`, 'correct');
    
    // Save score
    saveGameScore('numberGuessing', score, {
        attempts: 5 - attemptsLeft,
        time: timeTaken,
        secretNumber: secretNumber
    });
    
    // Update best score
    loadBestScore();
    
    // Show game controls
    gameControls.style.display = 'block';
    
    // Disable input
    guessInput.disabled = true;
    submitBtn.disabled = true;
    
    // Update leaderboard
    createLeaderboard();
    
    // Increment games played
    incrementGamesPlayed();
    
    showMessage(`Great job! Your score: ${formatNumber(score)}`, 'success');
}

/**
 * Handle wrong guess with enhanced hints
 */
function handleWrongGuess(guess) {
    let hint = '';
    const hints = generateHint(secretNumber, guess);
    
    // Add attempt info
    hint = `${hints} You have ${attemptsLeft} attempt${attemptsLeft === 1 ? '' : 's'} left.`;
    
    updateHintDisplay(hint, guess < secretNumber ? 'too-low' : 'too-high');
}

/**
 * Generate helpful hints based on number properties
 * @param {number} secretNumber - The secret number
 * @param {number} guess - Player's guess
 * @returns {string} Generated hint
 */
function generateHint(secretNumber, guess) {
    const hints = [];
    
    // Basic high/low hint
    if (guess < secretNumber) {
        hints.push(`Too low! The number is higher than ${guess}.`);
    } else {
        hints.push(`Too high! The number is lower than ${guess}.`);
    }
    
    // Mathematical property hints
    const properties = getNumberProperties(secretNumber);
    const randomProperty = properties[Math.floor(Math.random() * properties.length)];
    hints.push(randomProperty);
    
    return hints.join(' ');
}

/**
 * Get mathematical properties of a number
 * @param {number} num - The number to analyze
 * @returns {Array} Array of property hints
 */
function getNumberProperties(num) {
    const properties = [];
    
    // Even/Odd
    if (num % 2 === 0) {
        properties.push("The number is even.");
    } else {
        properties.push("The number is odd.");
    }
    
    // Prime number
    if (isPrime(num)) {
        properties.push("The number is prime!");
    } else {
        properties.push("The number is composite (not prime).");
    }
    
    // Divisibility hints
    if (num % 3 === 0) {
        properties.push("The number is divisible by 3.");
    }
    if (num % 5 === 0) {
        properties.push("The number is divisible by 5.");
    }
    if (num % 7 === 0) {
        properties.push("The number is divisible by 7.");
    }
    if (num % 10 === 0) {
        properties.push("The number is divisible by 10.");
    }
    
    // Perfect square
    if (isPerfectSquare(num)) {
        properties.push("The number is a perfect square!");
    }
    
    // Perfect cube
    if (isPerfectCube(num)) {
        properties.push("The number is a perfect cube!");
    }
    
    // Fibonacci number
    if (isFibonacci(num)) {
        properties.push("The number is in the Fibonacci sequence!");
    }
    
    // Range hints
    if (num <= 25) {
        properties.push("The number is in the range 1-25.");
    } else if (num <= 50) {
        properties.push("The number is in the range 26-50.");
    } else if (num <= 75) {
        properties.push("The number is in the range 51-75.");
    } else {
        properties.push("The number is in the range 76-100.");
    }
    
    // Sum of digits
    const digitSum = num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
    if (digitSum <= 5) {
        properties.push("The sum of its digits is 5 or less.");
    } else if (digitSum <= 10) {
        properties.push("The sum of its digits is between 6-10.");
    } else {
        properties.push("The sum of its digits is 11 or more.");
    }
    
    // Special numbers
    if (num === 42) {
        properties.push("The number is the answer to life, the universe, and everything!");
    } else if (num === 69) {
        properties.push("The number is... nice.");
    } else if (num === 100) {
        properties.push("The number is a century!");
    } else if (num === 1) {
        properties.push("The number is the first natural number!");
    }
    
    return properties;
}

/**
 * Check if a number is prime
 * @param {number} num - Number to check
 * @returns {boolean} True if prime
 */
function isPrime(num) {
    if (num < 2) return false;
    if (num === 2) return true;
    if (num % 2 === 0) return false;
    
    for (let i = 3; i <= Math.sqrt(num); i += 2) {
        if (num % i === 0) return false;
    }
    return true;
}

/**
 * Check if a number is a perfect square
 * @param {number} num - Number to check
 * @returns {boolean} True if perfect square
 */
function isPerfectSquare(num) {
    const sqrt = Math.sqrt(num);
    return Math.floor(sqrt) === sqrt;
}

/**
 * Check if a number is a perfect cube
 * @param {number} num - Number to check
 * @returns {boolean} True if perfect cube
 */
function isPerfectCube(num) {
    const cbrt = Math.cbrt(num);
    return Math.floor(cbrt) === cbrt;
}

/**
 * Check if a number is in the Fibonacci sequence
 * @param {number} num - Number to check
 * @returns {boolean} True if Fibonacci number
 */
function isFibonacci(num) {
    if (num < 0) return false;
    if (num === 0 || num === 1) return true;
    
    let a = 0, b = 1;
    while (b < num) {
        const temp = a + b;
        a = b;
        b = temp;
    }
    return b === num;
}

/**
 * Handle game over
 */
function handleGameOver() {
    gameEnded = true;
    
    updateHintDisplay(`Game Over! The secret number was ${secretNumber}. Better luck next time!`, 'error');
    
    // Show game controls
    gameControls.style.display = 'block';
    
    // Disable input
    guessInput.disabled = true;
    submitBtn.disabled = true;
    
    showMessage('Don\'t give up! Try again with a new game.', 'error');
}

/**
 * Calculate score based on attempts and time
 * @param {number} attemptsLeft - Number of attempts remaining
 * @param {number} timeTaken - Time taken in seconds
 * @returns {number} Calculated score
 */
function calculateScore(attemptsLeft, timeTaken) {
    // Base score from attempts (more attempts left = higher score)
    const attemptScore = attemptsLeft * 100;
    
    // Time bonus (faster = higher score, max 500 points)
    const timeBonus = Math.max(0, 500 - timeTaken);
    
    // Difficulty bonus (guessing in fewer attempts)
    const difficultyBonus = (5 - attemptsLeft) * 50;
    
    return attemptScore + timeBonus + difficultyBonus;
}

/**
 * Update attempts display
 */
function updateAttemptsDisplay() {
    attemptsDisplay.textContent = attemptsLeft;
    
    // Add warning class if low attempts
    if (attemptsLeft <= 2) {
        attemptsDisplay.parentElement.classList.add('warning');
    } else {
        attemptsDisplay.parentElement.classList.remove('warning');
    }
}

/**
 * Update hint display
 * @param {string} message - Message to display
 * @param {string} type - Type of hint (correct, too-high, too-low, error)
 */
function updateHintDisplay(message, type = '') {
    hintDisplay.textContent = message;
    hintDisplay.className = `hint-display ${type}`;
}

/**
 * Validate input in real-time
 */
function validateInput() {
    const value = parseInt(guessInput.value);
    
    if (isNaN(value) || value < 1 || value > 100) {
        guessInput.style.borderColor = 'var(--danger-color)';
    } else {
        guessInput.style.borderColor = 'var(--primary-color)';
    }
}

/**
 * Load and display best score
 */
function loadBestScore() {
    const leaderboard = getLeaderboard('numberGuessing');
    
    if (leaderboard.length > 0) {
        const bestScore = leaderboard[0].score;
        bestScoreDisplay.textContent = formatNumber(bestScore);
    } else {
        bestScoreDisplay.textContent = '-';
    }
}

/**
 * Create leaderboard display
 */
function createLeaderboard() {
    createLeaderboard('numberGuessing', leaderboardContainer);
}

/**
 * Start a new game
 */
function startNewGame() {
    // Reset UI
    gameControls.style.display = 'none';
    hintDisplay.className = 'hint-display';
    
    // Start new game
    startGame();
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
