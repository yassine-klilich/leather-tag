window.tagsObj = new Tags({
  el: "tags",
  initValues: ["Couscous", "Tajine"],
  classList: ["custom-tag"],
  placeholder: "Add some food you like...",
  clearOnBlur: true,
  allowDuplicates: true,
  allowedTags: ["Couscous", "Tajine", "Bastilla", "Rfisa", "Hrira", "Ma9loba"],
  disallowedTags: ["Batata", "Maticha", "Lkhyar"],
  disabled: false,
  autoComplete: ["Couscous", "Tajine b djaj", "Tajine b l7am", "Bastilla", "Rfisa", "Hrira", "Ma9loba"]
})