#!/usr/bin/env bash
# Install the ux-playbook skill.
#   scripts/install.sh <repo-dir>   copy it into <repo-dir>/.claude/skills/ux-playbook with a VERSION file; commit it there
#   scripts/install.sh --global     symlink ~/.claude/skills/ux-playbook to this checkout (every project on this machine)
# Claude Code and OpenCode both discover skills in .claude/skills/<name>/SKILL.md and ~/.claude/skills/<name>/SKILL.md.
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
src="$here/skills/ux-playbook"
usage() { sed -n '2,5p' "$0" | sed 's/^# \{0,1\}//'; }

[[ -f "$src/SKILL.md" ]] || { echo "error: $src/SKILL.md not found" >&2; exit 1; }

case "${1:-}" in
  -h | --help)
    usage
    ;;
  "")
    usage >&2
    exit 2
    ;;
  --global)
    dest="$HOME/.claude/skills/ux-playbook"
    mkdir -p "$(dirname "$dest")"
    if [[ -e "$dest" && ! -L "$dest" ]]; then
      echo "error: $dest exists and is not a symlink; move it away first" >&2
      exit 1
    fi
    ln -sfn "$src" "$dest"
    echo "Linked $dest -> $src"
    ;;
  *)
    target="$(cd "$1" && pwd)" || { echo "error: $1 is not a directory" >&2; exit 1; }
    dest="$target/.claude/skills/ux-playbook"
    if [[ -e "$dest" && ! -f "$dest/SKILL.md" ]]; then
      echo "error: $dest exists but is not a ux-playbook copy; move it away first" >&2
      exit 1
    fi
    version="$(git -C "$here" describe --tags --always --dirty 2>/dev/null || echo unknown)"
    commit="$(git -C "$here" rev-parse HEAD 2>/dev/null || echo unknown)"
    rm -rf "$dest"
    mkdir -p "$dest"
    cp -R "$src/." "$dest/"
    cat >"$dest/VERSION" <<EOF
source: https://github.com/vinh466/ux-playbook
version: $version
commit: $commit
installed: $(date -u +%Y-%m-%d)

This is a pinned copy. Do not edit it here: change the source repository, then run scripts/install.sh again.
EOF
    echo "Installed ux-playbook $version into $dest"
    ;;
esac
