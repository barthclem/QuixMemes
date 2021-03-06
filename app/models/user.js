/**
 * Created by aanu.oyeyemi on 19/02/2017.
 */
'use strict';

let bookshelf = require('../bookshelf');
let emailAuth = require('./emailAuth');

let user = bookshelf.Model.extend({
    tableName: 'user',
    hidden: ['password', 'updated_at'],
    hasTimeStamp: true,

    roleUser: function () {
        return this.hasMany('roleUser');
    },

    emailAuth: function () {
        return this.hasMany(emailAuth);
    }
});

module.exports =  bookshelf.model('user', user);
