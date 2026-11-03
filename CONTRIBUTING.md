# Contributing

This file is the authoring contract for the knowledge in [`skills/ux-playbook/`](skills/ux-playbook/SKILL.md).
Humans and agents follow it when they add or change a page. `node scripts/check.mjs` enforces the structural parts.

## Who reads the playbook

Coding agents, including small and fast models, read these pages in the middle of a task. Write for them:

- **Imperative and short.** One rule per line. "Use `Drawer` for …", not "It may be worth considering …".
- **Decisions before prose.** A table that maps a situation to a choice beats three paragraphs.
- **Concrete Mantine names.** Name the component, the prop and the package (`@mantine/modals`). Never invent a prop:
  check it on the Mantine page you cite.
- **One topic per page, ≤ 200 lines.** Link to the page that owns a neighbouring topic instead of repeating it.
- **English**, plain words, no marketing tone, no emoji.

## Sources and copying

- **Primer** ([primer.style](https://primer.style)) is the source of the *thinking*: patterns, usage guidance, accessibility.
  Cite the live page, e.g. `https://primer.style/product/ui-patterns/empty-states/`. The archived source repository
  [`primer/design`](https://github.com/primer/design) (MIT) may be read for wording, but the live site wins when they differ.
- **Mantine** ([mantine.dev](https://mantine.dev)) is the source of the *API*. Cite the LLM page, e.g.
  `https://mantine.dev/llms/core-modal.md` (v9; v8 lives at `https://v8.mantine.dev/llms.txt`).
- **Paraphrase and adapt.** Do not copy Primer text verbatim beyond a short quoted phrase. Drop everything that is
  specific to GitHub (Octicons, Primer component names as instructions, GitHub product examples) unless a mapping
  helps ("Primer calls this a *Blankslate*").
- A rule that is the playbook's own judgment, not from a source, is fine. It must still be concrete and testable.
- Every page that teaches (decisions, patterns, flows, accessibility, writing) has a **Sources** line under its title.

## Mantine baseline

- Examples target **Mantine 9** (`@mantine/core` 9.x). When v8 differs for something the page uses, add one line:
  `v8: …`. Do not write v7 notes.
- Examples are **TSX, minimal and composition-level**: imports, the component tree, the props that matter.
  No data fetching, routing or state libraries; use `useState` or a placeholder handler.
- Icons in examples come from `@tabler/icons-react`, a common choice in Mantine apps (Mantine 9's own docs show
  Phosphor icons). Products use their own icon set. Strings are literal English; projects map them to their i18n
  (said once in SKILL.md, not in every example).
- Style with theme tokens and style props (`gap="md"`, `c="dimmed"`), never hard-coded colours or pixel values.

## Page templates

Use the template of the folder. Section names are exact; `scripts/check.mjs` looks for them.

### `decisions/<topic>.md` — which component when

```markdown
# <Topic>: choosing the component

> **Use when:** <one line: the situation that sends an agent here>.
> **Sources:** Primer [<page>](<url>), … · Mantine [<Component>](<url>), …

## Decide

| Situation | Use | Not | Why |
| --- | --- | --- | --- |

## Rules

1. <imperative rule>

## Recipes

### <Recipe name>

(a short tsx block)

## Pitfalls

- <a mistake agents make, and the fix>

## Checklist

- [ ] <a yes/no check a reviewer can verify on a screenshot or in the code>
```

### `patterns/<pattern>.md` — a recurring UI situation

```markdown
# <Pattern>

> **Goal:** <the user outcome in one line>.
> **Sources:** Primer [<page>](<url>), … · Mantine [<Component>](<url>), …

## When

- Use when …
- Not when … → see [<page>](<relative link>)

## Anatomy

1. <part>: <purpose>

## States

| State | What the user sees | Mantine |
| --- | --- | --- |

## Rules

**Do**

- …

**Don't**

- …

## Recipe

(a short tsx block)

## Checklist

- [ ] …
```

### `flows/<flow>.md` — a sequence across states or screens

```markdown
# <Flow>

> **Goal:** <the user outcome in one line>.
> **Sources:** …

## When

## Steps

1. <step: what the user does, what the UI shows>

## Failures

| Failure | What the user sees | Recovery |
| --- | --- | --- |

## Rules

## Recipe

## Checklist
```

### Reference pages (`accessibility.md`, `writing.md`)

A title, a **Sources** line, sections by topic, and a final `## Checklist`.

## Links

- Link between pages with relative paths (`../patterns/loading.md`). Every page is reachable from `SKILL.md`.
- External links are absolute `https://` URLs.

## Checks

```bash
node scripts/check.mjs    # frontmatter, required sections, Sources lines, relative links, reachability, length
```

A change is done when the check passes and the page reads well to someone who has only this page open.

## Updating from the sources

Primer and Mantine change. When a cited page changes, update the page that cites it and note it in the commit message.
After a Mantine major upgrade, re-check every recipe against the new LLM pages and keep a `v<n>:` line only for the
previous major still in use.
