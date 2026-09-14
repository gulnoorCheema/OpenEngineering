# Maintainer and review process

The repository owner, [gulnoorCheema](https://github.com/gulnoorCheema), currently maintains OpenEngineering and decides which changes are merged and released. There is no separate steering committee or promised review turnaround.

Start a substantial exhibit with a proposal issue so the opening question, scope, sources, and model limits can be discussed before building. Small corrections can go straight to a pull request. The maintainer checks the contribution against CONTRIBUTING.md; passing CI alone does not establish educational accuracy. Disagreements should cite the learner need or technical evidence, and unresolved scope decisions remain with the maintainer.

Contributors retain their authorship and submit under the licenses in LICENSE and CONTENT-LICENSE.md. Keep meaningful Git authorship, fill in exhibit author and asset credits, and obtain consent before naming an independent reviewer. No separate CLA or sign-off process is currently required.

Merged changes to main trigger the Pages workflow. Pull requests run verification without deployment permissions. Fork maintainers control their own releases and should configure Pages and review settings for their repository.

## Repository settings checked September 14, 2026

Main currently has no branch protection or rulesets. Private vulnerability reporting is disabled. These are observed gaps, not enforced safeguards. Recommended maintainer setup is to require pull requests and the build check for main, block force pushes/deletion, and enable GitHub private vulnerability reporting. Choose an owner recovery/bypass policy before enforcing rules on this solo-maintainer repository.

A private contact for conduct concerns and a security disclosure route still need to be designated. Do not place sensitive reports in public issues. This audit has not published a conduct or security policy with an invented contact, nor changed repository access or enforcement settings.
