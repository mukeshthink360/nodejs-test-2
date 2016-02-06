'use strict';

var Transactions = require( '../models/transactions.model.js' );
var Customers = require( '../models/customer.model.js' );
var config = require( '../config/config.json');
var Stripe = require( 'stripe' )( config.stripeApiKey );

exports.index = function( req, res, next ) {
    if ( req.body ) {
        var transaction = new Transactions( {
            name: req.body.name
        } );
        transaction.save( function( err, trans ) {
            if ( err ) {
                return console.log( err );
            }
            res.status( 200 ).end();
        } );
    }
};

exports.createTransaction = function( req, res, next ) {

    Stripe.charges.create( {
        amount: req.body.amount,
        currency: req.body.currency,
        source: req.body.tokenn,
        description: 'Charge for test@example.com'
    }, function( err, charge ) {
       
		if (err){
            return res.status( 200 ).json( {
				success:false,
				message: err.message
			});
        }
	
       /*  
		Stripe.customers.retrieve(
		  "cus_7rCkzZTwTpDCI7",
		  function(err, customer) {
			
		} */
		
		var transaction = new Transactions( {
            transactionId: charge.id,
            amount: charge.amount,
            created: charge.created,
            currency: charge.currency,
            description: charge.description,
            paid: charge.paid,
            sourceId: charge.source.id
        } );
        transaction.save( function( err ) {
                if ( err ) {
                    return res.status( 500 );
                }
                else {
                    res.status( 200 ).json( {
                        success:true,
						message: 'Payment is created successfully'
                    } );
                }
        });
		
		Stripe.tokens.create({
		  card: {
			"number": req.body.number,
			"exp_month": req.body.exp_month,
			"exp_year": req.body.exp_year,
			"cvc": req.body.cvc,
		  }
		}, function(err, thistoken) {
			if(!err){
				Stripe.customers.create({
				  description: 'Customer for test@example.com',
				  source: thistoken.id,
				}, function(err, customer) {
					if (!err){
						var customers = new Customers({
							customerId: customer.id,					
							created: customer.created,
							currency: customer.currency,
							description: customer.description,
							last: customer.sources.data[0].last4,
							expmonth: customer.sources.data[0].exp_month,
							expyear: customer.sources.data[0].exp_year,
						});
						customers.save(function( err ) {
							if (err) {
								console.log(123+err);
								/* return res.status( 200 ).json( {
									status:false,
									message: 'Customer is not saved.'
								}); */
							}
						});
					}
					else
					{
						console.log(456+err);
						/* return res.status( 200 ).json( {
							status:false,
							message: 'Customer is not created'
						}); */
					}
				});					
			}
			else
			{
				console.log(789+err);
			}
		});
			
            // asynchronously called
    });
};
