document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element References ---
    const loader = document.getElementById('loader');
    const gameContainer = document.getElementById('game-container');
    const unsupportedBrowserEl = document.getElementById('unsupported-browser');
    const progressBar = document.getElementById('progress-bar');
    const loadingPercentage = document.getElementById('loading-percentage');
    const shootButton = document.getElementById('shoot-button');
    const ball = document.getElementById('ball');
    const keeper = document.getElementById('keeper');
    const scoreEl = document.getElementById('score');
    const shotsTakenEl = document.getElementById('shots-taken');
    const endScreen = document.getElementById('end-screen');
    const finalScoreEl = document.getElementById('final-score');
    const playAgainButton = document.getElementById('play-again-button');

    // --- Game State ---
    let score = 0;
    let shotsTaken = 0;
    const totalShots = 5;

    // --- Core Functions ---

    /**
     * RF-05: Checks for a supported browser.
     * This is a simple simulation. In a real scenario, this might check for WebGL support.
     */
    function checkBrowserSupport() {
        const ua = navigator.userAgent;
        // A very basic check for demonstration purposes.
        if (/Chrome|Firefox|Edg/.test(ua)) {
            return true;
        }
        return false;
    }

    /**
     * FP-01: Simulates the loading of game assets.
     * Mimics a large WebGL bundle download and compilation.
     */
    function simulateLoading() {
        loader.classList.remove('hidden');
        gameContainer.classList.add('hidden');
        unsupportedBrowserEl.classList.add('hidden');

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 5; // Simulate variable chunk loading
            if (progress > 100) {
                progress = 100;
            }
            progressBar.style.width = `${progress}%`;
            loadingPercentage.textContent = `${Math.floor(progress)}%`;

            if (progress === 100) {
                clearInterval(interval);
                setTimeout(() => {
                    loader.classList.add('hidden');
                    gameContainer.classList.remove('hidden');
                    resetGame();
                }, 500); // Short delay to appreciate the 100%
            }
        }, 150); // Simulates a ~4-7 second load time, meeting RNF-02
    }

    /**
     * FP-02: Handles the core gameplay logic of a shot.
     */
    function handleShoot() {
        if (shotsTaken >= totalShots) return;

        shootButton.disabled = true;
        shotsTaken++;
        shotsTakenEl.textContent = shotsTaken;

        // Move keeper randomly
        const keeperPosition = Math.random() * (150 - 20); // goal width - keeper width
        keeper.style.left = `${keeperPosition}px`;

        // Animate ball
        const shotAngle = (Math.random() - 0.5) * 120; // Random angle
        ball.style.transform = `translate(${shotAngle}px, -250px)`;

        // Determine outcome
        setTimeout(() => {
            // Simple collision detection simulation
            const isGoal = Math.random() > 0.4; // 60% chance of scoring
            if (isGoal) {
                score++;
                scoreEl.textContent = score;
                ball.style.backgroundColor = '#76ff03'; // Goal flash
            } else {
                ball.style.backgroundColor = '#ff5252'; // Miss flash
            }

            // Check for game end
            if (shotsTaken >= totalShots) {
                setTimeout(showEndScreen, 1000);
            } else {
                setTimeout(resetShot, 1000);
            }
        }, 500);
    }

    /**
     * Resets the ball and keeper for the next shot.
     */
    function resetShot() {
        ball.style.transition = 'none';
        ball.style.transform = 'translateX(-50%)';
        ball.style.backgroundColor = 'white';
        
        // Force reflow
        void ball.offsetWidth;

        ball.style.transition = 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
        shootButton.disabled = false;
    }

    /**
     * Resets the entire game to its initial state.
     */
    function resetGame() {
        score = 0;
        shotsTaken = 0;
        scoreEl.textContent = score;
        shotsTakenEl.textContent = shotsTaken;
        endScreen.classList.add('hidden');
        resetShot();
    }

    /**
     * Displays the final score screen.
     */
    function showEndScreen() {
        finalScoreEl.textContent = score;
        endScreen.classList.remove('hidden');
    }

    // --- Initial Setup and Event Listeners ---

    if (checkBrowserSupport()) {
        simulateLoading();
    } else {
        unsupportedBrowserEl.classList.remove('hidden');
    }

    shootButton.addEventListener('click', handleShoot);
    playAgainButton.addEventListener('click', resetGame);
});