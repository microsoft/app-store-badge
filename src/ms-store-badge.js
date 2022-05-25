"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _MSStoreBadge_languageDetails, _MSStoreBadge_env, _MSStoreBadge_iframeLocation, _MSStoreBadge_imagesLocation, _MSStoreBadge_platformDetails;
/**
 * <ms-store-badge> web component
 *
 * The app badge renders and iframe hosted on a domain whitelisted by Microsoft Edge so that users avoid
 * the browser security pop-up asking to launch another apps. Browsers other than Edge will show the
 * security pop-up.
 *
 * On non-Windows 10+ machines, it will simply display an href with an image to redirect to the Web PDP
 */
class MSStoreBadge extends HTMLElement {
    constructor() {
        super();
        /**
         * The ID of your app.
         */
        this.productId = "";
        /**
         * The optional campaign ID of your app.
         */
        this.cid = "";
        /**
          * Indicates whether popup or full mode should be launched.
          */
        this.popup = "";
        /**
          * Indicates whether badge should be in dark mode or light mode.
          */
        this.darkMode = "";
        /**
         * Sets the size of the badge. Should be "small" or "large"
         */
        this.size = "large";
        /**
         * Sets the language. If null or omitted, the language will be auto-detected from the user's browser language.
         */
        this.language = "";
        _MSStoreBadge_languageDetails.set(this, MSStoreBadge.englishLanguage);
        _MSStoreBadge_env.set(this, window.__rollup_injected_env || "dev");
        _MSStoreBadge_iframeLocation.set(this, __classPrivateFieldGet(this, _MSStoreBadge_env, "f") === "dev" ? "iframe.html" : "https://get.microsoft.com/iframe.html");
        _MSStoreBadge_imagesLocation.set(this, __classPrivateFieldGet(this, _MSStoreBadge_env, "f") === "dev" ? "/images" : "https://getbadgecdn.azureedge.net/images");
        _MSStoreBadge_platformDetails.set(this, { isWindows: false, windowsVersion: null, isEdgeBrowser: false });
        // Create our state.
        this.getPlatformDetails().then(details => __classPrivateFieldSet(this, _MSStoreBadge_platformDetails, details, "f"));
        __classPrivateFieldSet(this, _MSStoreBadge_languageDetails, MSStoreBadge.getSupportedLanguageFromCode(this.language), "f");
        this.language = __classPrivateFieldGet(this, _MSStoreBadge_languageDetails, "f").code;
        // Create our HTML elements.
        const shadow = this.attachShadow({ mode: "open" });
        const style = this.createStyle();
        const html = this.createHtml();
        shadow.appendChild(style);
        shadow.appendChild(html);
    }
    updateImageSrc() {
        var _a;
        const img = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("img");
        if (img) {
            img.setAttribute("src", this.getImageSource());
            img.className = this.getImageClass();
        }
    }
    // Web component lifecycle callback: component added to DOM
    connectedCallback() {
    }
    // Web component lifecycle callback: register that we want to observe certain attributes.
    static get observedAttributes() {
        return [
            "productid",
            "cid",
            "popup",
            "darkmode",
            "size",
            "language"
        ];
    }
    // Web component lifecycle callback: when an observed attribute changes.
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "size" && (newValue === "large" || newValue === "small") && oldValue !== newValue) {
            this.size = newValue;
            this.updateImageSrc();
        }
        else if (name === "language" && newValue !== oldValue && (typeof newValue === "string" || !newValue)) {
            __classPrivateFieldSet(this, _MSStoreBadge_languageDetails, MSStoreBadge.getSupportedLanguageFromCode(newValue), "f");
            this.language = __classPrivateFieldGet(this, _MSStoreBadge_languageDetails, "f").code;
            this.updateImageSrc();
        }
        else if (name === "productid" && newValue !== oldValue && typeof newValue === "string") {
            this.productId = newValue;
        }
        else if (name === "cid" && newValue !== oldValue && typeof newValue === "string") {
            this.cid = newValue;
        }
        else if (name === "popup" && newValue !== oldValue && typeof newValue === "string") {
            this.popup = newValue;
        }
        else if (name === "darkmode" && newValue !== oldValue && typeof newValue === "string") {
            this.darkMode = newValue;
        }
    }
    createStyle() {
        const styleString = `
      :host {
        display: inline-block;
        cursor: pointer;
        height: fit-content;
      }

      iframe {
        border: none;
        width: 0px;
        height: 0px;
      }

      img {
        width: auto;
        border-radius: 8px;
      }

      img.small {
        max-height: 52px;
      }

      img.large {
        max-height: 104px;
      }
    `;
        const element = document.createElement("style");
        element.textContent = styleString;
        return element;
    }
    createHtml() {
        const container = document.createElement("div");
        container.appendChild(this.createImage());
        container.appendChild(this.createIFrame());
        return container;
    }
    async getPlatformDetails() {
        // Use client hints if available.
        // Typescript doesn't yet have support for typing this.
        const navigatorAny = navigator;
        if (navigatorAny.userAgentData && navigatorAny.userAgentData.getHighEntropyValues) {
            try {
                const platformDetails = await navigatorAny.userAgentData.getHighEntropyValues(["platform", "platformVersion"]);
                const isWindows = platformDetails.platform === "Windows";
                const version = isWindows ? parseFloat((platformDetails === null || platformDetails === void 0 ? void 0 : platformDetails.platformVersion) || "") : null;
                return {
                    isWindows: isWindows,
                    windowsVersion: version,
                    isEdgeBrowser: (navigatorAny.userAgentData.brands || []).some((b) => b.brand === "Microsoft Edge")
                };
            }
            catch (error) {
                // Eat the error. We'll try our fallback below.
            }
        }
        // Fallback: use navigator.userAgent
        const windowsUserAgentRegex = new RegExp(/.?Windows NT (\d+\.?\d?\.?\d?\.?\d?)/gi);
        const matchResults = windowsUserAgentRegex.exec(navigator.userAgent);
        if (matchResults && matchResults.length >= 2) {
            return {
                isWindows: true,
                windowsVersion: parseFloat(matchResults[1]),
                isEdgeBrowser: !!navigator.userAgent.match("Edg/")
            };
        }
        // Some other platform besides Windows.
        return {
            isWindows: false,
            windowsVersion: null,
            isEdgeBrowser: !!navigator.userAgent.match("Edg/")
        };
    }
    static getSupportedLanguageFromCode(languageCode) {
        // If language code isn't set, auto-detect
        if (!languageCode) {
            return MSStoreBadge.getSupportedLanguageFromUserAgent();
        }
        // See if the language code is a supported language.
        const supportedLanguage = MSStoreBadge.supportedLanguages.find(l => l.code === languageCode.toLowerCase());
        if (supportedLanguage) {
            return supportedLanguage;
        }
        // Language code is unsupported. Fallback to English.
        return MSStoreBadge.englishLanguage;
    }
    static getSupportedLanguageFromUserAgent() {
        // Is the navigator language one of our supported languages? If so, use that.
        const navigatorLanguage = MSStoreBadge.supportedLanguages.find(l => l.name === navigator.language);
        if (navigatorLanguage) {
            return navigatorLanguage;
        }
        // No dice on the navigator language.
        // See if any of the navigator languages are supported.
        if (navigator.languages) {
            var match = navigator.languages
                .map(lang => MSStoreBadge.supportedLanguages.find(l => l.code === lang))
                .find(l => !!l);
            if (match) {
                return match;
            }
        }
        // Couldn't find any language support.
        // See if we have the language string ("en") rather than language-culture string ("en-us")
        const dashIndex = navigator.language.indexOf("-");
        if (dashIndex > 0) {
            const languageOnly = navigator.language.substring(0, dashIndex);
            const supportedLanguage = MSStoreBadge.supportedLanguages.find(l => l.name === languageOnly);
            if (supportedLanguage) {
                return supportedLanguage;
            }
        }
        // All else fails, go to English
        return MSStoreBadge.englishLanguage;
    }
    createIFrame() {
        const iframe = document.createElement("iframe");
        iframe.setAttribute("loading", "eager");
        iframe.title = "Microsoft Store App Badge";
        iframe.src = __classPrivateFieldGet(this, _MSStoreBadge_iframeLocation, "f");
        return iframe;
    }
    createImage() {
        const image = document.createElement("img");
        image.setAttribute("part", "img");
        image.src = this.getImageSource();
        image.className = this.getImageClass();
        image.alt = "Microsoft Store app badge";
        image.addEventListener("click", (e) => this.launchApp(e));
        return image;
    }
    getImageSource() {
        var fileName = null;
        //Dark mode
        if (this.darkMode === "true") {
            fileName = this.size === "large" ?
                __classPrivateFieldGet(this, _MSStoreBadge_languageDetails, "f").imageLarge.fileName :
                __classPrivateFieldGet(this, _MSStoreBadge_languageDetails, "f").imageSmall.fileName;
        }
        //Light mode
        else if (this.darkMode === "") {
            fileName = this.size === "large" ?
                __classPrivateFieldGet(this, _MSStoreBadge_languageDetails, "f").imageLargeLight.fileName :
                __classPrivateFieldGet(this, _MSStoreBadge_languageDetails, "f").imageSmallLight.fileName;
        }
        //Auto mode
        else if (this.darkMode === "auto") {
            const isDark = window.matchMedia('(prefers-color-scheme:dark)').matches;
            if (isDark) { //If detected dark mode
                fileName = this.size === "large" ?
                    __classPrivateFieldGet(this, _MSStoreBadge_languageDetails, "f").imageLarge.fileName :
                    __classPrivateFieldGet(this, _MSStoreBadge_languageDetails, "f").imageSmall.fileName;
                console.log("dark");
            }
            else { //If detected light mode
                fileName = this.size === "large" ?
                    __classPrivateFieldGet(this, _MSStoreBadge_languageDetails, "f").imageLargeLight.fileName :
                    __classPrivateFieldGet(this, _MSStoreBadge_languageDetails, "f").imageSmallLight.fileName;
                console.log("light");
            }
        }
        return `${__classPrivateFieldGet(this, _MSStoreBadge_imagesLocation, "f")}/${fileName}`;
    }
    getImageClass() {
        return this.size === "large" ? "large" : "small";
    }
    launchApp(e) {
        if (!this.productId) {
            return;
        }
        if (__classPrivateFieldGet(this, _MSStoreBadge_platformDetails, "f").isWindows && __classPrivateFieldGet(this, _MSStoreBadge_platformDetails, "f").isEdgeBrowser) {
            // Are we on Edge on Windows? Launch the mini PDP via the iframe hosted on Edge's whitelisted domain.
            this.launchStoreAppPdpViaWhitelistedDomain();
        }
        else if (__classPrivateFieldGet(this, _MSStoreBadge_platformDetails, "f").isWindows) {
            // We're on some other browser on Windows. Launch via ms-store-app:// protocol.
            this.launchStoreAppPdp();
        }
        else {
            // We're not on Windows so we can't launch the app. Navigate to the web PDP.
            this.launchStoreWebPdp(e);
        }
    }
    launchStoreAppPdp() {
        const appLaunchUrl = "ms-windows-store://pdp/" +
            "?productid=" + this.productId +
            "&cid=" + this.cid +
            (this.popup === "true" ? "&mode=mini&pos=" : "&pos=") + Math.floor(window.screenLeft * window.devicePixelRatio) +
            "," + Math.floor(window.screenTop * window.devicePixelRatio) +
            "," + Math.floor(window.outerWidth * window.devicePixelRatio) +
            "," + Math.floor(window.outerHeight * window.devicePixelRatio);
        location.href = appLaunchUrl;
    }
    launchStoreAppPdpViaWhitelistedDomain() {
        var _a, _b;
        if (this.popup === "") {
            this.launchStoreAppPdp();
        }
        else {
            const iframe = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("iframe");
            if (iframe) {
                const args = {
                    message: "launch",
                    productId: this.productId
                };
                (_b = iframe.contentWindow) === null || _b === void 0 ? void 0 : _b.postMessage(args, "*");
            }
        }
    }
    launchStoreWebPdp(e) {
        const url = `https://apps.microsoft.com/store/detail/${this.productId}?cid=${this.cid}`;
        if (e.ctrlKey) {
            window.open(url, "_blank");
        }
        else {
            window.location.href = url;
        }
    }
    static createSupportedLanguages() {
        return [
            { name: "Arabic", code: "ar", imageSmall: { fileName: "Arabic_S.png" }, imageSmallLight: { fileName: "English_SL.jpg" }, imageLarge: { fileName: "Arabic_L.png" }, imageLargeLight: { fileName: "English_LL.jpg" } },
            { name: "Bosnian", code: "be", imageSmall: { fileName: "Bosnian_S.png" }, imageSmallLight: { fileName: "English_SL.jpg" }, imageLarge: { fileName: "Bosnian_L.png" }, imageLargeLight: { fileName: "English_LL.jpg" } },
            { name: "Bengali", code: "bn", imageSmall: { fileName: "Bengali_S.png" }, imageSmallLight: { fileName: "English_SL.jpg" }, imageLarge: { fileName: "Bengali_L.png" }, imageLargeLight: { fileName: "English_LL.jpg" } },
            { name: "Bosnian", code: "bs", imageSmall: { fileName: "Bosnian_S.png" }, imageSmallLight: { fileName: "English_SL.jpg" }, imageLarge: { fileName: "Bosnian_L.png" }, imageLargeLight: { fileName: "English_LL.jpg" } },
            { name: "Bulgarian", code: "bg", imageSmall: { fileName: "Bulgarian_S.png" }, imageSmallLight: { fileName: "English_SL.jpg" }, imageLarge: { fileName: "Bulgarian_L.png" }, imageLargeLight: { fileName: "English_LL.jpg" } },
            { name: "Chinese (Simplified)", code: "zh-cn", imageSmall: { fileName: "Chinese_Simplified_S.png" }, imageSmallLight: { fileName: "English_SL.jpg" }, imageLarge: { fileName: "Chinese_Simplified_L.png" }, imageLargeLight: { fileName: "English_LL.jpg" } },
            { name: "Chinese (Traditional)", code: "zh-tw", imageSmall: { fileName: "Chinese_Traditional_S.png" }, imageSmallLight: { fileName: "English_SL.jpg" }, imageLarge: { fileName: "Chinese_Traditional_L.png" }, imageLargeLight: { fileName: "English_LL.jpg" } },
            { name: "Croatian", code: "hr", imageSmall: { fileName: "Croatian_S.png" }, imageSmallLight: { fileName: "English_SL.jpg" }, imageLarge: { fileName: "Croatian_L.png" }, imageLargeLight: { fileName: "English_LL.jpg" } },
            { name: "Czech", code: "cs", imageSmall: { fileName: "Czech_S.png" }, imageSmallLight: { fileName: "English_SL.jpg" }, imageLarge: { fileName: "Czech_L.png" }, imageLargeLight: { fileName: "English_LL.jpg" } },
            { name: "Danish", code: "da", imageSmall: { fileName: "Danish_S.png" }, imageSmallLight: { fileName: "English_SL.jpg" }, imageLarge: { fileName: "Danish_L.png" }, imageLargeLight: { fileName: "English_LL.jpg" } },
            { name: "Dutch", code: "nl", imageSmall: { fileName: "Dutch_S.png" }, imageSmallLight: { fileName: "English_SL.jpg" }, imageLarge: { fileName: "Dutch_L.png" }, imageLargeLight: { fileName: "English_LL.jpg" } },
            MSStoreBadge.englishLanguage,
            { name: "Estonian", code: "et", imageSmall: { fileName: "Estonian_S.png" }, imageSmallLight: { fileName: "English_SL.jpg" }, imageLarge: { fileName: "Estonian_L.png" }, imageLargeLight: { fileName: "English_LL.jpg" } },
            { name: "Filipino", code: "fil", imageSmall: { fileName: "Filipino_S.png" }, imageSmallLight: { fileName: "English_SL.jpg" }, imageLarge: { fileName: "Filipino_L.png" }, imageLargeLight: { fileName: "English_LL.jpg" } },
            { name: "Finnish", code: "fi", imageSmall: { fileName: "Finnish_S.png" }, imageSmallLight: { fileName: "English_SL.jpg" }, imageLarge: { fileName: "Finnish_L.png" }, imageLargeLight: { fileName: "English_LL.jpg" } },
            { name: "French", code: "fr", imageSmall: { fileName: "French_S.png" }, imageSmallLight: { fileName: "English_SL.jpg" }, imageLarge: { fileName: "French_L.png" }, imageLargeLight: { fileName: "English_LL.jpg" } },
            { name: "German", code: "de", imageSmall: { fileName: "German_S.png" }, imageSmallLight: { fileName: "English_SL.jpg" }, imageLarge: { fileName: "German_L.png" }, imageLargeLight: { fileName: "English_LL.jpg" } },
            { name: "Greek", code: "el", imageSmall: { fileName: "Greek_S.png" }, imageSmallLight: { fileName: "English_SL.jpg" }, imageLarge: { fileName: "Greek_L.png" }, imageLargeLight: { fileName: "English_LL.jpg" } },
            { name: "Hebrew", code: "he", imageSmall: { fileName: "Hebrew_S.png" }, imageSmallLight: { fileName: "English_SL.jpg" }, imageLarge: { fileName: "Hebrew_L.png" }, imageLargeLight: { fileName: "English_LL.jpg" } },
            { name: "Hindi", code: "hi", imageSmall: { fileName: "Hindi_S.png" }, imageSmallLight: { fileName: "English_SL.jpg" }, imageLarge: { fileName: "Hindi_L.png" }, imageLargeLight: { fileName: "English_LL.jpg" } },
            { name: "Hungarian", code: "hu", imageSmall: { fileName: "Hungarian_S.png" }, imageSmallLight: { fileName: "English_SL.jpg" }, imageLarge: { fileName: "Hungarian_L.png" }, imageLargeLight: { fileName: "English_LL.jpg" } },
            { name: "Indonesian", code: "id", imageSmall: { fileName: "Indonesian_S.png" }, imageSmallLight: { fileName: "English_SL.jpg" }, imageLarge: { fileName: "Indonesian_L.png" }, imageLargeLight: { fileName: "English_LL.jpg" } },
            { name: "Italian", code: "it", imageSmall: { fileName: "Italian_S.png" }, imageSmallLight: { fileName: "English_SL.jpg" }, imageLarge: { fileName: "Italian_L.png" }, imageLargeLight: { fileName: "English_LL.jpg" } },
            { name: "Japanese", code: "ja", imageSmall: { fileName: "Japanese_S.png" }, imageSmallLight: { fileName: "English_SL.jpg" }, imageLarge: { fileName: "Japanese_L.png" }, imageLargeLight: { fileName: "English_LL.jpg" } },
            { name: "Korean", code: "ko", imageSmall: { fileName: "Korean_S.png" }, imageSmallLight: { fileName: "English_SL.jpg" }, imageLarge: { fileName: "Korean_L.png" }, imageLargeLight: { fileName: "English_LL.jpg" } },
            { name: "Latvian", code: "lv", imageSmall: { fileName: "Latvian_S.png" }, imageSmallLight: { fileName: "English_SL.jpg" }, imageLarge: { fileName: "Latvian_L.png" }, imageLargeLight: { fileName: "English_LL.jpg" } },
            { name: "Lithuanian", code: "lt", imageSmall: { fileName: "Lithuanian_S.png" }, imageSmallLight: { fileName: "English_SL.jpg" }, imageLarge: { fileName: "Lithuanian_L.png" }, imageLargeLight: { fileName: "English_LL.jpg" } },
            { name: "Malay", code: "ms", imageSmall: { fileName: "Malay_S.png" }, imageSmallLight: { fileName: "English_SL.jpg" }, imageLarge: { fileName: "Malay_L.png" }, imageLargeLight: { fileName: "English_LL.jpg" } },
            { name: "Norwegian", code: "no", imageSmall: { fileName: "Norwegian_S.png" }, imageSmallLight: { fileName: "English_SL.jpg" }, imageLarge: { fileName: "Norwegian_L.png" }, imageLargeLight: { fileName: "English_LL.jpg" } },
            { name: "Polish", code: "pl", imageSmall: { fileName: "Polish_S.png" }, imageSmallLight: { fileName: "English_SL.jpg" }, imageLarge: { fileName: "Polish_L.png" }, imageLargeLight: { fileName: "English_LL.jpg" } },
            { name: "Portuguese (Brazil)", code: "pt-br", imageSmall: { fileName: "Portuguese_Brazil_S.png" }, imageSmallLight: { fileName: "English_SL.jpg" }, imageLarge: { fileName: "Portuguese_Brazil_L.png" }, imageLargeLight: { fileName: "English_LL.jpg" } },
            { name: "Portuguese (Portugal)", code: "pt", imageSmall: { fileName: "Portuguese_Portugal_S.png" }, imageSmallLight: { fileName: "English_SL.jpg" }, imageLarge: { fileName: "Portuguese_Portugal_L.png" }, imageLargeLight: { fileName: "English_LL.jpg" } },
            { name: "Romanian", code: "ro", imageSmall: { fileName: "Romanian_S.png", }, imageSmallLight: { fileName: "English_SL.jpg" }, imageLarge: { fileName: "Romanian_L.png" }, imageLargeLight: { fileName: "English_LL.jpg" } },
            { name: "Russian", code: "ru", imageSmall: { fileName: "Russian_S.png" }, imageSmallLight: { fileName: "English_SL.jpg" }, imageLarge: { fileName: "Russian_L.png" }, imageLargeLight: { fileName: "English_LL.jpg" } },
            { name: "Serbian", code: "sr", imageSmall: { fileName: "Serbian_S.png" }, imageSmallLight: { fileName: "English_SL.jpg" }, imageLarge: { fileName: "Serbian_L.png" }, imageLargeLight: { fileName: "English_LL.jpg" } },
            { name: "Slovak", code: "sk", imageSmall: { fileName: "Slovak_S.png" }, imageSmallLight: { fileName: "English_SL.jpg" }, imageLarge: { fileName: "Slovak_L.png" }, imageLargeLight: { fileName: "English_LL.jpg" } },
            { name: "Slovenian", code: "sl", imageSmall: { fileName: "Slovenian_S.png" }, imageSmallLight: { fileName: "English_SL.jpg" }, imageLarge: { fileName: "Slovenian_L.png" }, imageLargeLight: { fileName: "English_LL.jpg" } },
            { name: "Spanish", code: "es", imageSmall: { fileName: "Spanish_S.png" }, imageSmallLight: { fileName: "English_SL.jpg" }, imageLarge: { fileName: "Spanish_L.png" }, imageLargeLight: { fileName: "English_LL.jpg" } },
            { name: "Swahili", code: "sw", imageSmall: { fileName: "Swahili_S.png" }, imageSmallLight: { fileName: "English_SL.jpg" }, imageLarge: { fileName: "Swahili_L.png" }, imageLargeLight: { fileName: "English_LL.jpg" } },
            { name: "Swedish", code: "sv", imageSmall: { fileName: "Swedish_S.png" }, imageSmallLight: { fileName: "English_SL.jpg" }, imageLarge: { fileName: "Swedish_L.png" }, imageLargeLight: { fileName: "English_LL.jpg" } },
            { name: "Thai", code: "th", imageSmall: { fileName: "Thai_S.png" }, imageSmallLight: { fileName: "English_SL.jpg" }, imageLarge: { fileName: "Thai_L.png" }, imageLargeLight: { fileName: "English_LL.jpg" } },
            { name: "Turkish", code: "tr", imageSmall: { fileName: "Turkish_S.png" }, imageSmallLight: { fileName: "English_SL.jpg" }, imageLarge: { fileName: "Turkish_L.png" }, imageLargeLight: { fileName: "English_LL.jpg" } },
            { name: "Ukranian", code: "uk", imageSmall: { fileName: "Ukranian_S.png" }, imageSmallLight: { fileName: "English_SL.jpg" }, imageLarge: { fileName: "Ukranian_L.png" }, imageLargeLight: { fileName: "English_LL.jpg" } },
            { name: "Vietnamese", code: "vi", imageSmall: { fileName: "Vietnamese_S.png" }, imageSmallLight: { fileName: "English_SL.jpg" }, imageLarge: { fileName: "Vietnamese_L.png" }, imageLargeLight: { fileName: "English_LL.jpg" } }
        ];
    }
}
_MSStoreBadge_languageDetails = new WeakMap(), _MSStoreBadge_env = new WeakMap(), _MSStoreBadge_iframeLocation = new WeakMap(), _MSStoreBadge_imagesLocation = new WeakMap(), _MSStoreBadge_platformDetails = new WeakMap();
MSStoreBadge.englishLanguage = { name: "English", code: "en", imageSmall: { fileName: "English_S.png", }, imageSmallLight: { fileName: "English_SL.jpg" }, imageLarge: { fileName: "English_L.png" }, imageLargeLight: { fileName: "English_LL.jpg" } };
MSStoreBadge.supportedLanguages = MSStoreBadge.createSupportedLanguages();
customElements.define("ms-store-badge", MSStoreBadge);
//# sourceMappingURL=ms-store-badge.js.map