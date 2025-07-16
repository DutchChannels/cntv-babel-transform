# CNTV Babel Transform Action

A GitHub Action that transpiles JavaScript files using Babel for Connected TV applications.

## Features

- Transpiles modern JavaScript to ensure compatibility with various platforms
- Specifically designed for Connected TV platforms like Tizen
- Supports CDN URL replacement for different channels
- Easy integration into GitHub workflows

## Usage

```yaml
name: Build and Deploy
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Transpile JS files
        uses: DutchChannels/cntv-babel-transform@v1
        with:
          channel: "lov"
          platform: "tizen"
          build-path: "./platformBuilds"
```

## Inputs

| Input        | Description                   | Required | Default            |
| ------------ | ----------------------------- | -------- | ------------------ |
| `channel`    | Channel name (lov, nfn, etc.) | ✅       | -                  |
| `platform`   | Target platform (tizen, etc.) | ✅       | -                  |
| `build-path` | Path to build directory       | ❌       | `./platformBuilds` |

## Supported Channels

- `lov` - Love TV (CDN: `https://cdn.withlove.tv/cntv/tizen`)
- `nfn` - New Faith Network (CDN: `https://cdn.newfaithnetwork.com/cntv/tizen`)

## Example with Matrix Strategy

```yaml
strategy:
  matrix:
    channel: [lov, nfn]
    platform: [tizen]

steps:
  - name: Transpile for Connected TV
    uses: DutchChannels/cntv-babel-transform@v1
    with:
      channel: ${{ matrix.channel }}
      platform: ${{ matrix.platform }}
      build-path: "./dist/platformBuilds"
```

## Integration with Connected TV Apps

This action is designed to work seamlessly with the [DutchChannels/connected-tv-apps](https://github.com/DutchChannels/connected-tv-apps) repository.

### Setup in connected-tv-apps

Add this workflow file to `.github/workflows/deploy.yml` in your connected-tv-apps repository:

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
```

### Expected Directory Structure

The action expects your build output to follow this structure:

```
platformBuilds/
├── lov_tizen/
│   └── build/
│       └── static/
│           └── js/
│               └── main.[hash].js
└── nfn_tizen/
    └── build/
        └── static/
            └── js/
                └── main.[hash].js
```

## How it Works

1. **Finds the main JS file**: Looks for files matching pattern `main.[hash].js`
2. **Transpiles with Babel**: Uses `@babel/preset-env` for compatibility
3. **Replaces CDN URLs**: For Tizen platform, replaces static media paths with CDN URLs
4. **Creates output files**: Updates both the original file and creates `main.js`

## Development

```bash
# Install dependencies
yarn install

# Run tests
yarn test

# Test locally
INPUT_CHANNEL=lov INPUT_PLATFORM=tizen INPUT_BUILD_PATH=./test/fixtures yarn node src/index.js
```

## License

MIT
