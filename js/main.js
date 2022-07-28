window.addEventListener("load", function () {
  document.body.removeChild(this.document.querySelector(".loader"));
});

// vars
// side scrolling bar vars
let scrollBar = document.querySelector(".scroll-bar");
let scrollBarBall = document.querySelector(".scroll-bar span");
let scrolling = 0;
let newPosY = 0,
  from = 0,
  startPosY = scrollBarBall.getBoundingClientRect().top;
// landing var
let startBtn = document.querySelector(".start-btn");
let started = false;

let quiz = document.querySelector(".quiz-container");
let clearBtn = document.querySelector(".clear span");
let questionsCount = document.querySelector(".count span");
let bullets = document.querySelector(".bullets .spans");
// get the checkboxes
let choosenAns;
// next question button
let nextQBtn = document.querySelector(".next");

// right answers counter
let correctAns = 0;
// results section
let resultsSection = document.querySelector(".results");
let resultsSecQCount = resultsSection.querySelector(".q-num");
let rRQC = resultsSection.querySelector(".result-num");
let degree = resultsSection.querySelector(".degree");

// load event and a promeies to set the side scrolling bar limits
window.onload = scrollingFunction();
// start quiz
startBtn.addEventListener("click", function () {
  if (started === true) {
    bullets.innerHTML = "";
    correctAns = 0;
    clear();
    getQuestions();
    quiz.classList.remove("hide");
    resultsSection.classList.add("hide");

    window.scrollTo({
      top: 650,
      left: 0,
      behavior: "smooth",
    });

    setTimeout(() => {
      scrollingFunction();
    }, 1100);
  } else {
    started = true;
    startBtn.textContent = "Try agian";
    quiz.classList.remove("hide");
    resultsSection.classList.add("hide");
    window.scrollTo({
      top: 650,
      left: 0,
      behavior: "smooth",
    });
    setTimeout(() => {
      scrollingFunction();
    }, 1100);
  }
});

// getting the questions from the JSON file
function getQuestions() {
  let myRequest = new XMLHttpRequest();

  myRequest.onload = function () {
    if (this.readyState === 4 && this.status === 200) {
      // truning the this.responseText of the XMLHttpRequest into  a js obj
      let questions = JSON.parse(this.responseText);
      let questionsObj = shuffleArray(questions);

      // get the number of questions
      let questionsCount = questionsObj.length;
      let currentQuestion = 1;

      // creat bulletes equal to questions number
      creatBullets(questionsCount, currentQuestion);
      // add a Question
      addQuestions(questionsObj[currentQuestion - 1], questionsCount);
      let answers = document.querySelectorAll(".answer input");
      // next question
      nextQBtn.addEventListener("click", () => {
        // to make sure not to go farther the queestions count
        if (currentQuestion < questionsCount) {
          // when we reach the last question
          if (currentQuestion === questionsCount - 1) {
            nextQBtn.textContent = "finish quiz";
            nextQBtn.style.cssText = "background-color:#28c528;";
          }
          let rightAns = questionsObj[currentQuestion - 1]["right_answer"];
          currentQuestion++;

          checkAnswer(rightAns, answers);
          clear();
          manageBullets(currentQuestion);
          addQuestions(questionsObj[currentQuestion - 1], questionsCount);
          answers = document.querySelectorAll(".answer input");
        } else if (currentQuestion >= questionsCount) {
          currentQuestion = 1;
          nextQBtn.textContent = "Next question";
          nextQBtn.style.cssText = "";
          degree.innerHTML =
            correctAns === questionsCount
              ? "Perfect"
              : correctAns > (questionsCount * 3) / 4
              ? "Excellent"
              : correctAns > (questionsCount * 1) / 2
              ? "Good"
              : "Not very good";
          quiz.classList.add("hide");
          resultsSection.classList.remove("hide");
          rRQC.innerHTML = correctAns;
          setTimeout(() => {
            scrollingFunction();
          }, 1100);
        }
      });
    }
  };
  myRequest.open("GET", "html-questions.json", true);
  myRequest.send();
}
getQuestions();
// clear checked ans
clearBtn.addEventListener("click", function () {
  let answers = document.querySelectorAll(".answer input");

  answers.forEach((e) => {
    e.checked = false;
  });
});
// bullets number
//
function creatBullets(num) {
  // set questionsCount
  questionsCount.innerHTML = num;
  resultsSecQCount.innerHTML = num;
  // creat bullets
  let fragment = new DocumentFragment();
  for (let i = 0; i < num; i++) {
    let bullet = document.createElement("span");
    fragment.appendChild(bullet);
  }
  let spans = Array.from(fragment.children);
  spans[0].classList.add("on");
  spans[0].classList.add("current");

  bullets.appendChild(fragment);
}
//
// a function to put green color on bullets
function manageBullets(a) {
  let spans = Array.from(document.querySelector(".bullets .spans").children);

  for (let i = 0; i < a; i++) {
    spans[i].classList.add("on");
    spans[a - 2].classList.remove("current");
    spans[a - 1].classList.add("current");
  }
}

//
function addQuestions(obj) {
  // question  title
  let qTitle = document.createElement("h2");
  qTitle.textContent = obj["title"];
  document.querySelector(".quiz-box").appendChild(qTitle);
  // answers
  let answersBox = document.querySelector(".answers-box");
  let ansersFragment = new DocumentFragment();

  for (let i = 1; i < 5; i++) {
    // creat radio input
    let ansDiv = document.createElement("div");
    ansDiv.className = "answer";
    let radioInput = document.createElement("input");
    radioInput.name = "question";
    radioInput.type = "radio";
    radioInput.id = `answer-${i}`;
    radioInput.dataset.answer = obj[`answer_${i}`];
    // creat label
    let label = document.createElement("label");
    label.htmlFor = `answer-${i}`;
    label.textContent = obj[`answer_${i}`];
    ansDiv.append(radioInput, label);
    ansersFragment.appendChild(ansDiv);
  }
  answersBox.append(ansersFragment);
}
//
function checkAnswer(rAns, answers) {
  answers.forEach((e) => {
    if (e.checked) {
      choosenAns = e.dataset.answer;

      if (choosenAns === rAns) {
        correctAns++;
      }
    }
  });
}
// clear quesetion
function clear() {
  document.querySelector(".quiz-box").innerHTML = "";
  document.querySelector(".answers-box").innerHTML = "";
}
// manage scrolling
function scrollingFunction() {
  let mypromise = new Promise((res, rej) => {
    setTimeout(() => {
      res(
        document.documentElement.scrollHeight -
          document.documentElement.clientHeight
      );
    }, 400);
  });
  mypromise.then(function (totalHieght) {
    window.addEventListener("scroll", function () {
      scrolling = window.scrollY * (200 / totalHieght);
      scrollBarBall.style.top = `${scrolling - 8}px`;
    });
    scrollBarBall.addEventListener("mousedown", mouseDown);

    function mouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      document.onmouseup = mouseRel;
      // call a function whenever the cursor moves:
      document.onmousemove = drag;
    }
    function drag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position
      newPosY = startPosY - e.clientY;
      // set the scrolling ball's new position
      let value = from - newPosY;
      if (value >= 0 && value <= 200) {
        scrollBarBall.style.top = value + "px";
        window.scrollTo(0, totalHieght * (value / 200));
      }
    }
    function mouseRel(e) {
      e = e || window.event;
      startPosY = scrollBarBall.getBoundingClientRect().top;
      from = scrollBarBall.offsetTop;
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    }
  });
}
// shuffle an Array
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
