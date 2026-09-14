# Maintainer and review process

The repository owner, [gulnoorCheema](https://github.com/gulnoorCheema), currently maintains OpenEngineering and decides which changes are merged and released. There is no separate steering committee or promised review turnaround.

Start a substantial exhibit with a proposal issue so the opening question, scope, sources, and model limits can be discussed before building. Small corrections can go straight to a pull request. The maintainer checks the contribution against CONTRIBUTING.md; passing CI alone does not establish educational accuracy. Disagreements should cite the learner need or technical evidence, and unresolved scope decisions remain with the maintainer.

Contributors retain their authorship and submit under the licenses in LICENSE and CONTENT-LICENSE.md. Keep meaningful Git authorship, fill in exhibit author and asset credits, and obtain consent before naming an independent reviewer. No separate CLA or sign-off process is currently required.

Merged changes to main trigger the Pages workflow. Pull requests run verification without deployment permissions. Fork maintainers control their own releases and should configure Pages and review settings for their repository.

## Repository protections configured September 14, 2026

Main requires a pull request, an up-to-date passing `build` check from GitHub Actions, and resolved review conversations. These rules apply to administrators too. Force pushes and branch deletion are disabled. GitHub private vulnerability reporting is enabled; follow [SECURITY.md](../SECURITY.md).

CODEOWNERS requests review from the maintainer. There is no mandatory second-person approval count: this lets the solo maintainer merge their own PR after checks pass. External contributions are still reviewed by the maintainer before merge. A maintainer can change these settings through repository administration if recovery is necessary; that is a deliberate settings change, not a bypass granted by this policy.

Changes should now go through a branch and pull request, including maintainer and agent work. Never weaken the required checks just to get a PR merged. The build includes the browser dependency-notice audit. A security form alone does not ensure email delivery; maintainers must monitor their GitHub security-report notifications.

The private contact for conduct concerns remains pending the maintainer's choice. A [complete conduct-policy draft](CODE-OF-CONDUCT-DRAFT.md) is ready to publish once that contact is supplied. Security reports already have a working private route. Do not send ordinary conduct reports to public issues or to the security advisory form.
