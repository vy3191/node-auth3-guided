const express = require("express")
const Users = require("./users-model")
const restrict = require("../middleware/restrict")
const restrictRole = require("../middleware/restrict-role");
const router = express.Router()

router.get("/", restrict(), restrictRole('admin'), async (req, res, next) => {
	try {
		res.json(await Users.find())
	} catch(err) {
		next(err)
	}
})

module.exports = router