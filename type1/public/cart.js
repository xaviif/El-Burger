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
