'use strict';

/*global Stripe:true*/
/*global $form:true*/

//set Public key for Stripe payments
Stripe.setPublishableKey( 'pk_test_4zaR5YY29j2FgQfyQHWGzJQI' );
var isSubmit = false;
$( document ).ready( function() {
    $(document).on('click','#login-btn',function(e) {
		//e.preventDefault(); 
		if($.trim($('#login-name').val()) === '' || $.trim($('#login-password').val()) === '')
		{
			alert('Please fill both fields.');
			return false;
		}
		
		//$(this).parents('form').submit();
		/* $.ajax( {
			url: '/authenticate',
			type: 'POST',
			data: $('#login-form').serialize(),
		} ).done( function( response ) {
			if (!response.status ) {
				alert('Username/Password is wrong');
			}
		} ); */
	});
	
	$(document).on('click','#register-btn',function(e) {
		//e.preventDefault(); 
		
		if($.trim($('#create-name').val()) === '' || $.trim($('#create-password').val()) === '')
		{
			alert('Please fill both fields.');
			return false;
		}
		//$(this).parents('form').submit();
		/* $.ajax( {
			url: '/register',
			type: 'POST',
			data: $('#tab').serialize(),
		}).done( function( response ) {
			if (!response.status ) {
				alert('Username/Password is wrong');
			}
		} ); */
	});
	
	$( '#submittransaction' ).click( function() {
        
        var $form = $('#form');
		
		if ( !isSubmit ) {
            Stripe.card.createToken( {
                number: $( '#cardnumber' ).val(),
                cvc: $( '#cvc' ).val(),
                exp_month: $( '#card-expiry-month' ).val(),
                exp_year: $( '#card-expiry-year' ).val()
            }, function( status, response ) {
                if ( response.error ) {
                    // Show the errors on the form
                    $( '.payment-errors' ).text( response.error.message );
                }
                else {
                    // response contains id and card, which contains additional card details
                    var token = response.id;
                    // Insert the token into the form so it gets submitted to the server
                    $form.append( $( '<input type="hidden" name="stripeToken" />' ).val( token ) );
                    // and submit
                    $.ajax( {
                        url: '/createtransaction',
                        type: 'POST',
                        headers: {
                            'x-access-token': $( '#token' ).text()
                        },
                        data: {               							
							number: $( '#cardnumber' ).val(),
							cvc: $( '#cvc' ).val(),
							exp_month: $( '#card-expiry-month' ).val(),
							exp_year: $( '#card-expiry-year' ).val(),
							amount: $('#amount').val(),
                            currency: $('#currency').val(),
                            tokenn: token
                        }
                    } ).done( function( response ) {
                        if ( response.success ) {
                            $( '.payment-success' ).text( response.message );
							$( '.payment-errors' ).text('');
							$('#createTransaction')[0].reset();
                        }
						else
						{
							$( '.payment-success' ).text('');
							$('.payment-errors').text( response.message );
						}
                    } );
                }

            } );
        }

    } );
} );
