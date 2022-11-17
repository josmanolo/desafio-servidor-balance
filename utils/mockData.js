const { faker } = require("@faker-js/faker");

faker.locale = "en";
const { commerce, image } = faker;

const fakerRandomProducts = () => {
    const products = [];
    [...Array(7)].forEach(() => {
        const product = {
            name: commerce.product(),
            price: commerce.price(),
            description: commerce.productDescription(),
            image: image.image(),
        };

        products.push(product);
    });

    return products;
};

module.exports = fakerRandomProducts;
