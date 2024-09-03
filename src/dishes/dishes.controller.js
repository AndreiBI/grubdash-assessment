const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass
// In the src/dishes/dishes.controller.js file,
// add handlers and middleware functions to create, read, update, and list dishes.
// Note that dishes cannot be deleted.

// The dishes id is a hex like 3c637d011d844ebab1205fef8a7e36ea

function create(req, res) {
    const { data: { text } = {} } = req.body; // Should it be Json?
    const newDish = { id: nextId, text: text }; // Should it be Json?
    dishes.push(newDish);
    res.status(201).json({ data: newDish });
}

module.exports = {
    create: [create]
};
