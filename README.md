# OMNIPOST

Post to multiple social media platforms simultaneously from one place.

## What is OmniPost?

OmniPost is a web application that streamlines posting content across multiple social media platforms. Write your content once and post to X/Twitter, LinkedIn, Threads, and Bluesky all at the same time.

### Features

- **Multi-Platform Support** → Post to X/Twitter, LinkedIn, Threads, and Bluesky
- **Unified Mode** → Write one post that goes to all selected platforms
- **Custom Mode** → Customize content for each platform individually
- **Character Limit Tracking** → See remaining characters for each platform
- **Error Prevention** → Visual warnings when exceeding platform limits
- **One-Click Posting** → Post to all selected platforms with a single click

### Supported Platforms

- **X / Twitter** (280 characters)
- **LinkedIn** (3000 characters)
- **Threads** (500 characters)
- **Bluesky** (300 characters)

## Setup

Clone the repository and install dependencies:

```sh
npm install
npm run dev
```

Go to `http://localhost:10000` in your browser.

## How It Works

1. Select the platforms you want to post to
2. Choose your mode:
   - **Same** → Write one post for all platforms
   - **Custom** → Write unique content for each platform
3. Compose your content (character limits are tracked in real-time)
4. Click **Post** to open posting dialogs for each platform

**Note:** You must be logged in to each platform in your browser for posting to work.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- SASS

## Credits

Created by [Louanne Murphy](https://x.com/louannemmurphy)

Components by [Sacred Computer](https://www.sacred.computer)
