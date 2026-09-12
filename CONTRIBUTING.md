# Contribute to OpenEngineering

Help someone understand one thing they have always wondered about.

## Start small

You do not have to write code. A clear explanation, a dependable technical source, an accessibility improvement, or a careful correction is a useful contribution. See [starter opportunities](docs/GOOD-FIRST-ISSUES.md).

For a new exhibit, open a proposal with one opening question, the intended learner, the key relationship to make visible, and two technical sources. Check the existing issues before starting a large model.

## Development

1. Fork and clone this repository.
2. Run `npm ci` and `npm run dev`.
3. Make a focused change. For an exhibit, follow [AUTHORING.md](docs/AUTHORING.md).
4. Run `npm test` and `npm run build`.
5. Verify the relevant interaction in desktop and phone layouts.
6. Open a pull request describing the learner-facing change, sources, limitations, and checks actually performed.

## Work with an agent

Clone the repository and give your agent [AGENTS.md](AGENTS.md) as its entry point. The root file maps the codebase, setup commands, design and mechanical constraints, licenses, and required verification. Focused instructions live in [the scene directory](src/components/scenes/AGENTS.md) and [the exhibit-content directory](src/content/exhibits/AGENTS.md). Agents that discover `AGENTS.md` automatically can load these by scope; otherwise ask yours to read the relevant files explicitly.

Copy this prompt and replace the bracketed fields:

```text
Work in my local OpenEngineering checkout.
Read AGENTS.md and the AGENTS.md files in any directories you will edit.
Then implement this focused contribution: [issue URL or concrete task].
The intended result is: [what a beginner should understand or be able to do].
Use these references where relevant: [sources, or ask the agent to research them].

Inspect the existing implementation, preserve unrelated changes, and follow
the shared exhibit interface. Implement the change and run the checks required
by AGENTS.md. Report the sources, limitations, files changed, checks actually
performed, and anything still unverified. Leave a reviewable local change;
do not publish, deploy, merge, or send messages on my behalf.
```

For a whole exhibit, add the [reusable Astra brief](docs/ASTRA-BRIEF.md). It also works as a task brief for other coding agents. Researchers and writers can use the same entry point for a focused source or prose correction. Review what the agent produces before submitting your pull request; agent instructions do not replace technical or human review.

## Review standard

- Does the first question make sense without engineering knowledge?
- Does each moving part have the stated mechanical relationship?
- Does every experiment change something meaningful?
- Are units, simplifications, and sources clear?
- Can a visitor pause, reset, use the keyboard, and read an explanation without WebGL?
- Are code and asset licenses compatible and attribution complete?

AI-assisted contributions are welcome. Explain how the tool was used and what you personally checked. Do not mark content “engineer reviewed” unless a named reviewer agreed to that credit and reviewed this version.

Submitting a contribution means you have the rights to contribute it under the relevant project license: MIT for code and developer documentation, CC BY 4.0 for original educational content. Do not upload screenshots, CAD files, book pages, or text from other creators without the required permission and license.

Be kind, precise, and curious. Discuss the work, explain disagreements, and help new contributors find a manageable next step. The maintainer reviews and merges contributions; there is no automatic publication of submitted code.
