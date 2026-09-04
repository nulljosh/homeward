<img src="icon.svg" width="80" style="border-radius:18px">

# Homeward

![version](https://img.shields.io/badge/version-v0.1.0-blue) ![license](https://img.shields.io/badge/license-MIT-green) [![GitHub](https://img.shields.io/badge/GitHub-nulljosh%2Fhomeward-black?logo=github)](https://github.com/nulljosh/homeward)

**Live:** https://homeward.heyitsmejosh.com

A pet goes missing. The neighbourhood should know in minutes, not days.

Homeward is a lost and found board for pets. Post a missing animal or one you've found, with a photo and where you last saw it. Everyone nearby sees it. Web, plus native apps for iOS, Android, macOS and Windows.

## Screenshots

<img src="docs/screenshots/web.png" width="600">
<img src="docs/screenshots/mobile.png" width="200">

## Features

- Post lost or found, with photo and location
- Browse what's near you
- Native apps from one Kotlin Multiplatform codebase in `kmp/`, SwiftUI in `ios/`
- Web on Cloudflare Pages

## Run

```sh
npm install && npm run dev
cd kmp && ./gradlew :composeApp:assembleDebug
```

## License

MIT 2026 Joshua Trommel

## Whitepaper

[Technical whitepaper](WHITEPAPER.md)
