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

function getItemsAfterDate(daysAgo) {
    knexInstance
        .select('id', 'name', 'price', 'category')
        .where('date_added',
            '>',
            knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
        )
        .from('shopping_list')
        .then(results => {
            console.log(results);
        });
}

function costPerCategory() {
    knexInstance
        .select('category')
        .sum('price as total')
        .from('shopping_list')
        .groupBy('category')
        .then(result => {
            console.log(result);
        });
}
costPerCategory();