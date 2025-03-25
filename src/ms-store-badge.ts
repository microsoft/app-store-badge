import { performPSIAcquisition } from "./psi-service";
import { throttle } from "./throttle-async";

/**
 * <ms-store-badge> web component
 *
 * The app badge renders and iframe hosted on a domain whitelisted by Microsoft Edge so that users avoid 
 * the browser security pop-up asking to launch another apps. Browsers other than Edge will show the
 * security pop-up.
 * 
 * Code lives in ADO repo, migrated from GitHub as of 11/2024.
 * 
 * On non-Windows 10+ machines, it will simply display an href with an image to redirect to the Web PDP
 */
class MSStoreBadge extends HTMLElement {
  /**
   * The ID of your app. 
   */
  productId: string = "";

  /**
   * The name of your app, used in PSI service.
   */
  productName: string = "";
  
  /**
   * The optional campaign ID of your app. 
   */
  cid: string = "";

  /**
   * Sets the size of the badge. Should be "large"
   */
  size = "large";

  /**
    * Indicates whether direct or full mode should be launched. Direct is PSI, full is full PDP. 
    * If popup (mini) is specified, it falls back to full. Otherwise, fallback is direct.
    */
  windowMode: "direct" | "full" | "popup" = "direct";

  /**
    * Indicates whether badge should be in dark mode, light mode, or auto mode.
    */
  theme: "dark" | "light" | "auto" = "dark";

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
  #imagesLocation = this.#env === "dev" ? "/images" : "https://get.microsoft.com/images";
  #platformDetails: PlatformDetails = { isWindows: false, windowsVersion: null, isEdgeBrowser: false };
  #cspErrorOccurred = false;

  static englishLanguage: SupportedLanguage = { name: "English", code: "en-us", imageLarge: { fileName: "en-us dark.svg" }, imageLargeLight: { fileName: "en-us light.svg" } };
  static supportedLanguages = MSStoreBadge.createSupportedLanguages();

  private readonly PSIDownloadUrl: string = "https://get.microsoft.com/installer/download/";
  private readonly throttleDownload = throttle(performPSIAcquisition, 1500);
  private readonly imgPSIHandler = () => this.throttleDownload(this.productId, this.productName || "Microsoft Store Direct", undefined, this.getPSIUrl());
  private readonly imgPDPHandler = (e: MouseEvent) => this.launchApp(e);

  constructor() {
    super();
    MSStoreBadge.verifyLanguagesAvailable(); // Verify that all languages are available in the bundle.
    MSStoreBadge._forceIncludeXhosa();
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

  private static _forceIncludeXhosa() {
    const xhosa = MSStoreBadge.supportedLanguages.find(l => l.name === "Xhosa");
    if (!xhosa) {
      console.error("Xhosa language is missing!");
    }
  }

  updateImageSrc() {
    const img = this.shadowRoot?.querySelector("img");
    if (img) {
      img.setAttribute("src", this.getImageSource());
      img.className = this.getImageClass();
    }
  }

  updateListeners() {
    const img = this.shadowRoot?.querySelector("img");
    // Remove previous listeners if any
    img?.removeEventListener("click", this.imgPDPHandler);
    img?.removeEventListener("click", this.imgPSIHandler);

    // Attach new listeners
    if (this.windowMode === "direct") {
      img?.addEventListener("click", this.imgPSIHandler);
    } else {
      img?.addEventListener("click", this.imgPDPHandler);
    }
  }

  // Web component lifecycle callback: component added to DOM
  connectedCallback() {
  }

  // Web component lifecycle callback: register that we want to observe certain attributes.
  static get observedAttributes(): string[] {
    return [
      "productid",
      "productname",
      "cid",
      "window-mode",
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
    } else if (name === "productname" && newValue !== oldValue && typeof newValue === "string") {
      this.productName = newValue;
    } else if (name === "cid" && newValue !== oldValue && typeof newValue === "string") {
      this.cid = newValue;
    } else if (name === "window-mode" && (newValue === "popup" || newValue === "full" || newValue === "direct") && oldValue !== newValue) {
      // Deprecated mini mode. If sent, fallback to full.
      if (this.windowMode === "popup") {
        this.windowMode = "full";
      }
      this.windowMode = newValue;
      this.updateImageSrc();
      this.updateListeners();
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
    if (this.animation === "on") {
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
        border-radius: 8px;
        transition: 0.35s ease;
      }
      
      img:hover {
        transform: translate(0, -4px);
        cursor: pointer;
        box-shadow: 0 12px 40px 20px rgba(0, 0, 0, 0.05);
      }
        
      img.large {
        height: 104px;
      }
        
      div {
        height: 104px;
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

      img.large {
        height: 104px;
      }
        
      div {
        height: 104px;
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

    // See if the language code is a supported language. First check for edge case (same language letter codes, compare entire codes)  then check for second edge case (3 letter codes; e.g. fil), then normal case (2 letter codes).
    const supportedLanguage = MSStoreBadge.supportedLanguages.find(l => l.code === languageCode.toLowerCase()) || MSStoreBadge.supportedLanguages.find(l => l.code.substring(0, 3) === languageCode.toLowerCase()) || MSStoreBadge.supportedLanguages.find(l => l.code.substring(0, 2) === languageCode.toLowerCase());
    if (supportedLanguage) {
      return supportedLanguage;
    }

    // Language code is unsupported. Fallback to English.
    return MSStoreBadge.englishLanguage;
  }

  static getSupportedLanguageFromUserAgent(): SupportedLanguage {
    // Is the navigator language one of our supported languages? If so, use that.
    const navigatorLanguage = MSStoreBadge.supportedLanguages.find(l => l.code.toLowerCase() === (navigator.language || '').toLowerCase());
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
      const supportedLanguage = MSStoreBadge.supportedLanguages.find(l => l.code.toLowerCase() === languageOnly.toLowerCase());
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
    // Default launch method is now direct, which is PSI
    if (this.windowMode === "direct") {
      image.addEventListener("click", this.imgPSIHandler);
    } else {
      image.addEventListener("click", this.imgPDPHandler);
    }
    return image;
  }

  getImageSource(): string {
    var fileName = null;
    //Dark mode
    if (this.theme === "dark") {
      fileName = this.#languageDetails.imageLarge.fileName
    }
    //Light mode
    else if (this.theme === "light") {
      fileName = this.#languageDetails.imageLargeLight.fileName
    }
    //Auto mode
    else if (this.theme === "auto") {
      const isDark = window.matchMedia('(prefers-color-scheme:dark)').matches;
      if (isDark) { //If detected dark mode
        fileName = this.#languageDetails.imageLargeLight.fileName
      }
      else { //If detected light mode
        fileName = this.#languageDetails.imageLarge.fileName
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
      // Are we on Edge on Windows? Launch the full PDP via the iframe hosted on Edge's whitelisted domain.
      this.launchStoreAppPdpViaWhitelistedDomain();
    } else if (this.#platformDetails.isWindows) {
      // We're on some other browser on Windows. Launch via ms-store-app:// protocol.
      this.launchFullStoreApp();
    } else {
      // We're not on Windows so we can't launch the app. Navigate to the web PDP.
      this.launchStoreWebPdp(e);
    }
  }

  getPSIUrl(): string {
    return `${this.PSIDownloadUrl}${this.productId.toUpperCase()}?referrer=appbadge&source=${encodeURIComponent(window.location.hostname.toLowerCase())}`;
  }

  launchFullStoreApp() {
    const searchParams = new URLSearchParams();
    searchParams.append("productid", this.productId);
    searchParams.append("referrer", "appbadge");
    searchParams.append("source", window.location.hostname.toLowerCase());
    
    if (this.cid) {
      searchParams.append("cid", this.cid);
    }

    location.href = "ms-windows-store://pdp/?" + searchParams.toString();
  }

  launchStoreAppPdpViaWhitelistedDomain() {
    const iframe = this.shadowRoot?.querySelector("iframe");
    // If a CSP error has alread occurred due to blocked iframe, or if we don't have our whitelisted iframe,
    // then we punt and just launch via the normal ms-windows-store protocol.
    if (this.#cspErrorOccurred || !iframe || !iframe.contentWindow) {
      // If a CSP error occurred due to the whitelisted iframe, we can't launch via whitelisted iframe.
      // Fallback to using the ms-windows-store:// protocol.
      this.launchFullStoreApp();
    } else {
      this.#launchViaProtocolOnCspError();

      // Now launch via the whitelisted iframe. 
      const args = {
        message: "launch",
        productId: this.productId,
        cid: this.cid,
        windowMode: this.windowMode,
        source: window.location.hostname,
      };
      iframe.contentWindow.postMessage(args, "*");
    }
  }

  launchStoreWebPdp(e: MouseEvent): void {
    var url = "";
    if (!this.cid) {
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

  /**
   * Listens for content security policy (CSP) errors in the document for a moment. If one occurs due to CSP blocking our whitelisted iframe,
   * we will launch via the ms-windows-store:// protocol as a fallback.
   */
  #launchViaProtocolOnCspError(): void {
    // Listen for content security policy (CSP) errors. This error can happen if the user's domain
    // has blocked iframe navigation to our whitelisted get.microsoft.com domain via their CSP.
    // If that happens, we'll fallback to launching the app via the ms-store-app:// protocol.
    const cspErrorEventName = "securitypolicyviolation";
    const cspErrorListener = (e: SecurityPolicyViolationEvent) => {
      if (e.violatedDirective === "frame-src" && e.type === cspErrorEventName) {
        this.#cspErrorOccurred = true;
        this.launchFullStoreApp();
      }
    }
    document.addEventListener(cspErrorEventName, cspErrorListener, { once: true }); // Once, because we'll only get the error once, even if we try to launch multiple times.

    // Remove the CSP error listener 2s after we try to launch. We don't want to listen for other CSP errors that may exist on the page.
    setTimeout(() => document.removeEventListener(cspErrorEventName, cspErrorListener), 2000);
  }

  static createSupportedLanguages(): SupportedLanguage[] {
    let languageMap = new Map<string, string>();
    languageMap.set("Afrikaans", "af");
    languageMap.set("Albanian", "sq");
    languageMap.set("Amharic", "am");
    languageMap.set("Arabic", "ar");
    languageMap.set("Armenian", "hy");
    languageMap.set("Assamese", "as");
    languageMap.set("Azerbaijani", "az");
    languageMap.set("Bengali", "bn");
    languageMap.set("Bosnian", "bs");
    languageMap.set("Bulgarian", "bg");
    languageMap.set("Catalan", "ca");
    languageMap.set("Chinese_Simplified", "zh-cn");
    languageMap.set("Chinese_Traditional", "zh-tw");
    languageMap.set("Croatian", "hr");
    languageMap.set("Czech", "cs");
    languageMap.set("Danish", "da");
    languageMap.set("Dutch", "nl");
    languageMap.set("English", "en-us");
    languageMap.set("Estonian", "et");
    languageMap.set("Filipino", "fil");
    languageMap.set("Finnish", "fi");
    languageMap.set("French", "fr");
    languageMap.set("Galician", "gl");
    languageMap.set("Georgian", "ka");
    languageMap.set("German", "de");
    languageMap.set("Greek", "el");
    languageMap.set("Gujarati", "gu");
    languageMap.set("Hebrew", "he");
    languageMap.set("Hindi", "hi");
    languageMap.set("Hungarian", "hu");
    languageMap.set("Icelandic", "is");
    languageMap.set("Indonesian", "id");
    languageMap.set("Irish", "ga");
    languageMap.set("Italian", "it");
    languageMap.set("Japanese", "ja");
    languageMap.set("Kannada", "kn");
    languageMap.set("Kazakh", "kk");
    languageMap.set("Khmer", "km");
    languageMap.set("Konkani", "kok");
    languageMap.set("Korean", "ko");
    languageMap.set("Lao", "lo");
    languageMap.set("Latvian", "lv");
    languageMap.set("Lithuanian", "lt");
    languageMap.set("Luxembourgish", "lb");
    languageMap.set("Macedonian", "mk");
    languageMap.set("Malay", "ms");
    languageMap.set("Malayalam", "ml");
    languageMap.set("Maltese", "mt");
    languageMap.set("Māori", "mi");
    languageMap.set("Marathi", "mr");
    languageMap.set("Nepali", "ne");
    languageMap.set("Norwegian", "nn");
    languageMap.set("Oriya", "or");
    languageMap.set("Persian", "fa");
    languageMap.set("Polish", "pl");
    languageMap.set("Portuguese_Brazil", "pt-br");
    languageMap.set("Portuguese_Portugal", "pt-pt");
    languageMap.set("Punjabi", "pa");
    languageMap.set("Quechua", "quz");
    languageMap.set("Romanian", "ro");
    languageMap.set("Russian", "ru");
    languageMap.set("Scottish_Gaelic", "gd");
    languageMap.set("Serbian", "sr");
    languageMap.set("Slovak", "sk");
    languageMap.set("Slovenian", "sl");
    languageMap.set("Spanish", "es");
    languageMap.set("Swedish", "sv");
    languageMap.set("Tamil", "ta");
    languageMap.set("Telugu", "te");
    languageMap.set("Thai", "th");
    languageMap.set("Turkish", "tr");
    languageMap.set("Uighur", "ug");
    languageMap.set("Ukrainian", "uk");
    languageMap.set("Urdu", "ur");
    languageMap.set("Uzbek", "uz");
    languageMap.set("Vietnamese", "vi");
    languageMap.set("Welsh", "cy");
    languageMap.set("Xhosa", "xh");

    let language: SupportedLanguage[] = [];

    for (let name of languageMap.keys()) {
      let currLanguage: SupportedLanguage = {
        name: name,
        imageLarge: { fileName: languageMap.get(name)!.concat(" ").concat("dark.svg") },
        imageLargeLight: { fileName: languageMap.get(name)!.concat(" ").concat("light.svg") },
        code: languageMap.get(name) || ""
      }
      language.push(currLanguage);
    }
    return language;
  }

  static verifyLanguagesAvailable() {
    // Add this near the end of your class
    const expectedLanguages = ["English", "Xhosa", /* other critical languages */];
    const missingLanguages = expectedLanguages.filter(
      lang => !MSStoreBadge.supportedLanguages.some(l => l.name === lang)
    );
    
    if (missingLanguages.length > 0) {
      console.warn(`Missing languages in bundle: ${missingLanguages.join(', ')}`);
    }
  }
}

interface SupportedLanguage {
  name: string;
  imageLarge: SupportedLanguageImage;
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
