var t=function(t,i,e,n){return new(e||(e=Promise))((function(o,r){function s(t){try{c(n.next(t))}catch(t){r(t)}}function a(t){try{c(n.throw(t))}catch(t){r(t)}}function c(t){var i;t.done?o(t.value):(i=t.value,i instanceof e?i:new e((function(t){t(i)}))).then(s,a)}c((n=n.apply(t,i||[])).next())}))};function i(i,e){return t(this,arguments,void 0,(function*(i,e,n={},o){const r="psi_f_svc",s={method:"GET",headers:{Origin:"https://apps.microsoft.com",Referer:document.URL,"Access-Control-Request-Method":"GET","X-Correlation-Id":crypto.randomUUID(),"Content-Type":"application/octet-stream"},cache:"no-cache",params:new URLSearchParams(o)},a=Object.assign(Object.assign({},s),n);let c=null;try{c=yield fetch(`${o}`,a)}catch(t){window.location.href=`ms-windows-store://pdp/?productid=${i}&ocid=${r}na`}(null==c?void 0:c.ok)?function(i){t(this,void 0,void 0,(function*(){var t;const n=null!==(t=i.headers.get("X-PSI-FileName"))&&void 0!==t?t:`${e} Installer.exe`,o=yield i.blob(),r=URL.createObjectURL(o),s=document.createElement("a");s.href=r,s.download=decodeURIComponent(n),s.style.display="none",document.body.appendChild(s);try{s.click(),yield new Promise((t=>setTimeout(t,1e3)))}catch(t){}finally{URL.revokeObjectURL(r),document.body.removeChild(s)}}))}(c):function(e){t(this,void 0,void 0,(function*(){const t=null==e?void 0:e.status;window.location.href=`ms-windows-store://pdp/?productid=${i}&ocid=${r}${t}`}))}(c)}))}var e=function(t,i,e,n){return new(e||(e=Promise))((function(o,r){function s(t){try{c(n.next(t))}catch(t){r(t)}}function a(t){try{c(n.throw(t))}catch(t){r(t)}}function c(t){var i;t.done?o(t.value):(i=t.value,i instanceof e?i:new e((function(t){t(i)}))).then(s,a)}c((n=n.apply(t,i||[])).next())}))};let n=!1;var o,r,s,a,c,h,d,l,u,f=function(t,i,e,n){return new(e||(e=Promise))((function(o,r){function s(t){try{c(n.next(t))}catch(t){r(t)}}function a(t){try{c(n.throw(t))}catch(t){r(t)}}function c(t){var i;t.done?o(t.value):(i=t.value,i instanceof e?i:new e((function(t){t(i)}))).then(s,a)}c((n=n.apply(t,i||[])).next())}))},m=function(t,i,e,n,o){if("m"===n)throw new TypeError("Private method is not writable");if("a"===n&&!o)throw new TypeError("Private accessor was defined without a setter");if("function"==typeof i?t!==i||!o:!i.has(t))throw new TypeError("Cannot write private member to an object whose class did not declare it");return"a"===n?o.call(t,e):o?o.value=e:i.set(t,e),e},p=function(t,i,e,n){if("a"===e&&!n)throw new TypeError("Private accessor was defined without a getter");if("function"==typeof i?t!==i||!n:!i.has(t))throw new TypeError("Cannot read private member from an object whose class did not declare it");return"m"===e?n:"a"===e?n.call(t):n?n.value:i.get(t)};class g extends HTMLElement{constructor(){super(),o.add(this),this.productId="",this.productName="",this.cid="",this.size="large",this.windowMode="direct",this.theme="dark",this.language="",this.animation="off",s.set(this,r.englishLanguage),a.set(this,"prod"),c.set(this,"dev"===p(this,a,"f")?"iframe.html":"https://get.microsoft.com/iframe.html"),h.set(this,"dev"===p(this,a,"f")?"/images":"https://get.microsoft.com/images"),d.set(this,{isWindows:!1,windowsVersion:null,isEdgeBrowser:!1}),l.set(this,!1),this.PSIDownloadUrl="https://get.microsoft.com/installer/download/",this.throttleDownload=function(t,i){return(...o)=>e(this,void 0,void 0,(function*(){if(!n){n=!0;try{yield t(...o)}finally{setTimeout((()=>n=!1),i)}}}))}(i,1500),this.imgPSIHandler=()=>this.throttleDownload(this.productId,this.productName||"Microsoft Store Direct",void 0,this.getPSIUrl()),this.imgPDPHandler=t=>this.launchApp(t),this.getPlatformDetails().then((t=>m(this,d,t,"f"))),m(this,s,r.getSupportedLanguageFromCode(this.language),"f"),this.language=p(this,s,"f").code;const t=this.attachShadow({mode:"open"}),u=this.createStyle(),f=this.createHtml();t.appendChild(u),t.appendChild(f)}updateImageSrc(){var t;const i=null===(t=this.shadowRoot)||void 0===t?void 0:t.querySelector("img");i&&(i.setAttribute("src",this.getImageSource()),i.className=this.getImageClass())}updateListeners(){var t;const i=null===(t=this.shadowRoot)||void 0===t?void 0:t.querySelector("img");null==i||i.removeEventListener("click",this.imgPDPHandler),null==i||i.removeEventListener("click",this.imgPSIHandler),"direct"===this.windowMode?null==i||i.addEventListener("click",this.imgPSIHandler):null==i||i.addEventListener("click",this.imgPDPHandler)}connectedCallback(){}static get observedAttributes(){return["productid","productname","cid","window-mode","theme","size","language","animation"]}attributeChangedCallback(t,i,e){var n;"size"!==t||"large"!==e&&"small"!==e||i===e?"language"!==t||e===i||"string"!=typeof e&&e?"productid"===t&&e!==i&&"string"==typeof e?this.productId=e:"productname"===t&&e!==i&&"string"==typeof e?this.productName=e:"cid"===t&&e!==i&&"string"==typeof e?this.cid=e:"window-mode"!==t||"popup"!==e&&"full"!==e&&"direct"!==e||i===e?"theme"!==t||"dark"!=e&&"light"!==e&&"auto"!==e||i===e?"animation"!==t||"on"!==e&&"off"!==e||i===e||(this.animation=e,null===(n=this.shadowRoot)||void 0===n||n.appendChild(this.createStyle())):(this.theme=e,this.updateImageSrc()):("popup"===this.windowMode&&(this.windowMode="full"),this.windowMode=e,this.updateImageSrc(),this.updateListeners()):(m(this,s,r.getSupportedLanguageFromCode(e),"f"),this.language=p(this,s,"f").code,this.updateImageSrc()):(this.size=e,this.updateImageSrc())}createStyle(){var t="";t="on"===this.animation?"\n      :host {\n        display: inline-block;\n        cursor: pointer;\n        height: fit-content;\n      }\n\n      iframe {\n        border: none;\n        width: 0px;\n        height: 0px;\n      }\n\n      img {\n        border-radius: 8px;\n        transition: 0.35s ease;\n      }\n      \n      img:hover {\n        transform: translate(0, -4px);\n        cursor: pointer;\n        box-shadow: 0 12px 40px 20px rgba(0, 0, 0, 0.05);\n      }\n        \n      img.large {\n        height: 104px;\n      }\n        \n      div {\n        height: 104px;\n      }":"\n      :host {\n        display: inline-block;\n        cursor: pointer;\n        height: fit-content;\n      }\n\n      iframe {\n        border: none;\n        width: 0px;\n        height: 0px;\n      }\n\n      img {\n        width: auto;\n        border-radius: 8px;\n      }\n\n      img.large {\n        height: 104px;\n      }\n        \n      div {\n        height: 104px;\n      }";const i=document.createElement("style");return i.textContent=t,i}createHtml(){const t=document.createElement("div");return t.appendChild(this.createImage()),t.appendChild(this.createIFrame()),t}getPlatformDetails(){return f(this,void 0,void 0,(function*(){const t=navigator;if(t.userAgentData&&t.userAgentData.getHighEntropyValues)try{const i=yield t.userAgentData.getHighEntropyValues(["platform","platformVersion"]),e="Windows"===i.platform;return{isWindows:e,windowsVersion:e?parseFloat((null==i?void 0:i.platformVersion)||""):null,isEdgeBrowser:(t.userAgentData.brands||[]).some((t=>"Microsoft Edge"===t.brand))}}catch(t){}const i=new RegExp(/.?Windows NT (\d+\.?\d?\.?\d?\.?\d?)/gi).exec(navigator.userAgent);return i&&i.length>=2?{isWindows:!0,windowsVersion:parseFloat(i[1]),isEdgeBrowser:!!navigator.userAgent.match("Edg/")}:{isWindows:!1,windowsVersion:null,isEdgeBrowser:!!navigator.userAgent.match("Edg/")}}))}static getSupportedLanguageFromCode(t){if(!t)return r.getSupportedLanguageFromUserAgent();const i=r.supportedLanguages.find((i=>i.code===t.toLowerCase()))||r.supportedLanguages.find((i=>i.code.substring(0,3)===t.toLowerCase()))||r.supportedLanguages.find((i=>i.code.substring(0,2)===t.toLowerCase()));return i||r.englishLanguage}static getSupportedLanguageFromUserAgent(){const t=r.supportedLanguages.find((t=>t.code.toLowerCase()===(navigator.language||"").toLowerCase()));if(t)return t;if(navigator.languages){var i=navigator.languages.map((t=>r.supportedLanguages.find((i=>i.code===t)))).find((t=>!!t));if(i)return i}const e=navigator.language.indexOf("-");if(e>0){const t=navigator.language.substring(0,e),i=r.supportedLanguages.find((i=>i.code.toLowerCase()===t.toLowerCase()));if(i)return i}return r.englishLanguage}createIFrame(){const t=document.createElement("iframe");return t.setAttribute("loading","eager"),t.title="Microsoft Store App Badge",t.src=p(this,c,"f"),t}createImage(){const t=document.createElement("img");return t.setAttribute("part","img"),t.src=this.getImageSource(),t.className=this.getImageClass(),t.alt="Microsoft Store app badge","direct"===this.windowMode?t.addEventListener("click",this.imgPSIHandler):t.addEventListener("click",this.imgPDPHandler),t}getImageSource(){var t=null;if("dark"===this.theme)t=p(this,s,"f").imageLarge.fileName;else if("light"===this.theme)t=p(this,s,"f").imageLargeLight.fileName;else if("auto"===this.theme){t=window.matchMedia("(prefers-color-scheme:dark)").matches?p(this,s,"f").imageLargeLight.fileName:p(this,s,"f").imageLarge.fileName}return`${p(this,h,"f")}/${t}`}getImageClass(){return"large"===this.size?"large":"small"}launchApp(t){this.productId&&(p(this,d,"f").isWindows&&p(this,d,"f").isEdgeBrowser?this.launchStoreAppPdpViaWhitelistedDomain():p(this,d,"f").isWindows?this.launchFullStoreApp():this.launchStoreWebPdp(t))}getPSIUrl(){return`${this.PSIDownloadUrl}${this.productId.toUpperCase()}?referrer=appbadge&source=${encodeURIComponent(window.location.hostname.toLowerCase())}`}launchFullStoreApp(){const t=new URLSearchParams;t.append("productid",this.productId),t.append("referrer","appbadge"),t.append("source",window.location.hostname.toLowerCase()),this.cid&&t.append("cid",this.cid),location.href="ms-windows-store://pdp/?"+t.toString()}launchStoreAppPdpViaWhitelistedDomain(){var t;const i=null===(t=this.shadowRoot)||void 0===t?void 0:t.querySelector("iframe");if(!p(this,l,"f")&&i&&i.contentWindow){p(this,o,"m",u).call(this);const t={message:"launch",productId:this.productId,cid:this.cid,windowMode:this.windowMode,source:window.location.hostname};i.contentWindow.postMessage(t,"*")}else this.launchFullStoreApp()}launchStoreWebPdp(t){var i="";i=this.cid?`https://apps.microsoft.com/store/detail/${this.productId}?cid=${encodeURIComponent(this.cid)}&referrer=appbadge&source=${encodeURIComponent(window.location.hostname.toLowerCase())}`:`https://apps.microsoft.com/store/detail/${this.productId}?referrer=appbadge&source=${encodeURIComponent(window.location.hostname.toLowerCase())}`,t.ctrlKey?window.open(i,"_blank"):window.location.href=i}static createSupportedLanguages(){let t=new Map;t.set("Afrikaans","af"),t.set("Albanian","sq"),t.set("Amharic","am"),t.set("Arabic","ar"),t.set("Armenian","hy"),t.set("Assamese","as"),t.set("Azerbaijani","az"),t.set("Bengali","bn"),t.set("Bosnian","bs"),t.set("Bulgarian","bg"),t.set("Catalan","ca"),t.set("Chinese_Simplified","zh-cn"),t.set("Chinese_Traditional","zh-tw"),t.set("Croatian","hr"),t.set("Czech","cs"),t.set("Danish","da"),t.set("Dutch","nl"),t.set("English","en-us"),t.set("Estonian","et"),t.set("Filipino","fil"),t.set("Finnish","fi"),t.set("French","fr"),t.set("Galician","gl"),t.set("Georgian","ka"),t.set("German","de"),t.set("Greek","el"),t.set("Gujarati","gu"),t.set("Hebrew","he"),t.set("Hindi","hi"),t.set("Hungarian","hu"),t.set("Icelandic","is"),t.set("Indonesian","id"),t.set("Irish","ga"),t.set("Italian","it"),t.set("Japanese","ja"),t.set("Kannada","kn"),t.set("Kazakh","kk"),t.set("Khmer","km"),t.set("Konkani","kok"),t.set("Korean","ko"),t.set("Lao","lo"),t.set("Latvian","lv"),t.set("Lithuanian","lt"),t.set("Luxembourgish","lb"),t.set("Macedonian","mk"),t.set("Malay","ms"),t.set("Malayalam","ml"),t.set("Maltese","mt"),t.set("Māori","mi"),t.set("Marathi","mr"),t.set("Nepali","ne"),t.set("Norwegian","nn"),t.set("Oriya","or"),t.set("Persian","fa"),t.set("Polish","pl"),t.set("Portuguese_Brazil","pt-br"),t.set("Portuguese_Portugal","pt-pt"),t.set("Punjabi","pa"),t.set("Quechua","quz"),t.set("Romanian","ro"),t.set("Russian","ru"),t.set("Scottish_Gaelic","gd"),t.set("Serbian","sr"),t.set("Slovak","sk"),t.set("Slovenian","sl"),t.set("Spanish","es"),t.set("Swedish","sv"),t.set("Tamil","ta"),t.set("Telugu","te"),t.set("Thai","th"),t.set("Turkish","tr"),t.set("Uighur","ug"),t.set("Ukrainian","uk"),t.set("Urdu","ur"),t.set("Uzbek","uz"),t.set("Vietnamese","vi");let i=[];for(let e of t.keys()){let n={name:e,imageLarge:{fileName:t.get(e).concat(" ").concat("dark.svg")},imageLargeLight:{fileName:t.get(e).concat(" ").concat("light.svg")},code:t.get(e)||""};i.push(n)}return i}}r=g,s=new WeakMap,a=new WeakMap,c=new WeakMap,h=new WeakMap,d=new WeakMap,l=new WeakMap,o=new WeakSet,u=function(){const t="securitypolicyviolation",i=i=>{"frame-src"===i.violatedDirective&&i.type===t&&(m(this,l,!0,"f"),this.launchFullStoreApp())};document.addEventListener(t,i,{once:!0}),setTimeout((()=>document.removeEventListener(t,i)),2e3)},g.englishLanguage={name:"English",code:"en-us",imageLarge:{fileName:"en-us dark.svg"},imageLargeLight:{fileName:"en-us light.svg"}},g.supportedLanguages=r.createSupportedLanguages(),customElements.define("ms-store-badge",g);
