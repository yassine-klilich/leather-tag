import "./yk-tags.css"

"use strict";

if(window.Tags == undefined) {
  window.Tags = (function() {
    
    const _defaultConfig = Object.freeze({
      el: null,
      initValues: [],
      classList: [],
      disabled: false,
      allowDuplicates: true,
      preserveCase: false,
      placeholder: "",
      allowedTags: [],
      disallowedTags: [],
      autoComplete: [],
      onCreate: function() {},
      onBeforeTagAdd: function() {},
      onTagAdd: function() {},
      onBeforeTagRemove: function() {},
      onTagRemove: function() {}
    })

    Tags.DefaultConfig = _defaultConfig

    function Tags(config = _defaultConfig) {
      let _config = _buildConfigObject(_defaultConfig, config)
      let _dom = {
        tagsWrapper: null,
        inputElement: null,
        autoCompleteWrapper: null,
      }
      let _values = []
      let _tagItems = []
      let _disabled = false
      let _autoComplete = false
      let _bindFuncHideAutoComplete = _hideAutoComplete.bind(this)

      Object.defineProperty(this, "config", {
        get: () => _config,
        set: (value) => {
          _config = _buildConfigObject(_config, value)
          _checkConfigValues.call(this)
          _initGUI.call(this)
          this.values = _config.initValues
          this.disabled = _config.disabled
          this.autoComplete = _config.autoComplete
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
          this.dom.autoCompleteWrapper = _buildAutoCompleteDOM.call(this)
          _setAutoCompleteOptions.call(this, _autoComplete)
        },
      })
      Object.defineProperty(this, "_bindFuncHideAutoComplete", {
        get: () => _bindFuncHideAutoComplete,
        set: (value) => _bindFuncHideAutoComplete = value,
      })

      this.config = _config
    }

    /**
     * Add tag item
     * @param {string} value 
     */
    Tags.prototype.addTag = function(value) {
      if(typeof value != "string") {
        throw new Error(`ERROR[Tags.addTag] :: ${value} is not type of string`)
      }
      value = value.trim()
      if(this.config.preserveCase == false) {
        value = value.toLowerCase()
      }
      if(_isValidTagValue.call(this, value) == false) {
        return
      }
      this.config.onBeforeTagAdd()
      const tagItem = _createTagItem.call(this, value)
      this.dom.tagsWrapper.insertBefore(tagItem, this.dom.inputElement)
      this.values.push(value)
      this.tagItems.push(tagItem)
      this.config.onTagAdd()
      
      return tagItem
    }

    /**
     * Add a list of tags
     * @param {Array} values 
     */
    Tags.prototype.addAll = function(values) {
      if((values instanceof Array) == false) {
        throw new Error("ERROR[Tags.addAll] :: parameter is not instance of Array")
      }
      values.forEach((value) => {
        this.addTag(value)
      })
    }

    /**
     * Remove tag item
     * @param {number | HTMLElement} tagItem Even tag index or tag element
     */
    Tags.prototype.removeTag = function(tagItem) {
      this.config.onBeforeTagRemove()
      for (let i = 0; i < this.tagItems.length; i++) {
        if(i == tagItem || this.tagItems[i] == tagItem) {
          this.dom.tagsWrapper.removeChild(this.tagItems[i])
          this.values.splice(i, 1)
          this.tagItems.splice(i, 1)
          break
        }
      }
      this.config.onTagRemove()
    }

    /**
     * Remove all tags
     */
    Tags.prototype.removeAll = function() {
      this.values = []
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

        // Add Event Listeners 
        this.dom.tagsWrapper.addEventListener("click", _onClickTagsWrapper.bind(this))
        this.dom.inputElement.addEventListener("input", _onInputInputTags.bind(this))
        this.dom.inputElement.addEventListener("keyup", _onKeyUpInputTags.bind(this))
        this.dom.inputElement.addEventListener("keydown", _onKeyDownInputTags.bind(this))
      }
    }

    /**
     * Event handler for input element
     */
    function _onInputInputTags() {
      if(this.inputValue.length == 0) {
        _setAutoCompleteOptions.call(this, this.autoComplete)
      }
      else {
        const matchAutoCompleteOptions = this.autoComplete.filter(item => item.toLowerCase().includes(this.inputValue.toLowerCase()))
        if(matchAutoCompleteOptions.length > 0) {
          _setAutoCompleteOptions.call(this, matchAutoCompleteOptions)
          _showAutoComplete.call(this)
        }
        else {
          _hideAutoComplete.call(this)
        }
      }
    }

    /**
     * Event handler for input element
     * @param {KeyboardEvent} event 
     */
    function _onKeyUpInputTags(event) {
      if(event.key == "Escape") {
        this.dom.inputElement.blur()
        _hideAutoComplete.call(this)
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
            }
          }
        } break;
      }
    }

    /**
     * Create tag item element
     * @param {string} value 
     * @returns {HTMLElement} created tag item element
     */
    function _createTagItem(value) {
      const tagItem = document.createElement("div")
      const tagValue = document.createElement("span")
      const btnRemoveTag = document.createElement("button")

      tagItem.classList.add("yk-tags__item")
      tagValue.classList.add("yk-tags__value")
      btnRemoveTag.classList.add("yk-tags__btn-remove")
      btnRemoveTag.innerHTML = `<svg width="14" height="14" viewBox="0 0 48 48"><path fill="#767676" d="M38 12.83l-2.83-2.83-11.17 11.17-11.17-11.17-2.83 2.83 11.17 11.17-11.17 11.17 2.83 2.83 11.17-11.17 11.17 11.17 2.83-2.83-11.17-11.17z"/></svg>`
      btnRemoveTag.addEventListener("click", _onClickBtnRemoveTag.bind(this, tagItem))

      tagValue.textContent = value
      tagItem.appendChild(tagValue)
      tagItem.appendChild(btnRemoveTag)

      return tagItem
    }

    /**
     * On click button remove tag
     * @param {HTMLElement} tagItem 
     */
    function _onClickBtnRemoveTag(tagItem) {
      this.removeTag(tagItem)
    }

    /**
     * On click tag wrapper
     */
    function _onClickTagsWrapper(event) {
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
     * Check if tag value is valid
     * @param {string} value 
     */
    function _isValidTagValue(value) {
      if(this.config.allowDuplicates == false && _isTagExist.call(this, value)) {
        return false
      }
      if(this.config.allowedTags.length > 0 && this.config.allowedTags.map(item => item.toLowerCase()).includes(value.toLowerCase()) == false) {
        return false
      }
      if(this.config.disallowedTags.map(item => item.toLowerCase()).includes(value.toLowerCase())) {
        return false
      }
      return true
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
        this.tagItems[index].classList.add("yk-tags__item--animation")
      }
    }

    function _stopAnimationMatchedTagElement(index) {
      if(this._setTimeoutAnimation != null) {
        this.tagItems[index].classList.remove("yk-tags__item--animation")
        clearTimeout(this._setTimeoutAnimation)
        this._setTimeoutAnimation = null
      }
    }

    /**
     * Build auto complete DOM
     * @returns {HTMLElement}
     */
    function _buildAutoCompleteDOM() {
      const autoCompleteWrapper = document.createElement("div")
      autoCompleteWrapper.classList.add("yk-tags__autocomplete")
      autoCompleteWrapper.addEventListener("click", (event) => event.stopPropagation())
      return autoCompleteWrapper
    }

    /**
     * Set auto complete position
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
     * Append auto complete
     */
    function _showAutoComplete() {
      if(this.dom.autoCompleteWrapper.parentElement == null) {
        document.body.appendChild(this.dom.autoCompleteWrapper)
        _setAutoCompletePosition.call(this)
      }
      document.addEventListener("click", this._bindFuncHideAutoComplete)
      window.addEventListener("resize", this._bindFuncHideAutoComplete)
      this._scrollParent = _getScrollParent(this.dom.tagsWrapper)
      if(this._scrollParent != null) {
        if(this._scrollParent == document.documentElement) {
          this._scrollParent = document
        }
        this._scrollParent.addEventListener("scroll", this._bindFuncHideAutoComplete)
      }
    }
    
    /**
     * Remove auto complete
     */
    function _hideAutoComplete() {
      if(this.dom.autoCompleteWrapper.parentElement == document.body) {
        document.body.removeChild(this.dom.autoCompleteWrapper)
      }
      document.removeEventListener("click", this._bindFuncHideAutoComplete)
      window.removeEventListener("resize", this._bindFuncHideAutoComplete)
      if(this._scrollParent != null) {
        this._scrollParent.removeEventListener("scroll", this._bindFuncHideAutoComplete)
        this._scrollParent = null
      }
    }

    /**
     * Set auto complete options
     */
    function _setAutoCompleteOptions(options) {
      this.dom.autoCompleteWrapper.innerHTML = ""
      const autoCompleteUL = document.createElement("ul")
      for (let i = 0; i < options.length; i++) {
        const optionValue = options[i]
        const autoCompleteLI = document.createElement("li")
        autoCompleteLI.textContent = optionValue
        autoCompleteLI.addEventListener("click", _onClickAutoCompleteOption.bind(this, optionValue))
        autoCompleteUL.appendChild(autoCompleteLI)
      }
      this.dom.autoCompleteWrapper.appendChild(autoCompleteUL)
    }

    /**
     * On click auto-complete option event handler 
     */
    function _onClickAutoCompleteOption(value) {
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
  
    return Tags
  })()
}
