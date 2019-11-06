var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var OrderSchema = new Schema({
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  revenue: Number,
  totalAmount: Number,
  tax: Number,
  items: [{
    quantity: Number,
    index: Number,
    price: Number,
    item:
      {
        type: Schema.Types.ObjectId,
        ref: 'Item'
      }
  }]
});

var Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
