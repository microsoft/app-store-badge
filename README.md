# App Store Badge

This repository contains the source code for web component that displays the "Get this app on the Microsoft Store" badge.

## Why a web component?

Most app store badges are a simple image with a link to the web store.

We use a web component to go a step further: detect if we're on Windows, and if so, display a button that launches the Store on Windows using the mini PDP variation of the ms-store:// protocol where enabled.

If the badge is running on a non-Windows OS, or a Windows OS older than Windows 10, an image with link to the app in the web Store will be displayed instead.

Furthermore, when run in Edge, this component lights up further by skipping the "Page wants to launch ms-store://..." message. Instead, it launches the mini PDP for the Store, centered within the host page.

## Running the code

To run code locally, `npm run dev`, then launch http://localhost:8000/create-your-own.html

To build for production, `npm run build`. This will create the production artifacts in `/dist`.

## Deploying

Github actions are set to deploy the changes to https://black-water-0eaf5100f.azurestaticapps.net

You will need to manually deploy `/ms-store-badge.bundled.js` to `https://badgedeliverycdn.azureedge.net/ms-store-badge.bundled.js`. (Future work: auto-deploy this to the CDN via Github Actions)