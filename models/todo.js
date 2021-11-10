const mongoose = require('mongoose')

const TodoSchema = new mongoose.Schema({
	keyword : { type: String},
    summary : {type: String, required: true},
	date: {
		type: Number,
		default: Date.now
	}
})

const model = mongoose.model('TodoModel', TodoSchema)

module.exports = model