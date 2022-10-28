"use strict";

if(window.Tags == undefined) {
  window.Tags = (function() {
    
    const _defaultConfig = Object.freeze({
      el: null,
      tags: [],
      classList: [],
      disabled: false,
      allowDuplicates: true,
      clearOnBlur: false,
      preserveCase: false,
      placeholder: "",
      allowedTags: [],
      disallowedTags: [],
      onBeforeTagAdd: function() {},
      onTagAdd: function() {},
      onBeforeTagRemove: function() {},
      onTagRemove: function() {}
    })

    function Tags(config = _defaultConfig) {
      let _config = _buildConfigObject(config)
      let _dom = {
        tagsWrapper: null,
        inputTags: null,
      }
      let _values = []
      let _tagItems = []
      let _disabled = false

      Object.defineProperty(this, "config", {
        get: () => _config
      })
      Object.defineProperty(this, "dom", {
        get: () => _dom
      })
      Object.defineProperty(this, "values", {
        get: () => _values,
        set: (value) => {
          if((value instanceof Array) == false) {
            throw new Error("ERROR[Tags.addAll] :: parameter is not instance of Array")
          }
          if(value.length == 0) {
            _values = value
            this.tagItems = []
            this.dom.tagsWrapper.innerHTML = ""
            this.dom.tagsWrapper.appendChild(this.dom.inputTags)
          }
          else {
            this.removeAll()
            this.addAll(value)
          }
        },
      })
      Object.defineProperty(this, "tagItems", {
        get: () => _tagItems,
        set: (value) => _tagItems = value,
      })
      Object.defineProperty(this, "inputValue", {
        get: () => this.dom.inputTags.value,
        set: (value) => this.dom.inputTags.value = value,
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
      
      _checkConfigValues.call(this)
      _initGUI.call(this)
      this.values = this.config.tags
      this.disabled = this.config.disabled
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
      this.dom.tagsWrapper.insertBefore(tagItem, this.dom.inputTags)
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
      if(targetElement instanceof HTMLDivElement) {
        this.dom.tagsWrapper = targetElement
        this.dom.tagsWrapper.innerHTML = ""
        for (let i = 0; i < this.config.classList.length; i++) {
          const classItem = this.config.classList[i]
          this.dom.tagsWrapper.classList.add(classItem)
        }
        this.dom.inputTags = document.createElement("input")
        this.dom.tagsWrapper.classList.add("yk-tags")
        this.dom.inputTags.classList.add("yk-tags__input")
        this.dom.tagsWrapper.appendChild(this.dom.inputTags)
        this.dom.inputTags.setAttribute("placeholder", this.config.placeholder || "Type and press Enter")

        // Add Event Listeners 
        this.dom.tagsWrapper.addEventListener("click", _onClickTagsWrapper.bind(this))
        this.dom.inputTags.addEventListener("keyup", _onKeyUpInputTags.bind(this))
        this.dom.inputTags.addEventListener("keydown", _onKeyDownInputTags.bind(this))
        this.dom.inputTags.addEventListener("blur", _onBlurInputTags.bind(this))
      }
    }

    /**
     * Event handler for input element
     * @param {KeyboardEvent} event 
     */
    function _onKeyUpInputTags(event) {
      if(event.key == "Enter") {
        const value = this.inputValue
        if(value.trim().length > 0) {
          if(this.addTag(value) != null) {
            this.inputValue = ""
          }
        }
      }
    }

    /**
     * Event handler for input element
     * @param {KeyboardEvent} event 
     */
    function _onKeyDownInputTags(event) {
      if(event.key == "Backspace" && this.inputValue.length == 0) {
        this.removeTag(this.tagItems.length - 1)
      }
    }

    /**
     * On blur input element
     */
    function _onBlurInputTags() {
      if(this.config.clearOnBlur == true) {
        this.inputValue = ""
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
    function _onClickTagsWrapper() {
      this.dom.inputTags.focus()
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
            throw new Error(`ERROR[Tags._checkConfigValues] :: '${tagItem1}' can't be allowed and disallowed value`)
          }
        }
      }
    }

    /**
     * Check if tag value is valid
     * @param {string} value 
     */
    function _isValidTagValue(value) {
      if(this.config.allowDuplicates == false && this.values.map(item => item.toLowerCase()).includes(value.toLowerCase())) {
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
     * Builds config object based on the default configs
     * @param {object} config 
     * @returns {object}
     */
    function _buildConfigObject(config) {
      const _config = {};
      const keys = Object.keys(_defaultConfig);
      const length = keys.length;
      for (let index = 0; index < length; index++) {
        const key = keys[index];
        if(config.hasOwnProperty(key) == true) {
          _config[key] = config[key];
        }
        else {
          _config[key] = _defaultConfig[key];
        }
      }
      return _config;
    }
  
    return Tags
  })()
}
