let fillBodyNav = ()=>{
  let data = items;
  let build = "";
  for(let i = 0; i < data.length; i++){
    $("#menu_nav").html(`${$("#menu_nav").html()} <li>${data[i].name}</li>`);
  
  }
};
function displayItems(){
  let data = items;
  let build = "";
  let template = document.getElementById("template1").innerHTML;
  
  for(let i = 0; i < data.length; i++){
    build+= `<div class='cont_${data[i].stylingClass}' id='${data[i].name}'>`;
    for(let j = 0; j < data[i].items.length; j++){
      build += Mustache.render(template,data[i].items[j]);
      //console.log(data[0].items[i])
    }
    build+="</div>";
  }
  document.getElementById("display_menu_cont").innerHTML += build;
}

function start(){
  $("#WhiteFull").remove();
  fillBodyNav();
  displayItems();
  loadBuyDiv();
}
function extendBuyDiv(){
  let bodyDivCont = $(this).parent().parent().parent();
  buyContEl = $(bodyDivCont).children(".buying").children("div");
  let bodyEl = $(bodyDivCont).children(".temp_body");
  //$(buyContEl).children("div").css("height", `${$(bodyEl).css("height")}`);
  $(buyContEl).toggleClass("hidden expanded");
}

function hideBuyDiv(){
  $(buyContEl).toggleClass("hidden expanded");
  buyContEl = undefined;
}
function buyButtonClicked(b, a){
  buyContEl = $(a).closest(".expanded");
  //buyContEl = $(this).parent().parent().parent();
  let pId = $(buyContEl).parent().attr("id");
  console.log($(a), "2");
  let userChoice = $(a).siblings(".buyAmount").find(".selected").attr("id");
  let quantity;
  if(Number.isInteger(Number(userChoice))){
    quantity = userChoice;
  }else{
    quantity = $(a).siblings(".buyAmount").find(".selected").val();
  }
  console.log(quantity)
  if(Cart.isValid(quantity)){
    b.addItem(pId, quantity);
    hideBuyDiv();
  }else{
    alert("invalid!");
  }
}

function toggleCart(){
  $("#pageShadow").toggleClass("cartClose cartOpen");
  $("#cart_cont").toggleClass("cartClose cartOpen");
}
$("#nav_cart li i").click(toggleCart);
$("#cartExit").click(toggleCart);
window.onresize = loadBuyDiv;

$(document).on("mouseleave", ".menuItemCont", hideBuyDiv);
$(document).on("click", "button", extendBuyDiv);
window.addEventListener("load", pageLoadCart);
var buyContEl;
$(document).ready(()=>{
  
  var user = new User();
  var cart = new Cart();
  cart.fromDB(user.id);
  user.updateCart(cart.data);
  console.log(cart.data);
  
  $("#display_menu_cont").on("click", '.cartSubmit', function(){
    buyButtonClicked(cart, $(this));
    console.log(cart.data);
    user.updateData(cart.data);
  });
  $("#display_menu_cont").on("click", ".valueClickable", function(a){
    $(this).closest(".buyAmount").find(".selected").toggleClass("selected");
    $(this).toggleClass("selected");
  })
  window.addEventListener("beforeunload", function(){
    user.updateData(cart.data);
  });

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