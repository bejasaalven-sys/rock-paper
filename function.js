// Game State - UPDATED for 3 rounds
let gameState = {
    playerScore: 0,
    computerScore: 0,
    currentRound: 0,
    maxRounds: 3,  // ← CHANGED to 3
    playerChoice: null,
    computerChoice: null,
    result: '',
    gameActive: true,
    totalWins: 0,      // ← NEW: Track total wins
    totalDraws: 0,     // ← NEW: Track total draws
    totalLosses: 0     // ← NEW: Track total losses
};

// ... rest of your code stays the same until determineResult() ...

// UPDATED: Determine game result
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
    
    // NEW: Check if 3 rounds completed
    if (gameState.currentRound >= gameState.maxRounds) {
        setTimeout(declareMatchWinner, 1000);
    }
}

// NEW FUNCTION: Declare match winner after 3 rounds
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
    
    showMatchResultModal(matchResult);
    gameState.gameActive = false;
}

// NEW FUNCTION: Show match result modal
function showMatchResultModal(result) {
    if (!elements.modal || !elements.modalContent) return;
    
    const resultMessages = {
        win: ['MATCH WINNER! 🏆', 'PERFECT GAME! 🎉', 'CHAMPION! 👑'],
        draw: ['PERFECT DRAW! 🤝', 'EVEN MATCH! ⚖️', 'TIED GAME! 💯'],
        lose: ['MATCH LOST! 😤', 'BETTER LUCK! 💪', 'TRY AGAIN! 🔥']
    };
    
    const message = resultMessages[result][Math.floor(Math.random() * resultMessages[result].length)];
    
    const modalTitle = elements.modalContent.querySelector('h2');
    if (modalTitle) {
        modalTitle.innerHTML = `${message}<br><small>Final: ${gameState.playerScore}-${gameState.computerScore}</small>`;
    }
    
    elements.modal.classList.add('active');
}

// UPDATED: Update stats display (shows total wins/draws/losses)
function updateStats() {
    if (elements.stats.playerScore) {
        elements.stats.playerScore.textContent = gameState.totalWins;  // ← NOW SHOWS TOTAL WINS
    }
    if (elements.stats.computerScore) {
        elements.stats.computerScore.textContent = gameState.totalLosses;  // ← NOW SHOWS TOTAL LOSSES
    }
    if (elements.stats.round) {
        elements.stats.round.textContent = `${gameState.totalDraws}D | ${gameState.currentRound}/${gameState.maxRounds}`;  // ← SHOWS DRAWS + CURRENT ROUND
    }
}

// UPDATED: Reset game (resets round scores but keeps totals)
function resetGame() {
    // Reset current match only
    Object.assign(gameState, {
        playerScore: 0,
        computerScore: 0,
        currentRound: 0,
        playerChoice: null,
        computerChoice: null,
        result: '',
        gameActive: true
        // ← Totals (wins/draws/losses) are preserved!
    });
    
    if (elements.resultText) {
        elements.resultText.textContent = 'Choose your move!';
        elements.resultText.className = 'result-text';
    }
    
    // Reset score display to current match
    if (elements.scoreDisplay) {
        elements.scoreDisplay.textContent = `${gameState.playerScore} - ${gameState.computerScore}`;
    }
    
    // Reset displays
    if (elements.playerDisplay) elements.playerDisplay.innerHTML = '❓';
    if (elements.computerDisplay) elements.computerDisplay.innerHTML = '❓';
    
    if (elements.modal) {
        elements.modal.classList.remove('active');
    }
    
    updateStats();  // Updates with preserved totals
    
    // Re-enable buttons
    document.querySelectorAll('.choice-btn').forEach(btn => btn.disabled = false);
}