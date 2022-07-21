# App Store Badge

This repository contains the source code for web component that displays the "Get this app on the Microsoft Store" badge.

## Usage

Generate your own app badge using https://apps.microsoft.com/store/app-badge/

Alternately, add the following code in your HTML where you want the button to appear:

```html
<script type="module" src="https://getbadgecdn.azureedge.net/ms-store-badge.bundled.js"></script>
<ms-store-badge productid="9wzdncrfhvjl" size="large"></ms-store-badge>
```

The component has some additional configuration options:

| Option         | Type     | Default value | Description |
|--------------|-----------|------------|------------|
| productid | string  | undefined | Your app ID in the Microsoft Store. You can find this value by going to your URL in the Microsoft Web Store and grabbing the last part of the URL. For OneNote, for example, the web link is https://www.microsoft.com/en-us/p/onenote-for-windows-10/9wzdncrfhvjl, so OneNote's product ID is `9wzdncrfhvjl` |
| cid | string | undefined | Your app campaign code for analytics purposes. |
| window-mode | "popup" or "full" | "popup" | Configure the badge to open your app in popup store mode or full store mode respectively. |
| theme | "dark" or "light" or "auto" | "dark" | Configure the badge theme to be in dark mode, light mode, or auto mode respectively. |
| size | "large" or "small"  | "large" | small:<br>![image](https://user-images.githubusercontent.com/312936/135373704-9e786838-d75e-4962-bcf1-255b88de67b5.png)<br>large:<br> ![image](https://user-images.githubusercontent.com/312936/135373726-0eda0945-7d6d-413d-8af4-70e812509cf5.png)  |
| language | string | '' | The language to display the install button in. If left empty, the language will be detected from the user's browser `navigator.userAgent.language`. <br>Sample of specifying a different language:<br>![image](https://user-images.githubusercontent.com/312936/135659926-cafb666a-15ca-4129-a623-59e89a8ab7ea.png) |

Example using all the available options:

```html
<script type="module" src="https://getbadgecdn.azureedge.net/ms-store-badge.bundled.js"></script>
<ms-store-badge productid="9wzdncrfhvjl" size="small" language="he"></ms-store-badge>
```

## Styling the badge

To style the app badge web component, use [CSS parts](https://developer.mozilla.org/en-US/docs/Web/CSS/::part) to style the badge image. Specifically the app badge web component exposes the badge image as `img` part:

```css
/* Customize the badge's appearance */
ms-store-badge::part(img) {
    max-height: 52px;
    border-radius: 2px;
}
```

## Why a web component?

Most app store badges are a simple image with a link to the web store. Why is this a web component?

In short, for better localization and better user experience.

- **Localization**: the web component supports automatic detection of the user's locale, showing a localized button to the user based on the user's browser locale.
- **Fewer security prompts**: if the user is on Edge on Windows, no browser security prompt ("this site is trying to launch Microsoft Store") is shown. 
- **MiniPDP**: Where supported, when a user who clicks your app badge on Windows, instead of launching the full Store app, they'll get a mini popup dialog (mini product description page, or miniPDP) centered within the page, allowing for inline install. The user doesn't lose context. Here's what it looks like: <br>
![miniPDP for Discord app](https://user-images.githubusercontent.com/312936/180301318-fa183964-48cc-4624-82ad-18ff12bc9b96.png)
- **Better behavior on other OSes**: If the user is on MacOS or other non-Windows OS and they click your app badge, instead of trying (and failing) to launch the Microsoft Store app or MiniPDP, it instead launches the OS's native share dialog, allowing the user to share the link to your app.

## HTML-only

Can't use the app badge web component? For places like Github markdown or other contexts without Javascript, you can use an image with link:

```html
<!-- display an HTML-only app badge. Useful when you can't execute JS, such as in Github markdown pages -->
<a href="ms-windows-store://pdp/?ProductId=XPDC2RH70K22MN&mode=mini">
   <img src="https://getbadgecdn.azureedge.net/images/English_L.png" alt="Download Discord" />
</a>
```

## Running the code

To run code locally, `npm run dev`, then launch http://localhost:8000/create-your-own.html

To build for production, `npm run build`. This will create the production artifacts in `/dist`.

## Deploying

Github actions are set to deploy successful builds of main to the app badge CDN.
