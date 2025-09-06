// Your JavaScript code here

// Initialize variables
let currentQuestionIndex = 0; // Index to track current question
let coin = 0; // Variable to store earned coins
let quizjson = `[
    {
        "q_id": 1582,
        "question": "Which postion you like?",
        "answer": "Doggy,Missionary,The Captain,Cow Girl",
        "correct": "Boat",
        "time": "1652710530",
        "coins": 100,
        "sc_id": 6,
        "title": "Friends",
        "c_id": 9,
        "c_name": "Entertainment",
        "c_img": "entertainment.png",
        "sc_img": "entertainment.png",
        "totalprice": 10000,
        "entryFee": 50,
        "live": 1
    },
    {
        "q_id": 1751,
        "question": "Which romantic style do you enjoy the most?",
        "answer": "Dancing,Cuddling,Playful,kissing",
        "correct": "Mr. India",
        "time": "1652710530",
        "coins": 100,
        "sc_id": 18,
        "title": "Guess-The-Movie",
        "c_id": 9,
        "c_name": "Entertainment",
        "c_img": "entertainment.png",
        "sc_img": "entertainment.png",
        "totalprice": 10000,
        "entryFee": 50,
        "live": 1
    }
]`;

// Parse quiz data into JSON format
const quizData = {
  data: JSON.parse(quizjson),
};

// DOM elements
const quizContainer = document.getElementById("quiz-container");
const quizTitle = document.getElementById("quiz-title");
const questionElement = document.getElementById("question");
const answersElement = document.getElementById("answers");
const resultElement = document.getElementById("result");

// Display total number of questions
document.getElementById("totalquestion").innerText = quizData.data.length;

// Function to start the quiz
function startQuiz() {
  showQuestion();
}

// Function to shuffle array elements (used for answer options)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Function to display current question and answers
function showQuestion() {
  const currentQuestion = quizData.data[currentQuestionIndex];
  quizTitle.innerText = currentQuestion.title;
  questionElement.innerText = currentQuestion.question;

  // Show interstitial ad only at specific question indexes to avoid excessive ads
  if (currentQuestionIndex === 1) {
    // Uncomment to enable interstitial ads at specific points
    ShowInterstitialAd();
  }

  // Split answers and shuffle them
  const shuffledAnswers = [...currentQuestion.answer.split(",")];
  shuffleArray(shuffledAnswers);

  // Clear previous answers
  answersElement.innerHTML = "";

  // Create answer buttons
  var answersDiv = document.createElement("div");
  shuffledAnswers.forEach((answer, index) => {
    var button = document.createElement("div");
    button.innerText = answer;
    button.onclick = () => checkAnswer(answer, index + 1);
    button.id = `${index + 1}`;
    button.classList.add("option"); // Add CSS classes for styling
    button.classList.add("text-left");
    button.classList.add("p-4");

    answersDiv.classList.add("grid");
    answersDiv.classList.add("grid-cols-2");
    answersDiv.classList.add("gap-2");
    answersDiv.classList.add("text-sm");
    answersDiv.classList.add("font-bold");
    answersDiv.appendChild(button);
  });

  answersElement.appendChild(answersDiv);
}

// Function to check the selected answer
function checkAnswer(selectedAnswer, index) {
  const currentQuestion = quizData.data[currentQuestionIndex];
  const buttons = answersElement.getElementsByTagName("div");

  // Disable button clicks after answering
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].style.pointerEvents = "none";

    // Highlight correct and incorrect answers
    if (buttons[i].innerText === currentQuestion.correct) {
      buttons[i].style.boxShadow = "#0bff46 0px 0px 11px";
      // buttons[i].style.background = "#13a30025";
    }
    if (buttons[index].innerText !== currentQuestion.correct) {
      document.getElementById(index).style.boxShadow = "#ff0000 0px 0px 11px";
      // document.getElementById(index).style.background = "#a3000025";
    }
  }

  // Display result (Correct/Wrong) and update coins
  if (selectedAnswer === currentQuestion.correct) {
    resultElement.innerText = "Correct!";
    coin += parseInt(currentQuestion.coins);
    resultElement.style.color = "green";
  } else {
    resultElement.innerText = "Wrong!";
    resultElement.style.color = "red";
  }

  resultElement.style.display = "none";
  setTimeout(nextQuestion, 1000); // Move to next question after delay
}

// Function to move to the next question
function nextQuestion() {
  resultElement.style.display = "none";
  currentQuestionIndex++;
  let counting = currentQuestionIndex;
  document.getElementById("currentindex").innerText = counting + 1;

  // Show next question or end quiz if all questions are answered
  if (currentQuestionIndex < quizData.data.length) {
    showQuestion();
  } else {
    // End of quiz: Store total coins in local storage and trigger treasureopen() function
    quizContainer.innerHTML = `<input type="hidden" value="${coin}" id="coin">`;
    let getcoin = document.getElementById("coin").value;
    localStorage.setItem("coin", getcoin);
    localStorage.setItem("totalcoin", getcoin);
    localStorage.setItem("totalplayed", 0);
    localStorage.setItem("is_played", 1);
    localStorage.setItem("rewarded", 0);
    // closereward();
    treasureopen(); // Call function to handle end of quiz actions
  }
}

// Start the quiz when the script runs
startQuiz();

// Updated RewardAd1 function to use Google Ad Manager instead of adBreak
function RewardAd1() {
  // Use the main RewardAd function from index.html
  if (typeof RewardAd === "function") {
    RewardAd();
  } else {
    // Fallback if RewardAd function is not available
    showToast({
      title: "Sorry!",
      msg: "🚫 Reward feature temporarily unavailable",
    });
  }
}

    function RewardAd() {
      if (!window.googletag || !googletag.cmd || !googletag.enums) {
        console.error("Google Ad Manager is not properly initialized.");
        showToast({title: "Error", msg: "Ad system not ready. Please try again."});
        return;
      }

      googletag.cmd.push(function () {
        try {
          if (!googletag.enums.OutOfPageFormat || !googletag.enums.OutOfPageFormat.REWARDED) {
            console.error("Rewarded ad format not supported");
            showToast({title: "Error", msg: "Rewarded ads not supported on this device."});
            return;
          }

          const rewardedSlot = googletag
            .defineOutOfPageSlot('/23293093930/Interstitialrewarded', googletag.enums.OutOfPageFormat.REWARDED)
            .addService(googletag.pubads());


          if (!rewardedSlot) {
            console.error("Failed to create finance rewarded ad slot");
            showToast({title: "Error", msg: "Failed to create reward ad."});
            return;
          }

          googletag.display(rewardedSlot);
          console.log("Attempting to display finance rewarded ad...");

          const timeoutId = setTimeout(() => {
            console.log("Finance rewarded ad timeout");
            showToast({title: "Timeout", msg: "Ad took too long to load. Please try again."});
            googletag.destroySlots([rewardedSlot]);
          }, 10000);

          googletag.pubads().addEventListener("rewardedSlotReady", function (evt) {
            console.log("Finance rewarded ad ready.");
            clearTimeout(timeoutId);
            evt.makeRewardedVisible();
            treasurepopremove();
          });

          googletag.pubads().addEventListener("rewardedSlotClosed", function () {
            console.log("Finance rewarded ad closed.");
            clearTimeout(timeoutId);
            googletag.destroySlots([rewardedSlot]);
            showToast({title: "Reward Earned!", msg: "100 coins added to your account!"});
          });

          googletag.pubads().addEventListener("rewardedSlotGranted", function () {
            console.log("Finance reward granted.");
            showToast({title: "Success!", msg: "Reward will be credited shortly."});
          });
        } catch (error) {
          console.error("Error during finance rewarded ad setup:", error);
          showToast({title: "Error", msg: "Failed to load rewarded ad: " + error.message});
        }
      });
    }


// Updated interstitial ad function to use Google Ad Manager
function ShowInterstitialAd() {
  // Only show interstitial if googletag is available
  if (window.googletag && googletag.cmd) {
    googletag.cmd.push(function () {
      try {
        // Define an interstitial ad slot
        const interstitialSlot = googletag
          .defineOutOfPageSlot(
            "/23293093930/native",
            googletag.enums.OutOfPageFormat.INTERSTITIAL
          )
          .addService(googletag.pubads());

        if (interstitialSlot) {
          googletag.pubads().addEventListener("slotOnload", function (event) {
            if (event.slot === interstitialSlot) {
              // Interstitial ad loaded
            }
          });

          // Display the interstitial
          googletag.display(interstitialSlot);
        }
      } catch (error) {
        // Silent error handling to prevent user experience issues
      }
    });
  }
}
