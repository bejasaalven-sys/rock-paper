// Game State - 3-round matches with lifetime stats
let gameState = {
    playerScore: 0,        // Current match wins
    computerScore: 0,      // Current match losses  
    currentRound: 0,
    maxRounds: 3,
    playerChoice: null,
    computerChoice: null,
    result: '',
    gameActive: true,
    totalWins: 0,          // Lifetime wins
    totalDraws: 0,         // Lifetime draws
    totalLosses: 0         // Lifetime losses
};

const choices = ['rock', 'paper', 'scissors'];
const choiceIcons = {
    rock: '✊',
    paper: '✋', 
    scissors: '✌️'
};

document.addEventListener('DOMContentLoaded', function() {
    // Get ALL elements from your HTML
    const elements = {
        stats: {
            playerScore: document.querySelector('#playerScore'),     // Wins
            draws: document.querySelector('#draws'),                // Draws  
            computerScore: document.querySelector('#computerScore')  // Losses
        },
        playerDisplay: document.querySelector('#playerChoice'),
        computerDisplay: document.querySelector('#computerChoice'),
        resultText: document.querySelector('#resultText'),
        roundResult: document.querySelector('#roundResult'),
        choicesGrid: document.querySelector('#choicesGrid'),
        resetBtn: document.querySelector('#resetBtn'),
        modal: document.querySelector('#winModal'),
        playAgainBtn: document.querySelector('#playAgain'),
        themeToggle: document.querySelector('#themeToggle')
    };

    // Initialize game
    function init() {
        updateStats();
        addEventListeners();
        updateThemeToggle();
        resetDisplays();
    }

    // Reset displays to initial state
    function resetDisplays() {
        elements.playerDisplay.innerHTML = '❓';
        elements.computerDisplay.innerHTML = '❓';
        elements.resultText.textContent = 'Choose your move!';
        elements.resultText.className = 'result-text';
        elements.roundResult.textContent = '0 - 0';
    }

    // Add event listeners
    function addEventListeners() {
        // Choice buttons
        elements.choicesGrid.addEventListener('click', handleChoiceClick);
        
        // Reset button
        elements.resetBtn.addEventListener('click', resetGame);
        
        // Play again button
        if (elements.playAgainBtn) {
            elements.playAgainBtn.addEventListener('click', resetGame);
        }
        
        // Theme toggle
        if (elements.themeToggle) {
            elements.themeToggle.addEventListener('click', toggleTheme);
        }
        
        // Modal click outside to close
        if (elements.modal) {
            elements.modal.addEventListener('click', (e) => {
                if (e.target === elements.modal) resetGame();
            });
        }
        
        // Keyboard support
        document.addEventListener('keydown', handleKeyPress);
    }

    // Handle player choice
    function handleChoiceClick(e) {
        if (!e.target.closest('.choice-btn') || !gameState.gameActive) return;
        
        const choiceBtn = e.target.closest('.choice-btn');
        gameState.playerChoice = choiceBtn.dataset.choice;
        
        animateChoice('player');
        disableButtons();
        
        setTimeout(() => {
            gameState.computerChoice = getComputerChoice();
            animateChoice('computer');
            
            setTimeout(() => {
                determineResult();
                enableButtons();
            }, 1200);
        }, 600);
    }

    // Keyboard controls (R=Rock, P=Paper, S=Scissors)
    function handleKeyPress(e) {
        if (!gameState.gameActive) return;
        
        const keyMap = {
            'KeyR': 'rock', 'Digit1': 'rock',
            'KeyP': 'paper', 'Digit2': 'paper', 
            'KeyS': 'scissors', 'Digit3': 'scissors'
        };
        
        if (keyMap[e.code]) {
            gameState.playerChoice = keyMap[e.code];
            animateChoice('player');
            disableButtons();
            
            setTimeout(() => {
                gameState.computerChoice = getComputerChoice();
                animateChoice('computer');
                setTimeout(() => {
                    determineResult();
                    enableButtons();
                }, 1200);
            }, 600);
        }
    }

    // Get random computer choice
    function getComputerChoice() {
        return choices[Math.floor(Math.random() * choices.length)];
    }

    // Animate choice display
    function animateChoice(side) {
        const display = side === 'player' ? elements.playerDisplay : elements.computerDisplay;
        const choice = side === 'player' ? gameState.playerChoice : gameState.computerChoice;
        const icon = choiceIcons[choice];
        
        display.innerHTML = `<span class="choice-icon">${icon}</span>`;
        display.classList.add('animate');
        
        setTimeout(() => display.classList.remove('animate'), 800);
    }

    // Determine round winner
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
        displayRoundResult(player, computer, result);
        updateRoundScore();
        
        // Check if 3 rounds completed
        if (gameState.currentRound >= gameState.maxRounds) {
            setTimeout(declareMatchWinner, 1500);
        }
    }

    // Display round result
    function displayRoundResult(player, computer, result) {
        const messages = {
            win: ['YOU WIN!', 'VICTORY!', 'PERFECT!', 'AWESOME!'],
            lose: ['YOU LOSE!', 'OOF!', 'TRY AGAIN!', 'CLOSE ONE!'],
            tie: ['TIE!', 'DRAW!', 'EVEN!', 'SAME!']
        };
        
        const message = messages[result][Math.floor(Math.random() * messages[result].length)];
        elements.resultText.textContent = message;
        elements.resultText.className = `result-text ${result}`;
    }

    // Update current round score
    function updateRoundScore() {
        elements.roundResult.textContent = `${gameState.playerScore} - ${gameState.computerScore}`;
    }

    // Update lifetime stats
    function updateStats() {
        if (elements.stats.playerScore) elements.stats.playerScore.textContent = gameState.totalWins;
        if (elements.stats.draws) elements.stats.draws.textContent = gameState.totalDraws;
        if (elements.stats.computerScore) elements.stats.computerScore.textContent = gameState.totalLosses;
    }

    // Declare winner after 3 rounds
    function declareMatchWinner() {
        let matchResult;
        if (gameState.playerScore > gameState.computerScore) {
            matchResult = 'win';
            gameState.totalWins++;
        } else if (gameState.playerScore === gameState.computerScore) {
            matchResult = 'draw';
            gameState.totalDraws++;
        } else {
            matchResult = 'lose';
            gameState.totalLosses++;
        }
        
        showMatchResult(matchResult);
        gameState.gameActive = false;
    }

    // Show match result modal
    function showMatchResult(result) {
        const modalTitle = elements.modal.querySelector('h2');
        const messages = {
            win: ['🏆 MATCH WINNER! 🏆', '🎉 PERFECT GAME! 🎉', '👑 CHAMPION! 👑'],
            draw: ['🤝 PERFECT DRAW! 🤝', '⚖️ EVEN MATCH! ⚖️', '💯 TIED GAME! 💯'],
            lose: ['😤 MATCH LOST! 😤', '💪 BETTER LUCK! 💪', '🔥 TRY AGAIN! 🔥']
        };
        
        modalTitle.innerHTML = `${messages[result]}<br><small>${gameState.playerScore}-${gameState.computerScore}</small>`;
        elements.modal.classList.add('active');
        updateStats();
    }

    // Reset current match (keeps lifetime stats)
    function resetGame() {
        // Reset current match only
        gameState.playerScore = 0;
        gameState.computerScore = 0;
        gameState.currentRound = 0;
        gameState.playerChoice = null;
        gameState.computerChoice = null;
        gameState.result = '';
        gameState.gameActive = true;
        
        resetDisplays();
        updateRoundScore();
        updateStats();
        
        if (elements.modal) elements.modal.classList.remove('active');
        enableButtons();
    }

    // Utility functions
    function disableButtons() {
        document.querySelectorAll('.choice-btn').forEach(btn => btn.disabled = true);
    }
    
    function enableButtons() {
        document.querySelectorAll('.choice-btn').forEach(btn => btn.disabled = false);
    }

    // Theme toggle
    function toggleTheme() {
        const html = document.documentElement;
        const current = html.getAttribute('data-theme');
        const newTheme = current === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        elements.themeToggle.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
    }

    function updateThemeToggle() {
        const saved = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', saved);
        elements.themeToggle.innerHTML = saved === 'dark' ? '☀️' : '🌙';
    }

    // Start the game!
    init();
});