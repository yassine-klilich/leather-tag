window.tagsObj=new LeatherTag({el:"tags",initialTags:["Couscous","Tajine",new TagItem({value:"Pizza",disabled:!0,classList:["pizza-class"]}),new TagItem({value:"Tacos"})],classList:["custom-tag"],placeholder:"Add some food you like...",allowDuplicates:!1,disabled:!1,autoComplete:["Couscous","Pizza","Tacos","Tajine","Mroziya","Mlokhiya","Bastilla","Rfisa","Hrira","Ma9loba","Bisara","La3das","Loubya","Sandwich"],onInvalidTag:function(a){console.log(`%c'${a}' is an invalid value`,"background: red; padding: 2px; border-radius: 4px; color: #fff")},onAllRemoved:function(){console.log("1111")}});