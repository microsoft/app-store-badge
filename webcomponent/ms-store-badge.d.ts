import { LitElement } from 'lit';
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
     * to set the size of the badge (image)
     * true for big, false for small
     */
    bigBadge: boolean;
    protected largeBadgeUrl: string;
    protected smallBadgeUrl: string;
    protected iframeLocation: string;
    /**
     * Will contain the right url to the Web PDP or Store App protocol using the product ID
    */
    protected hrefValue: string;
    /**
     * Trying to trigger miniPDP only on Windows 10+
    */
    protected miniPDPcompatible: boolean;
    constructor();
    firstUpdated(): void;
    updated(): void;
    private _checkPlatform;
    private _checkLanguage;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'ms-store-badge': MSStoreBadge;
    }
}
//# sourceMappingURL=ms-store-badge.d.ts.map