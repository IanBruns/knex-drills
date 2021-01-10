const ShoppingListService = require('../src/shopping-list-service');
const knex = require('knex');
const { expect } = require('chai');
const { getById } = require('../src/articles-service');

describe(`Shopping List service object`, () => {
    let db;
    let testItems = [
        {
            id: 1,
            name: 'sea-salt ice cream',
            price: '8.88',
            date_added: new Date('2029-01-22T16:28:32.615Z'),
            checked: true,
            category: 'Snack'
        },
        {
            id: 2,
            name: 'P I ZZ A',
            price: '12.42',
            date_added: new Date('2100-05-22T16:28:32.615Z'),
            checked: false,
            category: 'Main'
        },
        {
            id: 3,
            name: 'The most tasty treat',
            price: '80.80',
            date_added: new Date('1919-12-22T16:28:32.615Z'),
            checked: true,
            category: 'Snack'
        },
    ];

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        });
    });

    before(() => db('shopping_list').truncate());

    afterEach(() => db('shopping_list').truncate());

    after(() => db.destroy());

    context(`Given shopping_list has data`, () => {
        beforeEach(() => {
            return db
                .into('shopping_list')
                .insert(testItems);
        });

        it(`getShoppingItems() returns the lsit of items from shopping_list table`, () => {
            return ShoppingListService.getShoppingItems(db)
                .then(items => {
                    expect(items).to.eql(testItems);
                });
        });

        it(`getItemById() returns the correct item from the id passed in`, () => {
            const secondId = 2;
            const target = testItems[secondId - 1];

            return ShoppingListService.getItemById(db, secondId)
                .then(item => {
                    expect(item).to.eql(target);
                });
        });

        it(`updateShoppingItem() Updates the item in the shopping_list table with the targeted id with the new values`, () => {
            const idToUpdate = 3;
            const updatedData = {
                name: 'Updated Name',
                price: '11.11',
                checked: false,
                date_added: new Date('2020-01-01T00:00:00.000Z'),
                category: 'Breakfast'
            };

            return ShoppingListService.updateShoppingItem(db, idToUpdate, updatedData)
                .then(() => ShoppingListService.getItemById(db, idToUpdate))
                .then(item => {
                    expect(item).to.eql({
                        id: idToUpdate,
                        name: updatedData.name,
                        price: updatedData.price,
                        checked: updatedData.checked,
                        date_added: updatedData.date_added,
                        category: updatedData.category
                    });
                });
        });

        it(`deleteItem() deletes the item from the target id`, () => {
            const idToRemove = 1;
            const expectedArray = testItems.filter(item => item.id !== idToRemove);

            return ShoppingListService.deleteItem(db, idToRemove)
                .then(() => ShoppingListService.getShoppingItems(db))
                .then(items => {
                    expect(items).to.eql(expectedArray);
                });
        });
    });

    context(`Given shopping_list has no data`, () => {
        it(`getShoppingItems() returns no items`, () => {
            return ShoppingListService.getShoppingItems(db)
                .then(items => {
                    expect(items).to.eql([]);
                });
        });

        it(`addShoppingItem() adds item to the shopping_list table with an id of 1`, () => {
            const addItem = {
                name: 'New Name',
                price: '16.12',
                date_added: new Date('2020-01-01T00:00:00.000Z'),
                category: 'Main'
            };

            return ShoppingListService.addShoppingItem(db, addItem)
                .then(item => {
                    expect(item).to.eql({
                        id: 1,
                        name: addItem.name,
                        price: addItem.price,
                        date_added: addItem.date_added,
                        checked: false,
                        category: addItem.category
                    });
                });
        });
    });
});