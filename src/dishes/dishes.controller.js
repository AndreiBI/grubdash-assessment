const path = require("path");
// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data")); // Trows errors
// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass


// The dishes id is a hex like 3c637d011d844ebab1205fef8a7e36ea
function dishExist(request, response, next) {
    const { dishId } = request.params;
    const foundDish = dishes.find((dish) => dish.id === dishId);
    if (foundDish) {
        response.locals.dish = foundDish;
        return next();
    }
    next({
        status: 404,
        message: `Dish does not exist: ${dishId}`,
    });
}

function bodyHasData(propertyName) {
    return function (request, response, next) {
        const { data = {} } = request.body;
        if (data[propertyName]) {
            return next();
        }
        next({ status: 400, message: `Dish must include a ${propertyName}` });
    };
}

function priceIsValid(request, response, next) {
    const { data: { price } = {} } = request.body;
    if (price <= 0 || !Number.isInteger(price)) {
        return next({
            status: 400,
            message: `Dish must have a price that is an integer greater than 0`,
        });
    }
    next();
}

function idMatchesDish(request, response, next) {
    const { dishId } = request.params;
    const { data: { id } = {} } = request.body;
    if (id && id !== dishId) {
        return next({
            status: 400,
            message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`,
        });
    }
    next();
}

function create(req, res) {
    const { data: { name, description, price, image_url } = {} } = req.body;
    const newDish = {
        id: nextId(),
        name,
        description,
        price,
        image_url,
    };
    dishes.push(newDish);
    res.status(201).json({ data: newDish });
}

function update(req, res) {
    const dish = res.locals.dish;
    const { data: { name, description, price, image_url } = {} } = req.body;
    dish.name = name;
    dish.description = description;
    dish.price = price;
    dish.image_url = image_url;
    res.json({ data: dish });
}

function list(req, res) {
    res.json({ data: dishes });
}

function read(req, res) {
    res.json({ data: res.locals.dish });
    // return 404 if no matching dish is found.
}

module.exports = {
    list,
    read: [dishExist, read],
    create: [
        bodyHasData("name"),
        bodyHasData("description"),
        bodyHasData("price"),
        bodyHasData("image_url"),
        priceIsValid,
        create,
    ],
    update: [
        dishExist,
        bodyHasData("name"),
        bodyHasData("description"),
        bodyHasData("price"),
        bodyHasData("image_url"),
        priceIsValid,
        idMatchesDish,
        update,
    ],
};
