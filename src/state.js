export const state = {
    currentUser: null,
    userData: { mistakes: [], favorites: [], testProgress: {} },
    testData: [],
    currentTestQuestions: [],
    currentQuestionIndex: 0,
    currentMode: 'NORMAL', // 'NORMAL', 'MISTAKES', 'FAVORITES', 'RANDOM_27'
    timerInterval: null,
    timeLeft: 0,
    userAnswers: {}
};

export function setTestProgress(index, score, isFinished) {
    if (!state.userData.testProgress) {
        state.userData.testProgress = {};
    }
    state.userData.testProgress[index] = { score, finished: isFinished };
}
