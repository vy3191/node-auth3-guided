const bcrypt = require("bcryptjs")
const Users = require("../users/users-model");
const jwt = require("jsonwebtoken");

function restrict() {
	const authError = {
		message: "Invalid credentials",
	}
	
	return async (req, res, next) => {
		try {
			const token = req.headers.authorization;
			if(!token) res.status(401).json(authError);

			// verify the token's signature
			jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
				 if(err) res.status(401).json(authError);
				 req.token = decoded;
				 next();
			});

		} catch(err) {
			next(err)
		}
	}
}

module.exports = restrict