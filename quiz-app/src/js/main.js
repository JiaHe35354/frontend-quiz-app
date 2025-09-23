import "../sass/main.scss";

import { setColorMode, checkModeChange } from "./theme.js";
import quizData from "../data/data.json";

const iconCorrect = "/images/icon-correct.svg";
const iconIncorrect = "/images/icon-incorrect.svg";
// Initial setup for theme
setColorMode();
checkModeChange();

const homePage = document.getElementById("page-home");
const quizPage = document.getElementById("page-quiz");
const resultPage = document.getElementById("page-result");

const currentEl = document.querySelector(".current");
const totalQuestion = document.querySelector(".total-question");
const progressEl = document.getElementById("progress");
const questionEl = quizPage.querySelector(".question");
const quizList = quizPage.querySelector(".quiz-list");
const dangerText = quizPage.querySelector(".danger-text");
const submitBtn = document.getElementById("btn-submit");

const scoreEl = document.getElementById("score");
const resultTotalEl = document.getElementById("result-total");
const playAgainBtn = document.getElementById("btn-play");

const headerSubject = document.querySelector(".header .subject");
const resultSubject = document.querySelector(".result-container .subject");

let currentQuiz = null;
let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = null;

document
  .getElementById("btn-html")
  .addEventListener("click", () => startQuiz("HTML"));
document
  .getElementById("btn-css")
  .addEventListener("click", () => startQuiz("CSS"));
document
  .getElementById("btn-js")
  .addEventListener("click", () => startQuiz("JavaScript"));
document
  .getElementById("btn-access")
  .addEventListener("click", () => startQuiz("Accessibility"));

function startQuiz(subject) {
  currentQuiz = quizData.quizzes.find((q) => q.title === subject);
  currentQuestionIndex = 0;
  score = 0;

  homePage.classList.add("hidden");
  quizPage.classList.remove("hidden");
  resultPage.classList.add("hidden");

  totalQuestion.textContent = currentQuiz.questions.length;

  headerSubject.classList.remove("hidden");
  headerSubject.removeAttribute("aria-hidden");
  updateSubjectDisplay(headerSubject, currentQuiz);

  loadQuestion();
}

function updateSubjectDisplay(container, quiz) {
  const imgEl = container.querySelector(".icon-wrapper img");
  const subjectText = container.querySelector(".subject-text");

  imgEl.src = quiz.icon;
  imgEl.alt = `${quiz.title} icon`;

  subjectText.textContent = quiz.title;

  container.querySelector(
    ".icon-wrapper"
  ).classList = `icon-wrapper icon-wrapper__${quiz.title.toLowerCase()}`;
}

function loadQuestion() {
  const q = currentQuiz.questions[currentQuestionIndex];
  currentEl.textContent = currentQuestionIndex + 1;
  progressEl.value = currentQuestionIndex + 1;
  progressEl.max = currentQuiz.questions.length;

  questionEl.textContent = q.question;

  quizList.innerHTML = "";

  q.options.forEach((opt, index) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.className = "btn btn-light";
    btn.innerHTML = `<span class="option-letter">${String.fromCharCode(
      65 + index
    )}</span> `;
    const textSpan = document.createElement("span");
    textSpan.classList.add("answer-text");
    textSpan.textContent = opt;
    btn.appendChild(textSpan);
    li.appendChild(btn);
    quizList.appendChild(li);

    btn.addEventListener("click", () => selectAnswer(btn, opt));
  });

  selectedAnswer = null;
  dangerText.style.display = "none";
  submitBtn.classList.add("btn-inactive");
}

function selectAnswer(button, answer) {
  quizList.querySelectorAll("button").forEach((btn) => {
    btn.classList.remove("btn-active");
  });

  button.classList.add("btn-active");
  selectedAnswer = answer;

  submitBtn.classList.remove("btn-inactive");
}

submitBtn.addEventListener("click", () => {
  if (!selectedAnswer) {
    dangerText.style.display = "flex";
    return;
  }

  const q = currentQuiz.questions[currentQuestionIndex];
  const buttons = quizList.querySelectorAll("button");

  const selectedBtn = [...buttons].find((btn) =>
    btn.classList.contains("btn-active")
  );

  if (!selectedBtn) return;

  const btnText = selectedBtn.textContent.slice(1).trim();

  if (btnText === q.answer) {
    selectedBtn.classList.add("correct");

    selectedBtn.insertAdjacentHTML(
      "beforeend",
      ` <span class="result-icon">
          <img src="/images/icon-correct.svg" alt="Correct icon" />
        </span>`
    );

    score++;
  } else {
    selectedBtn.classList.add("incorrect");

    selectedBtn.insertAdjacentHTML(
      "beforeend",
      ` <span class="result-icon">
          <img src="/images/icon-incorrect.svg" alt="Correct icon" />
        </span>`
    );
  }

  buttons.forEach((btn) => (btn.disabled = true));

  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuiz.questions.length) {
      loadQuestion();
    } else {
      showResults();
      updateSubjectDisplay(resultSubject, currentQuiz);
    }
  }, 1000);
});

function showResults() {
  quizPage.classList.add("hidden");
  resultPage.classList.remove("hidden");

  scoreEl.textContent = score;
  resultTotalEl.textContent = currentQuiz.questions.length;
}

playAgainBtn.addEventListener("click", () => {
  homePage.classList.remove("hidden");
  quizPage.classList.add("hidden");
  resultPage.classList.add("hidden");
});
