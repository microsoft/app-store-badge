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
    * Indicates whether popup or full mode should be launched. 
    */
  windowMode: "popup" | "full" = "popup";

  /**
    * Indicates whether badge should be in dark mode, light mode, or auto mode.
    */
  theme: "dark" | "light" | "auto" = "dark";

  /**
   * Sets the size of the badge. Should be "small" or "large"
   */
  size: "small" | "large" = "large";

  /**
   * Sets the language. If null or omitted, the language will be auto-detected from the user's browser language.
   */
  language: string | null = "";

  /**
   * Indicates whether badge animation should be applied or not.
   */
  animation: "on" | "off" = "off";

  #languageDetails: SupportedLanguage = MSStoreBadge.englishLanguage;
  #env: "dev" | "prod" = (window as any).__rollup_injected_env || "dev";
  #iframeLocation = this.#env === "dev" ? "iframe.html" : "https://get.microsoft.com/iframe.html";
  #imagesLocation = this.#env === "dev" ? "/images" : "https://getbadgecdn.azureedge.net/images";
  #platformDetails: PlatformDetails = { isWindows: false, windowsVersion: null, isEdgeBrowser: false };

  static englishLanguage: SupportedLanguage = { name: "English", code: "en", imageSmall: { fileName: "English_S.png", }, imageSmallLight: { fileName: "English_L.png"}, imageLarge: { fileName: "English_L.png" }, imageLargeLight: {fileName: "English_LL.svg"} };
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
      "windowmode",
      "theme",
      "size",
      "language",
      "animation",
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
    } else if (name === "windowmode" && (newValue === "popup" || newValue === "full") && oldValue !== newValue) {
      this.windowMode = newValue;
      this.updateImageSrc();
    } else if (name === "theme" && (newValue == "dark" || newValue === "light" || newValue === "auto") && oldValue !== newValue) {
      this.theme = newValue;
      this.updateImageSrc();
    } else if (name === "animation" && (newValue === "on" || newValue === "off") && oldValue !== newValue) {
      this.animation = newValue;
      this.shadowRoot?.appendChild(this.createStyle());
    }
  }

  createStyle(): HTMLStyleElement {
    var styleString = '';
    if(this.animation === "on") {
      styleString = `
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
        transition: 0.35s ease;
      }
      
      img:hover {
        transform: translate(0, -4px);
        cursor: pointer;
        box-shadow: 0 12px 40px 20px rgba(0, 0, 0, 0.05);
      }
      
      img.small {
        max-height: 52px;
      }

      img.large {
        max-height: 104px;
      }`
    }
    else {
      styleString = `
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
      }`
    }
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
    var fileName = null;
    //Dark mode
    if(this.theme === "dark") {
      fileName = this.size === "large" ?
      this.#languageDetails.imageLarge.fileName :
      this.#languageDetails.imageSmall.fileName;
    }
    //Light mode
    else if(this.theme === "light") {
      fileName = this.size === "large" ?
      this.#languageDetails.imageLargeLight.fileName :
      this.#languageDetails.imageSmallLight.fileName;
    }
    //Auto mode
    else if(this.theme === "auto") {
      const isDark = window.matchMedia('(prefers-color-scheme:dark)').matches;
        if(isDark) { //If detected dark mode
          fileName = this.size === "large" ?
          this.#languageDetails.imageLargeLight.fileName :
          this.#languageDetails.imageSmallLight.fileName;
        }
        else { //If detected light mode
          fileName = this.size === "large" ?
          this.#languageDetails.imageLarge.fileName :
          this.#languageDetails.imageSmall.fileName;
        }   
    }
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
      ((!this.cid) ? "" : "&cid=" + encodeURIComponent(this.cid)) +
      "&referrer=" + "appbadge" +
      "&source=" + encodeURIComponent(window.location.hostname.toLowerCase()) +
      (this.windowMode === "popup" ? "&mode=mini&pos=" : "&pos=") + Math.floor(window.screenLeft * window.devicePixelRatio) +
      "," + Math.floor(window.screenTop * window.devicePixelRatio) +
      "," + Math.floor(window.outerWidth * window.devicePixelRatio) +
      "," + Math.floor(window.outerHeight * window.devicePixelRatio);
    location.href = appLaunchUrl;
    console.log(appLaunchUrl);
  }

  launchStoreAppPdpViaWhitelistedDomain() {
    if(this.windowMode === "full") {
      this.launchStoreAppPdp();
    }
    else {
      const iframe = this.shadowRoot?.querySelector("iframe");
      if (iframe) {
        const args = {
          message: "launch",
          productId: this.productId
        };
        iframe.contentWindow?.postMessage(args, "*");
      }
    }
  }

  launchStoreWebPdp(e: MouseEvent) {
    var url = "";
    if(!this.cid) {
      url = `https://apps.microsoft.com/store/detail/${this.productId}?referrer=appbadge&source=${encodeURIComponent(window.location.hostname.toLowerCase())}`;
    }
    else {
      url = `https://apps.microsoft.com/store/detail/${this.productId}?cid=${encodeURIComponent(this.cid)}&referrer=appbadge&source=${encodeURIComponent(window.location.hostname.toLowerCase())}`;
    }
    if (e.ctrlKey) {
      window.open(url, "_blank");
    } else {
      window.location.href = url;
    }
  }

  static createSupportedLanguages(): SupportedLanguage[] {
    let languageMap = new Map<string, string>();
    languageMap.set("Arabic", "ar");
    languageMap.set("Belarusian", "be");
    languageMap.set("Bengali", "bn");
    languageMap.set("Bosnian", "bs");
    languageMap.set("Bulgarian", "bg");
    languageMap.set("Chinese_Simplified", "zh-cn");
    languageMap.set("Chinese_Traditional", "zh-tw");
    languageMap.set("Croatian", "hr");
    languageMap.set("Czech", "cs");
    languageMap.set("Danish", "da");
    languageMap.set("Dutch", "nl");
    languageMap.set("English", "en");
    languageMap.set("Estonian", "et");
    languageMap.set("Filipino", "fil");
    languageMap.set("Finnish", "fi");
    languageMap.set("French", "fr");
    languageMap.set("German", "el");
    languageMap.set("Greek", "be");
    languageMap.set("Hebrew", "he");
    languageMap.set("Hindi", "hi");
    languageMap.set("Hungarian", "hu");
    languageMap.set("Indonesian", "id");
    languageMap.set("Italian", "it");
    languageMap.set("Japanese", "ja");
    languageMap.set("Korean", "ko");
    languageMap.set("Latvian", "lv");
    languageMap.set("Lithuanian", "lt");
    languageMap.set("Malay", "ms");
    languageMap.set("Norwegian", "no");
    languageMap.set("Polish", "pl");
    languageMap.set("Portuguese_Brazil", "pt-br");
    languageMap.set("Portuguese_Portugal", "pt");
    languageMap.set("Romanian", "ro");
    languageMap.set("Russian", "ru");
    languageMap.set("Serbian", "sr");
    languageMap.set("Slovak", "sk");
    languageMap.set("Slovenian", "sl");
    languageMap.set("Spanish", "es");
    languageMap.set("Swahili", "sw");
    languageMap.set("Thai", "th");
    languageMap.set("Turkish", "tr");
    languageMap.set("Ukranian", "uk");
    languageMap.set("Vietnamese", "vi");
    
    let language: SupportedLanguage[] = [];

    for(let name of languageMap.keys()) {
      let currLanguage: SupportedLanguage =  {
        name: name, 
        imageSmall: {fileName: name.concat("_S.png")},
        imageLarge: {fileName: name.concat("_L.png")},
        imageSmallLight: {fileName: name.concat("_S.png")},
        imageLargeLight: {fileName: "English_LL.svg"},
        code: languageMap.get(name) || ""
      }
      language.push(currLanguage);
    }
    return language;
  }
}

interface SupportedLanguage {
  name: string;
  imageSmall: SupportedLanguageImage;
  imageLarge: SupportedLanguageImage;
  imageSmallLight: SupportedLanguageImage;
  imageLargeLight: SupportedLanguageImage;
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