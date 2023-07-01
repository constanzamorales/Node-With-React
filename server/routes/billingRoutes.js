const keys = require("../config/keys");
const stripe = require("stripe")(keys.stripeSecretKey);

module.exports = (app) => {
	app.post("/api/stripe", async (req, res) => {
		const charge = await stripe.charges.create({
			amount: 500, // We have to say it again in the backend
			currency: "usd",
			description: "$5 for 5 credits",
			source: req.body.id //the token stripe gave us for the credit card
		});

		console.log(charge);
	});
};
