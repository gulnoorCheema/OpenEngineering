# Contributor and open-source audit — September 14, 2026

The repository has a usable open-source foundation, but its reporting and review policies are not yet complete. This audit tested a clean local checkout and fixed reproducible contributor failures. It was performed with Codex; it is not an independent human onboarding study, mechanical review, legal opinion, or security assessment.

## Verified foundation

- Public GitHub repository with detected MIT license, content-license boundaries, third-party notices, contribution guide, PR template, technical correction/proposal forms, and three actual good-first-issue tickets.
- Root AGENTS.md plus scoped scene/content instructions cover setup, deterministic mechanics, original assets, attribution, accessibility, tests, and restrictions on publishing. The contributor prompt explicitly leaves agent work for human review.
- Original Blender sources, export scripts, technical references, design/authoring guides, and accurate limitations are present. Local app use requires no API key or account. Analytics defaults to no collection.
- Pull requests run tests and the production build with read-only repository permissions; they do not enter the Pages deployment job.
- Relative Markdown file links checked across 24 previously tracked project documents: none missing. This does not establish that external reference URLs remain available.

## Fixed during this audit

1. **New-exhibit studio failure:** a new manifest appeared in the studio selector but crashed while looking up captions in a six-entry table. New exhibits now get deterministic default recording frames, captions, and clock-rate handling.
2. **Missing starter imagery:** the scaffold now copies original gear PNG/WebP previews and the social image, with inherited credits and explicit replacement instructions. Existing images are protected against overwrite.
3. **Invalid generated identifiers:** a valid slug such as `class` previously produced invalid TypeScript. Generated symbols now have a safe prefix. Tests cover reserved names, numeric slug segments, invalid paths, and collisions.
4. **Media workflow limited to the original collection:** an author can prepare only their exhibit with `--exhibit`; the capture helper now accepts numeric slug segments. No need to regenerate the homepage posters.
5. **Dependency-notice collisions:** generated filenames include versions, NOTICE files are copied, and regeneration removes only previously inventoried files. A version-pinned Fiber 9.7.0 license was recovered from its upstream release commit. Empty notice entries are explicitly reported.
6. **Onboarding gaps:** added `.nvmrc`, explicit clone instructions, package license metadata, a general bug/accessibility form, links to the live starter issues, and maintainer/review documentation. Clarified inherited starter content, optional artwork tools, and upstream links retained by fork deployments.

## Checks actually performed

- Original tracked-only checkout: `npm ci`, 28 tests, and production build passed.
- Updated project: 31 tests passed; production build passed with 14 pages and zero Astro/TypeScript diagnostics.
- Separate checkout containing the changes: installed with Node 24.18.0/npm 11.16.0, scaffolded `belt-drive`, then passed 32 tests and a 15-page production build. The new exhibit route, studio option, and three preview/share files were present. The temporary starter was not added to the main repository.
- The shell initially selected Node 20 in the separate directory, and Astro correctly refused that build. Explicit `nvm use` selected the documented Node 24 and the build passed. Contributors must select the documented runtime; the version file alone does not switch every shell automatically.
- The single-exhibit image preparation command produced a 720×540 PNG/WebP and 1200×630 share image from existing product renders in the temporary checkout. It rejected an opaque collection input as intended. No new recording or new visual design was claimed.
- License-generator regression verifies distinct version texts, NOTICE retention, unrelated-file preservation, and repeatable regeneration. Python syntax and Git whitespace checks passed.
- npm reported zero known vulnerabilities at install time. npm also reported pending install-script approvals for esbuild and fsevents; no user-level approval settings were changed. Existing large Three.js bundle and Three CJS warnings remain.

## Remaining maintainer work

- **Private reporting:** designate a private conduct contact and a security disclosure route, then publish the corresponding policies. GitHub private vulnerability reporting is currently disabled. No sensitive report should be requested through public issues.
- **Review enforcement:** main has no branch protection or repository rulesets. The documented PR review process is a convention, not an enforced gate. Configure required PR/build checks and protection against force pushes/deletion with a deliberate owner recovery policy.
- **Notice provenance:** maath 0.10.8 and stats-gl 2.4.2 declare MIT in package metadata but omit standalone notice text in the inspected sources. Resolve their release-specific notices before claiming a complete redistribution review. Other empty inventory entries include installed platform/build packages; the inventory is not a browser-bundle audit.
- **Human checks:** have a contributor unfamiliar with this code run and modify the starter, and retain the existing pending mechanical review, beginner testing, and real-phone performance checks. This audit did not repeat visual QA or establish those outcomes.

Repository access, branch rules, notification settings, and private-reporting settings were inspected but not changed. See [maintainer process](MAINTAINERS.md), [contribution guide](../CONTRIBUTING.md), and [third-party notices](../THIRD-PARTY-NOTICES.md).

## Follow-up completed September 14

The maintainer authorized repository hardening after this audit. Private vulnerability reporting is enabled, and main now requires a PR, the current GitHub Actions build, and resolved conversations; administrator enforcement is enabled and force pushes/deletion are disabled. SECURITY.md and CODEOWNERS document/report the working process. The solo maintainer can merge their own passing PR without a second-person approval.

An instrumented production build verified notices for 21 retained browser/font packages plus Draco across 31 emitted chunks. Neither maath nor stats-gl appears in the delivered JavaScript. Their missing standalone upstream texts therefore do not represent missing notices in the current browser distribution. Reusing those packages or redistributing node_modules still needs review. The check is reproducible with `npm run audit:licenses` and runs in CI. Earlier observations above are historical; see MAINTAINERS.md for current settings. A conduct reporting contact remains pending.
