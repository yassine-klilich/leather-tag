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
      onClick: function(event) {},
      onCreate: function() {},
      onBeforeTagAdd: function() {},
      onTagAdded: function(tagItem) {},
      onAllAdded: function() {},
      onBeforeTagRemove: function() {},
      onTagRemoved: function(tagItem) {},
      onAllRemoved: function() {},
      onInvalidTagValue: function(value) {},
      onShowAutoComptele: function() {},
      onHideAutoComptele: function() {},
      onSelectAutoCompleteOption: function(value) {},
      onFocus: function(event) {},
      onBlur: function(event) {},
      onInput: function(event) {},
      onMaxTags: function() {},
      onEdit: function(tagItem) {},
      //mixed: false,
      //minTags: null,
      //forceAutoCompleteOptions: false,
    })

    LeatherTag.DefaultConfig = _defaultConfig
    
    /**
     * Builds config object based on the default configs
     * @param {object} base 
     * @param {object} config 
     * @returns {object}
     */
    LeatherTag._buildConfigObject = function(base, config) {
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

    LeatherTag.CLASS_NAMES = Object.freeze({
      LEATHER_TAG: "leather-tag",
      INPUT: "leather-tag__input",
      DISABLED: "leather-tag--disabled",
      AUTOCOMPLETE: "leather-tag__autocomplete",
      AUTOCOMPLETE_LI_FOCUSED: "leather-tag__autocomplete-li--focused",
      ITEM: "leather-tag__item",
      ITEM_ANIMATION: "leather-tag__item--animation",
      ITEM_DISABLED: "leather-tag__item--disabled",
      ITEM_EDIT: "leather-tag__item--edit",
      ITEM_VALUE: "leather-tag__value",
      BTN_REMOVE: "leather-tag__btn-remove",
      NO_RESULT: "leather-tag__no-result",
    })

    function LeatherTag(config = _defaultConfig) {
      let _config = _defaultConfig
      let _dom = {
        tagsWrapper: null,
        inputElement: null,
        autoCompleteWrapper: null,
      }
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
            _config = LeatherTag._buildConfigObject(_config, value)
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
        get: () => this.tagItems.map(item => item.value),
        set: (value) => {
          if((value instanceof Array) == false) {
            throw new TypeError("ERROR[set.values] :: parameter is not instance of Array")
          }
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
              this.dom.tagsWrapper.classList.add(LeatherTag.CLASS_NAMES.DISABLED)
              this.tagItems.forEach(item => item.disabled = true)
            } break;
            case false: {
              this.dom.tagsWrapper.classList.remove(LeatherTag.CLASS_NAMES.DISABLED)
              this.tagItems.forEach(item => item.disabled = false)
            } break;
          }
          _disabled = value
        },
      })
      Object.defineProperty(this, "autoComplete", {
        get: () => _autoComplete,
        set: (value) => {
          if(!(value instanceof Array)) {
            throw new TypeError("ERROR[set.autoComplete] :: parameter is not instance of Array")
          }
          _autoComplete = value
          this.shownAutoCompleteOptions = _autoComplete
        },
      })
      Object.defineProperty(this, "shownAutoCompleteOptions", {
        get: () => _shownAutoCompleteOptions,
        set: (value) => {
          if(value != null && !(value instanceof Array)) {
            throw new TypeError("ERROR[set.shownAutoCompleteOptions] :: parameter is not instance of Array")
          }
          value = value || []
          _shownAutoCompleteOptions = value
          _buildAutoCompleteOptions.call(this, _shownAutoCompleteOptions)
        },
      })
      Object.defineProperty(this, "autoCompleteOpen", {
        get: () => _autoCompleteOpen,
        set: (value) => {
          switch (value) {
            case true: {
              const showAutoCompleteAfter = this.config.showAutoCompleteAfter
              if(this.dom.autoCompleteWrapper.parentElement == null && (showAutoCompleteAfter == null || this.inputValue.length >= showAutoCompleteAfter)) {
                _autoCompleteOpen = true
                _showAutoComplete.call(this)
              }
            } break;
            case false: {
              if(this.dom.autoCompleteWrapper.parentElement == document.body) {
                _autoCompleteOpen = false
                _hideAutoComplete.call(this)
              }
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

      this.config = config
      this.config.onCreate.call(this)
    }

    /**
     * Add tag item
     * @param {TagItem} value 
     */
    LeatherTag.prototype.addTag = function(param) {
      if(param == null) {
        throw new Error(`ERROR[LeatherTag.addTag] :: parameter should not be null`)
      }
      this.config.onBeforeTagAdd.call(this)
      if(this._preventAddingTag == false) {
        if(this.config.maxTags != null && this.tagItems.length == this.config.maxTags) {
          this.config.onMaxTags.call(this)
          return
        }
        if(typeof param != "string" && !(param instanceof String) && !(param instanceof TagItem)) {
          throw new TypeError("ERROR[LeatherTag.addTag] :: param is not type of string or TagItem")
        }
        let _tagItemConfig = {}
        if(typeof param == "string" || param instanceof String) {
          _tagItemConfig.value = param.toString()
        }
        else {
          _tagItemConfig = param.config
        }

        if(this.isValueValid(_tagItemConfig.value) == false) {
          this.config.onInvalidTagValue.call(this, _tagItemConfig.value)
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
        this.tagItems.push(tagItem)
        _setAutoCompletePosition.call(this)
        this.config.onTagAdded.call(this, tagItem)

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
        throw new TypeError("ERROR[LeatherTag.addAll] :: parameter is not instance of Array")
      }
      values.forEach((value) => {
        this.addTag(value)
      })
      this.config.onAllAdded.call(this)
    }

    /**
     * Remove tag item
     * @param {number | TagItem} tagItem Even tag index or tag element
     */
    LeatherTag.prototype.removeTag = function(tagItem) {
      this.config.onBeforeTagRemove.call(this)
      let _removedTagItem = null
      for (let i = 0; i < this.tagItems.length; i++) {
        if(i == tagItem || this.tagItems[i] == tagItem) {
          this.dom.tagsWrapper.removeChild(this.tagItems[i].dom.tagItem)
          _removedTagItem = this.tagItems.splice(i, 1)[0]
          break
        }
      }
      _setAutoCompletePosition.call(this)
      this.config.onTagRemoved.call(this, _removedTagItem)
      return _removedTagItem
    }

    /**
     * Remove all tags
     */
    LeatherTag.prototype.removeAll = function() {
      for (let i = 0; i < this.tagItems.length;) {
        this.removeTag(this.tagItems[i])
      }
      this.config.onAllRemoved.call(this)
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
    LeatherTag.prototype.showAutoComplete = function(value) {
      this.shownAutoCompleteOptions = value
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
        this.dom.tagsWrapper.classList.add(LeatherTag.CLASS_NAMES.LEATHER_TAG)
        this.dom.inputElement.classList.add(LeatherTag.CLASS_NAMES.INPUT)
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
          this.showAutoComplete(matchAutoCompleteOptions)
        }
        else {
          this.autoCompleteOpen = true
          _autoCompleteNoResultFound.call(this)
        }
      }
      else {
          this.showAutoComplete(this.autoComplete)
      }
      this.config.onFocus.call(this, event)
    }

    /**
     * Event handler for input element
     */
    function _onBlurInputTags(event) {
      this.config.onBlur.call(this, event)
    }

    /**
     * Event handler for input element
     */
    function _onInputInputTags(event) {
      if(this.inputValue.length == 0) {
        this.shownAutoCompleteOptions = this.autoComplete
      }
      else {
        const matchAutoCompleteOptions = this.getMatchedAutoCompleteValues(this.inputValue.toLowerCase())
        if(matchAutoCompleteOptions.length > 0) {
          this.showAutoComplete(matchAutoCompleteOptions)
        }
        else {
          _autoCompleteNoResultFound.call(this)
        }
      }
      this.config.onInput.call(this, event)
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
      if(this.shownAutoCompleteOptions != null && this.shownAutoCompleteOptions.length > 0) {
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
      this.config.onClick.call(this, event)
      event.stopPropagation()
      this.dom.inputElement.focus()
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
        this.tagItems[index].dom.tagItem.classList.add(LeatherTag.CLASS_NAMES.ITEM_ANIMATION)
      }
    }

    /**
     * Stop animation for matched tag element
     * @param {number} index 
     */
    function _stopAnimationMatchedTagElement(index) {
      if(this._setTimeoutAnimation != null) {
        this.tagItems[index].dom.tagItem.classList.remove(LeatherTag.CLASS_NAMES.ITEM_ANIMATION)
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
      autoCompleteWrapper.classList.add(LeatherTag.CLASS_NAMES.AUTOCOMPLETE)
      autoCompleteWrapper.addEventListener("click", (event) => event.stopPropagation())
      return autoCompleteWrapper
    }

    /**
     * Set auto-complete position
     */
    function _setAutoCompletePosition() {
      if(this.autoCompleteOpen) {
        const isDisplayed = getComputedStyle(this.dom.tagsWrapper).display
        if(this.dom.tagsWrapper.parentElement != undefined && isDisplayed != "none") {
          const clientRect = this.dom.tagsWrapper.getBoundingClientRect()
          this.dom.autoCompleteWrapper.style.top = `${clientRect.bottom}px`
          this.dom.autoCompleteWrapper.style.left = `${clientRect.left}px`
          this.dom.autoCompleteWrapper.style.width = `${clientRect.width}px`
        }
      }
    }
    
    /**
     * Append auto-complete
     */
    function _showAutoComplete() {
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
      this.config.onShowAutoComptele.call(this)
    }
    
    /**
     * Remove auto-complete
     */
    function _hideAutoComplete() {
      document.body.removeChild(this.dom.autoCompleteWrapper)
      document.removeEventListener("click", this._bindFuncHideAutoComplete)
      window.removeEventListener("resize", this._bindFuncHideAutoComplete)
      if(this._scrollParent != null) {
        this._scrollParent.removeEventListener("scroll", this._bindFuncHideAutoComplete)
        this._scrollParent = null
      }
      if(this._currentFocusedAutoCompleteElement != null) {
        this._currentFocusedAutoCompleteElement.classList.remove(LeatherTag.CLASS_NAMES.AUTOCOMPLETE_LI_FOCUSED)
        this._currentFocusedAutoCompleteElement = null
      }
      this.shownAutoCompleteOptions = []
      this.config.onHideAutoComptele.call(this)
    }

    /**
     * Set auto-complete options
     */
    function _buildAutoCompleteOptions(options) {
      this.dom.autoCompleteWrapper.innerHTML = ""
      this.dom.autoCompleteList = null
      this._currentFocusedAutoCompleteElement = null
      const autoCompleteUL = document.createElement("ul")
      for (let i = 0; i < options.length; i++) {
        const optionValue = options[i]
        const autoCompleteLI = document.createElement("li")
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
      this.config.onSelectAutoCompleteOption.call(this, value)
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
     * Set focused class to auto-complete option
     * @param {string} nextOrPrevious whether 'nextSibling' or 'previousSibling'
     * @returns {number} index of focused auto-complete option, otherwise -1
     */
    function _setFocusedAutoCompleteOption(nextOrPrevious) {
      if(this.dom.autoCompleteList.childElementCount > 0) {
        if(this._currentFocusedAutoCompleteElement != null) {
          this._currentFocusedAutoCompleteElement.classList.remove(LeatherTag.CLASS_NAMES.AUTOCOMPLETE_LI_FOCUSED)
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
        this._currentFocusedAutoCompleteElement.classList.add(LeatherTag.CLASS_NAMES.AUTOCOMPLETE_LI_FOCUSED)
        return this.shownAutoCompleteOptions[parseInt(this._currentFocusedAutoCompleteElement.dataset.index)]
      }
    }

    /**
     * Set not result found
     */
    function _autoCompleteNoResultFound() {
      this.shownAutoCompleteOptions = []
      this.dom.autoCompleteWrapper.innerHTML = ""
      const noResultFoundMsg = document.createElement("div")
      noResultFoundMsg.classList.add(LeatherTag.CLASS_NAMES.NO_RESULT)
      noResultFoundMsg.textContent = "No result found"
      this.dom.autoCompleteWrapper.appendChild(noResultFoundMsg)
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
      value: null,
      data: null,
      classList: [],
      template: {
        tagItem: () => document.createElement("div"),
        tagValue: () => document.createElement("span"),
        tagRemoveButton: () => {
          const tagRemoveButton = document.createElement("button")
          tagRemoveButton.innerHTML = `<svg width="14" height="14" viewBox="0 0 48 48"><path d="M38 12.83l-2.83-2.83-11.17 11.17-11.17-11.17-2.83 2.83 11.17 11.17-11.17 11.17 2.83 2.83 11.17-11.17 11.17 11.17 2.83-2.83-11.17-11.17z"/></svg>`
          return tagRemoveButton
        },
      },
      onClick: ()=>{},
    })

    function TagItem(config = _defaultConfig) {
      let _config = LeatherTag._buildConfigObject(_defaultConfig, config)
      if(_config.value == null) {
        throw new Error(`ERROR[TagItem] :: Please provide a tag value`)
      }
      let _value = ""
      let _leatherTag = null
      let _dom = null
      let _data = _config.data
      let _disabled = false

      Object.defineProperty(this, "leatherTag", {
        get: () => _leatherTag,
        set: (value) => {
          if(value != null && !(value instanceof LeatherTag)) {
            throw new TypeError("ERROR[TagItem] :: value is not instance of LeatherTag")
          }
          _leatherTag = value
        },
      })
      Object.defineProperty(this, "config", {
        get: () => _config,
      })
      Object.defineProperty(this, "dom", {
        get: () => _dom,
      })
      Object.defineProperty(this, "value", {
        get: () => _value,
        set: (value) => {
          _value = value
          this.dom.tagValue.textContent = value
        },
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
              this.dom.tagItem.classList.add(LeatherTag.CLASS_NAMES.ITEM_DISABLED)
              this.dom.tagItem.removeChild(this.dom.tagRemoveButton)
            } break;
            case false: {
              _disabled = false
              this.dom.tagItem.classList.remove(LeatherTag.CLASS_NAMES.ITEM_DISABLED)
              this.dom.tagItem.appendChild(this.dom.tagRemoveButton)
            } break;
          }
        },
      })

      _checkTemplateFunctions.call(this)
      _dom = _buildDOM.call(this)
      this.disabled = _config.disabled
      this.leatherTag = _config.leatherTag
      this.value = _config.value
    }

    /**
     * Remove tag item
     */
    TagItem.prototype.remove = function() {
      if(this.leatherTag instanceof LeatherTag) {
        this.leatherTag.removeTag(this)
        this.leatherTag = null
      }
    }

    /**
     * Change tag item leatherTag object
     * @param {LeatherTag | null} value
     */
    TagItem.prototype.setLeatherTag = function(value) {
      if(value == this.leatherTag) {
        return
      }
      this.remove()
      if(value instanceof LeatherTag) {
        value.addTag(this)
      }
    }

    /**
     * Update tag value
     * @param {string} value
     */
    TagItem.prototype.updateValue = function(value) {
      this.value = value
      if(this.leatherTag instanceof LeatherTag) {
        this.leatherTag.config.onEdit.call(this.leatherTag, this)
      }
    }

    /**
     * Build DOM tag item
     * @returns {object} contains tagItem, tagValue and tagRemoveButton DOM elements
     */
    function _buildDOM() {
      // Tag item wrapper
      let tagItem = _buildTagTemplate.call(this, "tagItem")
      tagItem.classList.add(LeatherTag.CLASS_NAMES.ITEM)
      tagItem.addEventListener("click", (event) => event.stopPropagation())
      tagItem.addEventListener("dblclick", _onDblClickTagItem.bind(this))
      for (let i = 0; i < this.config.classList.length; i++) {
        tagItem.classList.add(this.config.classList[i])
      }
      
      // Tag value
      let tagValue = _buildTagTemplate.call(this, "tagValue")
      tagValue.classList.add(LeatherTag.CLASS_NAMES.ITEM_VALUE)
      tagValue.addEventListener("keydown", _onKeydownTagValue.bind(this))
      tagValue.addEventListener("blur", _onBlurTagValue.bind(this))
      
      // Delete button
      let tagRemoveButton = _buildTagTemplate.call(this, "tagRemoveButton")
      tagRemoveButton.classList.add(LeatherTag.CLASS_NAMES.BTN_REMOVE)
      tagRemoveButton.addEventListener("click", _onClickTagRemoveButton.bind(this))

      tagItem.appendChild(tagValue)
      tagItem.appendChild(tagRemoveButton)

      return { tagItem, tagValue, tagRemoveButton }
    }

    /**
     * On click button remove tag
     * @param {PointerEvent} event
     */
    function _onClickTagRemoveButton(event) {
      event.stopPropagation()
      this.remove(this)
    }

    /**
     * On double click tag item
     * @param {PointerEvent} event
     */
    function _onDblClickTagItem(event) {
      event.stopPropagation()
      if(this.disabled == false) {
        this.dom.tagItem.classList.add(LeatherTag.CLASS_NAMES.ITEM_EDIT)
        this.dom.tagValue.setAttribute("contenteditable", true)
      }
    }

    /**
     * On key down tag value
     * @param {KeyboardEvent} event
     */
    function _onKeydownTagValue(event) {
      if (event.key == "Enter") {
        event.preventDefault()
        _unfocusAndUpdateValue.call(this, this.dom.tagValue.textContent)
      }
      if (event.key == "Escape") {
        _unfocusAndUpdateValue.call(this, this.value)
      }
    }

    /**
     * On blur tag value
     */
    function _onBlurTagValue() {
      _unfocusAndUpdateValue.call(this, this.dom.tagValue.textContent)
    }

    /**
     * Unfocus from tag value element and update tag item value
     * @param {string} value
     */
    function _unfocusAndUpdateValue(value) {
      this.dom.tagItem.classList.remove(LeatherTag.CLASS_NAMES.ITEM_EDIT)
      this.dom.tagValue.setAttribute("contenteditable", false)
      if(this.value != value) {
        this.updateValue(value)
      }
    }

    /**
     * Check all templates are type of function
     * @throws {TypeError} when a property of template config is not a type of function
     */
    function _checkTemplateFunctions() {
      this.config.template = LeatherTag._buildConfigObject(_defaultConfig.template, this.config.template)
      for (const key in this.config.template) {
        if (Object.hasOwnProperty.call(this.config.template, key)) {
          if(typeof this.config.template[key] != "function") {
            throw new TypeError(`ERROR[TagItem] :: '${key}' must be a function returns a template.`)
          }
        }
      }
    }

    function _buildTagTemplate(tagTemplate) {
      let _tagTemplate = this.config.template[tagTemplate].call(this)
      if(typeof _tagTemplate != "string" && !(_tagTemplate instanceof HTMLElement)) {
        throw new TypeError(`ERROR[TagItem] :: '${_tagTemplate}' template is not type of string or HTMLElement`)
      }
      if(typeof _tagTemplate == "string") {
        const tempTagTemplate = document.createElement("div")
        tempTagTemplate.innerHTML = _tagTemplate
        _tagTemplate = tempTagTemplate.firstElementChild
        if(!(_tagTemplate instanceof HTMLElement)) {
          throw new TypeError(`ERROR[TagItem] :: '${_tagTemplate}' template is not type of HTMLElement`)
        }
      }
      return _tagTemplate
    }

    return TagItem
  })()
}
