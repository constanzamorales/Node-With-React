const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const keys = require("../config/keys");

const User = mongoose.model("users");

passport.use(
	new GoogleStrategy(
		{
			clientID: keys.googleClientID,
			clientSecret: keys.googleClientSecret,
			callbackURL: "/auth/google/callback"
		},
		(accessToken, refreshToken, profile, done) => {
			User.findOne({ googleId: profile.id }) // Look through users collection, find the first record with the googleId of profile.id. Returns a promise
				.then((existingUser) => {
					if (existingUser) {
						// We already have a record with the given profile ID
					} else {
						// Make a new record
						new User({ googleId: profile.id }).save(); // It will save it in the database for us
					}
				});
		}
	)
);
