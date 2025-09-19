# Contributing to MetaForge Pro

Thanks for your interest in contributing! This document explains how to propose changes and get them merged.

## Code of Conduct
By participating, you agree to abide by our [Code of Conduct](./CODE_OF_CONDUCT.md).

## Quick Start
1. Fork the repo and create your branch from `main`/`master`.
2. Create a focused PR: one change per PR.
3. Follow our commit convention: Conventional Commits (e.g., `feat: ...`, `fix: ...`).

## Development
```bash
# In the project root
npm install
# or pnpm/yarn

# run linters / tests if applicable
npm run lint
npm run test
```

## Documentation First
- For framework rules/flows, update the files under `.cursor/` accordingly.
- For architecture decisions, add an ADR under `docs/ADRs/`.

## DCO – Developer Certificate of Origin
We use DCO. Sign your commits with:
```bash
git commit -s -m "feat: your message"
```

## PR Checklist
- [ ] Follows Conventional Commits
- [ ] Includes docs/updates when needed
- [ ] Passes CI
- [ ] Backward compatible (if not, document breaking changes)

## Issue Reporting
Use the GitHub issue templates. Provide reproduction steps and expected behavior.

## Release Process
See [RELEASE.md](./RELEASE.md).


