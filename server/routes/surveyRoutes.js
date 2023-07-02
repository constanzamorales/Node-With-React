const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const requireCredits = require("../middlewares/requireCredits");

const Survey = mongoose.model("surveys");

module.exports = (app) => {
	app.post("/api/surveys", requireLogin, requireCredits, (req, res) => {
		const { title, subject, body, recipients } = req.body;

		const survey = new Survey({
			title,
			subject,
			body,
			recipients: recipients.split(",").map((email) => ({ email })), // This will take the list of emails, split it into an array, and then return an object for every email in there with a property of email and a value of the actual email
			_user: req.user.id,
			dateSent: Date.now()
		});
	});
};
