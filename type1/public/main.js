let fillBodyNav = ()=>{
  let data = items;
  let build = "";
  for(let i = 0; i < data.length; i++){
    $("#menu_nav").html(`${$("#menu_nav").html()} <li>${data[i].name}</li>`);
  
  }
};
let sectItems = {};
function displayItems(a){
  console.log(a);
  let data = items;
  let build = "";
  let template = document.getElementById("template1").innerHTML;
  if(a === "View All" || a === undefined){
    for(let i = 0; i < data.length; i++){
      build+= `<div class='cont_${data[i].stylingClass}' id='${data[i].name}'>`;
      for(let j = 0; j < data[i].items.length; j++){
        console.log(data[i].items[j]);
        build += Mustache.render(template,data[i].items[j]);
        //console.log(data[0].items[i])
      }
      build+="</div>";
    }
  }else{
    build+=`<div class='cont_card' id='${a}'>`;
    for(let i = 0; i < data.length; i++){
      for(let j = 0; j < data[i].items.length; j++){
        if(data[i].name === a){
          let cust = {...data[i].items[j]};
          cust.stylingClass = "card";
          build += Mustache.render(template,cust);
        }
      }
    }
    build+="</div>";
  }
  
  $("#display_menu_cont").removeClass("empty");
  $("#display_menu_cont").addClass("polluted");
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
  let userChoice = $(a).siblings(".buyAmount").find(".selected").attr("id");
  let quantity;
  if(Number.isInteger(Number(userChoice))){
    quantity = userChoice;
  }else{
    quantity = $(a).siblings(".buyAmount").find(".selected").val();
  }
  if(Cart.isValid(quantity)){
    b.addItem(pId, quantity);
    hideBuyDiv();
  }else{
    alert("invalid!");
  }
}
function toggleUserData(){
  $(".fa-user-box").css("top", $("#nav_cart").outerHeight());
  $(".fa-user-box").css("left", ($(".fa-user").position().left + parseFloat($(".fa-user").css("width"))));
  $(".fa-user-box").toggleClass("shown hidden");

}
let userModifiedCart = false;
function toggleCart(){
  $("#pageShadow").toggleClass("cartClose cartOpen");
  $("#cart_cont").toggleClass("cartClose cartOpen");
}
window.onresize = loadBuyDiv;

$(document).on("mouseleave", ".menuItemCont", hideBuyDiv);
$(document).on("click", "button", extendBuyDiv);
var buyContEl;
$(document).ready(()=>{
  var user = new User();
  var cart = new Cart();
  var dbCartData = user.getCart((a)=>{
    cart.addItems(a);
    user.loadCart(a);
  });
  
  $(".fa-bars").click(function(){
    $("#body").toggleClass("slide close");
    $(this).toggleClass("rotate upright");
  });
  $("#nav_cart li .fa-shopping-cart").click(()=>{
    $("#cart_body_items").html("");
    user.updateData(cart.data);
    user.loadCart(cart.data);
    toggleCart();
  });
  
  $("#nav_cart li .fa-user").click(()=>{
    //user.updateUserData(cart.data);
    //user.loadCart(cart.data);
    toggleUserData();
  });
  $("#cartExit").click(()=>{
    toggleCart();
    if(userModifiedCart){
      let indexs = [];
      let removeNow = $("#cart_body_items").children(".cart_item").children(".cart_visible.removed").closest(".cart_item");
      $(removeNow).each(function(){
        $(this).remove();
        indexs.push($(this).attr("id"));
      });
      for(var i in indexs){
        cart.removeItem(indexs[i]);
      }
      user.updateData(cart.data);
      userModifiedCart = false;
    }
  });
  $("#cart_body").on("click", ".spanUndo", function(){
    console.log("AAA");
    let divRemove = $(this).closest(".cart_item");
    $($(divRemove).children(".cart_visible")).toggleClass("removed visible");
    $($(divRemove).children(".cart_removed")).toggleClass("removed visible");
    
  });
  $("#cart_body").on("click", ".cart_item_delete", function(){
    console.log("AAA");
    userModifiedCart = true;
    let divRemove = $(this).closest(".cart_item");
    $($(divRemove).children(".cart_visible")).toggleClass("removed visible");
    $($(divRemove).children(".cart_removed")).toggleClass("removed visible");
  });
  $("#display_menu_cont").on("click", '.cartSubmit', function(){
    buyButtonClicked(cart, $(this));
    user.updateData(cart.data);
  });
  $("#display_menu_cont").on("click", ".valueClickable", function(a){
    $(this).closest(".buyAmount").find(".selected").toggleClass("selected");
    $(this).toggleClass("selected");
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
  $("#menu_nav").on("click", "li",function(){
    
    if(!($(this).hasClass("selected"))){
      let selectedEl = $(this).siblings(".selected");
      selectedEl.removeClass("selected");
      $(this).addClass("selected");
      $("#display_menu_cont").toggleClass("polluted empty");
      $("#display_menu_cont").empty();
      let reqSection = $(this).text();
      if(reqSection === "VIEW ALL"){
        reqSection = "all";
      }
      displayItems(reqSection);
    }
  });
});