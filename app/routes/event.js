/**
 * Created by barthclem on 4/25/17.
 */
'use strict';
let express = require('express');
let router = express.Router();
let validate = require('express-validation');
let responseFormatter = require('../lib/responseFormatter');
let AuthMiddleware = require('../lib/authMiddleWare');
let authorizer = require('../config/authorizator');
let constants = require('../config/constants').PERMISSIONS.EVENT;
let userGroup = require('../config/constants').DATA_GROUP.EVENT.id;
let organizerGroup = require('../config/constants').DATA_GROUP.ORGANIZER.id;
let guestGroup = require('../config/constants').DATA_GROUP.GUEST.id;
let loadRoleMiddleWare = require('../lib/roleMiddleWare');
let eventValidation = require('../validation/eventValidation');

module.exports = (app, serviceLocator) => {
    let authMiddleware = new AuthMiddleware(app);
    let eventController = serviceLocator.get('eventController');
    router.use(function (req, res, next) {
        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Content-Type', 'application/json');
        next();
    });

    router.route('/').get(
        [authMiddleware.authenticate(), loadRoleMiddleWare(organizerGroup), authorizer.wants(constants.VIEW_ALL_EVENTS)],
        (req, res, next) => {
            eventController.listAllEvents(req, res, next);
            //next();
        })
        .post([authMiddleware.authenticate(),  validate(eventValidation.createEvent),
                loadRoleMiddleWare(organizerGroup), authorizer.wants(constants.REGISTER_AN_EVENT)],
            (req, res, next)=> {
                eventController.createEvent(req, res, next);
            });

    router.route('/:id').get(
        [authMiddleware.authenticate(), validate(eventValidation.getEvent), loadRoleMiddleWare(userGroup, true),
            authorizer.wants(constants.VIEW_AN_EVENT)], (req, res, next) => {
            eventController.getEvent(req, res, next);
        })
        .put([authMiddleware.authenticate(), validate(eventValidation.editEvent), loadRoleMiddleWare(userGroup, true),
            authorizer.wants(constants.EDIT_AN_EVENT)], (req, res, next) => {
            eventController.updateEvent(req, res, next);
        })
        .delete([authMiddleware.authenticate(), validate(eventValidation.getEvent), loadRoleMiddleWare(userGroup, true),
            authorizer.wants(constants.CANCEL_AN_EVENT)], (req, res, next) => {
            eventController.deleteEvent(req, res, next);
        });

    router.route('/mails/:id').get(
        [authMiddleware.authenticate(), validate(eventValidation.getEvent), loadRoleMiddleWare(userGroup, true),
            authorizer.wants(constants.VIEW_AN_EVENT)], (req, res, next) => {
            eventController.getAllEventMails(req, res, next);
        });

    /**
     * Get Categories of event with ID :id
     */
     router.route('/cat/:id').get(
        [authMiddleware.authenticate(), validate(eventValidation.getEvent), loadRoleMiddleWare(userGroup, true),
            authorizer.wants(constants.VIEW_AN_EVENT)], (req, res, next) => {
            eventController.getCatEvent(req, res, next);
        });

    router.route('/organizer/:id').get(
        [authMiddleware.authenticate(), validate(eventValidation.getEventsWithOrganizerId), loadRoleMiddleWare(organizerGroup, true),
            authorizer.wants(constants.VIEW_AN_EVENT)], (req, res, next) => {
            eventController.listAllEventsByOrganizer(req, res, next);
        });

    return router;

};
