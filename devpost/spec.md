---
doc: spec
status: approved
---

# UNFRAME — Technical Spec

## How This Works, In Plain Language
UNFRAME is one web page. It opens in a browser such as Chrome, on a computer or a phone. There is nothing to install and nothing to log in to.

The page is made of three files, and each has one job:

- **`index.html` says what is on the page:** the name, the texts, the buttons, and the place where a video plays.
- **`style.css` says how it looks:** the dark cinema background, the purple, white and grey, the sharp modern text.
- **`script.js` says what happens when someone presses something:** play the next clip, remember the answer, show the reveal.

Next to those files is a folder called `media` holding four video files: the angry, sad, happy and normal clips. The lens and the music are already inside each video file, because the creator made them that way. The page only plays them.

All five screens (opening, clip, questions, normal clip, reveal) live in the same page. Only one is visible at a time; the script hides one and shows the next.

While someone uses the page, the script keeps a short list in its memory: for each of the three lens clips, what they chose, or that they skipped. The reveal reads that list. The list exists only while the page is open. Reloading or pressing "start again" empties it. Nothing is saved and nothing is sent anywhere.

Why this shape: it is the smallest thing that does everything the product plan asks for, with few enough files that each one can be opened and understood.

## The Core Journey Through the System
PRD ref: `prd.md > The Core Journey`.

1. The viewer opens `index.html`. The browser reads the three files and shows the **opening screen**.
2. They press start. The script hides the opening screen, shows the **clip screen**, and plays `media/clip-angry.mp4` with sound. Because the viewer just pressed a button, the browser allows the sound.
3. The clip ends. The script shows the **question**, the skip button and the replay button underneath the clip.
4. The viewer answers or skips. The script writes that into its list, then loads and plays `media/clip-sad.mp4`. Steps 3 and 4 repeat for sad and then happy.
5. After the third answer, the script shows the **normal clip screen** and plays `media/clip-normal.mp4`, which has no music, with no text on screen. A continue button appears.
6. The viewer presses continue. The script builds the **reveal screen**: four small videos, the three lens clips with their names and the normal clip with no name, and under each lens clip the matching line from its list.
7. Tapping a small video plays it; any other one that is playing stops.
8. "Start again" empties the list and shows the opening screen.

## Stack
Agreed by the creator: "a simple web page."

- **HTML, CSS, and JavaScript**, written by hand, with no framework and no added libraries. Reason: nothing to install, and every line in the project belongs to UNFRAME. Tradeoff accepted: a web page, not an app from an app store.
- **The browser's built-in video player** (the HTML `video` element) plays the clips. Docs: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video
- **Fonts already on the viewer's device**, so the page needs no internet connection to look right.
- **Git** (version 2.55, already installed) records each working step; **GitHub** holds the public copy.

Not verified online while writing this; to check early in the build:
- That sound plays on the creator's phone after the start button is pressed. Browser rules on sound: https://developer.mozilla.org/en-US/docs/Web/Media/Autoplay_guide
## Where It Runs and How Someone Tries It
- **Runs in:** any modern browser. No server, no keys, no accounts.
- **To start it:** open the project folder and double-click `index.html`.
- **For the demo recording:** open `index.html` in Chrome on the computer, make the window tall and narrow like a phone, and record the screen while going through the whole journey. Recording with sound is needed, since the music is part of the framing.
- **Submission needs both** a short demo video and a public GitHub repository. The creator will upload the demo video to YouTube, with comments turned off, and has a GitHub account.
- **Putting it online is optional** and not part of this build. If wanted later, GitHub Pages can publish this same folder as a link without changes. Docs: https://docs.github.com/en/pages

## Look and Feel
Carries forward `prd.md > Look and Feel`.

- **Background:** near-black with a purple tint, "like a cinema". The clip is the brightest thing on screen.
- **Colors:** one purple for buttons and accents, white for main text, grey for secondary text and outlines.
- **Text:** "sharp and modern": a clean sans-serif, capital letters with wide spacing for the name and for buttons, square corners and thin lines instead of rounded shapes and shadows.
- **Layout:** built for a phone held upright. One column. The vertical clip fills most of the screen; on a computer the same tall column sits centered.
- **Opening screen, to be eye-catching at once:** one name, one short text, one purple button, and nothing else, all visible without scrolling. The start button is the only purple thing on the screen, so the eye goes to it.
- **Tone of the words:** calm and inviting. No "correct", "wrong", or "score" anywhere.
- **Transitions** (2026-10-06, from the creator's first test): short visual fades between screens and between clips, no sound effects. The reveal builds up: the four clips appear one by one, then the answers, then the closing question on its own.

## Components

### Opening screen
Shows the name, the opening text and the start button. Pressing start begins the journey.
PRD ref: `prd.md > Opening screen`.

### Clip player
One video area, reused for the three lens clips and the normal clip. Plays the current clip with sound, never shows the treatment name, and tells the script when the clip has ended. Shows a short message if a clip cannot be played.
PRD ref: `prd.md > Watching a clip`, `prd.md > The normal clip`.

### Question panel
Appears when a lens clip ends: the question with its six choices, a skip button and a replay button. One press on a choice or on skip records the result and moves on. There is no back button.
PRD ref: `prd.md > Answering the question`, `prd.md > States and Boundaries`.

### Normal clip screen
The clip player and a continue button, with no question panel and no text about the clip. The clip itself has no music; the quiet is on purpose.
PRD ref: `prd.md > The normal clip`.

### Reveal screen
Four small videos, two by two. The three lens clips each show their name; the normal clip shows no name and no text. Under each lens clip: "You said: …" or "You skipped this one." Tap to replay. The closing question at the bottom, then start again. If the clips are similar takes, one extra line says so.
PRD ref: `prd.md > The reveal`.

### Texts and settings
One short block at the top of `script.js` holding every sentence the viewer reads, the question with its choices, the order of the clips, and one yes/no setting for "these are similar takes, not identical footage". The creator can change wording here without touching anything else.
PRD ref: `prd.md > Open Questions` (final wording; one recording or three takes).

## Data Model
One list, kept in the script's memory, with one entry per lens clip:

| What | Example |
|---|---|
| Which clip | angry |
| What was chosen | happy, sad, angry, scared, surprised, unsure, or skipped |

- **Where it lives:** in the page's memory only.
- **How it changes:** one entry is added each time the viewer answers or skips. Entries are never edited.
- **When the viewer leaves and comes back:** it is gone. A reload starts from the opening screen. This follows `prd.md > States and Boundaries` and `scope.md > Explicitly Cut`.

## File Structure

```
LENSVRA BUILD WITH AI/
├── index.html          # what is on the page: all five screens
├── style.css           # how it looks: cinema dark, purple, white, grey
├── script.js           # what happens: texts and settings at the top, then the journey
├── effects.js          # the visual effects at the end of each lens clip
├── media/
│   ├── clip-angry.mp4  # Cartoon Rage Face, with music
│   ├── clip-sad.mp4    # Tearful Gaze, with music
│   ├── clip-happy.mp4  # Mega Joy Face, with the happier mix
│   └── clip-normal.mp4 # no lens
├── README.md           # what UNFRAME is and how to open it
├── TODO.md             # progress checklist
├── .gitignore          # keeps personal notes and secrets out of the repository
└── devpost/            # Devpost learning workspace (planning documents)
```

The file names must stay exactly as written, so the real clips can replace the stand-ins without any change to the code.

## External Services and Dependencies
None while the page runs. It calls no outside service and needs no keys.

Around the project:
- **GitHub**, for the required public repository. Free. Single files must be under 100 MB; aim for under 10 MB per clip so the page loads quickly. Docs: https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github
- **YouTube**, for the demo video. Handled in `6-ship`.

## Important Failure Modes
- **A clip is missing or cannot be played** → the clip area shows "This clip could not be played." and the question still appears, so the journey can continue.
- **No sound** (phone on silent, or the browser holding sound back) → the clip screen has a small "sound on" reminder before the first clip. Sound is checked on the creator's own phone during the build.
- **Clips are large and slow to start** → keep each clip short and under about 10 MB.

## What Was Simplified and Why
- **Files opened from the computer** instead of a website with a link — the demo video only needs it running locally. Going online later means publishing the same folder.
- **Answers kept in memory** instead of being saved — the reveal is the only place they are needed. Saving them would need storage and raises privacy questions.
- **Finished video files** instead of lenses running in the page — the lenses live in Snapchat. Running them in a web page would be a large project of its own.
- **Stand-in clips while building** instead of waiting for filming — the journey can be built and tested first. The stand-ins are plainly labelled and are replaced by the real clips before the demo video.

## Decisions and Open Issues

**Decisions by the creator**
- A simple web page, not an installed app.
- Vertical clips; most of the audience will open it on a phone.
- The four clips, including the song, may be public in the GitHub repository: "I'm a public person."
- The demo video goes on YouTube with comments off.
- Filming happens on 2026-10-02 or 2026-10-03.
- One question per clip, about the person on screen. The question about the viewer's own feelings was removed as "the most personal one" (see `prd.md > Product Decisions`).
- No privacy note on the page. Nothing is saved or sent, and a note could make viewers doubt it.
- The normal clip has no music and no text on its screen, and no name on the reveal, "because the user have to think."
- The four real clips are in `media/` as `.mp4` (2026-10-02): vertical 1080 × 1920; angry 8.5 s, sad 7.9 s, happy 13.7 s (the remix), normal 5.5 s. Stand-in clips are no longer needed.
- A short quiet moment between clips while the question is on screen is fine. The music is inside each clip and is never cut mid-clip.

**Recommended by the agent and accepted by the creator (2026-10-02: "yes to all four")**
- No framework and no libraries.
- Building with stand-in clips if the build starts before the real clips exist.
- File names and the texts-and-settings block.
- One sentence in `README.md` saying that UNFRAME does not save or send any answers.

**The creator's open question, and what clarified it**
"I'm not sure where to place it at the site to get the design correct for eye-catching immediately and make the users want to test it."
- Explained: UNFRAME is its own page, so the opening screen is the whole first impression. The approach is one name, one short text, and one button, with the button as the only purple thing on screen.
- To be checked during the build: the creator looks at the opening screen on their own phone, and hands it to one other person without explaining anything. If that person presses start within a few seconds, it works. If not, the opening is adjusted.

**Still open, none blocking the build**
- One recording or three takes (`prd.md > Open Questions`). Handled by the yes/no setting.
- Final wording of the opening text. Editable in the texts-and-settings block.
