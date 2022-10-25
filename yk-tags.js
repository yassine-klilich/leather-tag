"use strict";

if(window.Tags == undefined) {
  window.Tags = function() {
    
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
      let _config = buildConfigObject(config)
    }

		Tags.prototype.add = function() {
			
		}

		Tags.prototype.remove = function() {
			
		}

		Tags.prototype.removeAll = function() {
			
		}

    function buildConfigObject(config) {
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
  }
}
