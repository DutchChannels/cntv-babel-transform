# Final Setup Instructions for DutchChannels/cntv-babel-transform

## 🎯 Ready to Publish!

Your GitHub Action package is now ready to be published to the DutchChannels organization. Here's everything you need to do:

## Step 1: Create Repository on GitHub

1. Go to https://github.com/DutchChannels
2. Click "New Repository"
3. Repository name: `cntv-babel-transform`
4. Description: "A GitHub Action for transpiling JavaScript files using Babel for Connected TV apps"
5. Make it **Public** (GitHub Actions need to be public to be used by other repos)
6. **Don't** initialize with README (we already have one)

## Step 2: Push Code to DutchChannels

```bash
# Navigate to your project
cd /Users/christophesnacken/Werk/cntv-babel-transform-package/cntv-babel-transform

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial release of CNTV Babel Transform Action"

# Add DutchChannels remote
git remote add origin https://github.com/DutchChannels/cntv-babel-transform.git

# Push to main branch
git branch -M main
git push -u origin main
```

## Step 3: Create Release

```bash
# Tag version 1.0.0
git tag -a v1.0.0 -m "Release v1.0.0 - Initial release"
git push origin v1.0.0

# Create major version tag (recommended for GitHub Actions)
git tag -a v1 -m "Major version v1"
git push origin v1
```

## Step 4: Create GitHub Release

1. Go to https://github.com/DutchChannels/cntv-babel-transform/releases
2. Click "Create a new release"
3. Choose tag: `v1.0.0`
4. Release title: `v1.0.0 - Initial Release`
5. Description:

   ````markdown
   ## 🎉 Initial Release of CNTV Babel Transform Action

   This GitHub Action transpiles JavaScript files using Babel for Connected TV applications.

   ### Features

   - ✅ Babel transpilation with @babel/preset-env
   - ✅ CDN URL replacement for Tizen platform
   - ✅ Support for multiple channels (lov, nfn)
   - ✅ Configurable build paths

   ### Usage

   ```yaml
   - uses: DutchChannels/cntv-babel-transform@v1
     with:
       channel: "lov"
       platform: "tizen"
       build-path: "./platformBuilds"
   ```
   ````

   See README.md for full documentation.

   ```

   ```

6. Click "Publish release"

## Step 5: Update connected-tv-apps Repository

Add this workflow to your `connected-tv-apps` repository at `.github/workflows/deploy.yml`:

```yaml
name: Build and Deploy Connected TV Apps

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  build-and-transpile:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        channel: [lov, nfn]
        platform: [tizen]

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build React app for ${{ matrix.channel }}
        run: npm run build:${{ matrix.channel }}
        env:
          REACT_APP_CHANNEL: ${{ matrix.channel }}
          REACT_APP_PLATFORM: ${{ matrix.platform }}

      - name: Transpile for Connected TV
        uses: DutchChannels/cntv-babel-transform@v1
        with:
          channel: ${{ matrix.channel }}
          platform: ${{ matrix.platform }}
          build-path: "./platformBuilds"

      - name: Archive production artifacts
        uses: actions/upload-artifact@v4
        with:
          name: ${{ matrix.channel }}-${{ matrix.platform }}-build
          path: platformBuilds/${{ matrix.channel }}_${{ matrix.platform }}/
          retention-days: 7
```

## Step 6: Test the Integration

1. Create a test PR in connected-tv-apps with the new workflow
2. Verify the action runs successfully
3. Check that the transpiled files are generated correctly

## ✅ Package Summary

Your package includes:

- **action.yml** - GitHub Action definition
- **src/index.js** - GitHub Actions entry point with @actions/core
- **src/transpiler.js** - Core Babel transformation logic with CDN replacement
- **src/utils/file-finder.js** - Utility to find main JS files
- **test/** - Comprehensive test suite
- **README.md** - Complete documentation
- **package.json** - Correct DutchChannels repository URLs
- **.github/workflows/** - CI/CD pipeline and examples

## 🚀 You're Ready!

Once published, other repositories can use your action with:

```yaml
- uses: DutchChannels/cntv-babel-transform@v1
  with:
    channel: "lov"
    platform: "tizen"
```

The action will:

1. Find the main.[hash].js file
2. Transpile it with Babel for ES5 compatibility
3. Replace CDN URLs for the specified channel/platform
4. Generate both the updated original file and a main.js file
