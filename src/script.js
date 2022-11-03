window.tagsObj = new Tags({
  el: "tags",
  initValues: ["Couscous", "Tajine"],
  classList: ["custom-tag"],
  placeholder: "Add some food you like...",
  allowDuplicates: false,
  allowedTags: ["Couscous", "Tajine", "Mroziya", "Mlokhiya", "Bastilla", "Rfisa", "Hrira", "Ma9loba"],
  disallowedTags: ["Batata", "Maticha", "Lkhyar"],
  disabled: false,
  onTagInvalid: function(value) {
    alert(`'${value}' is an invalid value`)
  },
})