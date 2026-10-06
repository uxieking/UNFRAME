---
doc: prd
status: approved
---

# UNFRAME — Product Requirements

A short interactive experience by LENSVRA where the audience watches one moment through three emotional treatments, says what mood they see, and then finds out what was really recorded.
Source: `scope.md > The Unique Kernel`, `scope.md > The Core Loop`.

## The Core Journey
Develops `scope.md > The Core Loop` and `scope.md > What "Working" Looks Like`.

1. The viewer opens UNFRAME and sees the opening screen: the name, a short text, and a start button.
2. They press start. The **angry** clip plays, with its lens, music, and lyrics. Nothing on screen names the treatment.
3. One question appears. They answer it, or skip. They may replay the clip first.
4. The **sad** clip plays, followed by the same question and skip.
5. The **happy** clip plays, with the happier mix of the same song, followed by the same question and skip.
6. The **normal**, unfiltered clip plays on its own, without music and without any text. No question is asked.
7. The reveal screen shows all four clips, the names of the three lens clips, the viewer's three answers, and the closing question.
8. They can replay any clip to compare, or start again.

Success: a viewer gets from the opening screen to the reveal, and the reveal shows the answers they actually gave.

## Screens and Layout
Four kinds of screen, always in the same order. The viewer only moves forward.

1. **Opening screen**: name, short text, start button.
2. **Clip screen** (three times: angry, sad, happy): the clip, then the question with six answer buttons and a replay button.
3. **Normal clip screen**: the unfiltered clip with no text, then a button to continue.
4. **Reveal screen**: four small clips together (two by two on a phone), the three lens clips named and the unfiltered one without a name; the viewer's answer under each of the three lens clips; the closing question at the bottom; a start again button.

On every screen the clip is the largest thing. The eye should travel from the clips, to the viewer's own answers, to the closing question.

## Look and Feel
- **Colors:** purple, white, and grey.
- **Background:** dark, "like a cinema", so the clips carry the emotion.
- **Text:** sharp and modern.
- **Tone:** reflective and inviting. The viewer should feel "less tricked", never tested or graded.
- **Transitions:** short visual transitions on screen, no sound effects. The reveal should feel exciting as it builds up (2026-10-06).
- **Brand:** this is a LENSVRA piece.

## Features and Behavior

### Opening screen
Develops `scope.md > The Core Loop` step 1.

Shows the name UNFRAME, a short text on screen, and a start button. The text gives a small hint that the viewer will be asked for their impression, without saying that the clips are one moment with different lenses.

Draft wording, to be edited by the creator:
> "You are about to watch a few short clips. After each one, tell us what you see. There are no wrong answers."

- [ ] The name, the text, and a start button are visible without scrolling on a phone.
- [ ] Nothing on this screen mentions lenses, filters, or the names of the moods.
- [ ] Pressing start leads to the angry clip.

### Watching a clip
Develops `scope.md > The Core Loop` step 2 and `scope.md > The POC Boundary`.

The three lens clips play in a fixed order: angry, sad, happy. Each plays with its own sound. No label, title, or color tells the viewer which treatment they are watching.

- [ ] The clips always appear in the order angry, sad, happy.
- [ ] Video and sound both play for each clip.
- [ ] While a clip plays, and while its question is on screen, nothing names the treatment.

### Answering the question
Develops `scope.md > The Core Loop` step 3.

When a clip ends, the viewer is asked one question. If they do not want to answer, they can skip. The viewer may replay the clip as many times as they like first. Answering, or skipping, moves them to the next clip.

- **The question:** "How would you describe this person's mood?" Happy, sad, angry, scared, surprised, unsure.

The question is about the person on screen, not about the viewer.

- [ ] The question, with its six choices, and a skip button appear after each of the three lens clips, the same way each time.
- [ ] A replay button plays the same clip again, and the question is still there afterwards.
- [ ] The viewer continues only by answering the question or by pressing skip.
- [ ] After answering or skipping, there is no way to go back and change it.

### The normal clip
Develops `scope.md > The POC Boundary` (the unfiltered original).

After the third answer, the unfiltered clip plays on its own. It has no lens and no music, and no text explains it. No question is asked. The quiet is on purpose: the viewer is left to think.

- [ ] The normal clip appears only after all three answers have been given.
- [ ] No text on this screen names or explains the clip.
- [ ] No answer buttons appear with it.
- [ ] A button leads on to the reveal.

### The reveal
Develops `scope.md > The Unique Kernel` and `scope.md > What "Working" Looks Like` step 4.

All four clips are shown together. The three lens clips now have their names: angry, sad, happy. The fourth, unfiltered clip has no name and no text; the viewer works out for themselves what it is. Under each of the three lens clips is the viewer's own answer, for example "Lens: angry. You said: sad." If they skipped that clip, it says "You skipped this one." There are no ticks, crosses, or scores. Tapping a clip plays it again. The closing question stands on its own at the bottom: "Are you reacting to what happened, or to how it was presented?" A start again button returns to the opening screen.

- [ ] Each of the three answers shown matches what the viewer chose for that clip, or shows that they skipped it.
- [ ] The three lens clips are named; the unfiltered clip has no name or text. All four can be replayed from this screen.
- [ ] Nothing marks an answer as right or wrong.
- [ ] The closing question is visible on the reveal screen.
- [ ] Start again returns to the opening screen with all earlier answers cleared.
- [ ] If the clips are separate takes rather than one recording, the reveal says clearly that they are similar takes, not identical footage.

## States and Boundaries
- **Moving on without answering:** allowed through the skip button. The reveal then shows "You skipped this one" for that clip.
- **Skipping all three:** the reveal still appears, with the four clips and the closing question.
- **Changing an earlier answer or skip:** not possible. The only way is to start over.
- **Start again:** returns to the opening screen and clears all answers.
- **Closing or reloading the page:** the experience begins again from the opening screen. Nothing is kept. *(Assumption, following `scope.md > Explicitly Cut`: no saved results.)*
- **A clip that will not play:** the viewer sees a short message saying the clip could not be played, instead of a blank screen. *(Assumption.)*
- **Starting a clip:** each clip starts when the viewer presses play or start, so that sound is never a surprise. *(Assumption; whether clips can start by themselves with sound is settled in `4-spec`.)*

## Product Decisions
- **Order is angry, sad, happy, then normal.** Angry is "a great hook to start with"; sad is where the viewer "will totally understand the lyrics and feel deeply"; happy uses the happier mix of the same song.
- **The opening gives a small hint, as text on screen.** "Less tricked is a safe thing."
- **Replay before answering is allowed.** "The user should totally be able to watch the clip again to understand it," because this makes the viewer reflect.
- **One question per clip, and skipping is allowed.** The question is about the person on screen. If the viewer does not want to answer, they can skip.
- **The second question was removed** (2026-10-02, during `4-spec`). "How does this clip make you feel?" asked about the viewer's own feelings, and the creator chose to remove "the most personal one."
- **No privacy note on the page.** The creator considered a line saying answers are not saved, and decided against it: people "will still think oh yes is this really true."
- **No changing answers.** "They have to start over."
- **Six answer choices** (2026-10-06, during `5-build`). The creator added "scared" and "surprised" to happy, sad, angry and unsure.
- **The normal clip gets its own moment before the reveal.** After happy, "go direct to normal."
- **The normal clip has no music and no text** (2026-10-02). No line saying "this is me normal or something", "because the user have to think. Maybe sometimes you need quiet moments or sometimes you need music." This replaced the draft line "This is what was recorded." The same holds on the reveal: the unfiltered clip stands there without a name.
- **The reveal layout** (four clips together, answers underneath, no right or wrong, closing question, start again) was recommended by the agent and accepted: "exactly the way I kind of imagine."
- **Look:** purple, white, grey; dark "like a cinema"; "sharp and modern" text.
- **The three lenses are finished** (2026-10-02): Cartoon Rage Face (angry), Tearful Gaze (sad), Mega Joy Face (happy).
- **The music belongs to the creator**, who mixes it and delivers it as part of each clip.

## What We're Building
- An opening screen with name, text, and start.
- Three lens clips in fixed order, each followed by one question, a skip, and a replay.
- The normal clip on its own.
- A reveal screen with four named clips, the viewer's three answers, replay, the closing question, and start again.
- The cinema look in purple, white, and grey.

## Deferred From the POC
- **Putting it online for the whole audience.** The prototype runs on the creator's computer for the demo video; sharing by link comes after.
- **Showing how other viewers answered.** Needs answers to be collected and stored, which the scope cut.
- **More settings and rounds** (the store, the workout). One setting proves the idea.

## Possible Later Enhancements
- A longer 1–3 minute piece edited in CapCut.
- "From room to scene": the viewer picks something around them and gets a small creative challenge. A separate idea, parked in `scope.md > Later`.

## Non-Goals
- **No accounts and no saved results.** Answers live only until the reveal.
- **No live camera, and no lenses applied inside the app.** The lenses live in Snapchat; the app plays finished clips.
- **No scoring.** The reveal is a mirror, not a grade.
- **No choosing the order.** The order is part of the piece.

## Open Questions
- **One recording or three takes.** The creator will test whether the same ocean recording can go through all three lenses. Does not block `4-spec`; the fallback wording is already a requirement.
- **Final wording** of the opening text. A draft is included; the creator can change it at any time. Does not block `4-spec`.
- **Clip length.** About 5–10 seconds each was recommended in scope; not confirmed. Does not block `4-spec`.
