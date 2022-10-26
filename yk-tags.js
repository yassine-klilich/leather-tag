"use strict";

if(window.Tags == undefined) {
  window.Tags = (function() {
    
    const _defaultConfig = Object.freeze({
			el: null, // whether element or selector
			tags: [],
			allowDuplicates: true,
			clearOnBlur: true,
			preserveCase: false,
			disableTags: [],
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

			Object.defineProperty(this, "config", {
				get: () => _config
			})
			Object.defineProperty(this, "dom", {
				get: () => _dom
			})
			Object.defineProperty(this, "values", {
				get: () => _values,
				set: (value) => _values = value,
			})
			Object.defineProperty(this, "tagItems", {
				get: () => _tagItems,
				set: (value) => _tagItems = value,
			})
			Object.defineProperty(this, "inputValue", {
				get: () => this.dom.inputTags.value,
				set: (value) => this.dom.inputTags.value = value,
			})
			
			_initGUI.call(this)
    }

		Tags.prototype.addTag = function(value) {
			const tagItem = _createTagItem.call(this, value)
			this.dom.tagsWrapper.insertBefore(tagItem, this.dom.inputTags)
			this.values.push(value)
			this.tagItems.push(tagItem)
		}

		/**
		 * Remove tag item
		 * @param {number | HTMLElement} tagItem Even tag index or tag element
		 */
		Tags.prototype.removeTag = function(tagItem) {
			for (let i = 0; i < this.tagItems.length; i++) {
				if(i == tagItem || this.tagItems[i] == tagItem) {
					this.dom.tagsWrapper.removeChild(this.tagItems[i])
					this.values.splice(i, 1)
					this.tagItems.splice(i, 1)
					break
				}
			}
		}

		Tags.prototype.removeAll = function() {
			this.values = []
			this.tagItems = []
			this.dom.tagsWrapper.innerHTML = ""
			this.dom.tagsWrapper.appendChild(this.dom.inputTags)
		}

		function _initGUI() {
			const targetElement = document.getElementById(this.config.el)
			if(targetElement instanceof HTMLDivElement) {
				this.dom.tagsWrapper = targetElement
				this.dom.inputTags = document.createElement("input")

				this.dom.tagsWrapper.classList.add("yk-tags")
				this.dom.inputTags.classList.add("yk-tags__input")

				this.dom.tagsWrapper.appendChild(this.dom.inputTags)

				this.dom.inputTags.setAttribute("placeholder", "Type and press Enter")
				this.dom.inputTags.addEventListener("keyup", _onKeyUpInputTags.bind(this))
				this.dom.inputTags.addEventListener("keydown", _onKeyDownInputTags.bind(this))
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
					this.addTag(value)
					this.inputValue = ""
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
