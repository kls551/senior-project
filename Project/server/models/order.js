var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var items = new Schema({
    itemId: Number, sellPrice: Number
  })
  

var OrderSchema = new Schema({
  orderDate: {
    type: Date,
    default: Date.now
  },
  totalAmount: Number,
  items: [items],
  note: String
});

var Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
