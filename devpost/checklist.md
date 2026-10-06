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

- [ ] **3. Handles a missing clip and no sound, and has a README**
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
- [ ] Final kick-the-tires exploration and feedback completed — after slice 3: the whole journey, including handing the opening screen to one other person without explaining (from `spec.md > Decisions and Open Issues`)

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: [what actually happened; real document/test/code references; unfinished work if interrupted]
Route and stops: [actual paths and symbols; guided stops completed, or reference-only route]
Edit outcome: [tried/kept/reverted/declined/not applicable; verification if changed]
Reflection: [offered/answered/declined/already covered — personal answer belongs only in the ignored profile]
Activity mode: [live app and editor, explicit static fallback, focused alternative, prior practice, or recap]

## Revisions
- Six answer choices instead of four (scared and surprised added) — the creator asked for them after slice 1 was built; scope, PRD and spec updated to match.
- Short visual transitions added to slice 2 (fades between screens and clips; reveal builds up clip by clip, answers next, closing question last; no sound effects) — the learner's early check found the ending needed to feel more exciting.
