'use strict';

var mongoose = require( 'mongoose' );
var config = require( '../config/config.json' );

var customersSchema = mongoose.Schema( {
    customerId: String,    
    created: Number,
    currency: String,
    description: String,
    last: Number,
	expmonth: Number,
    expyear: Number,
} );

var Customers = mongoose.model( 'Customers', customersSchema );

module.exports = Customers;
