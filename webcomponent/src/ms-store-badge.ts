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
   * to set the size of the badge (image)
   * true for big, false for small
   */
  @property({ type: Boolean }) bigBadge = false;

  @state()
  protected largeBadgeUrl = "https://developer.microsoft.com/store/badges/images/English_get-it-from-MS.png";

  @state()
  protected smallBadgeUrl = "https://developer.microsoft.com/store/badges/images/English_get_L.png";

  @state()
  protected iframeLocation = "https://david.blob.core.windows.net/tests/minipdp/iframe.html";

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

    switch (this.language) {
      case "ar":
        this.largeBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Arabic_get_it_from_MS.png';
        this.smallBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Arabic_get_L.png';
        break;
      case "be":
        this.largeBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Belarusian_get-it-from-MS.png';
        this.smallBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Belarusian_get_L.png';
        break;
      case "bn":
        this.largeBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Bengali_get-it-from-MS.png';
        this.smallBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Bengali_get_L.png';
        break;
      case "bs":
        this.largeBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Bosnian_get-it-from-MS.png';
        this.smallBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Bosnian_get_L.png';
        break;
      case "bg":
        this.largeBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Bulgarian_get-it-from-MS.png';
        this.smallBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Bulgarian_get_L.png';
        break;
      case "zh":
        this.largeBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Chinese_Simplified_get-it-from-MS.png';
        this.smallBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Chinese_Simplified_Get_L.png';
        break;
      case "hr":
        this.largeBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Croatian_get-it-from-MS.png';
        this.smallBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Croatian_get_L.png';
        break;
      case "cs":
        this.largeBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Czech_get-it-from-MS.png';
        this.smallBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Czech_get_L.png';
        break;
      case "da":
        this.largeBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Danish_get-it-from-MS.png';
        this.smallBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Danish_get_L.png';
        break;
      case "nl":
        this.largeBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Dutch_get-it-from-MS.png';
        this.smallBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Dutch_get_L.png';
        break;
      case "et":
        this.largeBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Estonian_get-it-from-MS.png';
        this.smallBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Estonian_get_L.png';
        break;
      case "fil":
        this.largeBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Filipino_get-it-from-MS.png';
        this.smallBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Filipino_get_L.png';
        break;
      case "fi":
        this.largeBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Finnish_get-it-from-MS.png';
        this.smallBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Finnish_get_L.png';
        break;
      case 'fr':
        this.largeBadgeUrl = 'https://developer.microsoft.com/store/badges/images/French_get-it-from-MS.png';
        this.smallBadgeUrl = 'https://developer.microsoft.com/store/badges/images/French_get_L.png';
        break;
      case "de":
        this.largeBadgeUrl = 'https://developer.microsoft.com/store/badges/images/German_get-it-from-MS.png';
        this.smallBadgeUrl = 'https://developer.microsoft.com/store/badges/images/German_get_L.png';
        break;
      case "el":
        this.largeBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Greek_-get-it-from-MS.png';
        this.smallBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Greek_get_L.png';
        break;
      case "he":
        this.largeBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Hebrew_-get-it-from-MS.png';
        this.smallBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Hebrew_get_L.png';
        break;
      case "hi":
        this.largeBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Hindi_get-it-from-MS.png';
        this.smallBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Hindi_get_L.png';
        break;
      case "hu":
        this.largeBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Hungarian_get-it-from-MS.png';
        this.smallBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Hungarian_get_L.png';
        break;
      case "id":
        this.largeBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Indonesian_get-it-from-MS.png';
        this.smallBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Indonesian_get_L.png';
        break;
      case "it":
        this.largeBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Italian_get-it-from-MS.png';
        this.smallBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Italian_get_L.png';
        break;
      case "ja":
        this.largeBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Japanese_-get-it-from-MS.png';
        this.smallBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Japan_Get__L.png';
        break;
      case "ko":
        this.largeBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Korean_get-it-from-MS.png';
        this.smallBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Korean_get_L.png';
        break;
      case "lv":
        this.largeBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Latvian_get-it-from-MS.png';
        this.smallBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Latvian_get_L.png';
        break;
      case "lt":
        this.largeBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Lithuanian_get-it-from-MS.png';
        this.smallBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Lithuanian_get_L.png';
        break;
      case "ms":
        this.largeBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Malay_get-it-from-MS.png';
        this.smallBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Malay_get_L.png';
        break;
      case "no":
        this.largeBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Norwegian_get-it-from-MS.png';
        this.smallBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Norwegian_get_L.png';
        break;
      case "pl":
        this.largeBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Polish_get-it-from-MS.png';
        this.smallBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Polish_get_L.png';
        break;
      case "pt":
        if (navigator.language.toLowerCase() === 'pt-br') {
          this.largeBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Portuguese-Brazilian_get-it-from-MS.png';
          this.smallBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Portuguese_Brazil_get_L.png';
        }
        else {
          this.largeBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Portuguese-Portugal_get-it-from-MS.png';
          this.smallBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Portuguese_Portugal_get_L.png';
        }
        break;
      case "ro":
        this.largeBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Romanian_get-it-from-MS.png';
        this.smallBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Romanian_get_L.png';
        break;
      case "ru":
        this.largeBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Russian_get_it_from_MS.png';
        this.smallBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Russian_get_L.png';
        break;
      case "sr":
        this.largeBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Serbian_get-it-from-MS.png';
        this.smallBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Serbian_get_L.png';
        break;
      case "sk":
        this.largeBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Slovak_get-it-from-MS.png';
        this.smallBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Slovak_get_L.png';
        break;
      case "sl":
        this.largeBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Slovenian_get_it_from_MS.png';
        this.smallBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Slovenian_get_L.png';
        break;
      case "es":
        this.largeBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Spanish_get-it-from-MS.png';
        this.smallBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Spanish_get_L.png';
        break;
      case "sw":
        this.largeBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Swahili_get-it-from-MS.png';
        this.smallBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Swahili_get_L.png';
        break;
      case "sv":
        this.largeBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Swedish_get-it-from-MS.png';
        this.smallBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Swedish_get_L.png';
        break;
      case "th":
        this.largeBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Thai_get-it-from-MS.png';
        this.smallBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Thai_get_L.png';
        break;
      case "tr":
        this.largeBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Turkish_get-it-from-MS.png';
        this.smallBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Turkish_get_L.png';
        break;
      case "uk":
        this.largeBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Ukranian_get_it_from_MS.png';
        this.smallBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Ukranian_get.png';
        break;
      case "vi":
        this.largeBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Vietnamese_get_it_from_MS.png';
        this.smallBadgeUrl = 'https://developer.microsoft.com/store/badges/images/Vietnamese_get.png';
        break;
    }
  }

  render() {
    let badge;
    let iframe;

    if (this.bigBadge) {
      badge = html`<img src="${this.largeBadgeUrl}" alt="Microsoft Store badge logo" class="largeBadge" />`;
      iframe = html`<iframe
  src='${this.iframeLocation}?productId=${this.productId}&amp;language=${this.language}&amp;badgeSize=big&amp;imgUrl=${this.largeBadgeUrl}&amp;targetUrl=${this.hrefValue}'
  class="iframeBig"></iframe>`;
    }
    else {
      badge = html`<img src="${this.smallBadgeUrl}" alt="Microsoft Store badge logo" class="smallBadge" />`;
      iframe = html`<iframe
  src='${this.iframeLocation}?prodZZZZZuctId=${this.productId}&amp;language=${this.language}&amp;imgUrl=${this.smallBadgeUrl}&amp;targetUrl=${this.hrefValue}'
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
