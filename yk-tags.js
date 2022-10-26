"use strict";


/**
 * start with the very basic feature
 * - add tags when pressing enter
 * - remove tag
 * 
 */

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

			Object.defineProperty(this, "config", {
				get: () => _config
			})
			Object.defineProperty(this, "dom", {
				get: () => _dom
			})
			Object.defineProperty(this, "values", {
				get: () => _values
			})
			
			_initGUI.call(this)
    }

		Tags.prototype.addTag = function(value) {
			const tagItem = _createTagItem.call(this, value)
			this.dom.tagsWrapper.insertBefore(tagItem, this.dom.inputTags)
			this.values.push(value)
		}

		Tags.prototype.remove = function() {
			
		}

		Tags.prototype.removeAll = function() {
			
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
			}
		}

		/**
		 * On keyup from the input element
		 * @param {KeyboardEvent} event 
		 */
		function _onKeyUpInputTags(event) {
			if(event.key == "Enter") {
				const value = this.dom.inputTags.value
				if(value.trim().length > 0) {
					this.addTag(value)
					this.dom.inputTags.value = ""
				}
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
			btnRemoveTag.addEventListener("click", _onClickRemoveTag.bind(this, tagItem))

			tagValue.textContent = value
			tagItem.appendChild(tagValue)
			tagItem.appendChild(btnRemoveTag)

			return tagItem
		}

		/**
		 * 
		 * @param {HTMLElement} tagItem 
		 */
		function _onClickRemoveTag(tagItem) {
			const tagItems = this.dom.tagsWrapper.children
			for (let i = 0; i < tagItems.length; i++) {
				if(tagItems[i] == tagItem) {
					this.dom.tagsWrapper.removeChild(tagItem)
					break
				}
			}
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
