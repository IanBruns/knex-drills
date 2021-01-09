const knex = require('knex');
require('dotenv').config();

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL
});

function nameSearch(searchName) {
    knexInstance
        .select('id', 'name', 'price', 'category')
        .from('shopping_list')
        .where('name', 'ILIKE', `%${searchName}%`)
        .then(result => {
            console.log(result);
        });
}

function paginateItem(pageNumber) {
    const productsPerPage = 6;
    const offset = productsPerPage * (pageNumber - 1);

    knexInstance
        .select('id', 'name', 'price', 'category')
        .from('shopping_list')
        .limit(productsPerPage)
        .offset(offset)
        .then(results => {
            console.log(results);
        });
}

paginateItem(2);