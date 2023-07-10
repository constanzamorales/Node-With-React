const _ = require("lodash");
const { Path } = require("path-parser");
const { URL } = require("url");
const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const requireCredits = require("../middlewares/requireCredits");
const Mailer = require("../services/Mailer");
const surveyTemplate = require("../services/emailTemplates/surveyTemplate");

const Survey = mongoose.model("surveys");

module.exports = (app) => {
	app.get("/api/surveys", requireLogin, async (req, res) => {
		const surveys = await Survey.find({ _user: req.user.id });

		res.send(surveys);
	});

	app.get("/api/surveys/:surveyId/:choice", (req, res) => {
		res.send("Thanks for voting!");
	});

	app.post("/api/surveys/webhooks", (req, res) => {
		const p = new Path("/api/surveys/:surveyId/:choice"); // Extract the survey id and the choice
		_.chain(req.body)
			.map(({ email, url }) => {
				const match = p.test(new URL(url).pathname); // Extract path from the URL

				if (match) {
					return {
						email,
						surveyId: match.surveyId,
						choice: match.choice
					};
				}
			})

			.compact() // Lodash removes undefined
			.uniqBy("email", "surveyId") // Lodash removes duplicates
			.each(({ surveyId, email, choice }) => {
				Survey.updateOne(
					{
						_id: surveyId,
						recipients: {
							$elemMatch: { email: email, responded: false }
						}
					},
					{
						$inc: { [choice]: 1 },
						$set: { "recipients.$.responded": true },
						lastResponded: new Date()
					}
				).exec();
			})
			.value(); // Pull the value out

		res.send({});
	});

	app.post("/api/surveys", requireLogin, requireCredits, async (req, res) => {
		const { title, subject, body, recipients } = req.body;

		const survey = new Survey({
			title,
			subject,
			body,
			recipients: recipients
				.split(",")
				.map((email) => ({ email: email.trim() })), // This will take the list of emails, split it into an array, and then return an object for every email in there with a property of email and a value of the actual email
			_user: req.user.id,
			dateSent: Date.now()
		});

		const mailer = new Mailer(survey, surveyTemplate(survey));

		try {
			await mailer.send();
			await survey.save();
			req.user.credits -= 1;
			const user = await req.user.save();
			res.send(user); // Send the updated user model
		} catch (err) {
			res.status(422).send(err);
		}
	});
};
