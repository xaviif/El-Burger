const db = firebase.database(); 
const rootRef = firebase.database().ref();
class Cart{
  constructor(start) {
    this.data = start || [];
  }
  static isValid(a){
      return a >= 1 ? true : false;
  }
  addItem(a, b){
    return this.data.push({
      productId: a,
      quantity: Math.floor(b)
    });
  }
  addItems(a){
    for(let i in a){
      this.data.push(a[i]);
    }
    return this.data;
  }
  modifyItem(index, quantity){
    return (this.isValid(quantity) ? this.data[index].quantity = Math.floor(quantity) : console.log("invalid"));
  }
  removeItem(index){
    return this.data.splice(index, 1); 
  }

  fromDB(a){
    let parent = this;
    let dbCart = [];
    rootRef.child(`userCarts/${a}/cart/`).once("value", (snapshot)=>{
      snapshot.forEach((child)=>{
        //Populate curItem with values, then push to cart
        let curItem = [childJ.key, childJ.val()];
        console.log()
        child.forEach((childJ)=>{
          curItem[childJ.key] = childJ.val();
        });
        dbCart.push(curItem);
      });
    }).then(()=>{
      parent.addItems(dbCart);
    });
  }
}


function loadBuyDiv(){
  $(".buying").each(function( index ) {
    let thisBuyEl = $(this);
    let bodyEl = $(thisBuyEl).siblings(".temp_body");
    $(thisBuyEl).css({
      "width": `${$(bodyEl).css("width")}`,
      "top": `${$(bodyEl).position().top}px`,
      "left": `${$(bodyEl).position().left}px`,
      "height": `${$(bodyEl).css("height")}`,
      "pointer-events": "none"
    });
    $(thisBuyEl).children("div").css({
      "height": `${$(bodyEl).css("height")}`,
      "width": `${$(bodyEl).css("width")}`,
    });
  });
}

class User{
  constructor(id){
    if (localStorage.getItem('clientId')===null)
      localStorage.setItem("clientId",Date.now());
    this.id = localStorage.getItem("clientId");
  }
  updateData(a){
    console.log(a);
    db.ref(`userCarts/${this.id}/cart`).set("");
    for(let i in a){
      //index aray
      console.log(a[i]);
      for(let j in a[i]){
        let pId = a[i].productId;
        let q = a[i].quantity || 0;
        db.ref(`userCarts/${this.id}/cart/item${i}/productId`).set(pId);
        db.ref(`userCarts/${this.id}/cart/item${i}/itemQuantity`).set(q);
      }
    }
  }
  updateCart(a){
    for(let i in a){
      console.log(a[i]);
      for(const [key, value] of Object.entries(a[i])){
        console.log(key, value);
      }
    }
  }
}

function pageLoadCart(){
  let i = 0;
  /*
  //Load cart from db
  rootRef.child(`${curId}/cart/`).once("value", function(snapshot){
    snapshot.forEach(function(child) {
      let cartCopy = [];
      child.forEach(function(childJ) {
        let childKey = childJ.key;
        cartCopy.push({
          //[childKey]: childJ.val()
          key: childJ.key,
          val: childJ.val()
        });
      });
      cart[i] = cartCopy.reduce(function(map, obj) {
        map[obj.key] = obj.val;
        return map;
      }, {});
      i++;
      console.log("okok")
    });
  }).then(()=>{
    //Display cart to user
    let data = items;
    
    for(var i in items){
      for (var j in data[i].items) {
        let pushData = {};
        for(const [key, value] of Object.entries(data[i].items[j])){
          if(!(key === "productId" || key === "price" ||  key === "name")){
            continue;
          }
          if(key === "name"){
            pushData[key] = value;
            itemsList.push(pushData);
          }else{
            pushData[key] = value;
          }
        } 
      }
    }
    let build = '';
    let template = document.getElementById("cartItem").innerHTML;
    console.log(itemsList);
    console.log(cart);
    for(let i in cart){
      let arIndex = 0;
      let target = cart[i].productId;
      for(let j in itemsList){
        //console.log(itemsList[j].productId, "aaaa", i, j);
        if(itemsList[j].productId === target){
          console.log(cart[i], "aa");
          itemsList[j].itemQuantity = cart[i].itemQuantity;
          build += Mustache.render(template, itemsList[j]);
          break;
        }
        
      }
      console.log(itemsList);
    }
    document.getElementById("cart_body_items").innerHTML += build;
  });      */
}
/*
///
let buyContEl;
let itemsList = [];

let showBuy = function(){
  let bodyDivCont = $(this).parent().parent().parent();
  buyContEl = $(bodyDivCont).children(".buying").children("div");
  let bodyEl = $(bodyDivCont).children(".temp_body");
  //$(buyContEl).children("div").css("height", `${$(bodyEl).css("height")}`);
  $(buyContEl).toggleClass("hidden expanded");
  

  //console.log(buyCont);
};

function readyFunc(){
  console.log("READY");
  $(".buying").each(function( index ) {
    let thisBuyEl = $(this);
    let bodyEl = $(thisBuyEl).siblings(".temp_body");
    $(thisBuyEl).css({
      "width": `${$(bodyEl).css("width")}`,
      "top": `${$(bodyEl).position().top}px`,
      "left": `${$(bodyEl).position().left}px`,
      "height": `${$(bodyEl).css("height")}`,
      "pointer-events": "none"
    });
    $(thisBuyEl).children("div").css({
      "height": `${$(bodyEl).css("height")}`,
      "width": `${$(bodyEl).css("width")}`,
    });
  });
}

function mouseOut(){
  //evt2.preventDefault();
  //console.log(buyContEl, "1", $(buyContEl).children("div").attr('class'));
  $(buyContEl).toggleClass("hidden expanded");
  buyContEl = undefined;
  //console.log(buyContEl, "2");
}
function pushToCart(){
  let parent = $("#cart_body_items");
  let template = document.getElementById("cartItem").innerHTML;
  let build = "";

  build += Mustache.render(template,data[i].items[j]);
  $(parent).append(template);
}
function updateCart(){
  //Add to cart
  buyContEl = $(this).parent().parent().parent();
  let item = {
    productId: $(buyContEl).parent().attr("id"),
    quantity: $(this).parent().children("input").val(),
  };
  cart.push(item);
  pushToCart();
  buyContEl.toggleClass("hidden expanded");
  buyContEl = undefined;
  
  console.log(cart);
}
function toggleCart(){
  $("#pageShadow").toggleClass("cartClose cartOpen");
  $("#cart_cont").toggleClass("cartClose cartOpen");
}
function saveCart(){
  console.log("savingCart");
  //let cartDb = db.ref("curId/cart");
  for(let i in cart){
    //index aray
    for(let j in cart[i]){
      db.ref(`${curId}/cart/item${i}/productId`).set(cart[i].productId);
      db.ref(`${curId}/cart/item${i}/itemQuantity`).set(cart[i].quantity);
    }
  }
}
function pageLoadCart(){
  let i = 0;
  //Load cart from db
  rootRef.child(`${curId}/cart/`).once("value", function(snapshot){
    snapshot.forEach(function(child) {
      let cartCopy = [];
      child.forEach(function(childJ) {
        let childKey = childJ.key;
        cartCopy.push({
          //[childKey]: childJ.val()
          key: childJ.key,
          val: childJ.val()
        });
      });
      cart[i] = cartCopy.reduce(function(map, obj) {
        map[obj.key] = obj.val;
        return map;
      }, {});
      i++;
      console.log("okok")
    });
  }).then(()=>{
    //Display cart to user
    let data = items;
    
    for(var i in items){
      for (var j in data[i].items) {
        let pushData = {};
        for(const [key, value] of Object.entries(data[i].items[j])){
          if(!(key === "productId" || key === "price" ||  key === "name")){
            continue;
          }
          if(key === "name"){
            pushData[key] = value;
            itemsList.push(pushData);
          }else{
            pushData[key] = value;
          }
        } 
      }
    }
    let build = '';
    let template = document.getElementById("cartItem").innerHTML;
    console.log(itemsList);
    console.log(cart);
    for(let i in cart){
      let arIndex = 0;
      let target = cart[i].productId;
      for(let j in itemsList){
        //console.log(itemsList[j].productId, "aaaa", i, j);
        if(itemsList[j].productId === target){
          console.log(cart[i], "aa");
          itemsList[j].itemQuantity = cart[i].itemQuantity;
          build += Mustache.render(template, itemsList[j]);
          break;
        }
        
      }
      console.log(itemsList);
    }
    document.getElementById("cart_body_items").innerHTML += build;
  });      
}

function checkId(){
  if (localStorage.getItem('clientId')===null)
    localStorage.setItem("clientId",Date.now());

    curId = localStorage.getItem("clientId");
}
function deleteCartItem(){

}
let curId;

window.onresize = readyFunc;
window.addEventListener("beforeunload", saveCart);
window.addEventListener('load', checkId);
window.addEventListener("load", pageLoadCart);


$("#nav_cart li i").click(toggleCart);

$(document).on("mouseleave", ".menuItemCont", mouseOut);
$(document).on("click", "#cartExit", toggleCart);
$(document).on("click", "#cart_item_delete", deleteCartItem);

$(document).on("click", '.cartSubmit', updateCart);
*/
//$("#placeOrderBtn").click(PlaceOrder)
/**
 * Save shopping cart in DB
 * Update cart on enter
 * 
 */