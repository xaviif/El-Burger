
let fillNav = ()=>{
  let data = items;
  let build = "";
  for(let i = 0; i < data.length; i++){
    $("#menu_nav").html(`${$("#menu_nav").html()} <li>${data[i].name}</li>`);
  
  }
};
function displayItems(){
  let data = items;
  var build = "";
  var header = document.getElementById("template_header").innerHTML;
  var template = document.getElementById("template1").innerHTML;

  for(let i = 0; i < data.length; i++){
    build+= `<div class='cont_${data[i].stylingClass}' id='${data[i].name}'>`;
    console.log(data[i].name);
    for(let j = 0; j < data[i].items.length; j++){
      build += Mustache.render(template,data[i].items[j]);
      //console.log(data[0].items[i])
    }
    build+="</div>";
  }
  document.getElementById("display_menu_cont").innerHTML += build;
}

let start = ()=>{
  $("#WhiteFull").remove();
};
$(document).ready(()=>{
  lazyload();
  fillNav();
  displayItems();
  let overLi = false;
  $(".navnav_items li").hover(function(a){
    $(this).css("transition", "0.1s");
    $(this).siblings().css("color", "rgba(0,0,0,0.3)");
    overLi = true;
  }, function(){
    overLi = false;
    $(this).siblings().css("color", "black");
    if(!overLi){
      $(this).css("transition", "0.5s");
    }
  });

});