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
@customElement('ms-store-badge')
export class MSStoreBadge extends LitElement {
  static styles = css`
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

  /**
   * product Id of the Microsoft Store App provided in the Partner Center portal.
   */
  @property({ type: String }) productId = '';

  /**
   * language to use for the badge image (en, fr, zh, etc.)
   * if not set, the component will auto detect the browser preferred language 
   */
  @property({ type: String }) language = '';

  /**
   * Sets the size of the badge. Should be "small" or "large"
   */
  @property({ type: String }) size: "small" | "large" = "large";

  @state()
  protected largeBadgeUrl = "https://developer.microsoft.com/store/badges/images/English_get-it-from-MS.png";

  @state()
  protected smallBadgeUrl = "https://developer.microsoft.com/store/badges/images/English_get_L.png";

  @state()
  protected iframeLocation = "https://black-water-0eaf5100f.azurestaticapps.net/iframe.html";

  private static languageImageSuffixMap = {
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

  /**
   * Will contain the right url to the Web PDP or Store App protocol using the product ID
  */
  @state()
  protected hrefValue = '';

  /**
   * Trying to trigger miniPDP only on Windows 10+
  */
  @state()
  protected miniPDPcompatible = false;

  constructor() {
    super();
  }

  firstUpdated() {
    this._checkLanguage();
    this._checkPlatform();
  }

  updated() {
    this._checkLanguage();
  }

  private _checkPlatform() {
    // If the OS is Windows 10 or Windows 11 
    if (navigator.userAgent.indexOf("Windows NT 1") !== -1) {
      this.hrefValue = `ms-windows-store://pdp/?ProductId=${this.productId}`;
      this.miniPDPcompatible = true;
    }
    // otherwise, redirect to the Web PDP
    else {
      this.hrefValue = `https://www.microsoft.com/store/apps/${this.productId}?cid=storebadge&ocid=badge`
    }
  }

  private _checkLanguage() {
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
    this.largeBadgeUrl = MSStoreBadge.getBadgeUrl(language, "large");
    this.smallBadgeUrl = MSStoreBadge.getBadgeUrl(language, "small");
  }

  static getBadgeUrl(language: string, size: "small" | "large") {
    // Special handling if it's small pt-br
    const langSuffix = language === "pt-br" && size === "small" ? "Portuguese_Brazil" :
      (this.languageImageSuffixMap as any)[language] || // Grab the image suffix from the map
      "English"; // Couldn't find anything? Use English

    const sizeSuffix = size === "small" ? "get_L.png" : "get-it-from-MS.png";
    return `https://developer.microsoft.com/store/badges/images/${langSuffix}_${sizeSuffix}`;
  }

  render() {
    let badge;
    let iframe;

    if (this.size === "large") {
      badge = html`<img src="${this.largeBadgeUrl}" alt="Microsoft Store badge logo" class="largeBadge" />`;
      iframe = html`<iframe
  src='${this.iframeLocation}?productId=${this.productId}&amp;language=${this.language}&amp;size=large&amp;imgUrl=${this.largeBadgeUrl}&amp;targetUrl=${this.hrefValue}'
  class="iframeBig"></iframe>`;
    }
    else {
      badge = html`<img src="${this.smallBadgeUrl}" alt="Microsoft Store badge logo" class="smallBadge" />`;
      iframe = html`<iframe
  src='${this.iframeLocation}?productId=${this.productId}&amp;language=${this.language}&amp;size=small&amp;imgUrl=${this.smallBadgeUrl}&amp;targetUrl=${this.hrefValue}'
  class="iframeSmall"></iframe>`;
    }

    return this.miniPDPcompatible ?
      html`${iframe}` :
      html`<a href="${this.hrefValue}" target="_blank">${badge}</a>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ms-store-badge': MSStoreBadge;
  }
}
