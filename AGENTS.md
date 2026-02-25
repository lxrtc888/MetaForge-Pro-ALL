# AGENTS.md

## Cursor Cloud specific instructions

### Overview

MetaForge Pro is a **documentation-only AI collaboration framework** — it is not a runnable application. The repository contains:

- Markdown documentation files (`.md`) describing AI roles, workflows, and templates
- Two Node.js CLI utility scripts under `tools/` (use only Node.js built-in modules — no npm dependencies required)
- No `package.json`, no test framework, no linter, no build system

### Running the CLI tools

The two executable scripts are:

- `node tools/project-init.js <project-name> [--template=todo-app] [--yes]` — scaffolds a new project directory. **Note:** this script expects a `.cursor/` directory at the repo root, which is not present in this repository. It will fail with "找不到MetaForge框架文件" until `.cursor/` is populated.
- `node tools/knowledge-init.js [init|status|cleanup|help]` — manages a global knowledge base at `~/.metaforge-global/`.

Both scripts are interactive by default; use `--yes` or `--skipPrototype` flags on `project-init.js` to avoid TTY prompts.

### Key caveats

- `CONTRIBUTING.md` references `npm install`, `npm run lint`, and `npm run test`, but there is **no `package.json`** in the repository — those commands will fail.
- The `tools/setup.sh` script is interactive (prompts for user input) and tries to download from a placeholder URL (`https://github.com/your-org/MetaForge-Pro/...`), so it cannot be run non-interactively.

### No services to start

There are no backend services, databases, or web servers to run. The development workflow is editing Markdown documentation and optionally running the Node.js scaffolding scripts.
