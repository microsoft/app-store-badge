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
  /**
   * The ID of your app. 
   */
  productId: string = "";

  /**
   * The optional campaign ID of your app. 
   */
  cid: string = "";

  /**
   * Sets the size of the badge. Should be "small" or "large"
   */
  size: "small" | "large" = "large";

  /**
   * Sets the language. If null or omitted, the language will be auto-detected from the user's browser language.
   */
  language: string | null = "";

  #languageDetails: SupportedLanguage = MSStoreBadge.englishLanguage;
  #env: "dev" | "prod" = (window as any).__rollup_injected_env || "dev";
  #iframeLocation = this.#env === "dev" ? "iframe.html" : "https://get.microsoft.com/iframe.html";
  #imagesLocation = this.#env === "dev" ? "/images" : "https://getbadgecdn.azureedge.net/images";
  #platformDetails: PlatformDetails = { isWindows: false, windowsVersion: null, isEdgeBrowser: false };

  static englishLanguage: SupportedLanguage = { name: "English", code: "en", imageSmall: { fileName: "English_S.png", }, imageLarge: { fileName: "English_L.png" } };
  static supportedLanguages = MSStoreBadge.createSupportedLanguages();

  constructor() {
    super();

    // Create our state.
    this.getPlatformDetails().then(details => this.#platformDetails = details);
    this.#languageDetails = MSStoreBadge.getSupportedLanguageFromCode(this.language);
    this.language = this.#languageDetails.code;

    // Create our HTML elements.
    const shadow = this.attachShadow({ mode: "open" });
    const style = this.createStyle();
    const html = this.createHtml();
    shadow.appendChild(style);
    shadow.appendChild(html);
  }

  updateImageSrc() {
    const img = this.shadowRoot?.querySelector("img");
    if (img) {
      img.setAttribute("src", this.getImageSource());
      img.className = this.getImageClass();
    }
  }

  // Web component lifecycle callback: component added to DOM
  connectedCallback() {
  }

  // Web component lifecycle callback: register that we want to observe certain attributes.
  static get observedAttributes(): string[] {
    return [
      "productid",
      "cid",
      "size",
      "language"
    ];
  }

  // Web component lifecycle callback: when an observed attribute changes.
  attributeChangedCallback(name: string, oldValue: any, newValue: any) {
    if (name === "size" && (newValue === "large" || newValue === "small") && oldValue !== newValue) {
      this.size = newValue;
      this.updateImageSrc();
    } else if (name === "language" && newValue !== oldValue && (typeof newValue === "string" || !newValue)) {
      this.#languageDetails = MSStoreBadge.getSupportedLanguageFromCode(newValue);
      this.language = this.#languageDetails.code;
      this.updateImageSrc();
    } else if (name === "productid" && newValue !== oldValue && typeof newValue === "string") {
      this.productId = newValue;
    } else if (name === "cid" && newValue !== oldValue && typeof newValue === "string") {
      this.cid = newValue;
    }
  }

  createStyle(): HTMLStyleElement {
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

  createHtml(): HTMLElement {
    const container = document.createElement("div");
    container.appendChild(this.createImage());
    container.appendChild(this.createIFrame());
    return container;
  }

  private async getPlatformDetails(): Promise<PlatformDetails> {
    // Use client hints if available.
    // Typescript doesn't yet have support for typing this.
    const navigatorAny = navigator as any;
    if (navigatorAny.userAgentData && navigatorAny.userAgentData.getHighEntropyValues) {
      try {
        const platformDetails = await navigatorAny.userAgentData.getHighEntropyValues(["platform", "platformVersion"]);
        const isWindows = platformDetails.platform === "Windows";
        const version = isWindows ? parseFloat(platformDetails?.platformVersion || "") : null;
        return {
          isWindows: isWindows,
          windowsVersion: version,
          isEdgeBrowser: (navigatorAny.userAgentData.brands || []).some((b: any) => b.brand === "Microsoft Edge")
        }
      } catch (error) {
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
      }
    }

    // Some other platform besides Windows.
    return {
      isWindows: false,
      windowsVersion: null,
      isEdgeBrowser: !!navigator.userAgent.match("Edg/")
    }
  }

  private static getSupportedLanguageFromCode(languageCode: string | null | undefined): SupportedLanguage {
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

  createIFrame(): HTMLIFrameElement {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("loading", "eager");
    iframe.title = "Microsoft Store App Badge";
    iframe.src = this.#iframeLocation;
    return iframe;
  }

  createImage(): HTMLImageElement {
    const image = document.createElement("img");
    image.setAttribute("part", "img");
    image.src = this.getImageSource();
    image.className = this.getImageClass();
    image.alt = "Microsoft Store app badge";
    image.addEventListener("click", (e: MouseEvent) => this.launchApp(e));
    return image;
  }

  getImageSource(): string {
    const fileName = this.size === "large" ?
      this.#languageDetails.imageLarge.fileName :
      this.#languageDetails.imageSmall.fileName;
    return `${this.#imagesLocation}/${fileName}`;
  }

  getImageClass(): string {
    return this.size === "large" ? "large" : "small";
  }

  launchApp(e: MouseEvent) {
    if (!this.productId) {
      return;
    }

    if (this.#platformDetails.isWindows && this.#platformDetails.isEdgeBrowser) {
      // Are we on Edge on Windows? Launch the mini PDP via the iframe hosted on Edge's whitelisted domain.
      this.launchStoreAppPdpViaWhitelistedDomain();
    } else if (this.#platformDetails.isWindows) {
      // We're on some other browser on Windows. Launch via ms-store-app:// protocol.
      this.launchStoreAppPdp();
    } else {
      // We're not on Windows so we can't launch the app. Navigate to the web PDP.
      this.launchStoreWebPdp(e);
    }
  }

  launchStoreAppPdp() {
    const appLaunchUrl = "ms-windows-store://pdp/" +
      "?productid=" + this.productId +
      "&cid=" + this.cid +
      "&mode=mini&pos=" + Math.floor(window.screenLeft * window.devicePixelRatio) +
      "," + Math.floor(window.screenTop * window.devicePixelRatio) +
      "," + Math.floor(window.outerWidth * window.devicePixelRatio) +
      "," + Math.floor(window.outerHeight * window.devicePixelRatio);
    location.href = appLaunchUrl;
    console.log(appLaunchUrl);
  }

  launchStoreAppPdpViaWhitelistedDomain() {
    const iframe = this.shadowRoot?.querySelector("iframe");
    if (iframe) {
      const args = {
        message: "launch",
        productId: this.productId
      };
      iframe.contentWindow?.postMessage(args, "*");
    }
  }

  launchStoreWebPdp(e: MouseEvent) {
    const url = `https://apps.microsoft.com/store/detail/${this.productId}/${this.cid}`;
    if (e.ctrlKey) {
      window.open(url, "_blank");
    } else {
      window.location.href = url;
    }
  }

  static createSupportedLanguages(): SupportedLanguage[] {
    return [
      { name: "Arabic", code: "ar", imageSmall: { fileName: "Arabic_S.png" }, imageLarge: { fileName: "Arabic_L.png" } },
      { name: "Bosnian", code: "be", imageSmall: { fileName: "Bosnian_S.png" }, imageLarge: { fileName: "Bosnian_L.png" } },
      { name: "Bengali", code: "bn", imageSmall: { fileName: "Bengali_S.png" }, imageLarge: { fileName: "Bengali_L.png" } },
      { name: "Bosnian", code: "bs", imageSmall: { fileName: "Bosnian_S.png" }, imageLarge: { fileName: "Bosnian_L.png" } },
      { name: "Bulgarian", code: "bg", imageSmall: { fileName: "Bulgarian_S.png" }, imageLarge: { fileName: "Bulgarian_L.png" } },
      { name: "Chinese (Simplified)", code: "zh-cn", imageSmall: { fileName: "Chinese_Simplified_S.png" }, imageLarge: { fileName: "Chinese_Simplified_L.png" } },
      { name: "Chinese (Traditional)", code: "zh-tw", imageSmall: { fileName: "Chinese_Traditional_S.png" }, imageLarge: { fileName: "Chinese_Traditional_L.png" } },
      { name: "Croatian", code: "hr", imageSmall: { fileName: "Croatian_S.png" }, imageLarge: { fileName: "Croatian_L.png" } },
      { name: "Czech", code: "cs", imageSmall: { fileName: "Czech_S.png" }, imageLarge: { fileName: "Czech_L.png" } },
      { name: "Danish", code: "da", imageSmall: { fileName: "Danish_S.png" }, imageLarge: { fileName: "Danish_L.png" } },
      { name: "Dutch", code: "nl", imageSmall: { fileName: "Dutch_S.png" }, imageLarge: { fileName: "Dutch_L.png" } },
      MSStoreBadge.englishLanguage,
      { name: "Estonian", code: "et", imageSmall: { fileName: "Estonian_S.png" }, imageLarge: { fileName: "Estonian_L.png" } },
      { name: "Filipino", code: "fil", imageSmall: { fileName: "Filipino_S.png" }, imageLarge: { fileName: "Filipino_L.png" } },
      { name: "Finnish", code: "fi", imageSmall: { fileName: "Finnish_S.png" }, imageLarge: { fileName: "Finnish_L.png" } },
      { name: "French", code: "fr", imageSmall: { fileName: "French_S.png" }, imageLarge: { fileName: "French_L.png" } },
      { name: "German", code: "de", imageSmall: { fileName: "German_S.png" }, imageLarge: { fileName: "German_L.png" } },
      { name: "Greek", code: "el", imageSmall: { fileName: "Greek_S.png" }, imageLarge: { fileName: "Greek_L.png" } },
      { name: "Hebrew", code: "he", imageSmall: { fileName: "Hebrew_S.png" }, imageLarge: { fileName: "Hebrew_L.png" } },
      { name: "Hindi", code: "hi", imageSmall: { fileName: "Hindi_S.png" }, imageLarge: { fileName: "Hindi_L.png" } },
      { name: "Hungarian", code: "hu", imageSmall: { fileName: "Hungarian_S.png" }, imageLarge: { fileName: "Hungarian_L.png" } },
      { name: "Indonesian", code: "id", imageSmall: { fileName: "Indonesian_S.png" }, imageLarge: { fileName: "Indonesian_L.png" } },
      { name: "Italian", code: "it", imageSmall: { fileName: "Italian_S.png" }, imageLarge: { fileName: "Italian_L.png" } },
      { name: "Japanese", code: "ja", imageSmall: { fileName: "Japanese_S.png" }, imageLarge: { fileName: "Japanese_L.png" } },
      { name: "Korean", code: "ko", imageSmall: { fileName: "Korean_S.png" }, imageLarge: { fileName: "Korean_L.png" } },
      { name: "Latvian", code: "lv", imageSmall: { fileName: "Latvian_S.png" }, imageLarge: { fileName: "Latvian_L.png" } },
      { name: "Lithuanian", code: "lt", imageSmall: { fileName: "Lithuanian_S.png" }, imageLarge: { fileName: "Lithuanian_L.png" } },
      { name: "Malay", code: "ms", imageSmall: { fileName: "Malay_S.png" }, imageLarge: { fileName: "Malay_L.png" } },
      { name: "Norwegian", code: "no", imageSmall: { fileName: "Norwegian_S.png" }, imageLarge: { fileName: "Norwegian_L.png" } },
      { name: "Polish", code: "pl", imageSmall: { fileName: "Polish_S.png" }, imageLarge: { fileName: "Polish_L.png" } },
      { name: "Portuguese (Brazil)", code: "pt-br", imageSmall: { fileName: "Portuguese_Brazil_S.png" }, imageLarge: { fileName: "Portuguese_Brazil_L.png" } },
      { name: "Portuguese (Portugal)", code: "pt", imageSmall: { fileName: "Portuguese_Portugal_S.png" }, imageLarge: { fileName: "Portuguese_Portugal_L.png" } },
      { name: "Romanian", code: "ro", imageSmall: { fileName: "Romanian_S.png", }, imageLarge: { fileName: "Romanian_L.png" } },
      { name: "Russian", code: "ru", imageSmall: { fileName: "Russian_S.png" }, imageLarge: { fileName: "Russian_L.png" } },
      { name: "Serbian", code: "sr", imageSmall: { fileName: "Serbian_S.png" }, imageLarge: { fileName: "Serbian_L.png" } },
      { name: "Slovak", code: "sk", imageSmall: { fileName: "Slovak_S.png" }, imageLarge: { fileName: "Slovak_L.png" } },
      { name: "Slovenian", code: "sl", imageSmall: { fileName: "Slovenian_S.png" }, imageLarge: { fileName: "Slovenian_L.png" } },
      { name: "Spanish", code: "es", imageSmall: { fileName: "Spanish_S.png" }, imageLarge: { fileName: "Spanish_L.png" } },
      { name: "Swahili", code: "sw", imageSmall: { fileName: "Swahili_S.png" }, imageLarge: { fileName: "Swahili_L.png" } },
      { name: "Swedish", code: "sv", imageSmall: { fileName: "Swedish_S.png" }, imageLarge: { fileName: "Swedish_L.png" } },
      { name: "Thai", code: "th", imageSmall: { fileName: "Thai_S.png" }, imageLarge: { fileName: "Thai_L.png" } },
      { name: "Turkish", code: "tr", imageSmall: { fileName: "Turkish_S.png" }, imageLarge: { fileName: "Turkish_L.png" } },
      { name: "Ukranian", code: "uk", imageSmall: { fileName: "Ukranian_S.png" }, imageLarge: { fileName: "Ukranian_L.png" } },
      { name: "Vietnamese", code: "vi", imageSmall: { fileName: "Vietnamese_S.png" }, imageLarge: { fileName: "Vietnamese_L.png" } }
    ];
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
}

interface PlatformDetails {
  isWindows: boolean;
  windowsVersion: number | null;
  isEdgeBrowser: boolean;
}

customElements.define("ms-store-badge", MSStoreBadge);