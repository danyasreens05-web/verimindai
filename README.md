# verimindai

A small React + TypeScript + Vite app that demonstrates a basic UI with a counter button and links to documentation.

## 1. Information about the project

This project is a starter application built with Vite, React, and TypeScript. It includes a single page app rendered from `src/App.tsx`, with styles in `src/App.css` and `src/index.css`.

## 2. Use and purpose

This project is a lightweight React demo app and a starter template for building a UI. It can be used as the foundation for a system that takes user input, shows output, and analyzes generated responses.

The app output includes:

- a hero section with image overlays for React, Vite, and a hero graphic
- a title heading and a short instruction paragraph
- a button counter that updates the displayed count when clicked
- documentation links to Vite and React
- social links to GitHub, Discord, X, and Bluesky

Example workflow for input and analysis:

1. The user opens the app and provides input or a prompt through the interface.
2. The app renders the output in the main UI section, showing the current result and page elements.
3. An analyzer component inspects the output to detect AI hallucinations or inconsistent responses.
4. The analyzer highlights any suspect content and generates a summary of the findings.
5. The summary gives the user a concise overview of the project output and any detected issues.

It shows how `src/main.tsx` mounts the React app, how `src/App.tsx` renders page elements, and how state updates work with the counter button.

## 3. How to run the project

- `npm run dev` — run the project locally with live reload.
- `npm run build` — create a production build.
- `npm run preview` — preview the production build locally.
- `npm run lint` — check code quality with ESLint.

### Build and preview

```bash
npm run build
npm run preview
```

