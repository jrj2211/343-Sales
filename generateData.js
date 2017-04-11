/************************************************************
 * Running this script with "node generateData.js" will
 * add new data to the database. If run multiple times,
 * duplicate data will appear so the DB should be dumped,
 * before running this.
 ***********************************************************/

var models = require("./models.js");

var people = [{firstName: "Joe", lastName: "Jankowiak", email: "jrj2211@rit.edu"}, {firstName: "Dan",lastName: "Fisher",email: "dan@gmail.com"}, {firstName: "Joe",lastName: "Campione",email: "Joe@gmail.com"}, {firstName: "Cailin",lastName: "Li",email: "Cailin@gmail.com"}, {firstName: "Nick",lastName: "Swanson",email: "Nick@gmail.com"},  {firstName: "John",lastName: "Doe",email: "nottheotherjohn@email.com"}, {firstName: "Justin",lastName: "Nietzel",email: "successewDan@gmail.com" }];
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
	
	promises = [];
	
	// Generate Customers
	for(var id in people) {
		promises.push(
			new Promise(function(resolve, reject) {
				var data = people[id];
				data.password = "5f4dcc3b5aa765d61d8327deb882cf99";
				data.phoneNumber = "123-123-1234";
				data.isCompany = Math.random() < 0.5;
				models.Customer.create(data).then(function(result) {
					customers[result.dataValues.id] = {"model": result.dataValues, "addresses": [], "paymentMethods": [], "orders": []};
					resolve(result.dataValues);
				});
			})
		);
	}
	
	Promise.all(promises).then(function() {
		console.log("Done Generating Customers");
		
		promises = [];
		
		// Generate Addresses 
		for (var id in customers) { 
			promises.push(
				new Promise(function(resolve, reject) {
					var data = {
						firstName: customers[id].model.firstName,
						lastName: customers[id].model.lastName,
						city: cities[Math.floor(Math.random()*cities.length)],
						zip: Math.floor(Math.random()*90000) + 10000,
						address: (Math.floor(Math.random()*500) + 1).toString() + " " + roads[Math.floor(Math.random()*roads.length)],
						customerId: customers[id].model.id,
						stateId: taxRates[Math.floor(Math.random()*taxRates.length)].id,
					}
					
					models.Address.create(data).then(function(result) {
						customers[data.customerId].addresses.push(result.dataValues);
						resolve(result.dataValues);
					});
				})
			);
		}
		
		Promise.all(promises).then(function() {
			console.log("Done Generating Addresses");
			
			promises = [];
			
			// Generate Payment Method
			for (var id  in customers) { 
				promises.push(
					new Promise(function(resolve, reject) {
						var customer = customers[id];
						var data = {
							cardNumber: generateCCnumber(),
							CVC: (Math.floor(Math.random()*999) + 100).toString(),
							expirationDate: (Math.floor(Math.random()*1704067200) + 1514764800),
							billingAddressId: customer.addresses[Math.floor(Math.random()*customer.addresses.length)].id,
						}
						
						models.PaymentMethod.create(data).then(function(result) {
							customer.paymentMethods.push(result.dataValues);
							resolve(result.dataValues);
						});
					})
				);
			}
			
			Promise.all(promises).then(function() {
				console.log("Done Generating Payment Methods");
				
				promises = [];
				
				// Generate Payment Method
				for (var id  in customers) { 
					// Add random number of orders
					while(Math.random() < 0.5) {
						promises.push(
							new Promise(function(resolve, reject) {
								var customer = customers[id];
								var data = {
									totalItemCost: (Math.floor(Math.random()*200000) + 10000) / 100,
									shippingCost: 3.99,
									orderDate: (Math.floor(Math.random()*1514764800) + 1420070400),
									isPaid: Math.random() < 0.8,
									taxPercentage: Math.floor(Math.random() * 12) / 100,
									customerId: customer.model.id,
									shippingAddressId: customer.addresses[Math.floor(Math.random()*customer.addresses.length)].id,
									paymentMethodId: customer.paymentMethods[Math.floor(Math.random()*customer.paymentMethods.length)].id,
								}
								
								models.Orders.create(data).then(function(result) {
									customer.orders.push(result.dataValues);
									resolve(result.dataValues);
								});
							})
						);
					}
				}
				
				Promise.all(promises).then(function() {
					console.log("Done Generating Orders");
					
					promises = [];
					
					// Generate Payment Method
					for (var id  in customers) { 
						// Add random number of orders
						var customer = customers[id];
						while(Math.random() < 0.75 && customer.orders.length > 0) {
							promises.push(
								new Promise(function(resolve, reject) {
									var data = {
										serialNumber: serialNumber++,
										modelId: phoneModels[Math.floor(Math.random()*phoneModels.length)],
										price: (Math.floor(Math.random()*50000) + 9000) / 100,
										isPaid: Math.random() < 0.8,
										replacementDeadline: (Math.floor(Math.random()*1514764800) + 1420070400),
										refundDeadline: (Math.floor(Math.random()*1514764800) + 1420070400),
										orderId: customer.orders[Math.floor(Math.random()*customer.orders.length)].id
									}
									
									models.Item.create(data).then(function(result) {
										resolve(result.dataValues);
									});
								})
							);
						}
					}
					
					Promise.all(promises).then(function() {
						console.log("Done Generating Order Items");
					});
				});
			});
		});
	});
});

function generateCCnumber() {
	var cc = "";
	for(var x = 1; x < 8; x++) {
		cc += Math.floor(Math.random()*99).toString();
	}
	return cc;
}