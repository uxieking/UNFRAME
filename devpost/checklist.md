---
doc: checklist
status: approved
---

# Build Checklist

Build mode: fast (chosen 2026-10-06; learner may switch to learn mode later)

## Slices

- [x] **1. Watch the three lens clips, answer each, and see your answers handed back**
  Becomes usable: Opening `index.html` shows the opening screen in the cinema look. Start plays the angry clip with sound; when it ends, the question, skip and replay appear. Answering or skipping moves on to sad, then happy. After happy, a plain first version of the reveal lists the three answers (or "You skipped this one").
  Why now: This is the unique kernel: the viewer commits to an answer, and the page remembers it and hands it back. It also proves the riskiest thing early: that the real clips play with sound after a button press. The three files and git are set up as part of it.
  PRD ref: `prd.md > The Core Journey` (steps 1–5), `prd.md > Opening screen`, `prd.md > Watching a clip`, `prd.md > Answering the question`
  Spec ref: `spec.md > Components` (Opening screen, Clip player, Question panel, Texts and settings), `spec.md > Data Model`, `spec.md > File Structure`, `spec.md > Look and Feel`
  Build: Create `index.html`, `style.css` and `script.js` per the file structure. Put every viewer-facing sentence, the question with its choices, the clip order and the "similar takes" yes/no setting in one block at the top of `script.js`. Build the opening screen, the reused clip player, and the question panel with its choices, skip and replay. Keep the answer list in memory and show it on a simple reveal.
  Verify (mechanical): Open `index.html` in the built-in browser with no console errors; confirm the opening screen fits without scrolling at phone size (375 × 812); press start and confirm `clip-angry.mp4` loads and plays; step through all three clips with one answer, one skip and one replay, and confirm the clips come in the order angry, sad, happy and the reveal list shows exactly those three results.
  Learner check: Double-click `index.html`, press start, and watch all three clips with the sound on. Answer two and skip one, and try replay once. See whether the list at the end matches what you chose, and say how the opening screen and the clip screen feel.
  Commit: `Add opening screen, three lens clips with question, and answer list`

- [x] **2. The quiet normal clip and the full reveal**
  Becomes usable: After the third answer, the normal clip plays alone with no text and a continue button. The reveal shows the four clips two by two: the three lens clips named, with "Lens: angry. You said: sad." under each, and the normal clip with no name. Tapping a clip plays it and stops any other. The closing question stands at the bottom, and start again clears everything and returns to the opening screen. If the "similar takes" setting is yes, one line says so.
  Why now: It builds directly on the answer list from slice 1 and turns it into the compelling moment, the reveal. It needs slice 1's journey to land on.
  PRD ref: `prd.md > The normal clip`, `prd.md > The reveal`, `prd.md > States and Boundaries`
  Spec ref: `spec.md > Components` (Normal clip screen, Reveal screen), `spec.md > The Core Journey Through the System` (steps 5–8), `spec.md > Look and Feel`
  Build: Add the normal clip screen with its continue button. Replace the simple list with the full reveal: four small videos in a 2 × 2 grid, names and answer lines, tap to play with only one playing at a time, closing question, start again that empties the list. Show the similar-takes line only when the setting says yes.
  Verify (mechanical): In the built-in browser, go through the whole journey with two answers and one skip; confirm the normal clip screen shows no text other than the continue button; confirm the reveal names only the three lens clips, the answer lines match, and nothing says correct, wrong or score; play one reveal clip, then another, and confirm the first stops; press start again and confirm the opening screen returns and a new run starts with an empty list; flip the similar-takes setting and confirm the line appears and disappears.
  Learner check: Go through the whole journey on the computer with the window narrow like a phone. At the reveal, tap the clips to compare them, read your answers, and say whether the reveal feels the way you imagined. Then press start again.
  Commit: `Add normal clip screen and full reveal`

- [x] **3. Handles a missing clip and no sound, and has a README**
  Becomes usable: If a clip cannot be played, the clip area says "This clip could not be played." and the question still appears, so the journey continues. A small "sound on" reminder sits on the screen before the first clip. `README.md` says what UNFRAME is, how to open it, and that it does not save or send any answers.
  Why now: These protect the demo and the public repository. They only make sense once the whole journey exists to protect.
  PRD ref: `prd.md > States and Boundaries` (a clip that will not play)
  Spec ref: `spec.md > Important Failure Modes`, `spec.md > Decisions and Open Issues` (README sentence)
  Build: Listen for the video's error event and show the message plus the question panel. Add the sound-on reminder from the texts block. Write `README.md`.
  Verify (mechanical): Temporarily point one clip at a file name that does not exist, confirm the message and the question appear and the journey still reaches the reveal, then restore the real name; confirm the sound-on reminder is visible before the first clip; confirm `README.md` exists and contains the no-save sentence; final run with no console errors.
  Learner check: Open the page again and look for the sound-on reminder. Read `README.md` and say whether it describes UNFRAME the way you would.
  Commit: `Handle unplayable clips, add sound reminder and README`

## Hands-on Checkpoints

- [x] Early usable behavior explored — after slice 1: the learner watches the three clips with sound, answers, and judges the opening screen and clip screen before the reveal is built. Feedback: "looks good", but the end is missing something and should be more exciting — short visual transitions on screen, no sound effects. Folded into slice 2.
- [x] Final kick-the-tires exploration and feedback completed — after slice 3: the whole journey, including handing the opening screen to one other person without explaining (from `spec.md > Decisions and Open Issues`) Learner reports the hand-off test is done with two other people: both pressed Start without explanation. One asked for more on screen (now covered by the transitions and end-of-clip effects); one asked for two more answer choices (now covered by scared and surprised), said it "really made me think", and took it again.

## Final Review

- [x] End-of-clip effects for the three lens clips (angry: squares press in, sparks, cracks with warm light; sad: blue and purple drops with rings, one gold drop rising; happy: gold bubbles and shapes that bounce and grow, one blue drop dancing). They come in before each lens clip ends (2.5 s at first; the learner moved it to 4 s and then 6 s during the wrap-up) and stay while the question shows; the normal clip stays quiet. Verified in the browser; learner tried it: "nice".
- [x] Reversed effects every second time through (start again): angry — squares pull back, cracks heal, warm light fills the screen; sad — many gold drops rise, one blue drop falls and rings; happy — blue drops bounce and grow, one gold bubble dances. A reload starts with the forward effects. Verified in the browser; learner tried it: "nice".
- [x] Final review complete — feedback resolved and learner confirms ready to ship (2026-10-06: "ja")

## Code Tour and App Map

- [x] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [x] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [x] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: Guided route connected to the learner's goal of explaining ideas clearly: their spoken description of the end-of-clip effects (motion, colour, one counterweight per feeling) followed from `prd.md > Look and Feel` into `effects.js`. The learner then asked for further changes on the spot (effects 6 s before clip end; a bigger, glowing, exploding blue drop in happy), which were built, verified in the browser and committed.
Route and stops: (1) `script.js` "timeupdate" listener and `EFFECT_SECONDS`; (2) `script.js` `round % 2`; (3) `effects.js` `function sad(reversed)` and "The one that goes the other way". All three stops shown with the file opened in the app's file pane.
Edit outcome: Learner chose to change `EFFECT_SECONDS` from 2.5 to 4 (made by the agent at their request), then asked for 6; kept, verified (effect not running at 4.5 s left, running after), committed in 6d440cc.
Reflection: Offered; learner moved on without answering (treated as declined).
Activity mode: Live app (localhost preview) and the app's file pane; animations verified by the agent with a timer stand-in because its browser pane was hidden.

## Revisions
- Six answer choices instead of four (scared and surprised added) — the creator asked for them after slice 1 was built; scope, PRD and spec updated to match.
- Short visual transitions added to slice 2 (fades between screens and clips; reveal builds up clip by clip, answers next, closing question last; no sound effects) — the learner's early check found the ending needed to feel more exciting.
- The sound reminder sits over the first clip for about three seconds and fades out, instead of on the opening screen — the opening screen must stay name, text and button only (`spec.md > Look and Feel`). If the browser blocks a clip from playing, its own play button is shown so the journey can continue.
- Added `effects.js` and visual effects at the end of each lens clip, seen by the viewer before answering — the creator chose this during the final review as an extra layer of framing, each feeling with a small counterweight. Spec file structure updated.
- Effects now start 6 s before each lens clip ends (was 2.5 s), and the blue drop in happy is bigger, glows, leaves a sparkle trail, swells and explodes into droplets with a shockwave, then forms again — the learner asked for this during the learning wrap-up after seeing the effects.
