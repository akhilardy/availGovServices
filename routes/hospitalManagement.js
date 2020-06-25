const express = require('express');
const router = express.Router();
const authentication = require('../models/authenticationdb');
const hospitalSchema = require('../models/hospitalSchema');

router.route('/signin')
    .post(async (req, res) => {
        data = req.body;
        console.log(data);
        try {
            const obj = await authentication.isValid(data.number);
            console.log(obj);
            if (obj) {
                res.status(200).json({
                    'res': 'successfull',
                    'status': true,
                    'id': obj.regNo,
                    'name': obj.name
                });
            } else {
                res.status(200).json({
                    'res': 'successfull',
                    'status': false,
                    'id': null,
                    'name': null
                });
            }
        }
        catch (e) {
            console.log(e);
            res.status(500).json({
                'res': 'Internal server error'
            });
        }
    });

router.route('/addScheme')
    .post(async (req, res) => {
        console.log('break1', req.body);
        try {
            var preEntry = await hospitalSchema.findOne({ name: req.body.hosName });
            console.log(preEntry);
            if (preEntry) {
                console.log('updating entry');
                const hospital = await hospitalSchema.updateEntry(req.body.hosName, req.body.serName, req.body.serDes);
                console.log(hospital);
            }
            else {
                console.log('creating entry');
                const hospitalObject = new hospitalSchema({
                    name: req.body.hosName,
                    serviceName: req.body.serName,
                    serviceDescription: req.body.serDes
                });
                const hospital = await hospitalSchema.createHospitalEntry(hospitalObject);
                console.log(`${hospital}`);
            }
            res.status(200).json({
                'res': 'successfully added schema'
            });
        }
        catch (e) {
            console.log(e);
            res.status(500).json({
                'res': 'Internal server error'
            });
        }
    });

router.route('/schemes')
    .get(async (req, response) => {
        try {
            var res = await hospitalSchema.find({ name: req.query.name });
            var result = [];
            for (var i = 0; i < res.length; i++) {
                element = res[i];
                for (var j = 0; j < element.serviceName.length; j++) {
                    const obj = {
                        'name': element.serviceName[j],
                        'des': element.serviceDescription[j]
                    }
                    result.push(obj);
                }
            };
            response.status(200).json({
                'res': 'successfull',
                'schemes': result
            });
        } catch (err) {
            console.log(err);
            response.status(500).json({
                'res': 'Internal server error'
            });
        }
    });

router.route('/getHospitals')
    .get(async (req, res) => {
        try {
            var response = await authentication.find({});
            console.log(response);
            let result = [];
            for (var i = 0; i < response.length; i++) {
                result.push(response[i].name);
            };
            res.status(200).json({
                'res': 'successfull',
                'schemes': result
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                'res': 'Internal server error'
            });
        }
    });
module.exports = router