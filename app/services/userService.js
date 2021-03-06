/**
 * Created by aanu.oyeyemi on 07/03/2017.
 */
'use strict';

let cryptor = require('bcrypt-nodejs');
let config = require('../config/config');

/**
 *@description this is class handles all action that can be performed by a participant
 */
class UserService {

    /**
     *
     *@description Organizer Service Constructor
     *
     *@param  {object} user - User model instance
     */

    constructor(user) {
        this.users = user;
    }

    /**
     *
     *@description Get All Users
     *
     * @return {object} a newly created participant object
     */
    getAllUsers () {
        return new Promise((resolve, reject) => {
            return this.users.forge().fetchAll().then(
                data => {
                    return resolve(data);
                }
            )
                .catch(error => {
                    return reject(error);
                });
        });
    }

    /**
     *
     *@description Get A User
     *
     *@param {integer}  id - Integer containing user identification
     * @return {object} Error/Data
     */
    getUser (id) {
        return new Promise((resolve, reject) => {
            return this.users.forge({ id }).fetch().then(
                data => {
                    console.log(`Data Received => ${JSON.stringify(data)}`);
                    return resolve(data);
                }
                    )
                .catch(error => {
                        console.log(`Error Message => ${error}`);
                        return reject(error);
                    }
                );
        });
    }

    /**
     *
     *@description Get A User
     *
     *@param {String}  username - Username df a user
     * @return {object} Error/Data
     */
    getUserByUsername (username) {
        return new Promise((resolve, reject) => {
            return this.users.
               forge({ username: username })
                .fetch({ columns: ['id', 'name', 'username', 'picture'] })
                .then(
                    data => { return resolve(data);}
                    )
                .catch(
                    error => { return reject(error);}
                    );
        });
    }


    /**
     *
     *@description Get A User
     *
     *@param {String}  email - Email of a user
     * @return {object} Error/Data
     */
    getUserByEmail (email) {
        return new Promise((resolve, reject) => {
            return this.users.forge({ email: email })
                .fetch({ withRelated: ['roleUser'] })
                .then(data => { return resolve(data);})
                .catch(
                    error => { return reject(error);}
                );
        });
    }

    /**
     *
     *@description Create a user
     *
     *@param  {object} userData - Object containing user registration data
     *
     * @return {object} a newly created user object
     */
    createUser (userData) {
        return new Promise((resolve, reject) => {
            userData.password = cryptor.hashSync(userData.password, config.someCherche.data);
            return this.users.forge().save(userData).then(
                data => {
                    //this sends authorization email to the newly reg member
                    return resolve(data);
                })
                .catch(error => {
                    console.log(` Error creating user ${error}`);
                    return reject(error);
                });
        });
    }

    /**
     *
     *@description Log a User into the system
     *
     *@param  {object} userData - Object containing user login data
     *
     * @return {object} promise - A promise object containing data/errpr
     */
    loginUser (userData) {
        return new Promise((resolve, reject) => {
            this.getUserByEmail(userData.email).then((data) => {
                cryptor.compare(userData.password, data.attributes.password, (error, result)=> {
                    if (error) {
                        return reject(error);
                    }

                    return resolve(data);
                });
            }).catch(error =>
                {return reject(error);}
            );
        });

    }

    /**
     *
     *@description update a user data in the database
     *
     *@param  {object} userData - Object containing new user data
     *@param {integer}  id - Integer containing user identification
     * @return {object} a newly created participant object
     */
    updateUser (id, userData) {
        return new Promise((resolve, reject) => {
            return this.users.forge({ id: id }).save(userData).then(
                data => { return resolve(data);})
                .catch(error => {
                    return reject(error);
                });
        });
    }

    /**
     *
     *@description update a user data in the database
     *
     *@param  {string} email - email of the user
     *@param {string}  status - the new status of the user
     * @return {Promise} object containing a newly updated user
     */
    updateUserStatus (email, status) {
        return new Promise((resolve, reject) => {
            return this.users.forge({ email: email }).save({ status: status }).then(
                data => { return resolve(data);})
                .catch(error => {
                    return reject(error);
                });
        });
    }

    /**
     *
     *@description Delete a participant
     *
     *@param  {integer} id - the ID of user
     *
     * @return {object} object - an object containing message/error
     */
    deleteUser (id) {
        return new Promise((resolve, reject) => {
            return this.users.forge({ id: id }).destroy().then(
                data => {
                    console.log(`DELETE USER ERROR => ${data}`);
                    return resolve(` User ${id} deleted successfully`);
                })
                .catch(error => {
                    console.log(`DELETE USER ERROR => ${error}`);
                    return reject(` unable to delete user with  id ${id}`);
                });
        });
    }
}

module.exports = UserService;
