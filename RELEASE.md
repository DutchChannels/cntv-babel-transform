# Release Checklist for DutchChannels/cntv-babel-transform

## Pre-release Steps

1. **Update version** in `package.json`
2. **Run tests** - `yarn test`
3. **Test locally** - Test with sample fixtures
4. **Update CHANGELOG.md** (create if needed)
5. **Review README.md** for accuracy
6. **Ensure all DutchChannels URLs are correct**

## Publishing to DutchChannels Organization

### Initial Setup

1. **Create repository** at `https://github.com/DutchChannels/cntv-babel-transform`
2. **Push code** to the new repository:
   ```bash
   git remote add origin https://github.com/DutchChannels/cntv-babel-transform.git
   git branch -M main
   git push -u origin main
   ```

### Creating a Release

1. **Tag the release**:

   ```bash
   git tag -a v1.0.0 -m "Release v1.0.0"
   git push origin v1.0.0
   ```

2. **Create GitHub Release**:

   - Go to https://github.com/DutchChannels/cntv-babel-transform
   - Click "Releases" → "Create a new release"
   - Select the tag created above
   - Add release notes

3. **Test the published action**:
   ```yaml
   - uses: DutchChannels/cntv-babel-transform@v1.0.0
     with:
       channel: "lov"
       platform: "tizen"
   ```

## Integration with connected-tv-apps

After publishing, update the connected-tv-apps repository:

1. **Add workflow file** to `connected-tv-apps/.github/workflows/deploy.yml`
2. **Update build scripts** to output to the expected directory structure
3. **Test the integration** with a pull request

## Post-release

1. **Update major version tag** (recommended for GitHub Actions):
   ```bash
   git tag -f v1
   git push origin v1 --force
   ```

This allows users to use `@v1` for the latest v1.x.x release.

2. **Notify team** about the new action availability
3. **Update connected-tv-apps** workflows to use the new action
