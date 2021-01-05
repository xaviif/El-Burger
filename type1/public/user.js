
class User{
  constructor(id){
    if (localStorage.getItem('clientId')===null)
      localStorage.setItem("clientId",Date.now());
    this.id = localStorage.getItem("clientId");
    this.total = 0.00;
    this.totalItems = 0;
    this.emptyDb = false;
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
    this.total = 0;
    for(let i in a){
      //console.log(a[i]);
      for(let j in items){
        let foundItem = items[j].items.find(x => x.productId === a[i].productId);
        let foundClone = {...foundItem};
        
        if(foundItem !== undefined){
          foundClone.itemQuantity = a[i].quantity;
          foundClone.indx = i;
          foundClone.total = (a[i].quantity * foundClone.price).toFixed(2);
          xAr.push(foundClone);
          this.totalItems+=1;
          this.total += parseFloat((a[i].quantity * foundClone.price));
          console.log(this.total);
        }else{
          continue;
        }
      }
    }
    for(let i in a){
      let template = document.getElementById("cartItemTemp").innerHTML;
      $("#cart_body_items").append(Mustache.render(template,xAr[i]));
    }
    if ($("#cart_body_items")[0].scrollHeight - 15 > $("#cart_body_items_cont").height()) {
      $(".scrollIcon").css("display", "initial");
    } else {
      $(".scrollIcon").css("display", "none");
    }
    if(this.totalItems > 0){
      this.total = parseFloat(this.total).toFixed(2);
      $("#totalItems").text(this.totalItems);
      $("#totalCost").text(this.total);
      if(!this.emptyDb){
        this.emptyDb = true;
        $("#cart_foot div").toggleClass("hidden displayed");
      }
    }
    let headerHeight = $("#cart_header").outerHeight();
    let contHeight = $("#cart_body_items").outerHeight();
    let iconHeight = $("#scrollIcon").outerHeight();
    $("#scrollIcon").css("top", headerHeight + contHeight - (iconHeight - 2));
  }
}
