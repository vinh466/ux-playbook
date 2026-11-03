#!/usr/bin/env node
// Structural checks for the ux-playbook skill (see CONTRIBUTING.md).
// Usage: node scripts/check.mjs            → exit 0 when every check passes, 1 otherwise.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const skillDir = join(root, 'skills', 'ux-playbook');
const MAX_LINES = 200;
const errors = [];
const fail = (file, message) => errors.push(`${relative(root, file)}: ${message}`);

const SECTIONS = {
  decisions: ['Decide', 'Rules', 'Recipes', 'Pitfalls', 'Checklist'],
  patterns: ['When', 'Anatomy', 'States', 'Rules', 'Recipe', 'Checklist'],
  flows: ['When', 'Steps', 'Failures', 'Rules', 'Recipe', 'Checklist'],
};
const LEAD = { decisions: 'Use when', patterns: 'Goal', flows: 'Goal' };
const REFERENCE_PAGES = ['accessibility.md', 'writing.md'];
const SOURCED_PAGES = [...REFERENCE_PAGES, 'principles.md', 'mantine.md'];

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

// Text outside fenced code blocks, so examples are not checked as Markdown.
function prose(text) {
  let inFence = false;
  return text
    .split('\n')
    .map((line) => {
      if (/^\s*(```|~~~)/.test(line)) {
        inFence = !inFence;
        return '';
      }
      return inFence ? '' : line;
    })
    .join('\n');
}

function splitFrontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  return match ? { frontmatter: match[1], body: text.slice(match[0].length) } : { frontmatter: null, body: text };
}

function frontmatterValue(frontmatter, key) {
  const lines = frontmatter.split('\n');
  const index = lines.findIndex((line) => line.startsWith(`${key}:`));
  if (index === -1) return null;
  const inline = lines[index].slice(key.length + 1).trim();
  if (!/^[>|]-?$/.test(inline)) return inline.replace(/^['"]|['"]$/g, '');
  const block = [];
  for (const line of lines.slice(index + 1)) {
    if (!/^\s+\S/.test(line)) break;
    block.push(line.trim());
  }
  return block.join(' ');
}

function localLinks(text) {
  const links = [];
  for (const match of prose(text).matchAll(/\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
    const target = match[1];
    if (/^(https?:|mailto:|#)/.test(target)) continue;
    links.push(target.split('#')[0]);
  }
  return links;
}

function checkLinks(file, text) {
  for (const target of localLinks(text)) {
    if (!existsSync(resolve(dirname(file), target))) fail(file, `broken link → ${target}`);
  }
}

function checkSkillFrontmatter(file, text) {
  const { frontmatter } = splitFrontmatter(text);
  if (!frontmatter) return fail(file, 'missing YAML frontmatter');
  const name = frontmatterValue(frontmatter, 'name');
  const description = frontmatterValue(frontmatter, 'description');
  if (!name || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name) || name.length > 64) fail(file, `invalid name "${name}"`);
  if (name !== 'ux-playbook') fail(file, `name "${name}" must match the folder "ux-playbook"`);
  if (!description || description.length > 1024) {
    fail(file, `description must be 1–1024 characters (has ${description?.length ?? 0})`);
  }
}

function checkPage(file, text) {
  const rel = relative(skillDir, file);
  const folder = rel.includes('/') ? rel.split('/')[0] : null;
  const body = prose(splitFrontmatter(text).body);
  const lines = text.split('\n').length;

  if (lines > MAX_LINES) fail(file, `${lines} lines (max ${MAX_LINES})`);
  if (!/^# \S/.test(body.trimStart())) fail(file, 'must start with an H1 title');
  if (/\b(TODO|TBD|FIXME)\b/.test(body)) fail(file, 'contains TODO/TBD/FIXME');

  const headings = [...body.matchAll(/^## (.+)$/gm)].map((match) => match[1].trim());
  const expected = SECTIONS[folder];
  if (expected) {
    let cursor = -1;
    for (const section of expected) {
      const index = headings.indexOf(section);
      if (index === -1) fail(file, `missing section "## ${section}"`);
      else if (index < cursor) fail(file, `section "## ${section}" is out of order`);
      else cursor = index;
    }
    if (!body.includes(`> **${LEAD[folder]}:**`)) fail(file, `missing "> **${LEAD[folder]}:**" line`);
  }
  if (expected || SOURCED_PAGES.includes(rel)) {
    if (!body.includes('**Sources:**')) fail(file, 'missing "**Sources:**" line');
  }
  if (REFERENCE_PAGES.includes(rel) && headings.at(-1) !== 'Checklist') {
    fail(file, 'must end with "## Checklist"');
  }
  if ((expected || REFERENCE_PAGES.includes(rel)) && !/^- \[ \] /m.test(body)) {
    fail(file, 'the checklist needs "- [ ] " items');
  }
}

function checkReachability(pages) {
  const start = join(skillDir, 'SKILL.md');
  const seen = new Set([start]);
  const queue = [start];
  while (queue.length) {
    const file = queue.shift();
    for (const target of localLinks(readFileSync(file, 'utf8'))) {
      const next = resolve(dirname(file), target);
      if (next.endsWith('.md') && existsSync(next) && !seen.has(next)) {
        seen.add(next);
        queue.push(next);
      }
    }
  }
  for (const page of pages) if (!seen.has(page)) fail(page, 'not reachable from SKILL.md');
}

const skillFile = join(skillDir, 'SKILL.md');
if (!existsSync(skillFile)) {
  fail(skillFile, 'missing');
} else {
  const pages = walk(skillDir).filter((file) => file.endsWith('.md'));
  checkSkillFrontmatter(skillFile, readFileSync(skillFile, 'utf8'));
  for (const page of pages) {
    const text = readFileSync(page, 'utf8');
    checkPage(page, text);
    checkLinks(page, text);
  }
  checkReachability(pages);
  for (const doc of ['README.md', 'CONTRIBUTING.md', 'NOTICE.md']) {
    const file = join(root, doc);
    if (existsSync(file)) checkLinks(file, readFileSync(file, 'utf8'));
    else fail(file, 'missing');
  }
  console.log(`Checked ${pages.length} skill pages.`);
}

if (errors.length) {
  console.error(errors.map((error) => `✗ ${error}`).join('\n'));
  console.error(`\n${errors.length} problem(s).`);
  process.exit(1);
}
console.log('✓ All checks passed.');
