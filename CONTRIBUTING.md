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
