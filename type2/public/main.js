function fetchItems(){
  let data = items;
  return data;
}
function buildMenu(){
  /*Builds the menu page using items.js*/
  let data = fetchItems();
  let parentEl = $("#menu");
  let cartItemTemplate = $("#itemTemplate").html();
  let build = "";
  let menu = {};
  //Build all menu subheaders
  jQuery.each(data, function(i, val) {
    let styleMenu = val.style.id;
    console.log(styleMenu)
    if(!(menu[styleMenu])){
      menu[styleMenu] = styleMenu;
      build+=`<div class="menu_item_group" id=${styleMenu}><h3>${val.style.name}</h3></div>`;
    }
    $(parentEl).html(build);
  });
  
  jQuery.each(data, function(i, val){
    let styleMenu = val.style.id;
    $(`#${styleMenu}`).append(Mustache.render(cartItemTemplate,data[i]));
  });
}

function submitToCart(el){
  let cart = $("#cart");
  let cartItemTemplate = $("#cartItemTemplate").html();

  let productName = $(el).parents(".item").find(".productname").text()
  let productQuantity = $(el).siblings(".quantInput").val();
  let productInfo = items.filter(
    function(data){ return (data.name === productName) }
  );
  
  let item = {
    name: productInfo[0].name,
    quantity: productQuantity,
    subtotal: (productInfo[0].price * productQuantity).toFixed(2),
  };
  
  $(cart).append(Mustache.render(cartItemTemplate,item));
  
}
$(document).ready(function(){
  //$(window).scroll(parallaxImgHeader);
  $(window).scroll(function() {
    if ($(document).scrollTop() > (window.innerHeight)*0.85) {
        $('#nav-head').css("height", '8vh');
        $('#nav-head').css("box-shadow", '0px 2px 4px 2px rgba(0, 0, 0, 0.1)');
        $('#nav-head').css("background-image", ' linear-gradient(rgb(255,255,255), rgb(255,255,255))');
        $('#nav-head').css("background-color", 'white');

    }
    else {
      $('#nav-head').css("height", '12vh');
      $('#nav-head').css("box-shadow", '0px 2px 4px 2px rgba(0, 0, 0, 0)');
      $('#nav-head').css("background-image", ' linear-gradient(rgba(0,0,0,0.2), transparent)');
      
      $('#nav-head').css("background-color", 'transparent');
    }
});
  buildMenu();
  $(".deliveryChoice").click(function(){
    $("#slider_choice").css("margin-left","50%");
    $(this).css("color", "black");
    $(this).siblings(".pickupChoice").css("color", "rgba(0, 0, 0, 0.3)")
  });
  
  $(".pickupChoice").click(function(){
    $("#slider_choice").css("margin-left","0%");
    $(this).css("color", "black");
    $(this).siblings(".deliveryChoice").css("color", "rgba(0, 0, 0, 0.3)")
  });

  $(".itemDescCont").click(function(){  
    $(this).closest('#menu').find(".selected").toggleClass("selected")
    $(this).parent().toggleClass("selected");
    //$(this).parent().children(".extended-info").toggleClass("extended collapsed");
  });

  $("#menu").on('click', ".itemCont", function() {
    let productOverName = $(this).find(".productname").text();
    $("#pt2 #title_span").text(productOverName)
  });
});