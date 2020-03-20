const express = require("express")
const bcrypt = require("bcryptjs")
const Users = require("../users/users-model")
const restrict = require("../middleware/restrict")
const jwt = require('jsonwebtoken');

const router = express.Router()

router.post("/register", async (req, res, next) => {
	try {
		const { username } = req.body
		const user = await Users.findBy({ username }).first()

		if (user) {
			return res.status(409).json({
				message: "Username is already taken",
			})
		}

		res.status(201).json(await Users.add(req.body))
	} catch(err) {
		next(err)
	}
})

router.post("/login", async (req, res, next) => {
	const authError = {
		message: "Invalid Credentials",
	}

	try {
		const { username, password } = req.body

		const user = await Users.findBy({ username }).first()
		if (!user) {
			return res.status(401).json(authError)
		}

		const passwordValid = await bcrypt.compare(password, user.password)
		if (!passwordValid) {
			return res.status(401).json(authError)
		}
      /// What needs to happen here?
		const  payload ={
			userId: user.id,
			userRole:'normal' // This would normally come from a database.
		}

		const token = jwt.sign(payload, process.env.JWT_SECRET);
		res.setHeader('Set-Cookie', `token=${token}; path=/; httpOnly=true`);
		// res.setHeader('Set-Cookie', `token=${authToken}; path=/`)
		res.json({
			message: `Welcome ${user.username}!`,
			token: token
		})
	} catch(err) {
		next(err)
	}
})

module.exports = router