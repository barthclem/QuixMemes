/**
 * Created by barthclem on 4/19/17.
 */
'use strict';

let bookshelf = require('../bookshelf');

let eventAdmin = bookshelf.Model.extend({
    idAttribute: 'id',
    //hidden : ['id'],
    tableName: 'eventAdmin',

    user: function () {
        return this.belongsTo('user');
    },

    event: function () {
        return this.belongsTo('event');
    }
});

module.exports = bookshelf.model('eventAdmin', eventAdmin);
