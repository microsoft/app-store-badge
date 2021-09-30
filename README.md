# App Store Badge

This repository contains the source code for web component that displays the "Get this app on the Microsoft Store" badge.

## Why a web component?

Most app store badges are a simple image with a link to the web store.

We use a web component to go a step further: detect if we're on Windows, and if so, delights the user by allowing inline install.

If the badge is running on a non-Windows OS, or a Windows OS older than Windows 10, an image with link to the app in the web Store will be displayed instead.

Inline install is achieved in two ways: 
    1. We use the ms-store:// protocol with the `?minipdp` query string. This instructs the Store to launch a miniature product description page (mini PDP) inline, prompting the user to install.
    2. The web component runs this logic via an iframe hosted on badgedelivery.microsoft.com. This domain is whitelisted by Edge to skip browser launch prompts. Other browsers will still work, but will prompt the user before launching the mini PDP.


## Running the code

To run code locally, `npm run dev`, then launch http://localhost:8000/create-your-own.html

To build for production, `npm run build`. This will create the production artifacts in `/dist`.

## Deploying

Github actions are set to deploy the changes to https://black-water-0eaf5100f.azurestaticapps.net

You will need to manually deploy `/ms-store-badge.bundled.js` to `https://badgedeliverycdn.azureedge.net/ms-store-badge.bundled.js`. (Future work: auto-deploy this to the CDN via Github Actions)