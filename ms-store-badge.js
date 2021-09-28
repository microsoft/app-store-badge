var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MSStoreBadge_1;
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
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
        this.largeBadgeUrl = "https://developer.microsoft.com/store/badges/images/English_get-it-from-MS.png";
        this.smallBadgeUrl = "https://developer.microsoft.com/store/badges/images/English_get_L.png";
        this.iframeLocation = "https://black-water-0eaf5100f.azurestaticapps.net/iframe.html";
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
        let dashPosition;
        if (this.language === '') {
            dashPosition = navigator.language.indexOf("-");
            /* 'en-us', 'fr-fr', 'fil-ph' */
            if (dashPosition !== -1) {
                this.language = navigator.language.substring(0, dashPosition);
            }
            /* 'en', 'fr' */
            else {
                this.language = navigator.language;
            }
        }
        // Set the large image URL and small image URL based on the language.
        // Special case for Portuguese: we need to check if it's Portugal or Brazil variation.
        const language = navigator.language.toLowerCase() === "pt-br" ?
            "pt-br" :
            this.language;
        this.largeBadgeUrl = MSStoreBadge_1.getBadgeUrl(language, "large");
        this.smallBadgeUrl = MSStoreBadge_1.getBadgeUrl(language, "small");
    }
    static getBadgeUrl(language, size) {
        // Special handling if it's small pt-br
        const langSuffix = language === "pt-br" && size === "small" ? "Portuguese_Brazil" :
            this.languageImageSuffixMap[language] || // Grab the image suffix from the map
                "English"; // Couldn't find anything? Use English
        const sizeSuffix = size === "small" ? "get_L.png" : "get-it-from-MS.png";
        return `https://developer.microsoft.com/store/badges/images/${langSuffix}_${sizeSuffix}`;
    }
    render() {
        let badge;
        let iframe;
        if (this.size === "large") {
            badge = html `<img src="${this.largeBadgeUrl}" alt="Microsoft Store badge logo" class="largeBadge" />`;
            iframe = html `<iframe
  src='${this.iframeLocation}?productId=${this.productId}&amp;language=${this.language}&amp;badgeSize=big&amp;imgUrl=${this.largeBadgeUrl}&amp;targetUrl=${this.hrefValue}'
  class="iframeBig"></iframe>`;
        }
        else {
            badge = html `<img src="${this.smallBadgeUrl}" alt="Microsoft Store badge logo" class="smallBadge" />`;
            iframe = html `<iframe
  src='${this.iframeLocation}?productId=${this.productId}&amp;language=${this.language}&amp;imgUrl=${this.smallBadgeUrl}&amp;targetUrl=${this.hrefValue}'
  class="iframeSmall"></iframe>`;
        }
        return this.miniPDPcompatible ?
            html `${iframe}` :
            html `<a href="${this.hrefValue}" target="_blank">${badge}</a>`;
    }
};
MSStoreBadge.styles = css `
    :host {
      display: block;
      padding: 0;
      margin: 0;
    }

    iframe {
      border:none;
    }

    .iframeBig {
      width:284px;
      height:108px
    }

    .iframeSmall {
      width:127px;
      height:57px
    }

    .largeBadge {
       width: 284px; height: 104px;
        }

    .smallBadge {
        width: 127px; height: 52px;
    }
  `;
MSStoreBadge.languageImageSuffixMap = {
    "ar": "Arabic",
    "be": "Bosnian",
    "bn": "Bengali",
    "bs": "Bosnian",
    "bg": "Bulgarian",
    "zh": "Chinese_Simplified",
    "hr": "Croatian",
    "cs": "Czech",
    "da": "Danish",
    "nl": "Dutch",
    "en": "English",
    "et": "Estonian",
    "fil": "Filipino",
    "fi": "Finnish",
    "fr": "French",
    "de": "German",
    "el": "Greek",
    "he": "Hebrew",
    "hi": "Hindi",
    "hu": "Hungarian",
    "id": "Indonesian",
    "it": "Italian",
    "ja": "Japanese",
    "ko": "Korean",
    "lv": "Latvian",
    "lt": "Lithuanian",
    "ms": "Malay",
    "no": "Norwegian",
    "pl": "Polish",
    "pt": "Portuguese-Portugal",
    "pt-pt": "Portuguese-Portugal",
    "pt-br": "Portuguese-Brazilian",
    "ro": "Romanian",
    "ru": "Russian",
    "sr": "Serbian",
    "sk": "Slovak",
    "sl": "Slovenian",
    "es": "Spanish",
    "sw": "Swahili",
    "sv": "Swedish",
    "th": "Thai",
    "tr": "Turkish",
    "uk": "Ukranian",
    "vi": "Vietnamese"
};
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