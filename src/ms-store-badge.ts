import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

const borderRadius = css`8px`;
const smallHeight = 52;
const smallHeightCss = css`${smallHeight}px;`;
const largeHeight = 104;
const largeHeightCss = css`${largeHeight}px`;
const imagesRoot = "../images"; // This will be replaced by rollup with the real production URL.

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
  protected languageDetails: SupportedLanguage = MSStoreBadge.englishLanguage; // will use the real deal after call to _checkLanguage()

  @state()
  protected iframeLocation = "../src/iframe.html"; // This is for ease of testing. Our rollup build script will change this to the production URL.

  /**
   * Trying to trigger miniPDP only on Windows 10+
  */
  @state()
  protected miniPDPcompatible = false;

  private static englishLanguage: SupportedLanguage = { name: "English", code: "en", imageSmall: { fileName: "English_S.png", aspectRatio: 2.5 }, imageLarge: { fileName: "English_L.png", aspectRatio: 2.769 } };

  private static supportedLanguages: SupportedLanguage[] = [
    { name: "Arabic", code: "ar", imageSmall: { fileName: "Arabic_S.png", aspectRatio: 3.458 }, imageLarge: { fileName: "Arabic_L.png", aspectRatio: 2.769 } },
    { name: "Bosnian", code: "be", imageSmall: { fileName: "Bosnian_S.png", aspectRatio: 4.369 }, imageLarge: { fileName: "Bosnian_L.png", aspectRatio: 2.769 } },
    { name: "Bengali", code: "bn", imageSmall: { fileName: "Bengali_S.png", aspectRatio: 2.5 }, imageLarge: { fileName: "Bengali_L.png", aspectRatio: 2.769 } },
    { name: "Bosnian", code: "bs", imageSmall: { fileName: "Bosnian_S.png", aspectRatio: 4.369 }, imageLarge: { fileName: "Bosnian_L.png", aspectRatio: 2.769 } },
    { name: "Bulgarian", code: "bg", imageSmall: { fileName: "Bulgarian_S.png", aspectRatio: 5.38 }, imageLarge: { fileName: "Bulgarian_L.png", aspectRatio: 2.769 } },
    { name: "Chinese (Simplified)", code: "zh-cn", imageSmall: { fileName: "Chinese_Simplified_S.png", aspectRatio: 2.744 }, imageLarge: { fileName: "Chinese_Simplified_L.png", aspectRatio: 2.769 } },
    { name: "Chinese (Traditional)", code: "zh-tw", imageSmall: { fileName: "Chinese_Traditional_S.png", aspectRatio: 2.776 }, imageLarge: { fileName: "Chinese_Traditional_L.png", aspectRatio: 2.769 } },
    { name: "Croatian", code: "hr", imageSmall: { fileName: "Croatian_S.png", aspectRatio: 4.406 }, imageLarge: { fileName: "Croatian_L.png", aspectRatio: 2.769 } },
    { name: "Czech", code: "cs", imageSmall: { fileName: "Czech_S.png", aspectRatio: 3.197 }, imageLarge: { fileName: "Czech_L.png", aspectRatio: 2.769 } },
    { name: "Danish", code: "da", imageSmall: { fileName: "Danish_S.png", aspectRatio: 3.239 }, imageLarge: { fileName: "Danish_L.png", aspectRatio: 2.769 } },
    { name: "Dutch", code: "nl", imageSmall: { fileName: "Dutch_S.png", aspectRatio: 3.859 }, imageLarge: { fileName: "Dutch_L.png", aspectRatio: 2.769 } },
    MSStoreBadge.englishLanguage,
    { name: "Estonian", code: "et", imageSmall: { fileName: "Estonian_S.png", aspectRatio: 3.161 }, imageLarge: { fileName: "Estonian_L.png", aspectRatio: 2.769 } },
    { name: "Filipino", code: "fil", imageSmall: { fileName: "Filipino_S.png", aspectRatio: 3.119 }, imageLarge: { fileName: "Filipino_L.png", aspectRatio: 2.769 } },
    { name: "Finnish", code: "fi", imageSmall: { fileName: "Finnish_S.png", aspectRatio: 3.119 }, imageLarge: { fileName: "Finnish_L.png", aspectRatio: 2.769 } },
    { name: "French", code: "fr", imageSmall: { fileName: "French_S.png", aspectRatio: 3.718 }, imageLarge: { fileName: "French_L.png", aspectRatio: 2.769 } },
    { name: "German", code: "de", imageSmall: { fileName: "German_S.png", aspectRatio: 2.609 }, imageLarge: { fileName: "German_L.png", aspectRatio: 2.769 } },
    { name: "Greek", code: "el", imageSmall: { fileName: "Greek_S.png", aspectRatio: 4.546 }, imageLarge: { fileName: "Greek_L.png", aspectRatio: 2.769 } },
    { name: "Hebrew", code: "he", imageSmall: { fileName: "Hebrew_S.png", aspectRatio: 3.666 }, imageLarge: { fileName: "Hebrew_L.png", aspectRatio: 2.769 } },
    { name: "Hindi", code: "hi", imageSmall: { fileName: "Hindi_S.png", aspectRatio: 4.25 }, imageLarge: { fileName: "Hindi_L.png", aspectRatio: 2.769 } },
    { name: "Hungarian", code: "hu", imageSmall: { fileName: "Hungarian_S.png", aspectRatio: 3.416 }, imageLarge: { fileName: "Hungarian_L.png", aspectRatio: 2.769 } },
    { name: "Indonesian", code: "id", imageSmall: { fileName: "Indonesian_S.png", aspectRatio: 2.666 }, imageLarge: { fileName: "Indonesian_L.png", aspectRatio: 2.769 } },
    { name: "Italian", code: "it", imageSmall: { fileName: "Italian_S.png", aspectRatio: 3.401 }, imageLarge: { fileName: "Italian_L.png", aspectRatio: 2.769 } },
    { name: "Japanese", code: "ja", imageSmall: { fileName: "Japanese_S.png", aspectRatio: 2.609 }, imageLarge: { fileName: "Japanese_L.png", aspectRatio: 2.769 } },
    { name: "Korean", code: "ko", imageSmall: { fileName: "Korean_S.png", aspectRatio: 2.312 }, imageLarge: { fileName: "Korean_L.png", aspectRatio: 2.769 } },
    { name: "Latvian", code: "lv", imageSmall: { fileName: "Latvian_S.png", aspectRatio: 2.942 }, imageLarge: { fileName: "Latvian_L.png", aspectRatio: 2.769 } },
    { name: "Lithuanian", code: "lt", imageSmall: { fileName: "Lithuanian_S.png", aspectRatio: 3.578 }, imageLarge: { fileName: "Lithuanian_L.png", aspectRatio: 2.769 } },
    { name: "Malay", code: "ms", imageSmall: { fileName: "Malay_S.png", aspectRatio: 4.171 }, imageLarge: { fileName: "Malay_L.png", aspectRatio: 2.769 } },
    { name: "Norwegian", code: "no", imageSmall: { fileName: "Norwegian_S.png", aspectRatio: 3.213 }, imageLarge: { fileName: "Norwegian_L.png", aspectRatio: 2.769 } },
    { name: "Polish", code: "pl", imageSmall: { fileName: "Polish_S.png", aspectRatio: 3.593 }, imageLarge: { fileName: "Polish_L.png", aspectRatio: 2.769 } },
    { name: "Portuguese (Brazil)", code: "pt-br", imageSmall: { fileName: "Portuguese_Brazil_S.png", aspectRatio: 2.963 }, imageLarge: { fileName: "Portuguese_Brazil_L.png", aspectRatio: 2.769 } },
    { name: "Portuguese (Portugal)", code: "pt", imageSmall: { fileName: "Portuguese_Portugal_S.png", aspectRatio: 3.171 }, imageLarge: { fileName: "Portuguese_Portugal_L.png", aspectRatio: 2.769 } },
    { name: "Romanian", code: "ro", imageSmall: { fileName: "Romanian_S.png", aspectRatio: 4.312 }, imageLarge: { fileName: "Romanian_L.png", aspectRatio: 2.769 } },
    { name: "Russian", code: "ru", imageSmall: { fileName: "Russian_S.png", aspectRatio: 3.895 }, imageLarge: { fileName: "Russian_L.png", aspectRatio: 2.769 } },
    { name: "Serbian", code: "sr", imageSmall: { fileName: "Serbian_S.png", aspectRatio: 4.395 }, imageLarge: { fileName: "Serbian_L.png", aspectRatio: 2.769 } },
    { name: "Slovak", code: "sk", imageSmall: { fileName: "Slovak_S.png", aspectRatio: 3.067 }, imageLarge: { fileName: "Slovak_L.png", aspectRatio: 2.769 } },
    { name: "Slovenian", code: "sl", imageSmall: { fileName: "Slovenian_S.png", aspectRatio: 3.375 }, imageLarge: { fileName: "Slovenian_L.png", aspectRatio: 2.769 } },
    { name: "Spanish", code: "es", imageSmall: { fileName: "Spanish_S.png", aspectRatio: 4.692 }, imageLarge: { fileName: "Spanish_L.png", aspectRatio: 2.769 } },
    { name: "Swahili", code: "sw", imageSmall: { fileName: "Swahili_S.png", aspectRatio: 2.666 }, imageLarge: { fileName: "Swahili_L.png", aspectRatio: 2.769 } },
    { name: "Swedish", code: "sv", imageSmall: { fileName: "Swedish_S.png", aspectRatio: 3.208 }, imageLarge: { fileName: "Swedish_L.png", aspectRatio: 2.769 } },
    { name: "Thai", code: "th", imageSmall: { fileName: "Thai_S.png", aspectRatio: 3.135 }, imageLarge: { fileName: "Thai_L.png", aspectRatio: 2.769 } },
    { name: "Turkish", code: "tr", imageSmall: { fileName: "Turkish_S.png", aspectRatio: 2.708 }, imageLarge: { fileName: "Turkish_L.png", aspectRatio: 2.769 } },
    { name: "Ukranian", code: "uk", imageSmall: { fileName: "Ukranian_S.png", aspectRatio: 4.468 }, imageLarge: { fileName: "Ukranian_L.png", aspectRatio: 2.769 } },
    { name: "Vietnamese", code: "vi", imageSmall: { fileName: "Vietnamese_S.png", aspectRatio: 2.192 }, imageLarge: { fileName: "Vietnamese_L.png", aspectRatio: 2.769 } }
  ];

  constructor() {
    super();
  }

  get imageUrl() {
    if (this.size === "large") {
      return `${imagesRoot}/${this.languageDetails.imageLarge.fileName}`;
    }

    return `${imagesRoot}/${this.languageDetails.imageSmall.fileName}`;
  }

  /**
   * Will contain the right url to the Web PDP or Store App protocol using the product ID
  */
  get hrefValue() {
    // If the OS is Windows 10 or Windows 11 
    if (this.miniPDPcompatible) {
      return `ms-windows-store://pdp/?ProductId=${this.productId}`;
    }

    // Otherwise, redirect to the Web PDP
    return `https://www.microsoft.com/store/apps/${this.productId}?cid=storebadge&ocid=badge`;
  }

  firstUpdated() {
    this._checkLanguage();
    this._checkPlatform();
  }

  updated() {
    this._checkLanguage();
    this._checkPlatform(); // Needed because if the product ID changed, we need to recalculate this.hrefValue.
  }

  private _checkPlatform() {
    if (navigator.userAgent.indexOf("Windows NT 1") !== -1) {
      this.miniPDPcompatible = true;
    }
  }

  private _checkLanguage() {
    // If language isn't set, auto-detect
    if (this.language === '') {
      const detectedLanguage = MSStoreBadge.getSupportedLanguageFromUserAgent();
      this.language = detectedLanguage.code;
      this.languageDetails = detectedLanguage;
    } else {
      // The user set a specific language on our component. Make sure it's valid.
      const supportedLanguage = MSStoreBadge.supportedLanguages.find(l => l.code === this.language.toLowerCase());
      if (supportedLanguage) {
        this.language = supportedLanguage.code;
        this.languageDetails = supportedLanguage;
      } else {
        // User set the language to something not supported. Fallback to English.
        this.language = MSStoreBadge.englishLanguage.code;
        this.languageDetails = MSStoreBadge.englishLanguage;
      }
    }
  }

  static getSupportedLanguageFromUserAgent(): SupportedLanguage {
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

  renderIFrame(width: number, height: number): TemplateResult {
    return html`
      <div class="iframe-container ${this.size}">
        <iframe width="${width}" height="${height}" frameborder="0" scrolling="no"
          src='${this.iframeLocation}?productId=${this.productId}&amp;language=${this.language}&amp;size=${this.size}&amp;imgUrl=${this.imageUrl}&amp;targetUrl=${this.hrefValue}'>
        </iframe>
      </div>`;
  }

  renderImage(width: number, height: number): TemplateResult {
    return html`<a href="${this.hrefValue}" target="_blank">
  <img width="${width}" height="${height}" src="${this.imageUrl}" alt="Microsoft Store badge logo" />
</a>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ms-store-badge': MSStoreBadge;
  }
}

interface SupportedLanguage {
  name: string;
  imageSmall: SupportedLanguageImage;
  imageLarge: SupportedLanguageImage;
  code: string;
}

interface SupportedLanguageImage {
  fileName: string;
  aspectRatio: number; // 1.5 = width is 1.5 greater than height
}
