const tags = new Tags({
  el: "tags",
  tags: ["Couscous", "Tajine"],
  classList: ["custom-tag"],
  placeholder: "Add some food you like...",
  clearOnBlur: true,
  allowDuplicates: true,
  allowedTags: ["Couscous", "Tajine", "Bastilla", "Rfisa", "Hrira", "Ma9loba"],
  disallowedTags: ["Batata", "Maticha", "Lkhyar"],
  disabled: false,
})