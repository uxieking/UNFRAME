// ===================================================================
// TEXTS AND SETTINGS
// Every sentence the viewer reads lives here. Change the wording here;
// nothing else in the file needs to change.
// ===================================================================

const TEXTS = {
  openingText:
    "You are about to watch a few short clips. After each one, tell us what you see. There are no wrong answers.",
  startButton: "Start",
  soundReminder: "Sound on",
  clipError: "This clip could not be played.",
  question: "How would you describe this person's mood?",
  choices: ["Happy", "Sad", "Angry", "Scared", "Surprised", "Unsure"],
  replayButton: "Watch again",
  skipButton: "Skip",
  continueButton: "Continue",
  lensLabel: "Lens",
  youSaid: "You said",
  youSkipped: "You skipped this one.",
  takesNote: "These are similar takes, not identical footage.",
  closingQuestion: "Are you reacting to what happened, or to how it was presented?",
  restartButton: "Start again",
};

// The three lens clips, in the order they are shown.
const LENS_CLIPS = [
  { name: "angry", file: "media/clip-angry.mp4" },
  { name: "sad", file: "media/clip-sad.mp4" },
  { name: "happy", file: "media/clip-happy.mp4" },
];

// The unfiltered clip: shown on its own after the three, with no name anywhere.
const NORMAL_CLIP = "media/clip-normal.mp4";

// Yes/no: are the clips similar takes rather than one identical recording?
const SIMILAR_TAKES = false;

// How many seconds before a lens clip ends its effect comes in (see effects.js).
const EFFECT_SECONDS = 2.5;

// ===================================================================
// THE JOURNEY
// ===================================================================

// The viewer's answers, one entry per lens clip: { clip, chosen }.
// Lives only in memory. A reload or "start again" empties it.
let answers = [];
let currentClip = 0;

// Which time through the test this is. Every second time, the effects
// are reversed. Starts again from the first when the page is reloaded.
let round = 0;

const screens = {
  opening: document.getElementById("screen-opening"),
  clip: document.getElementById("screen-clip"),
  reveal: document.getElementById("screen-reveal"),
};
const video = document.getElementById("clip-video");
const questionPanel = document.getElementById("question-panel");
const continueButton = document.getElementById("continue-button");
const soundReminder = document.getElementById("sound-reminder");
const clipError = document.getElementById("clip-error");

// Show one screen, hide the others, with a short fade in.
function showScreen(name) {
  for (const key in screens) {
    const screen = screens[key];
    screen.hidden = key !== name;
    screen.classList.remove("is-entering");
  }
  void screens[name].offsetWidth; // restart the fade
  screens[name].classList.add("is-entering");
  window.scrollTo(0, 0);
}

// Put the texts from the block above onto the page.
function fillTexts() {
  document.getElementById("opening-text").textContent = TEXTS.openingText;
  document.getElementById("start-button").textContent = TEXTS.startButton;
  document.getElementById("question-text").textContent = TEXTS.question;
  document.getElementById("replay-button").textContent = TEXTS.replayButton;
  document.getElementById("skip-button").textContent = TEXTS.skipButton;
  continueButton.textContent = TEXTS.continueButton;
  soundReminder.textContent = TEXTS.soundReminder;
  clipError.textContent = TEXTS.clipError;
  document.getElementById("takes-note").textContent = TEXTS.takesNote;
  document.getElementById("closing-question").textContent = TEXTS.closingQuestion;
  document.getElementById("restart-button").textContent = TEXTS.restartButton;

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
  round++;
  showScreen("clip");
  playClip(LENS_CLIPS[currentClip].file);
  // A small reminder over the first clip only; it fades by itself.
  soundReminder.hidden = false;
}

// Play a clip in the big player, with a short fade between clips.
// Nothing on screen names the treatment.
function playClip(file) {
  questionPanel.hidden = true;
  continueButton.hidden = true;
  clipError.hidden = true;
  soundReminder.hidden = true;
  Effects.stop();
  video.classList.add("is-fading");
  setTimeout(() => {
    video.src = file;
    video.classList.remove("is-fading");
    video.play().catch((error) => {
      // If the browser holds the clip back, show its own play button.
      if (error.name === "NotAllowedError") video.controls = true;
    });
  }, video.getAttribute("src") ? 300 : 0);
}

function isNormalClip() {
  return currentClip >= LENS_CLIPS.length;
}

// What comes after a clip: the question after a lens clip,
// only the continue button after the normal clip.
function showAfterClip() {
  video.controls = false;
  if (isNormalClip()) {
    continueButton.hidden = false;
  } else {
    questionPanel.hidden = false;
  }
}

video.addEventListener("ended", showAfterClip);

// Near the end of each lens clip, its effect comes in and stays
// while the question is on screen. The normal clip stays quiet.
video.addEventListener("timeupdate", () => {
  if (isNormalClip() || Effects.isRunning()) return;
  if (video.duration - video.currentTime <= EFFECT_SECONDS) {
    const reversed = round % 2 === 0;
    Effects.start(LENS_CLIPS[currentClip].name, reversed);
  }
});

// A clip that cannot be played: say so, and let the journey continue.
video.addEventListener("error", () => {
  if (!video.getAttribute("src")) return; // emptied on purpose at the reveal
  soundReminder.hidden = true;
  clipError.hidden = false;
  showAfterClip();
});

function replayClip() {
  Effects.stop();
  video.currentTime = 0;
  video.play();
}

// Answering or skipping records the result and moves on. No going back.
function recordAnswer(chosen) {
  answers.push({ clip: LENS_CLIPS[currentClip].name, chosen: chosen });
  currentClip++;
  if (isNormalClip()) {
    playClip(NORMAL_CLIP);
  } else {
    playClip(LENS_CLIPS[currentClip].file);
  }
}

// ---------- The reveal ----------

// The reveal builds up: the clips one by one, then the answers,
// then the closing question on its own.
function showReveal() {
  Effects.stop();
  video.pause();
  video.removeAttribute("src");
  video.load();

  const grid = document.getElementById("reveal-grid");
  grid.innerHTML = "";

  const tiles = LENS_CLIPS.map((clip, i) => ({
    file: clip.file,
    name: TEXTS.lensLabel + ": " + clip.name,
    answer: answerLine(answers[i]),
  }));
  tiles.push({ file: NORMAL_CLIP, name: null, answer: null });

  const clipStep = 350; // ms between each clip appearing
  const answersAt = tiles.length * clipStep + 300;

  tiles.forEach((tile, i) => {
    const box = document.createElement("div");
    box.className = "tile";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "tile-video appear";
    button.style.setProperty("--delay", i * clipStep + "ms");
    const small = document.createElement("video");
    small.src = tile.file + "#t=0.1"; // show a still frame until tapped
    small.preload = "metadata";
    small.playsInline = true;
    small.addEventListener("ended", () => button.classList.remove("is-playing"));
    button.appendChild(small);
    button.addEventListener("click", () => toggleRevealClip(small, button));
    box.appendChild(button);

    // The normal clip has no name and no text: the viewer works it out.
    if (tile.name) {
      button.setAttribute("aria-label", "Play " + tile.name);
      const name = document.createElement("p");
      name.className = "tile-name appear";
      name.style.setProperty("--delay", i * clipStep + "ms");
      name.textContent = tile.name;
      box.appendChild(name);

      const answer = document.createElement("p");
      answer.className = "tile-answer appear";
      answer.style.setProperty("--delay", answersAt + i * 250 + "ms");
      answer.textContent = tile.answer;
      box.appendChild(answer);
    } else {
      button.setAttribute("aria-label", "Play clip");
    }
    grid.appendChild(box);
  });

  const lastAnswerAt = answersAt + (LENS_CLIPS.length - 1) * 250;
  const takesNote = document.getElementById("takes-note");
  takesNote.hidden = !SIMILAR_TAKES;
  setAppear(takesNote, lastAnswerAt + 500);
  setAppear(document.getElementById("closing-question"), lastAnswerAt + 1200);
  setAppear(document.getElementById("restart-button"), lastAnswerAt + 2000);

  showScreen("reveal");
}

function answerLine(answer) {
  return answer.chosen === "skipped"
    ? TEXTS.youSkipped
    : TEXTS.youSaid + ": " + answer.chosen + ".";
}

// Restart an element's fade-in after a delay.
function setAppear(element, delay) {
  element.classList.remove("appear");
  void element.offsetWidth;
  element.style.setProperty("--delay", delay + "ms");
  element.classList.add("appear");
}

// Tapping a small clip plays it; any other one that is playing stops.
function toggleRevealClip(small, button) {
  const wasPlaying = !small.paused;
  for (const other of document.querySelectorAll("#reveal-grid video")) {
    other.pause();
    other.parentElement.classList.remove("is-playing");
  }
  if (!wasPlaying) {
    if (small.ended) small.currentTime = 0;
    small.play();
    button.classList.add("is-playing");
  }
}

// Start again: empty the list and go back to the opening screen.
function restart() {
  for (const small of document.querySelectorAll("#reveal-grid video")) {
    small.pause();
  }
  answers = [];
  currentClip = 0;
  showScreen("opening");
}

document.getElementById("start-button").addEventListener("click", startJourney);
document.getElementById("replay-button").addEventListener("click", replayClip);
document.getElementById("skip-button").addEventListener("click", () => recordAnswer("skipped"));
continueButton.addEventListener("click", showReveal);
document.getElementById("restart-button").addEventListener("click", restart);

Effects.init(document.getElementById("effects-layer"));
fillTexts();
