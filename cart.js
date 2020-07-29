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
    this.total = 0;
    this.totalItems = 0;
  }
  updateData(a){
    /**
     * a: array[];
     */
    db.ref(`userCarts/${this.id}/cart/`).set(a);
    
  }
  getCart(a){
    let dbCart = [];
    rootRef.child(`userCarts/${this.id}/cart/`).once("value", (snapshot)=>{
      snapshot.forEach((child)=>{
        dbCart.push(child.val());
      });
    }).then(()=>{
      a(dbCart);
      return dbCart;
    });
  }
  loadCart(a){
    //a is array
    let xAr = [];
    for(let i in a){
      //console.log(a[i]);
      for(let j in items){
        let foundItem = items[j].items.find(x => x.productId === a[i].productId);
        let foundClone = {...foundItem};
        
        if(foundItem !== undefined){
          foundClone.itemQuantity = a[i].quantity;
          foundClone.indx = i;
          foundClone.total = a[i].quantity * foundClone.price;
          xAr.push(foundClone);
          this.totalItems+=1;
          this.total+=a[i].quantity * foundClone.price;
        }else{
          continue;
        }
      }
    }
    for(let i in a){
      let template = document.getElementById("cartItemTemp").innerHTML;
      $("#cart_body_items").append(Mustache.render(template,xAr[i]));
    }
    let headerHeight = $("#cart_header").outerHeight();
    let contHeight = $("#cart_body_items").outerHeight();
    let iconHeight = $("#scrollIcon").outerHeight();
    $("#scrollIcon").css("top", headerHeight + contHeight - (iconHeight - 2));
  }
}

/*
///
let buyContEl;
let itemsList = [];

function pushToCart(){
  let parent = $("#cart_body_items");
  let template = document.getElementById("cartItem").innerHTML;
  let build = "";

  build += Mustache.render(template,data[i].items[j]);
   $("#cart_body_items")$(parent).append(template);
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

let curId;
window.addEventListener("beforeunload", saveCart);
window.addEventListener("load", pageLoadCart);

$("#nav_cart li i").click(toggleCart);

$(document).on("mouseleave", ".menuItemCont", mouseOut);
$(document).on("click", "#cart_item_delete", deleteCartItem);

*/
//$("#placeOrderBtn").click(PlaceOrder)
/**
 * Save shopping cart in DB
 * Update cart on enter
 * 
 */