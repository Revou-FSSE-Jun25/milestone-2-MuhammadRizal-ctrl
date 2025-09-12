/**
 * Rock, Paper, Scissors Game - JavaScript Implementation
 * A classic game where players compete against the computer
 */

// Game state variables
let playerScore = 0;
let computerScore = 0;
let currentRound = 1;
let gameStarted = false;
let gameEnded = false;
let playerChoice = null;
let computerChoice = null;

// Game configuration
const WINNING_SCORE = 3;
const CHOICES = ['rock', 'paper', 'scissors'];

// Choice emojis mapping
const CHOICE_EMOJIS = {
    rock: '🪨',
    paper: '📄',
    scissors: '✂️'
};

// DOM elements
let playerScoreDisplay, computerScoreDisplay, currentRoundDisplay;
let gameStatus, choicesContainer, resultsArea, roundResult;
let playerChoiceDisplay, computerChoiceDisplay;
let gameControls, newGameBtn, backToHomeBtn;
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
        
        console.log('Rock Paper Scissors Game initialized successfully');
    } catch (error) {
        console.error('Error initializing Rock Paper Scissors Game:', error);
        showErrorMessage('Failed to initialize the Rock Paper Scissors Game. Please refresh the page.');
    }
});

/**
 * Initialize DOM elements
 */
function initializeElements() {
    playerScoreDisplay = document.getElementById('playerScore');
    computerScoreDisplay = document.getElementById('computerScore');
    currentRoundDisplay = document.getElementById('currentRound');
    gameStatus = document.getElementById('gameStatus');
    choicesContainer = document.getElementById('choicesContainer');
    resultsArea = document.getElementById('resultsArea');
    roundResult = document.getElementById('roundResult');
    playerChoiceDisplay = document.getElementById('playerChoiceDisplay');
    computerChoiceDisplay = document.getElementById('computerChoiceDisplay');
    gameControls = document.getElementById('gameControls');
    newGameBtn = document.getElementById('newGameBtn');
    backToHomeBtn = document.getElementById('backToHomeBtn');
    userNameSection = document.getElementById('userNameSection');
    setNameBtn = document.getElementById('setNameBtn');
    playerNameInput = document.getElementById('playerName');
    leaderboardContainer = document.getElementById('leaderboardContainer');
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
    try {
        // Choice buttons
        const choiceButtons = document.querySelectorAll('.choice-btn');
        if (choiceButtons.length === 0) {
            console.warn('No choice buttons found');
        } else {
            choiceButtons.forEach((button, index) => {
                try {
                    button.addEventListener('click', function(e) {
                        try {
                            e.preventDefault();
                            if (!gameEnded) {
                                const choice = this.dataset.choice;
                                if (choice && CHOICES.includes(choice)) {
                                    handlePlayerChoice(choice);
                                } else {
                                    console.error('Invalid choice:', choice);
                                    showErrorMessage('Invalid choice selected. Please try again.');
                                }
                            }
                        } catch (error) {
                            console.error('Error handling choice click:', error);
                            showErrorMessage('Failed to process your choice. Please try again.');
                        }
                    });
                } catch (error) {
                    console.error(`Error adding event listener to choice button ${index}:`, error);
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
    playerScore = 0;
    computerScore = 0;
    currentRound = 1;
    gameStarted = true;
    gameEnded = false;
    playerChoice = null;
    computerChoice = null;
    
    // Update UI
    updateScoreDisplay();
    updateGameStatus('Choose your move to start the game!');
    
    // Hide results and controls
    resultsArea.style.display = 'none';
    roundResult.style.display = 'none';
    gameControls.style.display = 'none';
    
    // Enable choice buttons
    enableChoiceButtons();
}

/**
 * Handle player choice
 * @param {string} choice - Player's choice (rock, paper, or scissors)
 */
function handlePlayerChoice(choice) {
    if (gameEnded) return;
    
    playerChoice = choice;
    
    // Disable choice buttons temporarily
    disableChoiceButtons();
    
    // Show loading state
    updateGameStatus('Computer is thinking...');
    
    // Add visual feedback for selected choice
    highlightPlayerChoice(choice);
    
    // Computer makes choice after a short delay
    setTimeout(() => {
        computerChoice = getComputerChoice();
        playRound();
    }, 1000);
}

/**
 * Get computer's choice
 * @returns {string} Computer's choice
 */
function getComputerChoice() {
    const randomIndex = Math.floor(Math.random() * CHOICES.length);
    return CHOICES[randomIndex];
}

/**
 * Play a round
 */
function playRound() {
    // Show results area
    resultsArea.style.display = 'grid';
    
    // Update choice displays
    playerChoiceDisplay.textContent = CHOICE_EMOJIS[playerChoice];
    computerChoiceDisplay.textContent = CHOICE_EMOJIS[computerChoice];
    
    // Determine round winner
    const roundWinner = determineWinner(playerChoice, computerChoice);
    
    // Update scores
    if (roundWinner === 'player') {
        playerScore++;
        showRoundResult('You win this round!', 'win');
    } else if (roundWinner === 'computer') {
        computerScore++;
        showRoundResult('Computer wins this round!', 'lose');
    } else {
        showRoundResult('It\'s a tie!', 'tie');
    }
    
    // Update score display
    updateScoreDisplay();
    
    
    // Check for game winner
    setTimeout(() => {
        checkGameWinner();
    }, 2000);
}

/**
 * Determine the winner of a round
 * @param {string} playerChoice - Player's choice
 * @param {string} computerChoice - Computer's choice
 * @returns {string} Winner ('player', 'computer', or 'tie')
 */
function determineWinner(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) {
        return 'tie';
    }
    
    // Rock beats scissors, scissors beat paper, paper beats rock
    if (
        (playerChoice === 'rock' && computerChoice === 'scissors') ||
        (playerChoice === 'scissors' && computerChoice === 'paper') ||
        (playerChoice === 'paper' && computerChoice === 'rock')
    ) {
        return 'player';
    }
    
    return 'computer';
}

/**
 * Check if there's a game winner
 */
function checkGameWinner() {
    if (playerScore >= WINNING_SCORE) {
        endGame('player');
    } else if (computerScore >= WINNING_SCORE) {
        endGame('computer');
    } else {
        // Continue to next round
        currentRound++;
        updateScoreDisplay();
        updateGameStatus(`Round ${currentRound} - Choose your move!`);
        enableChoiceButtons();
        resultsArea.style.display = 'none';
        roundResult.style.display = 'none';
    }
}

/**
 * End the game
 * @param {string} winner - Winner of the game ('player' or 'computer')
 */
function endGame(winner) {
    gameEnded = true;
    
    // Calculate final score
    const finalScore = calculateFinalScore(winner);
    
    // Update game status
    if (winner === 'player') {
        updateGameStatus('🎉 Congratulations! You won the game!', 'success');
        showMessage('Great job! You beat the computer!', 'success');
    } else {
        updateGameStatus('😔 Game Over! Computer won this time.', 'error');
        showMessage('Better luck next time! The computer got lucky.', 'error');
    }
    
    // Save score
    saveGameScore('rockPaperScissors', finalScore, {
        playerScore: playerScore,
        computerScore: computerScore,
        rounds: currentRound,
        winner: winner
    });
    
    // Show game controls immediately
    gameControls.style.display = 'block';
    
    // Ensure the new game button is visible and enabled
    if (newGameBtn) {
        newGameBtn.style.display = 'inline-block';
        newGameBtn.disabled = false;
        newGameBtn.textContent = 'New Game';
    }
    
    // Update leaderboard
    createLeaderboard();
    
    // Increment games played
    incrementGamesPlayed();
}

/**
 * Calculate final score
 * @param {string} winner - Winner of the game
 * @returns {number} Final score
 */
function calculateFinalScore(winner) {
    let score = 0;
    
    // Base score for winning
    if (winner === 'player') {
        score += 1000;
    } else {
        score += 100; // Participation score
    }
    
    // Bonus for winning quickly
    score += (WINNING_SCORE - Math.min(playerScore, computerScore)) * 100;
    
    // Bonus for player's score
    score += playerScore * 50;
    
    return score;
}

/**
 * Update score display
 */
function updateScoreDisplay() {
    playerScoreDisplay.textContent = playerScore;
    computerScoreDisplay.textContent = computerScore;
    currentRoundDisplay.textContent = currentRound;
}

/**
 * Update game status message
 * @param {string} message - Status message
 * @param {string} type - Message type for styling
 */
function updateGameStatus(message, type = '') {
    gameStatus.textContent = message;
    gameStatus.className = `game-message ${type}`;
}

/**
 * Show round result
 * @param {string} message - Result message
 * @param {string} type - Result type (win, lose, tie)
 */
function showRoundResult(message, type) {
    roundResult.textContent = message;
    roundResult.className = `round-result ${type}`;
    roundResult.style.display = 'block';
}

/**
 * Highlight player's choice
 * @param {string} choice - Player's choice
 */
function highlightPlayerChoice(choice) {
    // Remove previous highlights
    document.querySelectorAll('.choice-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Highlight selected choice
    const selectedBtn = document.querySelector(`[data-choice="${choice}"]`);
    if (selectedBtn) {
        selectedBtn.classList.add('selected');
    }
}

/**
 * Enable choice buttons
 */
function enableChoiceButtons() {
    document.querySelectorAll('.choice-btn').forEach(btn => {
        btn.disabled = false;
        btn.classList.remove('selected');
    });
}

/**
 * Disable choice buttons
 */
function disableChoiceButtons() {
    document.querySelectorAll('.choice-btn').forEach(btn => {
        btn.disabled = true;
    });
}

/**
 * Create leaderboard display
 */
function createLeaderboard() {
    createLeaderboard('rockPaperScissors', leaderboardContainer);
}

/**
 * Start a new game
 */
function startNewGame() {
    // Reset game state
    gameEnded = false;
    gameStarted = false;
    
    // Reset UI
    gameControls.style.display = 'none';
    resultsArea.style.display = 'none';
    roundResult.style.display = 'none';
    gameStatus.className = 'game-message';
    
    // Clear any previous selections
    document.querySelectorAll('.choice-btn').forEach(btn => {
        btn.classList.remove('selected');
        btn.disabled = false;
    });
    
    // Start new game
    startGame();
}

// showMessage function is available from main.js
