(()=>{"use strict";null==window.LeatherTag&&(window.LeatherTag=function(){const t=Object.freeze({el:null,initialTags:[],classList:[],disabled:!1,allowDuplicates:!0,placeholder:"",allowedTags:[],disallowedTags:[],autoComplete:[],regexPattern:null,maxTags:null,showAutoCompleteAfter:null,onClick:function(){},onCreate:function(){},onBeforeTagAdd:function(){},onTagAdd:function(){},onAllAdded:function(){},onBeforeTagRemove:function(){},onTagRemove:function(){},onAllRemoved:function(){},onInvalidTag:function(){},onShowAutoComptele:function(){},onHideAutoComptele:function(){},onSelectAutoCompleteOption:function(){},onFocus:function(){},onBlur:function(){},onInput:function(){},onMaxTags:function(){}});function e(o=t){let n=b(t,o),s={tagsWrapper:null,inputElement:null,autoCompleteWrapper:null},l=[],a=[],r=!1,d=[],h=[],c=e.prototype.hideAutoComplete.bind(this),p=!1,m=null,E=!1;Object.defineProperty(this,"config",{get:()=>n,set:t=>{null!=t&&Object.keys(t).length>0&&(n=b(n,t),u.call(this),i.call(this),this.values=n.initialTags,this.disabled=n.disabled,this.autoComplete=n.autoComplete)}}),Object.defineProperty(this,"dom",{get:()=>s}),Object.defineProperty(this,"values",{get:()=>l,set:t=>{if(t instanceof Array==0)throw new Error("ERROR[set.values] :: parameter is not instance of Array");l=[],this.tagItems=[],this.dom.tagsWrapper.innerHTML="",this.dom.tagsWrapper.appendChild(this.dom.inputElement),this.addAll(t)}}),Object.defineProperty(this,"tagItems",{get:()=>a,set:t=>a=t}),Object.defineProperty(this,"inputValue",{get:()=>this.dom.inputElement.value,set:t=>this.dom.inputElement.value=t}),Object.defineProperty(this,"disabled",{get:()=>r,set:t=>{switch(t){case!0:this.dom.tagsWrapper.classList.add("yk-tags--disabled");break;case!1:this.dom.tagsWrapper.classList.remove("yk-tags--disabled")}r=t}}),Object.defineProperty(this,"autoComplete",{get:()=>d,set:t=>{if(t instanceof Array==0)throw new Error("ERROR[set.autoComplete] :: parameter is not instance of Array");d=t,C.call(this,d)}}),Object.defineProperty(this,"shownAutoCompleteOptions",{get:()=>h,set:t=>h=t}),Object.defineProperty(this,"autoCompleteOpen",{get:()=>p,set:t=>{switch(t){case!0:g.call(this),p=!0;break;case!1:f.call(this),p=!1}}}),Object.defineProperty(this,"_bindFuncHideAutoComplete",{get:()=>c,set:t=>c=t}),Object.defineProperty(this,"_currentFocusedAutoCompleteElement",{get:()=>m,set:t=>m=t}),Object.defineProperty(this,"_preventAddingTag",{get:()=>E,set:t=>E=t}),this.config=n,this.config.onCreate(this)}function i(){const t=document.getElementById(this.config.el);if(null==t)throw new Error("ERROR[_initGUI] :: target element not found");if(t instanceof HTMLDivElement){this.dom.tagsWrapper=t,this.dom.tagsWrapper.innerHTML="";for(let t=0;t<this.config.classList.length;t++){const e=this.config.classList[t];this.dom.tagsWrapper.classList.add(e)}this.dom.inputElement=document.createElement("input"),this.dom.tagsWrapper.classList.add("yk-tags"),this.dom.inputElement.classList.add("yk-tags__input"),this.dom.tagsWrapper.appendChild(this.dom.inputElement),this.dom.inputElement.setAttribute("placeholder",this.config.placeholder||"Type and press Enter"),this.dom.autoCompleteWrapper=p.call(this),this.dom.tagsWrapper.addEventListener("click",r.bind(this)),this.dom.inputElement.addEventListener("focus",o.bind(this)),this.dom.inputElement.addEventListener("blur",n.bind(this)),this.dom.inputElement.addEventListener("input",s.bind(this)),this.dom.inputElement.addEventListener("keyup",l.bind(this)),this.dom.inputElement.addEventListener("keydown",a.bind(this))}}function o(t){if(this.inputValue.length>0){const t=this.getMatchedAutoCompleteValues(this.inputValue.toLowerCase());t.length>0&&v.call(this,t)}this.config.onFocus(t,this)}function n(t){this.config.onBlur(t,this)}function s(t){if(0==this.inputValue.length)C.call(this,this.autoComplete);else{const t=this.getMatchedAutoCompleteValues(this.inputValue.toLowerCase());t.length>0?v.call(this,t):this.hideAutoComplete()}this.config.onInput(t,this)}function l(t){"Escape"==t.key&&(this.dom.inputElement.blur(),this.hideAutoComplete())}function a(t){switch(t.key){case"Backspace":0==this.inputValue.length&&this.removeTag(this.tagItems.length-1);break;case"Enter":{const t=this.inputValue;t.trim().length>0&&null!=this.addTag(t)&&(this.inputValue="",this.hideAutoComplete())}}if(null!=this.autoComplete&&this.autoComplete.length>0)switch(t.key){case"ArrowUp":{let t=w.call(this,"previousElementSibling");this.inputValue=null==t?"":t}break;case"ArrowDown":{let t=w.call(this,"nextElementSibling");this.inputValue=null==t?"":t}}}function r(t){this.config.onClick(t,this),t.stopPropagation(),this.dom.inputElement.focus(),0==this.autoCompleteOpen&&v.call(this,this.autoComplete)}function u(){const t=this.config.allowedTags,e=this.config.disallowedTags;for(let i=0;i<t.length;i++){const o=t[i];for(let t=0;t<e.length;t++){if(o==e[t])throw new Error(`ERROR[_checkConfigValues] :: '${o}' can't be allowed and disallowed value`)}}}function d(t){const e=this.values.map((t=>t.toLowerCase())),i=t.toLowerCase();for(let t=0;t<e.length;t++){if(i==e[t])return h.call(this,t),!0}return!1}function h(t){null==this._setTimeoutAnimation&&(this._setTimeoutAnimation=setTimeout((()=>{c.call(this,t)}),1e3),this.tagItems[t].dom.classList.add("yk-tags__item--animation"))}function c(t){null!=this._setTimeoutAnimation&&(this.tagItems[t].dom.classList.remove("yk-tags__item--animation"),clearTimeout(this._setTimeoutAnimation),this._setTimeoutAnimation=null)}function p(){const t=document.createElement("div");return t.classList.add("yk-tags__autocomplete"),t.addEventListener("click",(t=>t.stopPropagation())),t}function m(){const t=getComputedStyle(this.dom.tagsWrapper).display;if(null!=this.dom.tagsWrapper.parentElement&&"none"!=t){const t=this.dom.tagsWrapper.getBoundingClientRect();this.dom.autoCompleteWrapper.style.top=`${t.bottom}px`,this.dom.autoCompleteWrapper.style.left=`${t.left}px`,this.dom.autoCompleteWrapper.style.width=`${t.width}px`}}function g(){const t=this.config.showAutoCompleteAfter;null!=this.dom.autoCompleteWrapper.parentElement||null!=t&&this.inputValue.length!=t||(document.body.appendChild(this.dom.autoCompleteWrapper),m.call(this),document.addEventListener("click",this._bindFuncHideAutoComplete),window.addEventListener("resize",this._bindFuncHideAutoComplete),this._scrollParent=A(this.dom.tagsWrapper),null!=this._scrollParent&&(this._scrollParent==document.documentElement&&(this._scrollParent=document),this._scrollParent.addEventListener("scroll",this._bindFuncHideAutoComplete)),this.config.onShowAutoComptele(this))}function f(){this.dom.autoCompleteWrapper.parentElement==document.body&&(document.body.removeChild(this.dom.autoCompleteWrapper),document.removeEventListener("click",this._bindFuncHideAutoComplete),window.removeEventListener("resize",this._bindFuncHideAutoComplete),null!=this._scrollParent&&(this._scrollParent.removeEventListener("scroll",this._bindFuncHideAutoComplete),this._scrollParent=null),null!=this._currentFocusedAutoCompleteElement&&(this._currentFocusedAutoCompleteElement.classList.remove("yk-tags__autocomplete-li--focused"),this._currentFocusedAutoCompleteElement=null),this.shownAutoCompleteOptions=[],this.config.onHideAutoComptele(this))}function C(t){this.dom.autoCompleteWrapper.innerHTML="",this.dom.autoCompleteList=null,this.shownAutoCompleteOptions=[],this._currentFocusedAutoCompleteElement=null;const e=document.createElement("ul");for(let i=0;i<t.length;i++){const o=t[i],n=document.createElement("li");this.shownAutoCompleteOptions.push(o),n.textContent=o,n.setAttribute("data-index",i),n.addEventListener("click",E.bind(this,o)),e.appendChild(n)}this.dom.autoCompleteWrapper.appendChild(e),this.dom.autoCompleteList=e}function E(t){this.config.onSelectAutoCompleteOption(this,t),null!=this.addTag(t)&&(this.inputValue="")}function A(t){return null==t?null:t.scrollHeight>t.clientHeight?t:A(t.parentNode)}function v(t){C.call(this,t),this.showAutoComplete()}function w(t){if(this.dom.autoCompleteList.childElementCount>0){if(null!=this._currentFocusedAutoCompleteElement&&(this._currentFocusedAutoCompleteElement.classList.remove("yk-tags__autocomplete-li--focused"),this._currentFocusedAutoCompleteElement=this._currentFocusedAutoCompleteElement[t]),null==this._currentFocusedAutoCompleteElement)switch(t){case"previousElementSibling":this._currentFocusedAutoCompleteElement=this.dom.autoCompleteList.children[this.dom.autoCompleteList.childElementCount-1];break;case"nextElementSibling":this._currentFocusedAutoCompleteElement=this.dom.autoCompleteList.children[0]}return this._currentFocusedAutoCompleteElement.classList.add("yk-tags__autocomplete-li--focused"),this.shownAutoCompleteOptions[parseInt(this._currentFocusedAutoCompleteElement.dataset.index)]}}function b(t,e){const i={},o=Object.keys(t);for(let n=0;n<o.length;n++){const s=o[n];1==e.hasOwnProperty(s)?i[s]=e[s]:i[s]=t[s]}return i}return e.DefaultConfig=t,e.prototype.addTag=function(t){if(null==t)throw new Error("ERROR[LeatherTag.addTag] :: parameter should not be null");if(this.config.onBeforeTagAdd(this),0==this._preventAddingTag){if(null!=this.config.maxTags&&this.values.length==this.config.maxTags)return void this.config.onMaxTags(this);if(!("string"==typeof t||t instanceof String||t instanceof TagItem))throw new Error("ERROR[LeatherTag.addTag] :: param is not type of string or TagItem");let e={};if("string"==typeof t||t instanceof String?e.value=t.toString():e=t.config,0==this.isValueValid(e.value))return void this.config.onInvalidTag(e.value);let i=null;return t instanceof TagItem?(i=t,i.tagger=this):(e.tagger=this,i=new TagItem(e)),this.dom.tagsWrapper.insertBefore(i.dom.tagItem,this.dom.inputElement),this.values.push(e.value),this.tagItems.push(i),this.config.onTagAdd(this),i}this._preventAddingTag=!1},e.prototype.addAll=function(t){if(t instanceof Array==0)throw new Error("ERROR[LeatherTag.addAll] :: parameter is not instance of Array");t.forEach((t=>{this.addTag(t)})),this.config.onAllAdded()},e.prototype.removeTag=function(t){this.config.onBeforeTagRemove(this);let e=null;for(let i=0;i<this.tagItems.length;i++)if(i==t||this.tagItems[i]==t){this.dom.tagsWrapper.removeChild(this.tagItems[i].dom),this.values.splice(i,1),e=this.tagItems.splice(i,1)[0];break}return this.config.onTagRemove(this),e},e.prototype.removeAll=function(){for(let t=0;t<this.tagItems.length;)this.removeTag(this.tagItems[t]);this.config.onAllRemoved()},e.prototype.getMatchedAutoCompleteValues=function(t){return this.autoComplete.filter((e=>e.toLowerCase().includes(t)))},e.prototype.showAutoComplete=function(){this.autoCompleteOpen=!0},e.prototype.hideAutoComplete=function(){this.autoCompleteOpen=!1},e.prototype.preventAddTag=function(){this._preventAddingTag=!0},e.prototype.isValueValid=function(t){return(null==this.config.regexPattern||0!=this.config.regexPattern.test(t))&&((0!=this.config.allowDuplicates||!d.call(this,t))&&(!(this.config.allowedTags.length>0&&0==this.config.allowedTags.map((t=>t.toLowerCase())).includes(t.toLowerCase()))&&!(this.config.disallowedTags.length>0&&this.config.disallowedTags.map((t=>t.toLowerCase())).includes(t.toLowerCase()))))},e}(),window.TagItem=function(){const t=Object.freeze({tagger:null,disabled:!1,readonly:!1,value:null,data:null,classList:[],template:()=>{},onClick:()=>{}});function e(e=t){let o=function(t,e){const i={},o=Object.keys(t);for(let n=0;n<o.length;n++){const s=o[n];1==e.hasOwnProperty(s)?i[s]=e[s]:i[s]=t[s]}return i}(t,e);if(null==o.value)throw new Error("ERROR[TagItem] :: Please provide a tag value");let n=o.value,s=null,l=null,a=o.data,r=!1;Object.defineProperty(this,"tagger",{get:()=>s,set:t=>s=t}),Object.defineProperty(this,"config",{get:()=>o}),Object.defineProperty(this,"dom",{get:()=>l}),Object.defineProperty(this,"value",{get:()=>n,set:t=>n=t}),Object.defineProperty(this,"data",{get:()=>a,set:t=>a=t}),Object.defineProperty(this,"disabled",{get:()=>r,set:t=>{switch(t){case!0:r=!0,this.dom.tagItem.classList.add("yk-tags__item--disabled"),this.dom.tagItem.removeChild(this.dom.tagDeleteBtn);break;case!1:r=!1,this.dom.tagItem.classList.remove("yk-tags__item--disabled"),this.dom.tagItem.appendChild(this.dom.tagDeleteBtn)}}}),l=i.call(this),this.disabled=o.disabled,this.tagger=o.tagger}function i(){const t=document.createElement("div"),e=document.createElement("span"),i=document.createElement("button");return t.classList.add("yk-tags__item"),e.classList.add("yk-tags__value"),i.classList.add("yk-tags__btn-remove"),i.innerHTML='<svg width="14" height="14" viewBox="0 0 48 48"><path d="M38 12.83l-2.83-2.83-11.17 11.17-11.17-11.17-2.83 2.83 11.17 11.17-11.17 11.17 2.83 2.83 11.17-11.17 11.17 11.17 2.83-2.83-11.17-11.17z"/></svg>',i.addEventListener("click",o.bind(this)),e.textContent=this.value,t.appendChild(e),t.appendChild(i),{tagItem:t,tagDeleteBtn:i}}function o(t){t.stopPropagation(),this.remove(this)}return e.prototype.remove=function(){this.tagger.removeTag(this)},e}())})();