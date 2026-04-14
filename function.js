// Game State
let gameState = {
    playerScore: 0,
    computerScore: 0,
    currentRound: 0,
    maxRounds: 10,
    playerChoice: null,
    computerChoice: null,
    result: '',
    gameActive: true
};

// Choices configuration
const choices = ['rock', 'paper', 'scissors']; // Fixed: Added quotes around 'scissors'
const choiceIcons = {
    rock: '✊',
    paper: '✋',
    scissors: '✌️'
};

// Wait for DOM to load before selecting elements
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements - Now safe to query
    const elements = {
        stats: {
            playerScore: document.querySelector('#player-score'),
            computerScore: document.querySelector('#computer-score'),
            round: document.querySelector('#round')
        },
        gameArea: document.querySelector('.game-area'),
        choiceArea: document.querySelector('.choice-area'),
        resultText: document.querySelector('.result-text'),
        scoreDisplay: document.querySelector('.score-display'),
        choicesGrid: document.querySelector('.choices-grid'),
        playerDisplay: document.querySelector('#player-display'),
        computerDisplay: document.querySelector('#computer-display'),
        resetBtn: document.querySelector('.reset-btn'),
        modal: document.querySelector('.modal'),
        modalContent: document.querySelector('.modal-content')
    };

    // Initialize game
    function init() {
        updateStats();
        createChoiceButtons();
        addEventListeners();
        updateThemeToggle();
    }

    // Create choice buttons dynamically
    function createChoiceButtons() {
        if (!elements.choicesGrid) return;
        elements.choicesGrid.innerHTML = '';
        choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.dataset.choice = choice;
            btn.innerHTML = `
                <i>${choiceIcons[choice]}</i>
                <span>${choice.charAt(0).toUpperCase() + choice.slice(1)}</span>
            `;
            elements.choicesGrid.appendChild(btn);
        });
    }

    // Add event listeners
    function addEventListeners() {
        // Choice buttons
        if (elements.choicesGrid) {
            elements.choicesGrid.addEventListener('click', handleChoiceClick);
        }
        
        // Reset button
        if (elements.resetBtn) {
            elements.resetBtn.addEventListener('click', resetGame);
        }
        
        // Theme toggle
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }
        
        // Keyboard support
        document.addEventListener('keydown', handleKeyPress);
    }

    // Handle player choice
    function handleChoiceClick(e) {
        if (!e.target.closest('.choice-btn') || !gameState.gameActive) return;
        
        const choiceBtn = e.target.closest('.choice-btn');
        gameState.playerChoice = choiceBtn.dataset.choice;
        
        // Animate player choice
        animateChoice('player');
        
        setTimeout(() => {
            document.querySelectorAll('.choice-btn').forEach(btn => btn.disabled = true);
            
            // Computer makes choice
            setTimeout(() => {
                gameState.computerChoice = getComputerChoice();
                animateChoice('computer');
                
                // Determine result
                determineResult();
                
                // Re-enable buttons after delay
                setTimeout(() => {
                    document.querySelectorAll('.choice-btn').forEach(btn => btn.disabled = false);
                }, 1500);
                
            }, 800);
            
        }, 200);
    }

    // Handle keyboard input
    function handleKeyPress(e) {
        if (!gameState.gameActive) return;
        
        const keyMap = {
            'KeyR': 'rock',
            'KeyP': 'paper',
            'KeyS': 'scissors',
            'Digit1': 'rock',
            'Digit2': 'paper',
            'Digit3': 'scissors'
        };
        
        if (keyMap[e.code]) {
            gameState.playerChoice = keyMap[e.code];
            animateChoice('player');
            
            // Same logic as mouse click
            setTimeout(() => {
                document.querySelectorAll('.choice-btn').forEach(btn => btn.disabled = true);
                setTimeout(() => {
                    gameState.computerChoice = getComputerChoice();
                    animateChoice('computer');
                    determineResult();
                    setTimeout(() => {
                        document.querySelectorAll('.choice-btn').forEach(btn => btn.disabled = false);
                    }, 1500);
                }, 800);
            }, 200);
        }
    }

    // Get computer choice
    function getComputerChoice() {
        const randomIndex = Math.floor(Math.random() * choices.length);
        return choices[randomIndex];
    }

    // Animate choice displays
    function animateChoice(playerOrComputer) {
        if (!elements.playerDisplay || !elements.computerDisplay) return;
        
        const display = playerOrComputer === 'player' ? 
            elements.playerDisplay : elements.computerDisplay;
        
        const icon = choiceIcons[playerOrComputer === 'player' ? 
            gameState.playerChoice : gameState.computerChoice];
        
        display.innerHTML = `<span class="choice-icon">${icon}</span>`;
        display.classList.add('animate');
        
        setTimeout(() => {
            display.classList.remove('animate');
        }, 500);
    }

    // Determine game result
    function determineResult() {
        gameState.currentRound++;
        
        const player = gameState.playerChoice;
        const computer = gameState.computerChoice;
        
        let result;
        
        if (player === computer) {
            result = 'tie';
        } else if (
            (player === 'rock' && computer === 'scissors') ||
            (player === 'paper' && computer === 'rock') ||
            (player === 'scissors' && computer === 'paper')
        ) {
            result = 'win';
            gameState.playerScore++;
        } else {
            result = 'lose';
            gameState.computerScore++;
        }
        
        gameState.result = result;
        displayResult(player, computer, result);
        updateStats();
        
        // Check if game is over
        if (gameState.currentRound >= gameState.maxRounds) {
            setTimeout(showGameOverModal, 1000);
        }
    }

    // Display result
    function displayResult(player, computer, result) {
        if (!elements.resultText || !elements.scoreDisplay) return;
        
        const resultMessages = {
            win: ['YOU WIN!', 'Victory!', 'Amazing!', 'Perfect!'],
            lose: ['YOU LOSE!', 'Try again!', 'Close one!', 'Better luck!'],
            tie: ['TIE!', 'Draw!', 'Even!', 'Same choice!']
        };
        
        const message = resultMessages[result][Math.floor(Math.random() * resultMessages[result].length)];
        
        elements.resultText.textContent = message;
        elements.resultText.className = `result-text ${result}`;
        
        // Update score display
        elements.scoreDisplay.textContent = `${gameState.playerScore} - ${gameState.computerScore}`;
    }

    // Update stats display
    function updateStats() {
        if (elements.stats.playerScore) {
            elements.stats.playerScore.textContent = gameState.playerScore;
        }
        if (elements.stats.computerScore) {
            elements.stats.computerScore.textContent = gameState.computerScore;
        }
        if (elements.stats.round) {
            elements.stats.round.textContent = gameState.currentRound;
        }
    }

    // Show game over modal
    function showGameOverModal() {
        if (!elements.modal || !elements.modalContent) return;
        
        const winner = gameState.playerScore > gameState.computerScore ? 
            'YOU WIN THE GAME! 🎉' : 
            gameState.playerScore === gameState.computerScore ? 
            'IT\'S A TIE! 🤝' : 'COMPUTER WINS! 😢';
        
        const modalTitle = elements.modalContent.querySelector('h2');
        if (modalTitle) {
            modalTitle.textContent = winner;
        }
        
        elements.modal.classList.add('active');
        gameState.gameActive = false;
    }

    // Reset game
    function resetGame() {
        Object.assign(gameState, {
            playerScore: 0,
            computerScore: 0,
            currentRound: 0,
            playerChoice: null,
            computerChoice: null,
            result: '',
            gameActive: true
        });
        
        if (elements.resultText) {
            elements.resultText.textContent = 'Choose your move!';
            elements.resultText.className = 'result-text';
        }
        if (elements.scoreDisplay) {
            elements.scoreDisplay.textContent = '0 - 0';
        }
        
        // Reset displays
        if (elements.playerDisplay) elements.playerDisplay.innerHTML = '❓';
        if (elements.computerDisplay) elements.computerDisplay.innerHTML = '❓';
        
        if (elements.modal) {
            elements.modal.classList.remove('active');
        }
        updateStats();
        
        // Re-enable buttons
        document.querySelectorAll('.choice-btn').forEach(btn => btn.disabled = false);
        gameState.gameActive = true;
    }

    // Theme toggle functionality
    function toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update toggle icon
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
        }
    }

    function updateThemeToggle() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        const html = document.documentElement;
        html.setAttribute('data-theme', savedTheme);
        
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.innerHTML = savedTheme === 'dark' ? '☀️' : '🌙';
        }
    }

    // Close modal on click outside or play again button
    if (elements.modal) {
        elements.modal.addEventListener('click', (e) => {
            if (e.target === elements.modal) {
                resetGame();
            }
        });
    }

    // Initialize everything after DOM is ready
    updateThemeToggle();
    init();
});