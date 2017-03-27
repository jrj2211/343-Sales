var customer = {};

var database = [
	{
		"id" : 1,
		"customerId": 1,
		"repId": 99,
		"cost": 200,
		"orderDate": "2017-03-01T20:51:26.905Z",
		"isPaid": false,
		"taxPercentage": 8,
		"shippingInfo": {
			"firstName": "john",
			"lastName": "doe",
			"address": "1111 street",
			"city": "Rochester",
			"zip": "14586",
			"state": "NY"
		},
		"billingInfo": {
			"firstName": "john",
			"lastName": "doe",
			"address": "1111 street",
			"city": "Rochester",
			"zip": "14586",
			"state": "NY",
			"ccLastFourDigets": "1234"
		},
		"customerInfo": {
			"customerId": 1,
			"firstName": "John",
			"lastName": "Johnson",
			"email": "nottheotherjohn@email.com",
			"phone": "5451112222"
		},
		"items": [
			{
				"serialId": 20,
				"price": 100,
				"status": "original|return|replace",
				"replaceDeadline": "2017-03-01T20:51:26.908Z",
				"refundDeadline": "2017-03-01T20:51:26.908Z"
			},
			{
				"serialId": 21,
				"price": 200,
				"status": "original|return|replace",
				"replaceDeadline": "2017-03-01T20:51:26.909Z",
				"refundDeadline": "2017-03-01T20:51:26.909Z"
			}
		]
	},
	{
		"id" : 2,
		"customerId": 1,
		"repId": 60,
		"cost": 700.50,
		"orderDate": "2017-03-20T20:51:26.905Z",
		"isPaid": true,
		"taxPercentage": 8,
		"shippingInfo": {
			"firstName": "john",
			"lastName": "doe",
			"address": "1111 street",
			"city": "Rochester",
			"zip": "14586",
			"state": "NY"
		},
		"billingInfo": {
			"firstName": "john",
			"lastName": "doe",
			"address": "1111 street",
			"city": "Rochester",
			"zip": "14586",
			"state": "NY",
			"ccLastFourDigets": "1234"
		},
		"customerInfo": {
			"customerId": 1,
			"firstName": "John",
			"lastName": "Johnson",
			"email": "nottheotherjohn@email.com",
			"phone": "5451112222"
		},
		"items": [
			{
				"serialId": 12,
				"price": 200.25,
				"status": "original",
				"replaceDeadline": "2017-04-20T20:51:26.908Z",
				"refundDeadline": "2017-05-20T20:51:26.908Z"
			},
			{
				"serialId": 22,
				"price": 500.25,
				"status": "original",
				"replaceDeadline": "2017-04-20T20:51:26.909Z",
				"refundDeadline": "2017-05-20T20:51:26.909Z"
			}
		]
	},
	{
		"id" : 3,
		"customerId": 2,
		"repId": 12,
		"cost": 100,
		"orderDate": "2017-03-23T20:51:26.905Z",
		"isPaid": true,
		"taxPercentage": 8,
		"shippingInfo": {
			"firstName": "joe",
			"lastName": "jefferson",
			"address": "222 road",
			"city": "Rochester",
			"zip": "12345",
			"state": "NY"
		},
		"billingInfo": {
			"firstName": "joe",
			"lastName": "jefferson",
			"address": "222 road",
			"city": "Rochester",
			"zip": "12345",
			"state": "NY",
			"ccLastFourDigets": "1234"
		},
		"customerInfo": {
			"customerId": 2,
			"firstName": "Joe",
			"lastName": "Jefferson",
			"email": "therealjoe@joemail.com",
			"phone": "1231231234"
		},
		"items": [
			{
				"serialId": 10,
				"price": 100,
				"status": "original",
				"replaceDeadline": "2017-04-22T20:51:26.908Z",
				"refundDeadline": "2017-05-22T20:51:26.908Z"
			}
		]
	}
];



customer.get = function(req, res, next, first, lastName, email, phone) {
  var customer = [];
  database.forEach(function(data){
    var found = true;
    var cust = data['customerInfo'];
		if(first != null){
      if(!cust['firstName'].includes(first)) {
        found = false;
      };
		};
    if(found && lastName != null){
      if(!cust['lastName'].includes(first)) {
        found = false;
      };
		};
    if(found && email != null){
      if(!cust['email'].includes(email)) {
        found = false;
      };
		};
    if(found && phone != null){
      if(!cust['phone'].includes(phone)) {
        found = false;
      };
		};

    if(found) {
      customer.push(cust);
    };
	});

  var responseObj = {
    "customers": customer
	};
  res.json(responseObj);
};

module.exports = customer;