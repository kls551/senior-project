var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var attr = new Schema({
  weight: Number, type: String, price: Number
})

var ItemSchema = new Schema({
  name: String,
  description: String,
  brand: String,
  attr: [attr],
  busAttr: [{quantity: Number, buyPrice: Number}]
});

var Item = mongoose.model("Item", ItemSchema);
module.exports = Item;
