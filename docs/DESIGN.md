# Design system

## Visual thesis

A warm, contemporary technical exhibit: one machine, enough space to inspect it, and a small explanation that makes the next discovery inviting. The model is the focus. The interface provides orientation and control.

## Tokens

The source of truth is `src/styles/global.css`.

| Role | Token | Default |
|---|---|---|
| Page | `--paper` | #f7f5f0 |
| Exhibit background | `--surface` | #efeee8 |
| Main text | `--ink` | #282d2f |
| Supporting text | `--muted` | #71746f |
| Action / input | `--orange` | #d84f1a |
| Secondary mechanism / output | `--blue` | #356c89 |
| Dividers | `--line` | #dddcd4 |
| Body | `--font` | DM Sans |
| Headings | `--display` | Space Grotesk |
| Technical labels | `--mono` | IBM Plex Mono |

Use 16px body copy, 14px regular controls, and 12px secondary labels. Do not encode meaning through color alone. Orange suggests the driver or highlighted action; blue suggests a contrasting component. Add labels, motion, and arrows where needed.

## Composition

- Desktop: model on the left, a roughly 350px story panel on the right.
- Phone: model, playback controls, story, experiment, and navigation in that order.
- One main idea per chapter; short paragraphs; terminology explained at first use.
- Allow free exploration immediately. Story chapters are navigable in any order.
- Deeper technical detail belongs below the main player, with visible sources and limitations.

## Models and motion

- Build original schematic geometry. Show necessary parts clearly before adding decorative detail.
- Keep part identity and color consistent across chapters and exploded views.
- Choose a camera that makes the primary relationship visible. Offer front and perspective presets.
- Mechanism time and narrative progress are separate. The cycle slider changes the physical state; chapter navigation changes what is explained.
- Use deterministic kinematics. Exploded offsets affect presentation only.
- Respect reduced motion: start paused, avoid animated camera moves, and permit manual scrubbing.
- Pause animation when the page is hidden or the model is offscreen.
- State when motion is slowed or prescribed. Do not imply that simulated timing is measured performance.

## Acceptance

Verify 390px and 1440px layouts, 200% text enlargement, keyboard focus, touch controls, and readable failure states. All main controls need text or accessible names. Keep the initial scene small enough for a representative phone to load within five seconds and animate at 30fps; record the actual device and measured result.
