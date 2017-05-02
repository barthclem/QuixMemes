'use strict';
/**
 *@description this is class handles all action that can be performed on a Event Category
 */
class CategoryService {

    /**
     *
     *@description category Service constructor
     *
     *@param  {object} category - category model instance
     *@param {object}  event - event model instance
     *
     */
    constructor (category, event) {
        this.category = category;
        this.event = event;
    }

    /**
     *
     *@description create a category of event
     *
     *@param  {object} categoryData - Object containing category data
     *
     * @return {object} a newly created category object
     */
    createCategory (categoryData) {
        this.category.forge().save(categoryData)
            .then( data => {
                return data;
            })
            .catch(error => {
                throw error;
            })
    }

    /**
     *
     *@description Edit a category
     *
     * @param {Integer}  categoryId- Integer identifying a category
     * @param  {object} categoryData - Object containing new category data
     *
     * @return {object} object - A modified category Object / error
     */
    editCategory (categoryId, categoryData) {
        this.category.forge({id : categoryId}).save(categoryData)
            .then(data => {
                return data;
            })
            .catch(error => {
                throw error;
            });
    }

    /**
     *
     *@description Get  a category { including categoryEntries }
     *
     * @param {Integer}  categoryId - Integer identifying a category
     *
     * @return {object} object -  category Object / error
     */
    getCategory (categoryId) {
        this.category.forge({id : categoryId}).fetch({
            withRelated : ['categoryEntry']
        })
            .then(data => {
                return data;
            })
            .catch(error => {
                throw error;
            });
    }

    /**
     *
     *@description Get  all categories
     *
     * @return {object} object -  Object containing all categories / error
     */
    getAllCategories () {
        this.category.forge().fetchAll()
            .then(data => {
                return data;
            })
            .catch(error => {
                throw error;
            });
    }


    /**
     *
     *@description Delete a Category
     *
     *@param  {Integer} categoryId - the ID of a category
     *
     * @return {object} object - a object containing message/error
     */
    deleteCategory (categoryId) {
        this.category.forge({id : categoryId})
            .destroy()
            .then(data => {
                return {message : "category deleted successfully"};
            })
            .catch(error => {
                throw error;
            });
    }



}

module.exports = CategoryService;