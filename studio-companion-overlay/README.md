# Giotto desktop overlay

This Electron app creates a small always-on-top Windows widget and loads the Giotto chat page from the Next.js app in this repository.

## Run locally

1. In a terminal at the repository root, set AI_GATEWAY_API_KEY in the root .env.local file if needed, then start the chatbot:

   corepack pnpm dev

2. In a second terminal, open this folder and start the overlay:

   cd studio-companion-overlay
   
   npm.cmd install
   
   npm.cmd start

Keep both terminals open while using Giotto. The overlay loads http://localhost:3000, so the Next.js app must be running first.

Keep the real API key in the repository root .env.local. Do not put it in this folder or commit it. The root .gitignore should keep .env.local out of Git.

## Main files

- index.html contains the widget shell and the embedded chat page.
- main.cjs creates the Electron window, keeps it on screen, and handles its size.
- preload.cjs exposes a small, restricted bridge for the widget controls.
- renderer.js handles the open, collapse, and quit buttons.

This is a local development prototype, not a Windows installer.