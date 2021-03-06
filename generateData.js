/************************************************************
 * Running this script with "node generateData.js" will
 * add new data to the database. If run multiple times,
 * duplicate data will appear so the DB should be dumped,
 * before running this.
 ***********************************************************/

var models = require("./models.js");

var companies = [null,null,null,"Verizon","Best Buy","Snapchat","Wally World"];
var people = [{firstName: "Joe", lastName: "Jankowiak", email: "jrj2211@rit.edu"}, {firstName: "Dan",lastName: "Fisher",email: "dan@gmail.com"}, {firstName: "Joe",lastName: "Campione",email: "Joe@gmail.com"}, {firstName: "Cailin",lastName: "Li",email: "Cailin@gmail.com"}, {firstName: "Nick",lastName: "Swanson",email: "Nick@gmail.com"},  {firstName: "John",lastName: "Doe",email: "nottheotherjohn@email.com"}, {firstName: "Justin",lastName: "Nietzel",email: "newDan@gmail.com" }];
var states = { "AL": "Alabama", "AK": "Alaska", "AS": "American Samoa", "AZ": "Arizona", "AR": "Arkansas", "CA": "California", "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware", "DC": "District Of Columbia", "FM": "Federated States Of Micronesia", "FL": "Florida", "GA": "Georgia", "GU": "Guam", "HI": "Hawaii", "ID": "Idaho", "IL": "Illinois", "IN": "Indiana", "IA": "Iowa", "KS": "Kansas", "KY": "Kentucky", "LA": "Louisiana", "ME": "Maine", "MH": "Marshall Islands", "MD": "Maryland", "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota", "MS": "Mississippi", "MO": "Missouri", "MT": "Montana", "NE": "Nebraska", "NV": "Nevada", "NH": "New Hampshire", "NJ": "New Jersey", "NM": "New Mexico", "NY": "New York", "NC": "North Carolina", "ND": "North Dakota", "MP": "Northern Mariana Islands", "OH": "Ohio", "OK": "Oklahoma", "OR": "Oregon", "PW": "Palau", "PA": "Pennsylvania", "PR": "Puerto Rico", "RI": "Rhode Island", "SC": "South Carolina", "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas", "UT": "Utah", "VT": "Vermont", "VI": "Virgin Islands", "VA": "Virginia", "WA": "Washington", "WV": "West Virginia", "WI": "Wisconsin", "WY": "Wyoming"}
var cities = ["Cherryville","Cougarville","Elk Grove","Thunder Bay","Sommersdale","Autumn Springs","Blackstone","Blackstone Valley","Golden Creek","Rancho Cordova","Horizon Bay","Sun Valley","La Riviera","Lincoln Heights","Liberty Falls","Liberty Heights","Fountain Grove","Birchwood","Fulton Oaks","Westlake Village","Eastlake Village","Wedgewood Creek","Ashton Park","Heritage Park","Duma Hills","Greystone","Bella Vista","Stonebridge","Natomas","Walnut Village"];
var roads = ["Route 30","Clark Street","Grove Street","Washington Avenue","Route 5","Evergreen Lane","Elm Street","Broadway","Creek Road","Marshall Street"];
var phoneModels = ["A","B","C"];
var serialNumber = 120133;

var taxRates = [];
var customers = {};
var promises = [];

// Create all the states
for(var abbr in states) {
	promises.push(
		new Promise(function(resolve, reject) {
			models.TaxRates.create({
				state: states[abbr],
				rate: Math.floor(Math.random() * 12) / 100,
			}).then(function(result) {
				taxRates.push(result.dataValues);
				resolve(result.dataValues);
			});
		})
	);
}

Promise.all(promises).then(function() {
	console.log("Done Generating States");
	
	if(process.argv.length > 2) {
	
		promises = [];
		
		// Generate Customers
		for(var id in people) {
			var data = people[id];
			data.password = "5f4dcc3b5aa765d61d8327deb882cf99";
			data.phoneNumber = "123-123-1234";
			data.company = companies[Math.floor(Math.random()*companies.length)];
			
			generateCustomer(data);
		}
	}
});

var shippingOptions = [{name:"Free", price: 0},{name:"Economy", price: 3.99},{name:"Overnight", price: 12.99},{name:"1 Hour Delivery", price: 1000}];

// Create shipping options
models.ShippingCosts.bulkCreate(shippingOptions).then(function(result) {});

function generateCustomer(data) {
	console.log(data);
	
	models.Customer.create(data).then(function(customer) {
		
		var addressInfo = {
			firstName: data.firstName,
			lastName: data.lastName,
			city: cities[Math.floor(Math.random()*cities.length)],
			zip: Math.floor(Math.random()*90000) + 10000,
			address: (Math.floor(Math.random()*500) + 1).toString() + " " + roads[Math.floor(Math.random()*roads.length)],
			customerId: customer.id,
			stateId: taxRates[Math.floor(Math.random()*taxRates.length)].id,
		}
		
		models.Address.create(addressInfo).then(function(address) {
			
			var paymentMethodInfo = {
				cardNumber: generateCCnumber(),
				CVC: (Math.floor(Math.random()*999) + 100).toString(),
				expirationDate: (Math.floor(Math.random()*1704067200) + 1514764800),
				billingAddressId: address.id,
			}
			
			models.PaymentMethod.create(paymentMethodInfo).then(function(paymentMethod) {
				
				promises = [];
				
				// Add random number of orders
				while(Math.random() < 0.5) {
					var orderInfo = {
						totalItemCost: (Math.floor(Math.random()*200000) + 10000) / 100,
						shippingCost: 3.99,
						orderDate: (Math.floor(Math.random()*1514764800) + 1420070400),
						isPaid: Math.random() < 0.8,
						taxPercentage: Math.floor(Math.random() * 12) / 100,
						customerId: customer.id,
						shippingAddressId: address.id,
						paymentMethodId: paymentMethod.id,
					}
					
					models.Orders.create(orderInfo).then(function(order) {
						var chanceOfItem = 1;
						while(Math.random() < chanceOfItem) {
						
							var data = {
								serialNumber: serialNumber++,
								modelId: phoneModels[Math.floor(Math.random()*phoneModels.length)],
								price: (Math.floor(Math.random()*50000) + 9000) / 100,
								isPaid: Math.random() < 0.8,
								replacementDeadline: (Math.floor(Math.random()*1514764800) + 1420070400),
								refundDeadline: (Math.floor(Math.random()*1514764800) + 1420070400),
								orderId: order.id
							}
							
							models.Item.create(data).then(function(result) {
								
							});
							
							chanceOfItem -= .3;
						}
					});
				}
			});
		});
	});
}

function generateCCnumber() {
	var cc = "";
	for(var x = 1; x < 8; x++) {
		cc += Math.floor(Math.random()*99).toString();
	}
	return cc;
}