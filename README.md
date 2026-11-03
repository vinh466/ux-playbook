# UX Playbook

UX knowledge that AI coding agents load while they build and review **React + Mantine** interfaces.
[Mantine](https://mantine.dev) provides the components. The thinking behind GitHub's [Primer](https://primer.style)
design guidance decides **when** to use each one, **which states** a screen needs, and **how to check** the result.

It is packaged as an [Agent Skill](skills/ux-playbook/SKILL.md), so Claude Code, OpenCode and other agents that read
`SKILL.md` load it on demand, and only the pages a task needs.

## Why it exists

Agents use Mantine reliably: the components render and the API calls are right. The weak spots are elsewhere:

- **Layout and hierarchy**: every element looks equally important, and the main action does not stand out.
- **Missing states**: no empty, loading or error state, no reason shown for a disabled button.
- **Discoverability**: features the user cannot find, and advanced options mixed into the main path.
- **Flows**: extra steps, no protection on destructive actions, input lost on errors.

Mantine's docs explain **how** to use a component. They do not say **when** to choose it or **why**. Primer's
patterns and usage guidance do, but they are written for GitHub's own components. This playbook keeps Primer's
reasoning, maps it onto Mantine 9 (with v8 notes), and adds a working process for agents.

## Goals

1. **Stable, consistent UI**: the product's shared components and Mantine come first, styled with theme tokens only.
2. **Strong UX by default**: every screen has clear hierarchy, every state is designed, it is accessible and works on
   a phone and on a desktop.
3. **Business rules stay intact**: agents keep facts, assumptions and proposals apart, and never change a rule to
   simplify the UI.
4. **Room to research and create**: for bigger work, agents research known patterns and offer options, including
   bolder ones.
5. **The right to push back**: agents may challenge a spec, a flow or a component. They **build the safe default
   and attach a proposal** for the owner to decide.

## Audience

| Who | How they use it |
| --- | --- |
| **AI coding agents** (primary), including small, fast models | Load the skill for UI work. Follow the tier process, decision tables, patterns and checklists |
| **Product owners and reviewers** | Review agent PRs with the [rubric](skills/ux-playbook/process/review-rubric.md). Decide on [UX proposals](skills/ux-playbook/process/ux-challenge.md) |
| **Developers** | A compact UX reference for Mantine apps |

## Scope

**In scope**

- Web application UI built with **React + Mantine** (v9, with v8 notes): product apps, admin panels, dashboards,
  operations consoles, SaaS settings.
- Layout, choosing components, actions, overlays, navigation, data display, feedback, forms, saving, empty and
  loading states, progressive disclosure, onboarding, degraded states, destructive flows, accessibility, interface
  text.
- The process around them: sizing work into tiers, UX specs, research notes, the visual check with screenshots, the
  review rubric, and UX proposals.

**Out of scope**

- Visual brand design: colour palettes, logos, illustration. The theme belongs to each product.
- Marketing and landing pages, games and canvas-heavy interfaces, native mobile apps.
- Other UI libraries. The principles transfer; the recipes do not.
- Research with real users. Agents do heuristic review and desk research; the owner makes the final call on feel.
- Product-specific rules. Those live in each product's repository and **override** this playbook.

## How it works

```
Business requirements  >  Product's own UX rules  >  This playbook  >  Mantine defaults
```

| Tier | When | What the agent does |
| --- | --- | --- |
| **S** | A small change on an existing screen | Follow the page for that component and run its checklist |
| **M** | A new screen, dialog or form | Write a UX spec, build, take screenshots, self-review with the rubric |
| **L** | A new flow or feature area | Research, write options (A safe, B/C bolder), build A, attach B/C as proposals |

Every UI task ends with **UX notes**: the tier, the states covered, the screenshots, the rubric result, the
assumptions and the proposals.

## What's inside

```
skills/ux-playbook/
├── SKILL.md                 entry point: precedence, tiers, routing table, report format
├── principles.md            the 12 principles behind every rule
├── mantine.md               versions, API lookup through Mantine's LLM docs, theme rules
├── accessibility.md         keyboard, focus, labels, contrast, motion, announcements
├── writing.md               labels, buttons, errors, empty-state and confirmation text
├── decisions/               which Mantine component when
│   ├── layout.md  actions.md  overlays.md  navigation.md
│   └── data-display.md  feedback.md  selection.md
├── patterns/                recurring situations
│   ├── forms.md  saving.md  empty-states.md  loading.md
│   └── progressive-disclosure.md  feature-onboarding.md  degraded-experiences.md
├── flows/
│   └── destructive-actions.md
├── process/                 workflow (S/M/L), ux-challenge, research, visual-check, review-rubric
└── templates/               ux-spec, research-note, product-brief
```

## Install

**One project, pinned copy (recommended for teams).** Copy the skill into the product repository and commit it, so
every agent session in that repository gets the same version:

```bash
git clone https://github.com/vinh466/ux-playbook.git
ux-playbook/scripts/install.sh /path/to/product-repo     # → .claude/skills/ux-playbook/ + VERSION
```

Both [Claude Code](https://code.claude.com/docs/en/skills) and [OpenCode](https://opencode.ai/docs/skills/)
discover skills in `.claude/skills/<name>/SKILL.md`. Then add one line to the product's agent guide
(`AGENTS.md` or `CLAUDE.md`):

```markdown
For any UI work, load the `ux-playbook` skill. This repository's UX rules (<link to them>) win over it.
```

**Every project on one machine.** Link the skill into your user folder:

```bash
ux-playbook/scripts/install.sh --global    # symlink → ~/.claude/skills/ux-playbook
```

**Other agents.** Point the agent guide at `skills/ux-playbook/SKILL.md`; the pages are plain Markdown.

**Updating a pinned copy.** Run `install.sh` again. It replaces the folder and rewrites `VERSION` with the commit.

## Status

**v0.1, 2026-11-03.** The first pilot is the [GameWarden](https://github.com/vinh466/GameWarden) web panel
(Mantine 9, OpenCode and Claude Code agents). Next on the list: a search/filter/sort flow, long-running jobs,
settings pages, dashboards and data visualization.

## Related

- [Primer](https://primer.style): the source of the patterns and guidance. Projects that use Primer React should use
  Primer's own [MCP server](https://primer.style/product/getting-started/foundations/mcp/) instead.
- [Mantine LLM docs](https://mantine.dev/llms.txt): the API reference the playbook points agents to.

## License and attribution

[MIT](LICENSE). The guidance is adapted from GitHub's Primer design guidance. See [NOTICE](NOTICE.md). This project is
not affiliated with GitHub or Mantine.

Contributions follow [CONTRIBUTING.md](CONTRIBUTING.md). Run `node scripts/check.mjs` before you open a pull request.
