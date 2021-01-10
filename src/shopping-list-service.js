const ShoppingListService = {
    getShoppingItems(knex) {
        return knex.select('*').from('shopping_list');
    },
    getItemById(knex, targetId) {
        return knex
            .from('shopping_list')
            .select('*')
            .where('id', targetId)
            .first();
    },
    addShoppingItem(knex, newItem) {
        return knex
            .insert(newItem)
            .into('shopping_list')
            .returning('*')
            .then(rows => {
                return rows[0];
            });
    },
    updateShoppingItem(knex, id, newData) {
        return knex
            .from('shopping_list')
            .where({ id })
            .update(newData);
    },
    deleteItem(knex, id) {
        return knex
            .from('shopping_list')
            .where({ id })
            .delete();
    }
};

module.exports = ShoppingListService;