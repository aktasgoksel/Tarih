class StateManager {
    constructor() {
        this._currentUser = null;
        this._userData = { mistakes: [], favorites: [], testProgress: {} };
        this._testData = [];
        this._currentTestQuestions = [];
        this._currentQuestionIndex = 0;
        this._currentMode = 'NORMAL';
        this._currentTestIndex = 0;
        
        // Timer State
        this._timeRemaining = 0;
        this._timerInterval = null;
        this._isTimerRunning = false;
        this._isTimerPaused = false;
        this._testTotalQuestionsForTimer = 0;
    }

    // Getters and Setters
    getCurrentUser() { return this._currentUser; }
    setCurrentUser(user) { this._currentUser = user; }

    getUserData() { return this._userData; }
    setUserData(data) { 
        this._userData = data || { mistakes: [], favorites: [], testProgress: {} }; 
        if (!this._userData.mistakes) this._userData.mistakes = [];
        if (!this._userData.favorites) this._userData.favorites = [];
        if (!this._userData.testProgress) this._userData.testProgress = {};
    }

    getTestData() { return this._testData; }
    setTestData(data) { this._testData = data || []; }

    getCurrentTestQuestions() { return this._currentTestQuestions; }
    setCurrentTestQuestions(questions) { this._currentTestQuestions = questions || []; }

    getCurrentQuestionIndex() { return this._currentQuestionIndex; }
    setCurrentQuestionIndex(index) { this._currentQuestionIndex = index; }

    getCurrentMode() { return this._currentMode; }
    setCurrentMode(mode) { this._currentMode = mode; }

    getCurrentTestIndex() { return this._currentTestIndex; }
    setCurrentTestIndex(index) { this._currentTestIndex = index; }

    getTimeRemaining() { return this._timeRemaining; }
    setTimeRemaining(time) { this._timeRemaining = time; }

    getTimerInterval() { return this._timerInterval; }
    setTimerInterval(interval) { this._timerInterval = interval; }

    getIsTimerRunning() { return this._isTimerRunning; }
    setIsTimerRunning(running) { this._isTimerRunning = running; }

    getIsTimerPaused() { return this._isTimerPaused; }
    setIsTimerPaused(paused) { this._isTimerPaused = paused; }

    getTestTotalQuestionsForTimer() { return this._testTotalQuestionsForTimer; }
    setTestTotalQuestionsForTimer(total) { this._testTotalQuestionsForTimer = total; }

    // Helper functions
    setTestProgress(index, score, isFinished) {
        if (!this._userData.testProgress) {
            this._userData.testProgress = {};
        }
        this._userData.testProgress[index] = { score, finished: isFinished };
    }
}

export const State = new StateManager();
