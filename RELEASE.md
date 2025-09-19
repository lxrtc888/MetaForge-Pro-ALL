# Release Process

## Versioning
- Semantic Versioning (SemVer): MAJOR.MINOR.PATCH
- Monthly patches, quarterly minors, semi-annual majors

## Steps
1. Ensure `main` is green (CI passing)
2. Update `CHANGELOG.md`
3. Bump version in relevant files if applicable
4. Create a signed tag: `git tag -s vX.Y.Z -m "release: vX.Y.Z"` (if signing)
5. Push tags: `git push --follow-tags`
6. Create GitHub Release from tag

## Compatibility
- Backward compatibility preferred for minors/patches
- Breaking changes require a major version and migration notes
