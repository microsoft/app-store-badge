# App Store Badge

This repository contains the source code for web component that displays the "Get this app on the Microsoft Store" badge.

## Usage

Generate your own app badge using https://apps.microsoft.com/store/app-badge/

Alternately, add the following code in your HTML where you want the button to appear:

```html
<script type="module" src="https://get.microsoft.com/badge/ms-store-badge.bundled.js"></script>
<ms-store-badge productid="9wzdncrfhvjl"></ms-store-badge>
```

The component has some additional configuration options:

| Option         | Type     | Default value | Description |
|--------------|-----------|------------|------------|
| productid | string  | undefined | Your app ID in the Microsoft Store. You can find this value by navigating to your app in the [Microsoft Store for Web](https://apps.microsoft.com) and grabbing the last part of the URL. The Discord app, for example, is at [https://apps.microsoft.com/store/detail/discord/XPDC2RH70K22MN](https://apps.microsoft.com/store/detail/discord/XPDC2RH70K22MN), so its product ID is `XPDC2RH70K22MN` |
| productname | string | undefined | Your app product name in the Microsoft Store. This is only used for the default direct method of installation, where your product name will be part of the installer template.
| cid | string | undefined | Your app campaign code for analytics purposes. If the user clicks the app badge, this value will be passed to analytics and will be available to you in your [Microsoft Partner Center](https://partner.microsoft.com/en-us/dashboard/home) reports. |
| window-mode | "direct" or "popup" or "full" | "popup" | Configure the badge to automatically download your app with direct mode, or open your app in popup store mode or full store mode.<br><br>In `popup` mode, users who click your app badge will see the popup store:<br><img src="https://user-images.githubusercontent.com/312936/180301318-fa183964-48cc-4624-82ad-18ff12bc9b96.png" width="400" /><br><br>In `full` mode, users who click your app badge will see full store app:<br><img src="https://user-images.githubusercontent.com/312936/182920385-f39fc676-afd5-43f8-a9f2-284f19b3f93e.png" width="400" />) |
| theme | "dark" or "light" or "auto" | "dark" | Configure the badge theme dark mode, light mode, or auto mode. Auto mode detects the user's dark mode preference and sets the badge theme accordingly.<br><br>`dark` should be used on sites with light backgrounds:<br><img src="https://user-images.githubusercontent.com/312936/182922340-049d097a-dc7e-48b1-ae37-61179885e87d.png" width="200" /><br><br>`light` should be use on sites with dark backgrounds:<br><img src="https://user-images.githubusercontent.com/312936/182922409-17cf675d-24d6-4d9c-b694-96da2a8addf8.png" width="200" /> |
| animation | "on" or "off" | "off" | When `on`, the badge will use an animation and shadow on hover. Alternately, you may build and apply your own animations by adding CSS to the `img` part. See [styling the badge](#styling-the-badge) for more information. |
| language | string | '' | The language to display the app badge. If left empty, the language will be detected from the user's browser `navigator.userAgent.language`. <br>Sample of specifying a different language:<br><img src="https://get.microsoft.com/images/he-il%20dark.svg" width="270" /><br><br><details><summary>See supported languages</summary><ul><li>Afrikaans: "af"</li><li>Arabic: "ar"</li><li>Belarusian: "be"</li><li>Bulgarian: "bg"</li><li>Bengali: "bn"</li><li>Bosnian: "bs"</li><li>Catalan: "ca"</li><li>Chinese (Simplified): "zh-cn"</li><li>Chinese (Traditional): "zh-tw"<li>Czech: "cs"</li><li>Danish: "da"</li><li>Dutch: "nl"</li><li>German: "de"</li><li>Greek: "el"</li><li>English: "en"</li><li>Spanish: "es"</li><li>Estonian: "et"</li><li>Persian: "fa"</li><li>Finnish: "fi"</li><li>Filipino: "fil"</li><li>French: "fr"</li><li>Galician: "gl"</li><li>Hebrew: "he"</li><li>Hindi: "hi"</li><li>Croatian: "hr"</li><li>Hungarian: "hu"</li><li>Indonesian: "id"</li><li>Icelandic: "is"</li><li>Italian: "it"</li><li>Japanese: "ja"</li><li>Georgian: "ka"</li><li>Kazakh: "kk"</li><li>Korean: "ko"</li><li>Lithuanian: "lt"</li><li>Latvian: "lv"</li><li>Malay: "ms"</li><li>Norwegian: "nb"</li><li>Polish: "pl"</li><li>Portuguese (Brazil): "pt-br"</li><li>Portuguese (Portugal): "pt-pt"</li><li>Romanian: "ro"</li><li>Russian: "ru"</li><li>Slovak: "sk"</li><li>Slovenian: "sl"</li><li>Serbian: "sr"</li><li>Swedish: "sv"</li><li>Swahili: "sw"</li><li>Thai: "th"</li><li>Turkish: "tr"</li><li>Ukrainian: "uk"</li><li>Vietnamese: "vi"</li><li>Welsh: "cy"</li></ul></details> |

Example using all the available options:

```html
<script type="module" src="https://get.microsoft.com/badge/ms-store-badge.bundled.js"></script>
<ms-store-badge productid="9wzdncrfhvjl" productname="Placeholder" window-mode="direct" language="he" cid="abc123" theme="light"></ms-store-badge>
```

## Styling the badge

To style the app badge web component, use [CSS parts](https://developer.mozilla.org/en-US/docs/Web/CSS/::part) to style the badge image. Specifically, the app badge web component exposes the badge image as `img` part:

```css
/* Customize the badge's appearance */
ms-store-badge::part(img) {
    max-height: 52px;
}
```

## Why a web component?

Most app store badges are a simple image with a link to the web store. Why is this a web component?

In short, for better localization and better user experience.

- **Localization**: the web component supports automatic detection of the user's locale, showing a localized button to the user based on the user's browser locale.
- **Fewer security prompts**: if the user is on Edge on Windows, no browser security prompt ("this site is trying to launch Microsoft Store") is shown. 
- **popup mode centering**: Where supported, when a user who clicks your app badge on Windows, instead of launching the full Store app, they'll get a mini popup dialog (mini product description page, or miniPDP) centered within the parent page, allowing for inline install. The user doesn't lose context. Here's what it looks like: <br>
![miniPDP for Discord app](https://user-images.githubusercontent.com/312936/180301318-fa183964-48cc-4624-82ad-18ff12bc9b96.png)
- **Better behavior on other OSes**: If the user is on MacOS or other non-Windows OS and they click your app badge, instead of trying (and failing) to launch the Microsoft Store app or MiniPDP, it instead launches the OS's native share dialog, allowing the user to share the link to your app.
- **Automatic theme support**: You can configure your app badge to use automatic theme detection. When `theme="auto"`, the app badge will be themed based on whether the user has [dark mode](https://css-tricks.com/dark-modes-with-css/) enabled.

## HTML-only

While the app badge script is small (about 9k), there are contexts where a script doesn't make sense: Github markdown pages, static sites, or other contexts without Javascript available. For such contexts, you can use a simple image with link:

```html
<!-- display an HTML-only app badge. Useful when you can't execute JS, such as in Github markdown pages -->
<a href="https://apps.microsoft.com/detail/TikTok/9nh2gph4jzs4?mode=direct">
	<img src="https://get.microsoft.com/images/en-us%20dark.svg" width="200"/>
</a>
```

Be mindful that the HTML-only version of the badge loses some functionality of the full badge. For example, automatic theme detection, OS-specific behavior (e.g. launch the Store on Windows, or open the [apps's web Product Description Page](https://apps.microsoft.com/store/detail/chavah-messianic-radio/9NHKJB6LPPTV) on non-Windows OS), localization, and fewer user prompts for Edge users are not available in the HTML-only version of the badge.

## Running the code

To run code locally, `npm run dev`, then launch http://localhost:8000/create-your-own.html

To build for production, `npm run build`. This will create the production artifacts in `/dist`.

## Deploying

Github actions are set to deploy successful builds of main to the app badge CDN.
