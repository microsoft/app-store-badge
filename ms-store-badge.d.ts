import { LitElement, TemplateResult } from 'lit';
/**
 * <ms-store-badge> web component
 *
 * Will try to use the Store App protocol to launch the mini PDP on Windows 10+ via an iframe
 * hosted on a default allowed domain by Edge. It will generate a small security pop-up on Chrome
 * and will work without security pop-up in Firefox
 *
 * On non-Windows 10+ machines, it will simply display a href with an image to redirect to the Web PDP
 */
export declare class MSStoreBadge extends LitElement {
    static styles: import("lit").CSSResultGroup;
    /**
     * product Id of the Microsoft Store App provided in the Partner Center portal.
     */
    productId: string;
    /**
     * language to use for the badge image (en, fr, zh, etc.)
     * if not set, the component will auto detect the browser preferred language
     */
    language: string;
    /**
     * Sets the size of the badge. Should be "small" or "large"
     */
    size: "small" | "large";
    protected languageDetails: SupportedLanguage;
    protected iframeLocation: string;
    /**
     * Trying to trigger miniPDP only on Windows 10+
    */
    protected miniPDPcompatible: boolean;
    private static englishLanguage;
    private static supportedLanguages;
    constructor();
    get imageUrl(): string;
    /**
     * Will contain the right url to the Web PDP or Store App protocol using the product ID
    */
    get hrefValue(): string;
    firstUpdated(): void;
    updated(): void;
    private _checkPlatform;
    private _checkLanguage;
    static getSupportedLanguageFromUserAgent(): SupportedLanguage;
    render(): TemplateResult<2 | 1>;
    renderIFrame(width: number, height: number): TemplateResult;
    renderImage(width: number, height: number): TemplateResult;
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
    aspectRatio: number;
}
export {};
//# sourceMappingURL=ms-store-badge.d.ts.map