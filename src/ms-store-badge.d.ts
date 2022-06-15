/**
 * <ms-store-badge> web component
 *
 * The app badge renders and iframe hosted on a domain whitelisted by Microsoft Edge so that users avoid
 * the browser security pop-up asking to launch another apps. Browsers other than Edge will show the
 * security pop-up.
 *
 * On non-Windows 10+ machines, it will simply display an href with an image to redirect to the Web PDP
 */
declare class MSStoreBadge extends HTMLElement {
    #private;
    /**
     * The ID of your app.
     */
    productId: string;
    /**
     * The optional campaign ID of your app.
     */
    cid: string;
    /**
      * Indicates whether popup or full mode should be launched.
      */
    windowMode: "popup" | "full";
    /**
      * Indicates whether badge should be in dark mode, light mode, or auto mode.
      */
    theme: "dark" | "light" | "auto";
    /**
     * Sets the size of the badge. Should be "small" or "large"
     */
    size: "small" | "large";
    /**
     * Sets the language. If null or omitted, the language will be auto-detected from the user's browser language.
     */
    language: string | null;
    /**
     * Indicates whether badge animation should be applied or not.
     */
    animation: "on" | "off";
    static englishLanguage: SupportedLanguage;
    static supportedLanguages: SupportedLanguage[];
    constructor();
    updateImageSrc(): void;
    connectedCallback(): void;
    static get observedAttributes(): string[];
    attributeChangedCallback(name: string, oldValue: any, newValue: any): void;
    createStyle(): HTMLStyleElement;
    createHtml(): HTMLElement;
    private getPlatformDetails;
    private static getSupportedLanguageFromCode;
    static getSupportedLanguageFromUserAgent(): SupportedLanguage;
    createIFrame(): HTMLIFrameElement;
    createImage(): HTMLImageElement;
    getImageSource(): string;
    getImageClass(): string;
    launchApp(e: MouseEvent): void;
    launchStoreAppPdp(): void;
    launchStoreAppPdpViaWhitelistedDomain(): void;
    launchStoreWebPdp(e: MouseEvent): void;
    static createSupportedLanguages(): SupportedLanguage[];
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
//# sourceMappingURL=ms-store-badge.d.ts.map