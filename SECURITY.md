# Security policy

## Report a vulnerability privately

Use [GitHub's private vulnerability report form](https://github.com/gulnoorCheema/OpenEngineering/security/advisories/new). Private vulnerability reporting is enabled for this repository. Reports are handled by the repository maintainer; do not put exploit details, credentials, or personal information in public issues or pull requests.

Include the affected URL or commit, steps to reproduce, expected impact, and a minimal proof of concept if you can provide it without harming anyone. Redact private information. Test only systems you own or are authorized to test. Please coordinate public disclosure with the maintainer so a fix can be prepared.

This is a volunteer-maintained project. There is no guaranteed response time or paid bounty program. Updates about a report will be provided in its private advisory conversation.

## Supported code

Security fixes target the current main branch and its latest GitHub Pages deployment. Older commits and independent forks are not separately maintained. Fork operators should configure their own reporting route and apply relevant fixes.

The public application is static. The optional recording helper binds to loopback and is for local authoring only; do not expose it to the internet. Report issues in that helper through the same private channel. A public technical correction or ordinary UI bug belongs in the corresponding issue form if it has no sensitive security details.

## Maintainer handling

Reproduce the issue privately, assess impact, prepare and verify a fix, and coordinate release/disclosure with the reporter. Credit reporters only with their permission. Monitor GitHub security-report notifications; enabling the form does not override personal notification preferences.
