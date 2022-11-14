import "./leather-tag.css"

"use strict";

if(window.LeatherTag == undefined) {

  /**
   * LeatherTag Class
   */
  window.LeatherTag = (function() {
    
    const _defaultConfig = Object.freeze({
      el: null,
      initialTags: [],
      classList: [],
      disabled: false,
      allowDuplicates: true,
      placeholder: "",
      allowedTags: [],
      disallowedTags: [],
      autoComplete: [],
      regexPattern: null,
      maxTags: null,
      showAutoCompleteAfter: null,
      onClick: function() {},
      onCreate: function() {},
      onBeforeTagAdd: function() {},
      onTagAdd: function() {},
      onAllAdded: function() {},
      onBeforeTagRemove: function() {},
      onTagRemove: function() {},
      onAllRemoved: function() {},
      onInvalidTag: function() {},
      onShowAutoComptele: function() {},
      onHideAutoComptele: function() {},
      onSelectAutoCompleteOption: function() {},
      onFocus: function() {},
      onBlur: function() {},
      onInput: function() {},
      onMaxTags: function() {},
      //mixed: false,
      //minTags: null,
      //forceAutoCompleteOptions: false,
      //onEdit: function() {},
    })

    LeatherTag.DefaultConfig = _defaultConfig

    function LeatherTag(config = _defaultConfig) {
      let _config = _buildConfigObject(_defaultConfig, config)
      let _dom = {
        tagsWrapper: null,
        inputElement: null,
        autoCompleteWrapper: null,
      }
      let _values = []
      let _tagItems = []
      let _disabled = false
      let _autoComplete = []
      let _shownAutoCompleteOptions = []
      let _bindFuncHideAutoComplete = LeatherTag.prototype.hideAutoComplete.bind(this)
      let _autoCompleteOpen = false
      let _currentFocusedAutoCompleteElement = null
      let _preventAddingTag = false

      Object.defineProperty(this, "config", {
        get: () => _config,
        set: (value) => {
          if(value != null && Object.keys(value).length > 0) {
            _config = _buildConfigObject(_config, value)
            _checkConfigValues.call(this)
            _initGUI.call(this)
            this.values = _config.initialTags
            this.disabled = _config.disabled
            this.autoComplete = _config.autoComplete
          }
        }
      })
      Object.defineProperty(this, "dom", {
        get: () => _dom
      })
      Object.defineProperty(this, "values", {
        get: () => _values,
        set: (value) => {
          if((value instanceof Array) == false) {
            throw new Error("ERROR[set.values] :: parameter is not instance of Array")
          }
          _values = []
          this.tagItems = []
          this.dom.tagsWrapper.innerHTML = ""
          this.dom.tagsWrapper.appendChild(this.dom.inputElement)
          this.addAll(value)
        },
      })
      Object.defineProperty(this, "tagItems", {
        get: () => _tagItems,
        set: (value) => _tagItems = value,
      })
      Object.defineProperty(this, "inputValue", {
        get: () => this.dom.inputElement.value,
        set: (value) => this.dom.inputElement.value = value,
      })
      Object.defineProperty(this, "disabled", {
        get: () => _disabled,
        set: (value) => {
          switch (value) {
            case true: {
              this.dom.tagsWrapper.classList.add("yk-tags--disabled")
            } break;
            case false: {
              this.dom.tagsWrapper.classList.remove("yk-tags--disabled")
            } break;
          }
          _disabled = value
        },
      })
      Object.defineProperty(this, "autoComplete", {
        get: () => _autoComplete,
        set: (value) => {
          if((value instanceof Array) == false) {
            throw new Error("ERROR[set.autoComplete] :: parameter is not instance of Array")
          }
          _autoComplete = value
          _buildAutoCompleteOptions.call(this, _autoComplete)
        },
      })
      Object.defineProperty(this, "shownAutoCompleteOptions", {
        get: () => _shownAutoCompleteOptions,
        set: (value) => _shownAutoCompleteOptions = value,
      })
      Object.defineProperty(this, "autoCompleteOpen", {
        get: () => _autoCompleteOpen,
        set: (value) => {
          switch (value) {
            case true: {
              _showAutoComplete.call(this)
              _autoCompleteOpen = true
            } break;
            case false: {
              _hideAutoComplete.call(this)
              _autoCompleteOpen = false
            } break;
          }
        }
      })
      Object.defineProperty(this, "_bindFuncHideAutoComplete", {
        get: () => _bindFuncHideAutoComplete,
        set: (value) => _bindFuncHideAutoComplete = value,
      })
      Object.defineProperty(this, "_currentFocusedAutoCompleteElement", {
        get: () => _currentFocusedAutoCompleteElement,
        set: (value) => _currentFocusedAutoCompleteElement = value,
      })
      Object.defineProperty(this, "_preventAddingTag", {
        get: () => _preventAddingTag,
        set: (value) => _preventAddingTag = value,
      })

      this.config = _config
      this.config.onCreate(this)
    }

    /**
     * Add tag item
     * @param {string | TagItem} value 
     */
    LeatherTag.prototype.addTag = function(param) {
      if(param == null) {
        throw new Error(`ERROR[LeatherTag.addTag] :: parameter should not be null`)
      }
      this.config.onBeforeTagAdd(this)
      if(this._preventAddingTag == false) {
        if(this.config.maxTags != null && this.values.length == this.config.maxTags) {
          this.config.onMaxTags(this)
          return
        }
        if(typeof param != "string" && !(param instanceof String) && !(param instanceof TagItem)) {
          throw new Error("ERROR[LeatherTag.addTag] :: param is not type of string or TagItem")
        }
        let _tagItemConfig = {}
        if(typeof param == "string" || param instanceof String) {
          _tagItemConfig.value = param.toString()
        }
        else {
          _tagItemConfig = param.config
        }

        if(this.isValueValid(_tagItemConfig.value) == false) {
          this.config.onInvalidTag(_tagItemConfig.value)
          return
        }
        let tagItem = null
        if(param instanceof TagItem) {
          tagItem = param
          tagItem.leatherTag = this
        }
        else {
          _tagItemConfig.leatherTag = this
          tagItem = new TagItem(_tagItemConfig)
        }
        this.dom.tagsWrapper.insertBefore(tagItem.dom.tagItem, this.dom.inputElement)
        this.values.push(_tagItemConfig.value)
        this.tagItems.push(tagItem)
        this.config.onTagAdd(this)

        return tagItem
      }
      this._preventAddingTag = false
    }

    /**
     * Add a list of tags
     * @param {Array} values 
     */
    LeatherTag.prototype.addAll = function(values) {
      if((values instanceof Array) == false) {
        throw new Error("ERROR[LeatherTag.addAll] :: parameter is not instance of Array")
      }
      values.forEach((value) => {
        this.addTag(value)
      })
      this.config.onAllAdded()
    }

    /**
     * Remove tag item
     * @param {number | TagItem} tagItem Even tag index or tag element
     */
    LeatherTag.prototype.removeTag = function(tagItem) {
      this.config.onBeforeTagRemove(this)
      let _removedTagItem = null
      for (let i = 0; i < this.tagItems.length; i++) {
        if(i == tagItem || this.tagItems[i] == tagItem) {
          this.dom.tagsWrapper.removeChild(this.tagItems[i].dom.tagItem)
          this.values.splice(i, 1)
          _removedTagItem = this.tagItems.splice(i, 1)[0]
          break
        }
      }
      this.config.onTagRemove(this)
      return _removedTagItem
    }

    /**
     * Remove all tags
     */
    LeatherTag.prototype.removeAll = function() {
      for (let i = 0; i < this.tagItems.length;) {
        this.removeTag(this.tagItems[i])
      }
      this.config.onAllRemoved()
    }

    /**
     * Get matched auto-complete values
     * @param {string} value 
     * @returns {Array}
     */
    LeatherTag.prototype.getMatchedAutoCompleteValues = function(value) {
      return this.autoComplete.filter(item => item.toLowerCase().includes(value))
    }

    /**
     * Show auto-complete
     */
    LeatherTag.prototype.showAutoComplete = function() {
      this.autoCompleteOpen = true
    }

    /**
     * Hide auto-complete
     */
    LeatherTag.prototype.hideAutoComplete = function() {
      this.autoCompleteOpen = false
    }

    /**
     * Prevent adding new tag
     */
    LeatherTag.prototype.preventAddTag = function() {
      this._preventAddingTag = true
    }

    /**
     * Check if tag value is valid
     * - Check if matched the regex pattern
     * - Check if duplicated or not in case allowDuplicates is false
     * - Check if the value allowed or disallowed
     * @param {string} value 
     * @returns {boolean} true if valid, otherwise false
     */
    LeatherTag.prototype.isValueValid = function(value) {
      // Check if it matches regex pattern
      if(this.config.regexPattern != null && this.config.regexPattern.test(value) == false) {
        return false
      }
      // Check if already exists
      if(this.config.allowDuplicates == false && _isTagExist.call(this, value)) {
        return false
      }
      // Check if tag is an allowed value
      if(this.config.allowedTags.length > 0 && this.config.allowedTags.map(item => item.toLowerCase()).includes(value.toLowerCase()) == false) {
        return false
      }
      // Check if tag is a disallowed value
      if(this.config.disallowedTags.length > 0 && this.config.disallowedTags.map(item => item.toLowerCase()).includes(value.toLowerCase())) {
        return false
      }
      return true
    }

    /**
     * Initialize GUI for tag
     */
    function _initGUI() {
      const targetElement = document.getElementById(this.config.el)
      if(targetElement == null) {
        throw new Error("ERROR[_initGUI] :: target element not found")
      }
      if(targetElement instanceof HTMLDivElement) {
        this.dom.tagsWrapper = targetElement
        this.dom.tagsWrapper.innerHTML = ""
        for (let i = 0; i < this.config.classList.length; i++) {
          const classItem = this.config.classList[i]
          this.dom.tagsWrapper.classList.add(classItem)
        }
        this.dom.inputElement = document.createElement("input")
        this.dom.tagsWrapper.classList.add("yk-tags")
        this.dom.inputElement.classList.add("yk-tags__input")
        this.dom.tagsWrapper.appendChild(this.dom.inputElement)
        this.dom.inputElement.setAttribute("placeholder", this.config.placeholder || "Type and press Enter")
        this.dom.autoCompleteWrapper = _buildAutoCompleteDOM.call(this)

        // Add Event Listeners 
        this.dom.tagsWrapper.addEventListener("click", _onClickTagsWrapper.bind(this))
        this.dom.inputElement.addEventListener("focus", _onFocusInputTags.bind(this))
        this.dom.inputElement.addEventListener("blur", _onBlurInputTags.bind(this))
        this.dom.inputElement.addEventListener("input", _onInputInputTags.bind(this))
        this.dom.inputElement.addEventListener("keyup", _onKeyUpInputTags.bind(this))
        this.dom.inputElement.addEventListener("keydown", _onKeyDownInputTags.bind(this))
      }
    }

    /**
     * Event handler for input element
     */
    function _onFocusInputTags(event) {
      if(this.inputValue.length > 0) {
        const matchAutoCompleteOptions = this.getMatchedAutoCompleteValues(this.inputValue.toLowerCase())
        if(matchAutoCompleteOptions.length > 0) {
          _fillAndShowAutoComplete.call(this, matchAutoCompleteOptions)
        }
      }
      this.config.onFocus(event, this)
    }

    /**
     * Event handler for input element
     */
    function _onBlurInputTags(event) {
      this.config.onBlur(event, this)
    }

    /**
     * Event handler for input element
     */
    function _onInputInputTags(event) {
      if(this.inputValue.length == 0) {
        _buildAutoCompleteOptions.call(this, this.autoComplete)
      }
      else {
        const matchAutoCompleteOptions = this.getMatchedAutoCompleteValues(this.inputValue.toLowerCase())
        if(matchAutoCompleteOptions.length > 0) {
          _fillAndShowAutoComplete.call(this, matchAutoCompleteOptions)
        }
        else {
          this.hideAutoComplete()
        }
      }
      this.config.onInput(event, this)
    }

    /**
     * Event handler for input element
     * @param {KeyboardEvent} event 
     */
    function _onKeyUpInputTags(event) {
      if(event.key == "Escape") {
        this.dom.inputElement.blur()
        this.hideAutoComplete()
      }
    }

    /**
     * Event handler for input element
     * @param {KeyboardEvent} event 
     */
    function _onKeyDownInputTags(event) {
      switch (event.key) {
        case "Backspace": {
          if (this.inputValue.length == 0) {
            this.removeTag(this.tagItems.length - 1)
          }
        } break;
        case "Enter": {
          const value = this.inputValue
          if(value.trim().length > 0) {
            if(this.addTag(value) != null) {
              this.inputValue = ""
              this.hideAutoComplete()
            }
          }
        } break;
      }
      if(this.autoComplete != null && this.autoComplete.length > 0) {
        switch (event.key) {
          case "ArrowUp": {
            let value = _setFocusedAutoCompleteOption.call(this, "previousElementSibling")
            this.inputValue = (value == null) ? "" : value
          } break;
          case "ArrowDown": {
            let value = _setFocusedAutoCompleteOption.call(this, "nextElementSibling")
            this.inputValue = (value == null) ? "" : value
          } break;
        }
      }
    }

    /**
     * On click tag wrapper
     */
    function _onClickTagsWrapper(event) {
      this.config.onClick(event, this)
      event.stopPropagation()
      this.dom.inputElement.focus()
      if(this.autoCompleteOpen == false) {
        _fillAndShowAutoComplete.call(this, this.autoComplete)
      }
    }

    /**
     * Check for any invalid config
     */
    function _checkConfigValues() {
      // Check if allowed tags are not the same in disallowed tags
      const allowedTags = this.config.allowedTags
      const disallowedTags = this.config.disallowedTags
      for (let i = 0; i < allowedTags.length; i++) {
        const tagItem1 = allowedTags[i];
        for (let i = 0; i < disallowedTags.length; i++) {
          const tagItem2 = disallowedTags[i];
          if(tagItem1 == tagItem2) {
            throw new Error(`ERROR[_checkConfigValues] :: '${tagItem1}' can't be allowed and disallowed value`)
          }
        }
      }
    }

    /**
     * Check if tag value already exists
     * @param {string} value 
     */
    function _isTagExist(value) {
      const _values = this.values.map(item => item.toLowerCase())
      const _value = value.toLowerCase()
      for (let i = 0; i < _values.length; i++) {
        const item = _values[i]
        if(_value == item) {
          _animateMatchedTagElement.call(this, i)
          return true
        }
      }
      return false
    }

    /**
     * Animate matched tag element
     * @param {number} index 
     */
    function _animateMatchedTagElement(index) {
      if(this._setTimeoutAnimation == null) {
        this._setTimeoutAnimation = setTimeout(() => {
          _stopAnimationMatchedTagElement.call(this, index)
        }, 1000)
        this.tagItems[index].dom.classList.add("yk-tags__item--animation")
      }
    }

    /**
     * Stop animation for matched tag element
     * @param {number} index 
     */
    function _stopAnimationMatchedTagElement(index) {
      if(this._setTimeoutAnimation != null) {
        this.tagItems[index].dom.classList.remove("yk-tags__item--animation")
        clearTimeout(this._setTimeoutAnimation)
        this._setTimeoutAnimation = null
      }
    }

    /**
     * Build auto-complete DOM
     * @returns {HTMLElement}
     */
    function _buildAutoCompleteDOM() {
      const autoCompleteWrapper = document.createElement("div")
      autoCompleteWrapper.classList.add("yk-tags__autocomplete")
      autoCompleteWrapper.addEventListener("click", (event) => event.stopPropagation())
      return autoCompleteWrapper
    }

    /**
     * Set auto-complete position
     */
    function _setAutoCompletePosition() {
      const isDisplayed = getComputedStyle(this.dom.tagsWrapper).display
      if(this.dom.tagsWrapper.parentElement != undefined && isDisplayed != "none") {
        const clientRect = this.dom.tagsWrapper.getBoundingClientRect()
        this.dom.autoCompleteWrapper.style.top = `${clientRect.bottom}px`
        this.dom.autoCompleteWrapper.style.left = `${clientRect.left}px`
        this.dom.autoCompleteWrapper.style.width = `${clientRect.width}px`
      }
    }
    
    /**
     * Append auto-complete
     */
    function _showAutoComplete() {
      const showAutoCompleteAfter = this.config.showAutoCompleteAfter
      if(this.dom.autoCompleteWrapper.parentElement == null && (showAutoCompleteAfter == null || this.inputValue.length == showAutoCompleteAfter)) {
        document.body.appendChild(this.dom.autoCompleteWrapper)
        _setAutoCompletePosition.call(this)
        document.addEventListener("click", this._bindFuncHideAutoComplete)
        window.addEventListener("resize", this._bindFuncHideAutoComplete)
        this._scrollParent = _getScrollParent(this.dom.tagsWrapper)
        if(this._scrollParent != null) {
          if(this._scrollParent == document.documentElement) {
            this._scrollParent = document
          }
          this._scrollParent.addEventListener("scroll", this._bindFuncHideAutoComplete)
        }
        this.config.onShowAutoComptele(this)
      }
    }
    
    /**
     * Remove auto-complete
     */
    function _hideAutoComplete() {
      if(this.dom.autoCompleteWrapper.parentElement == document.body) {
        document.body.removeChild(this.dom.autoCompleteWrapper)
        document.removeEventListener("click", this._bindFuncHideAutoComplete)
        window.removeEventListener("resize", this._bindFuncHideAutoComplete)
        if(this._scrollParent != null) {
          this._scrollParent.removeEventListener("scroll", this._bindFuncHideAutoComplete)
          this._scrollParent = null
        }
        if(this._currentFocusedAutoCompleteElement != null) {
          this._currentFocusedAutoCompleteElement.classList.remove("yk-tags__autocomplete-li--focused")
          this._currentFocusedAutoCompleteElement = null
        }
        this.shownAutoCompleteOptions = []
        this.config.onHideAutoComptele(this)
      }
    }

    /**
     * Set auto-complete options
     */
    function _buildAutoCompleteOptions(options) {
      this.dom.autoCompleteWrapper.innerHTML = ""
      this.dom.autoCompleteList = null
      this.shownAutoCompleteOptions = []
      this._currentFocusedAutoCompleteElement = null
      const autoCompleteUL = document.createElement("ul")
      for (let i = 0; i < options.length; i++) {
        const optionValue = options[i]
        const autoCompleteLI = document.createElement("li")
        this.shownAutoCompleteOptions.push(optionValue)
        autoCompleteLI.textContent = optionValue
        autoCompleteLI.setAttribute("data-index", i)
        autoCompleteLI.addEventListener("click", _onClickAutoCompleteOption.bind(this, optionValue))
        autoCompleteUL.appendChild(autoCompleteLI)
      }
      this.dom.autoCompleteWrapper.appendChild(autoCompleteUL)
      this.dom.autoCompleteList = autoCompleteUL
    }

    /**
     * On click auto-complete option event handler 
     */
    function _onClickAutoCompleteOption(value) {
      this.config.onSelectAutoCompleteOption(this, value)
      if(this.addTag(value) != null) {
        this.inputValue = ""
      }
    }

    /**
     * Get scroll parent element
     * @param {HTMLElement} node 
     * @returns {null | HTMLElement}
     */
    function _getScrollParent(node) {
      if (node == null) {
        return null
      }
    
      if (node.scrollHeight > node.clientHeight) {
        return node
      } else {
        return _getScrollParent(node.parentNode)
      }
    }

    /**
     * Fill and show auto-complete
     */
    function _fillAndShowAutoComplete(value) {
      _buildAutoCompleteOptions.call(this, value)
      this.showAutoComplete()
    }

    /**
     * Set focused class to auto-complete option
     * @param {string} nextOrPrevious whether 'nextSibling' or 'previousSibling'
     * @returns {number} index of focused auto-complete option, otherwise -1
     */
    function _setFocusedAutoCompleteOption(nextOrPrevious) {
      if(this.dom.autoCompleteList.childElementCount > 0) {
        if(this._currentFocusedAutoCompleteElement != null) {
          this._currentFocusedAutoCompleteElement.classList.remove("yk-tags__autocomplete-li--focused")
          this._currentFocusedAutoCompleteElement = this._currentFocusedAutoCompleteElement[nextOrPrevious]
        }
        if(this._currentFocusedAutoCompleteElement == null) {
          switch (nextOrPrevious) {
            case "previousElementSibling": {
              this._currentFocusedAutoCompleteElement = this.dom.autoCompleteList.children[this.dom.autoCompleteList.childElementCount - 1]
            } break;
            case "nextElementSibling": {
              this._currentFocusedAutoCompleteElement = this.dom.autoCompleteList.children[0]
            } break;
          }
        }
        this._currentFocusedAutoCompleteElement.classList.add("yk-tags__autocomplete-li--focused")
        return this.shownAutoCompleteOptions[parseInt(this._currentFocusedAutoCompleteElement.dataset.index)]
      }
    }

    /**
     * Builds config object based on the default configs
     * @param {object} config 
     * @returns {object}
     */
    function _buildConfigObject(base, config) {
      const _config = {}
      const keys = Object.keys(base)
      for (let index = 0; index < keys.length; index++) {
        const key = keys[index]
        if(config.hasOwnProperty(key) == true) {
          _config[key] = config[key]
        }
        else {
          _config[key] = base[key]
        }
      }
      return _config
    }
  
    return LeatherTag
  })()

  /**
   * TagItem Class
   */
  window.TagItem = (function() {

    const _defaultConfig = Object.freeze({
      leatherTag: null,
      disabled: false,
      readonly: false,
      value: null,
      data: null,
      classList: [],
      template: ()=>{},
      onClick: ()=>{},
    })

    function TagItem(config = _defaultConfig) {
      let _config = _buildConfigObject(_defaultConfig, config)
      if(_config.value == null) {
        throw new Error(`ERROR[TagItem] :: Please provide a tag value`)
      }
      let _value = _config.value
      let _leatherTag = null
      let _dom = null
      let _data = _config.data
      let _disabled = false

      Object.defineProperty(this, "leatherTag", {
        get: () => _leatherTag,
        set: (value) => _leatherTag = value,
      })
      Object.defineProperty(this, "config", {
        get: () => _config,
      })
      Object.defineProperty(this, "dom", {
        get: () => _dom,
      })
      Object.defineProperty(this, "value", {
        get: () => _value,
        set: (value) => _value = value,
      })
      Object.defineProperty(this, "data", {
        get: () => _data,
        set: (value) => _data = value,
      })
      Object.defineProperty(this, "disabled", {
        get: () => _disabled,
        set: (value) => {
          switch (value) {
            case true: {
              _disabled = true
              this.dom.tagItem.classList.add("yk-tags__item--disabled")
              this.dom.tagItem.removeChild(this.dom.tagDeleteBtn)
            } break;
            case false: {
              _disabled = false
              this.dom.tagItem.classList.remove("yk-tags__item--disabled")
              this.dom.tagItem.appendChild(this.dom.tagDeleteBtn)
            } break;
          }
        },
      })

      _dom = _buildDOM.call(this)
      this.disabled = _config.disabled
      this.leatherTag = _config.leatherTag
    }

    /**
     * Remove tag item
     */
    TagItem.prototype.remove = function() {
      this.leatherTag.removeTag(this)
    }

    /**
     * Build DOM tag item
     * @returns {object} contains tagItem and tagDeleteBtn
     */
    function _buildDOM() {
      const tagItem = document.createElement("div")
      const tagValue = document.createElement("span")
      const btnRemoveTag = document.createElement("button")

      tagItem.classList.add("yk-tags__item")
      tagValue.classList.add("yk-tags__value")
      btnRemoveTag.classList.add("yk-tags__btn-remove")
      btnRemoveTag.innerHTML = `<svg width="14" height="14" viewBox="0 0 48 48"><path d="M38 12.83l-2.83-2.83-11.17 11.17-11.17-11.17-2.83 2.83 11.17 11.17-11.17 11.17 2.83 2.83 11.17-11.17 11.17 11.17 2.83-2.83-11.17-11.17z"/></svg>`
      btnRemoveTag.addEventListener("click", _onClickBtnRemoveTag.bind(this))

      tagValue.textContent = this.value
      tagItem.appendChild(tagValue)
      tagItem.appendChild(btnRemoveTag)

      return {
        tagItem: tagItem,
        tagDeleteBtn: btnRemoveTag
      }
    }

    /**
     * On click button remove tag
     * @param {PointerEvent} event
     */
    function _onClickBtnRemoveTag(event) {
      event.stopPropagation()
      this.remove(this)
    }

    /**
     * Builds config object based on the default configs
     * @param {object} config 
     * @returns {object}
     */
    function _buildConfigObject(base, config) {
      const _config = {}
      const keys = Object.keys(base)
      for (let index = 0; index < keys.length; index++) {
        const key = keys[index]
        if(config.hasOwnProperty(key) == true) {
          _config[key] = config[key]
        }
        else {
          _config[key] = base[key]
        }
      }
      return _config
    }

    return TagItem
  })()
}
