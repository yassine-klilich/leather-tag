window.tagsObj = new Tags({
  el: "tags",
  initValues: ["Couscous", "Tajine"],
  classList: ["custom-tag"],
  placeholder: "Add some food you like...",
  allowDuplicates: false,
  //allowedTags: ["Couscous", "Tajine", "Mroziya", "Mlokhiya", "Bastilla", "Rfisa", "Hrira", "Ma9loba"],
  //disallowedTags: ["Batata", "Maticha", "Lkhyar"],
  disabled: false,
  autoComplete: ["Couscous", "Tajine", "Mroziya", "Mlokhiya", "Bastilla", "Rfisa", "Hrira", "Ma9loba", "Bisara", "La3das", "Loubya", "Sandwich"],
  onInvalidTag: function(value) {
    console.log(`%c'${value}' is an invalid value`, 'background: red; padding: 2px; border-radius: 4px; color: #fff')
  },
})