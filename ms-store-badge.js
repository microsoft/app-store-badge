var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MSStoreBadge_1;
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
const borderRadius = css `8px`;
const smallHeight = 52;
const smallHeightCss = css `${smallHeight}px;`;
const largeHeight = 104;
const largeHeightCss = css `${largeHeight}px`;
/**
 * <ms-store-badge> web component
 *
 * Will try to use the Store App protocol to launch the mini PDP on Windows 10+ via an iframe
 * hosted on a default allowed domain by Edge. It will generate a small security pop-up on Chrome
 * and will work without security pop-up in Firefox
 *
 * On non-Windows 10+ machines, it will simply display a href with an image to redirect to the Web PDP
 */
let MSStoreBadge = MSStoreBadge_1 = class MSStoreBadge extends LitElement {
    constructor() {
        super();
        /**
         * product Id of the Microsoft Store App provided in the Partner Center portal.
         */
        this.productId = '';
        /**
         * language to use for the badge image (en, fr, zh, etc.)
         * if not set, the component will auto detect the browser preferred language
         */
        this.language = '';
        /**
         * Sets the size of the badge. Should be "small" or "large"
         */
        this.size = "large";
        this.languageDetails = MSStoreBadge_1.englishLanguage; // will use the real deal after call to _checkLanguage()
        this.largeBadgeUrl = "https://developer.microsoft.com/store/badges/images/English_get-it-from-MS.png";
        this.smallBadgeUrl = "https://developer.microsoft.com/store/badges/images/English_get_L.png";
        this.iframeLocation = "../src/iframe.html"; // This is for ease of testing. Our rollup build script will change this to the production URL.
        /**
         * Will contain the right url to the Web PDP or Store App protocol using the product ID
        */
        this.hrefValue = '';
        /**
         * Trying to trigger miniPDP only on Windows 10+
        */
        this.miniPDPcompatible = false;
    }
    firstUpdated() {
        this._checkLanguage();
        this._checkPlatform();
    }
    updated() {
        this._checkLanguage();
        this._checkPlatform(); // Needed because if the product ID changed, we need to recalculate this.hrefValue.
    }
    _checkPlatform() {
        // If the OS is Windows 10 or Windows 11 
        if (navigator.userAgent.indexOf("Windows NT 1") !== -1) {
            this.hrefValue = `ms-windows-store://pdp/?ProductId=${this.productId}`;
            this.miniPDPcompatible = true;
        }
        // otherwise, redirect to the Web PDP
        else {
            this.hrefValue = `https://www.microsoft.com/store/apps/${this.productId}?cid=storebadge&ocid=badge`;
        }
    }
    _checkLanguage() {
        // If language isn't set, auto-detect
        if (this.language === '') {
            const detectedLanguage = MSStoreBadge_1.getSupportedLanguageFromUserAgent();
            this.language = detectedLanguage.code;
            this.languageDetails = detectedLanguage;
        }
        else {
            // The user set a specific language on our component. Make sure it's valid.
            const supportedLanguage = MSStoreBadge_1.supportedLanguages.find(l => l.code === this.language.toLowerCase());
            if (supportedLanguage) {
                this.language = supportedLanguage.code;
                this.languageDetails = supportedLanguage;
            }
            else {
                // User set the language to something not supported. Fallback to English.
                this.language = MSStoreBadge_1.englishLanguage.code;
                this.languageDetails = MSStoreBadge_1.englishLanguage;
            }
        }
        this.smallBadgeUrl = `https://developer.microsoft.com/store/badges/images/${this.languageDetails.imageSmall.fileName}`;
        this.largeBadgeUrl = `https://developer.microsoft.com/store/badges/images/${this.languageDetails.imageLarge.fileName}`;
    }
    static getSupportedLanguageFromUserAgent() {
        // Is the navigator language one of our supported languages? If so, use that.
        const navigatorLanguage = MSStoreBadge_1.supportedLanguages.find(l => l.name === navigator.language);
        if (navigatorLanguage) {
            return navigatorLanguage;
        }
        // No dice on the navigator language.
        // See if any of the navigator languages are supported.
        if (navigator.languages) {
            var match = navigator.languages
                .map(lang => MSStoreBadge_1.supportedLanguages.find(l => l.code === lang))
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
            const supportedLanguage = MSStoreBadge_1.supportedLanguages.find(l => l.name === languageOnly);
            if (supportedLanguage) {
                return supportedLanguage;
            }
        }
        // All else fails, go to English
        return MSStoreBadge_1.englishLanguage;
    }
    render() {
        // Component height are static.
        // However, widths are dependent on the aspect ratio of the image.
        const componentHeight = this.size === "large" ? largeHeight : smallHeight;
        const componentWidth = Math.round(componentHeight * (this.size === "large" ? this.languageDetails.imageLarge.aspectRatio : this.languageDetails.imageSmall.aspectRatio));
        if (this.miniPDPcompatible) {
            return this.renderIFrame(componentWidth, componentHeight);
        }
        // We can't launch the Store; we may be on a different OS.
        // Render the image that links to the web store.
        return this.renderImage(componentWidth, componentHeight);
    }
    renderIFrame(width, height) {
        const imageUrl = this.size === "large" ? this.largeBadgeUrl : this.smallBadgeUrl;
        return html `
      <div class="iframe-container ${this.size}">
        <iframe width="${width}" height="${height}" frameborder="0" scrolling="no"
          src='${this.iframeLocation}?productId=${this.productId}&amp;language=${this.language}&amp;size=${this.size}&amp;imgUrl=${imageUrl}&amp;targetUrl=${this.hrefValue}'>
        </iframe>
      </div>`;
    }
    renderImage(width, height) {
        const badgeUrl = this.size === "large" ? this.largeBadgeUrl : this.smallBadgeUrl;
        return html `<a href="${this.hrefValue}" target="_blank">
  <img width="${width}" height="${height}" src="${badgeUrl}" alt="Microsoft Store badge logo" />
</a>`;
    }
};
MSStoreBadge.styles = css `
    :host {
      display: block;
      padding: 0;
      margin: 0;
    }

    iframe {
      border: none;
    }

    img {
      /* When rendering the image, rather than the iframe, add a border radius.  */
      border-radius: ${borderRadius};
    }

    .iframe-container {
      /* To simulate our iframe having a border radius, we use this technique: https://stackoverflow.com/a/36110063/536 */
      border-radius: ${borderRadius};
      transform: translateZ(0px);
      display: inline-block;
      overflow: hidden;
    }

      .iframe-container.small {
        height: ${smallHeightCss};
      }

      .iframe-container.large {
        height: ${largeHeightCss}
      }
  `;
MSStoreBadge.englishLanguage = { name: "English", code: "en", imageSmall: { fileName: "English_get_L.png", aspectRatio: 2.5 }, imageLarge: { fileName: "English_get-it-from-MS.png", aspectRatio: 2.769 } };
MSStoreBadge.supportedLanguages = [
    { name: "Arabic", code: "ar", imageSmall: { fileName: "Arabic_get_L.png", aspectRatio: 3.458 }, imageLarge: { fileName: "Arabic_get_it_from_MS.png", aspectRatio: 2.769 } },
    { name: "Bosnian", code: "be", imageSmall: { fileName: "Bosnian_get_L.png", aspectRatio: 4.369 }, imageLarge: { fileName: "Bosnian_get-it-from-MS.png", aspectRatio: 2.769 } },
    { name: "Bengali", code: "bn", imageSmall: { fileName: "Bengali_get_L.png", aspectRatio: 2.5 }, imageLarge: { fileName: "Bengali_get-it-from-MS.png", aspectRatio: 2.769 } },
    { name: "Bosnian", code: "bn", imageSmall: { fileName: "Bosnian_get_L.png", aspectRatio: 4.369 }, imageLarge: { fileName: "Bosnian_get-it-from-MS.png", aspectRatio: 2.769 } },
    { name: "Bulgarian", code: "bg", imageSmall: { fileName: "Bulgarian_get_L.png", aspectRatio: 5.38 }, imageLarge: { fileName: "Bulgarian_get-it-from-MS.png", aspectRatio: 2.769 } },
    { name: "Chinese (Simplified)", code: "zh", imageSmall: { fileName: "Chinese_Simplified_Get_L.png", aspectRatio: 2.744 }, imageLarge: { fileName: "Chinese_Simplified_get-it-from-MS.png", aspectRatio: 2.769 } },
    { name: "Chinese (Traditional)", code: "tc", imageSmall: { fileName: "Chinese-Traditional_Get_L.png", aspectRatio: 2.776 }, imageLarge: { fileName: "Chinese-Traditional_get-it-from-MS.png", aspectRatio: 2.769 } },
    { name: "Croatian", code: "hr", imageSmall: { fileName: "Croatian_get_L.png", aspectRatio: 4.406 }, imageLarge: { fileName: "Croatian_get-it-from-MS.png", aspectRatio: 2.769 } },
    { name: "Czech", code: "cs", imageSmall: { fileName: "Czech_get_L.png", aspectRatio: 3.197 }, imageLarge: { fileName: "Czech_get-it-from-MS.png", aspectRatio: 2.769 } },
    { name: "Danish", code: "da", imageSmall: { fileName: "Danish_get_L.png", aspectRatio: 3.239 }, imageLarge: { fileName: "Danish_get-it-from-MS.png", aspectRatio: 2.769 } },
    { name: "Dutch", code: "nl", imageSmall: { fileName: "Dutch_get_L.png", aspectRatio: 3.859 }, imageLarge: { fileName: "Dutch_get-it-from-MS.png", aspectRatio: 2.769 } },
    MSStoreBadge_1.englishLanguage,
    { name: "Estonian", code: "et", imageSmall: { fileName: "Estonian_get_L.png", aspectRatio: 3.161 }, imageLarge: { fileName: "Estonian_get-it-from-MS.png", aspectRatio: 2.769 } },
    { name: "Filipino", code: "fil", imageSmall: { fileName: "Filipino_get_L.png", aspectRatio: 3.119 }, imageLarge: { fileName: "Filipino_get-it-from-MS.png", aspectRatio: 2.769 } },
    { name: "Finnish", code: "fi", imageSmall: { fileName: "Finnish_get_L.png", aspectRatio: 3.119 }, imageLarge: { fileName: "Finnish_get-it-from-MS.png", aspectRatio: 2.769 } },
    { name: "French", code: "fr", imageSmall: { fileName: "French_get_L.png", aspectRatio: 3.718 }, imageLarge: { fileName: "French_get-it-from-MS.png", aspectRatio: 2.769 } },
    { name: "German", code: "de", imageSmall: { fileName: "German_get_L.png", aspectRatio: 2.609 }, imageLarge: { fileName: "German_get-it-from-MS.png", aspectRatio: 2.769 } },
    { name: "Greek", code: "el", imageSmall: { fileName: "Greek_get_L.png", aspectRatio: 4.546 }, imageLarge: { fileName: "Greek_-get-it-from-MS.png", aspectRatio: 2.769 } },
    { name: "Hebrew", code: "he", imageSmall: { fileName: "Hebrew_get_L.png", aspectRatio: 3.666 }, imageLarge: { fileName: "Hebrew_-get-it-from-MS.png", aspectRatio: 2.769 } },
    { name: "Hindi", code: "hi", imageSmall: { fileName: "Hindi_get_L.png", aspectRatio: 4.25 }, imageLarge: { fileName: "Hindi_get-it-from-MS.png", aspectRatio: 2.769 } },
    { name: "Hungarian", code: "hu", imageSmall: { fileName: "Hungarian_get_L.png", aspectRatio: 3.416 }, imageLarge: { fileName: "Hungarian_get-it-from-MS.png", aspectRatio: 2.769 } },
    { name: "Indonesian", code: "id", imageSmall: { fileName: "Indonesian_get_L.png", aspectRatio: 2.666 }, imageLarge: { fileName: "Indonesian_get-it-from-MS.png", aspectRatio: 2.769 } },
    { name: "Italian", code: "it", imageSmall: { fileName: "Italian_get_L.png", aspectRatio: 3.401 }, imageLarge: { fileName: "Italian_get-it-from-MS.png", aspectRatio: 2.769 } },
    { name: "Japanese", code: "ja", imageSmall: { fileName: "Japan_Get__L.png", aspectRatio: 2.609 }, imageLarge: { fileName: "Japanese_-get-it-from-MS.png", aspectRatio: 2.769 } },
    { name: "Korean", code: "ko", imageSmall: { fileName: "Korean_get_L.png", aspectRatio: 2.312 }, imageLarge: { fileName: "Korean_get-it-from-MS.png", aspectRatio: 2.769 } },
    { name: "Latvian", code: "lv", imageSmall: { fileName: "Latvian_get_L.png", aspectRatio: 2.942 }, imageLarge: { fileName: "Latvian_get-it-from-MS.png", aspectRatio: 2.769 } },
    { name: "Lithuanian", code: "lt", imageSmall: { fileName: "Lithuanian_get_L.png", aspectRatio: 3.578 }, imageLarge: { fileName: "Lithuanian_get-it-from-MS.png", aspectRatio: 2.769 } },
    { name: "Malay", code: "ms", imageSmall: { fileName: "Malay_get_L.png", aspectRatio: 4.171 }, imageLarge: { fileName: "Malay_get-it-from-MS.png", aspectRatio: 2.769 } },
    { name: "Norwegian", code: "no", imageSmall: { fileName: "Norwegian_get_L.png", aspectRatio: 3.213 }, imageLarge: { fileName: "Norwegian_get-it-from-MS.png", aspectRatio: 2.769 } },
    { name: "Polish", code: "pl", imageSmall: { fileName: "Polish_get_L.png", aspectRatio: 3.593 }, imageLarge: { fileName: "Polish_get-it-from-MS.png", aspectRatio: 2.769 } },
    { name: "Portuguese (Brazil)", code: "pt-br", imageSmall: { fileName: "Portuguese_Brazil_get_L.png", aspectRatio: 2.963 }, imageLarge: { fileName: "Portuguese-Brazilian_get-it-from-MS.png", aspectRatio: 2.769 } },
    { name: "Portuguese (Portugal)", code: "pt", imageSmall: { fileName: "Portuguese_Portugal_get_L.png", aspectRatio: 3.171 }, imageLarge: { fileName: "Portuguese-Portugal_get-it-from-MS.png", aspectRatio: 2.769 } },
    { name: "Romanian", code: "ro", imageSmall: { fileName: "Romanian_get_L.png", aspectRatio: 4.312 }, imageLarge: { fileName: "Romanian_get-it-from-MS.png", aspectRatio: 2.769 } },
    { name: "Russian", code: "ru", imageSmall: { fileName: "Russian_get_L.png", aspectRatio: 3.895 }, imageLarge: { fileName: "Russian_get_it_from_MS.png", aspectRatio: 2.769 } },
    { name: "Serbian", code: "sr", imageSmall: { fileName: "Serbian_get_L.png", aspectRatio: 4.395 }, imageLarge: { fileName: "Serbian_get-it-from-MS.png", aspectRatio: 2.769 } },
    { name: "Slovak", code: "sk", imageSmall: { fileName: "Slovak_get_L.png", aspectRatio: 3.067 }, imageLarge: { fileName: "Slovak_get-it-from-MS.png", aspectRatio: 2.769 } },
    { name: "Slovenian", code: "sl", imageSmall: { fileName: "Slovenian_get_L.png", aspectRatio: 3.375 }, imageLarge: { fileName: "Slovenian_get_it_from_MS.png", aspectRatio: 2.769 } },
    { name: "Spanish", code: "es", imageSmall: { fileName: "Spanish_get_L.png", aspectRatio: 4.692 }, imageLarge: { fileName: "Spanish_get-it-from-MS.png", aspectRatio: 2.769 } },
    { name: "Swahili", code: "sw", imageSmall: { fileName: "Swahili_get_L.png", aspectRatio: 2.666 }, imageLarge: { fileName: "Swahili_get-it-from-MS.png", aspectRatio: 2.769 } },
    { name: "Swedish", code: "sv", imageSmall: { fileName: "Swedish_get_L.png", aspectRatio: 3.208 }, imageLarge: { fileName: "Swedish_get-it-from-MS.png", aspectRatio: 2.769 } },
    { name: "Thai", code: "th", imageSmall: { fileName: "Thai_get_L.png", aspectRatio: 3.135 }, imageLarge: { fileName: "Thai_get-it-from-MS.png", aspectRatio: 2.769 } },
    { name: "Turkish", code: "tr", imageSmall: { fileName: "Turkish_get_L.png", aspectRatio: 2.708 }, imageLarge: { fileName: "Turkish_get-it-from-MS.png", aspectRatio: 2.769 } },
    { name: "Ukranian", code: "uk", imageSmall: { fileName: "Ukranian_get.png", aspectRatio: 4.468 }, imageLarge: { fileName: "Ukranian_get_it_from_MS.png", aspectRatio: 2.769 } },
    { name: "Vietnamese", code: "vi", imageSmall: { fileName: "Vietnamese_get.png", aspectRatio: 2.192 }, imageLarge: { fileName: "Vietnamese_get_it_from_MS.png", aspectRatio: 2.769 } }
];
__decorate([
    property({ type: String })
], MSStoreBadge.prototype, "productId", void 0);
__decorate([
    property({ type: String })
], MSStoreBadge.prototype, "language", void 0);
__decorate([
    property({ type: String })
], MSStoreBadge.prototype, "size", void 0);
__decorate([
    state()
], MSStoreBadge.prototype, "languageDetails", void 0);
__decorate([
    state()
], MSStoreBadge.prototype, "largeBadgeUrl", void 0);
__decorate([
    state()
], MSStoreBadge.prototype, "smallBadgeUrl", void 0);
__decorate([
    state()
], MSStoreBadge.prototype, "iframeLocation", void 0);
__decorate([
    state()
], MSStoreBadge.prototype, "hrefValue", void 0);
__decorate([
    state()
], MSStoreBadge.prototype, "miniPDPcompatible", void 0);
MSStoreBadge = MSStoreBadge_1 = __decorate([
    customElement('ms-store-badge')
], MSStoreBadge);
export { MSStoreBadge };
//# sourceMappingURL=ms-store-badge.js.map