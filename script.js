// ===================================================================
// TEXTS AND SETTINGS
// Every sentence the viewer reads lives here. Change the wording here;
// nothing else in the file needs to change.
// ===================================================================

const TEXTS = {
  openingText:
    "You are about to watch a few short clips. After each one, tell us what you see. There are no wrong answers.",
  startButton: "Start",
  question: "How would you describe this person's mood?",
  choices: ["Happy", "Sad", "Angry", "Scared", "Surprised", "Unsure"],
  replayButton: "Watch again",
  skipButton: "Skip",
  lensLabel: "Lens",
  youSaid: "You said",
  youSkipped: "You skipped this one.",
};

// The three lens clips, in the order they are shown.
const LENS_CLIPS = [
  { name: "angry", file: "media/clip-angry.mp4" },
  { name: "sad", file: "media/clip-sad.mp4" },
  { name: "happy", file: "media/clip-happy.mp4" },
];

// Yes/no: are the clips similar takes rather than one identical recording?
const SIMILAR_TAKES = false;

// ===================================================================
// THE JOURNEY
// ===================================================================

// The viewer's answers, one entry per lens clip: { clip, chosen }.
// Lives only in memory. A reload or "start again" empties it.
let answers = [];
let currentClip = 0;

const screens = {
  opening: document.getElementById("screen-opening"),
  clip: document.getElementById("screen-clip"),
  reveal: document.getElementById("screen-reveal"),
};
const video = document.getElementById("clip-video");
const questionPanel = document.getElementById("question-panel");

function showScreen(name) {
  for (const key in screens) {
    screens[key].hidden = key !== name;
  }
  window.scrollTo(0, 0);
}

// Put the texts from the block above onto the page.
function fillTexts() {
  document.getElementById("opening-text").textContent = TEXTS.openingText;
  document.getElementById("start-button").textContent = TEXTS.startButton;
  document.getElementById("question-text").textContent = TEXTS.question;
  document.getElementById("replay-button").textContent = TEXTS.replayButton;
  document.getElementById("skip-button").textContent = TEXTS.skipButton;

  const choicesBox = document.getElementById("choices");
  for (const choice of TEXTS.choices) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "button";
    button.textContent = choice;
    button.addEventListener("click", () => recordAnswer(choice.toLowerCase()));
    choicesBox.appendChild(button);
  }
}

function startJourney() {
  answers = [];
  currentClip = 0;
  showScreen("clip");
  playLensClip();
}

// Play the current lens clip. Nothing on screen names the treatment.
function playLensClip() {
  questionPanel.hidden = true;
  video.src = LENS_CLIPS[currentClip].file;
  video.play();
}

// When a clip ends, the question appears underneath it.
video.addEventListener("ended", () => {
  questionPanel.hidden = false;
});

function replayClip() {
  video.currentTime = 0;
  video.play();
}

// Answering or skipping records the result and moves on. No going back.
function recordAnswer(chosen) {
  answers.push({ clip: LENS_CLIPS[currentClip].name, chosen: chosen });
  currentClip++;
  if (currentClip < LENS_CLIPS.length) {
    playLensClip();
  } else {
    video.removeAttribute("src");
    video.load();
    showReveal();
  }
}

// First version of the reveal: the viewer's answers handed back.
function showReveal() {
  const list = document.getElementById("answer-list");
  list.innerHTML = "";
  for (const answer of answers) {
    const item = document.createElement("li");
    const name = document.createElement("span");
    name.className = "lens-name";
    name.textContent = TEXTS.lensLabel + ": " + answer.clip;
    item.appendChild(name);
    item.append(
      answer.chosen === "skipped"
        ? TEXTS.youSkipped
        : TEXTS.youSaid + ": " + answer.chosen + "."
    );
    list.appendChild(item);
  }
  showScreen("reveal");
}

document.getElementById("start-button").addEventListener("click", startJourney);
document.getElementById("replay-button").addEventListener("click", replayClip);
document.getElementById("skip-button").addEventListener("click", () => recordAnswer("skipped"));

fillTexts();
