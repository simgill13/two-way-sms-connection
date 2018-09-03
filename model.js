const mongoose = require('mongoose');




// const blogPostSchema = mongoose.Schema ({
// 	name: String,
// 	email: String,
// 	subject: String,
// 	message: String
// });


const newbarSchema = mongoose.Schema({
	barName: String,
	barid: Number,
	barMenu:Array,
	barAddress: String,
});

const activeOrders = mongoose.Schema({
	barName: String,
	barid: Number,
	customerId:Number,
	activeOrder:Array,
});




const bar = mongoose.model("bar", newbarSchema);
const order = mongoose.model("order",activeOrders)

module.exports = {bar,order};


