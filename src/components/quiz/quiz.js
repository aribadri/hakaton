import { questions } from './questions.js';

export class Quiz {
  constructor() {
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.isAnswered = false;

    this.modal = document.getElementById('quizModal');
    this.closeBtn = document.getElementById('quizCloseBtn');
    this.questionScreen = document.getElementById('questionScreen');
    this.resultScreen = document.getElementById('resultScreen');
    this.questionText = document.getElementById('questionText');
    this.answersContainer = document.getElementById('answersContainer');
    this.progressBar = document.getElementById('progressBar');
    this.progressText = document.getElementById('progressText');
    this.resultTitle = document.getElementById('resultTitle');
    this.resultDescription = document.getElementById('resultDescription');
    this.scoreText = document.getElementById('scoreText');
    this.restartBtn = document.getElementById('restartBtn');

    this.init();
  }

  init() {
    // Close button
    this.closeBtn.addEventListener('click', () => this.close());

    // Restart button
    this.restartBtn.addEventListener('click', () => this.restart());

    // Close on overlay click
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });
  }

  open() {
    this.modal.classList.remove('hidden');
    this.showQuestion();
  }

  close() {
    this.modal.classList.add('hidden');
  }

  restart() {
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.resultScreen.classList.add('hidden');
    this.questionScreen.classList.remove('hidden');
    this.showQuestion();
  }

  showQuestion() {
    const question = questions[this.currentQuestionIndex];
    this.isAnswered = false;

    // Update progress
    const progress = ((this.currentQuestionIndex + 1) / questions.length) * 100;
    this.progressBar.style.width = `${progress}%`;
    this.progressText.textContent = `Вопрос ${this.currentQuestionIndex + 1} из ${questions.length}`;

    // Show question
    this.questionText.textContent = question.question;

    // Show answers
    this.answersContainer.innerHTML = '';
    question.answers.forEach((answer, index) => {
      const button = document.createElement('button');
      button.className = 'quiz-answer-btn';
      button.textContent = answer.text;
      button.addEventListener('click', () => this.selectAnswer(index));
      this.answersContainer.appendChild(button);
    });
  }

  selectAnswer(answerIndex) {
    if (this.isAnswered) return;
    this.isAnswered = true;

    const question = questions[this.currentQuestionIndex];
    const buttons = this.answersContainer.querySelectorAll('.quiz-answer-btn');
    const selectedAnswer = question.answers[answerIndex];

    // Show correct/incorrect
    buttons.forEach((button, index) => {
      button.disabled = true;
      if (question.answers[index].correct) {
        button.classList.add('correct');
      }
    });

    if (selectedAnswer.correct) {
      this.score++;
      buttons[answerIndex].classList.add('correct');
    } else {
      buttons[answerIndex].classList.add('incorrect');
    }

    // Next question after delay
    setTimeout(() => {
      this.currentQuestionIndex++;
      if (this.currentQuestionIndex < questions.length) {
        this.showQuestion();
      } else {
        this.showResult();
      }
    }, 1500);
  }

  showResult() {
    this.questionScreen.classList.add('hidden');
    this.resultScreen.classList.remove('hidden');

    const percentage = (this.score / questions.length) * 100;
    this.scoreText.textContent = `${this.score} из ${questions.length}`;

    if (percentage === 100) {
      this.resultTitle.textContent = '🎉 Отлично!';
      this.resultDescription.textContent = 'Вы настоящий эксперт СоюзМультфильм! Все ответы верные!';
      this.launchConfetti();
    } else if (percentage >= 60) {
      this.resultTitle.textContent = '👍 Хорошо!';
      this.resultDescription.textContent = 'Вы неплохо знаете советские мультфильмы. Молодец!';
      this.launchConfetti();
    } else {
      this.resultTitle.textContent = '🤔 Попробуйте еще раз';
      this.resultDescription.textContent = 'Пересмотрите классику СоюзМультфильм и попробуйте снова!';
    }
  }

  launchConfetti() {
    if (typeof window.confetti !== 'function') {
      console.error('Confetti library not loaded');
      return;
    }

    // Найдем или создадим canvas для конфетти с правильным z-index
    let confettiCanvas = document.querySelector('.confetti-canvas');
    if (!confettiCanvas) {
      confettiCanvas = document.createElement('canvas');
      confettiCanvas.className = 'confetti-canvas';
      confettiCanvas.style.position = 'fixed';
      confettiCanvas.style.top = '0';
      confettiCanvas.style.left = '0';
      confettiCanvas.style.width = '100%';
      confettiCanvas.style.height = '100%';
      confettiCanvas.style.pointerEvents = 'none';
      confettiCanvas.style.zIndex = '3001';
      document.body.appendChild(confettiCanvas);
    }

    const myConfetti = window.confetti.create(confettiCanvas, { resize: true });

    const duration = 2000;
    const end = Date.now() + duration;
    const colors = ['#726de3', '#9b59b6', '#3498db', '#e74c3c', '#f39c12'];

    (function frame() {
      myConfetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      myConfetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }
}
