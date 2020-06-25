const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('./../config');

const hospitalSchema = require('../models/hospitalSchema')

router.route('/getHospitals')
    .get(async (req, res) => {
        try {
            const lat = req.query.lat;
            const lng = req.query.lng;
            const availableHospitals_response = await axios.get('http://localhost:8080/api/hospitals/getHospitals');
            console.log(availableHospitals_response.data);
            const available_hospitals = new Set(availableHospitals_response.data.schemes);
            console.log(available_hospitals);
            const nearbyHospitals_response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + lat + ', ' + lng + '&radius=' + config.radius + '&types=hospital&key=' + config.api_key);
            const api_res = nearbyHospitals_response.data.results;
            console.log(api_res);
            const result = [];
            for (let i = 0; i < api_res.length; i++) {
                if (available_hospitals.has(api_res[i].name)) {
                    const hospitalData_response = await axios.get('http://localhost:8080/api/hospitals/schemes?name=' + api_res[i].name);
                    const hospital = {
                        'name': api_res[i].name,
                        'business_status': api_res[i].business_status,
                        'rating': api_res[i].rating,
                        'services': hospitalData_response.data.schemes
                    }
                    result.push(hospital);
                }
            }
            res.status(200).json({
                'res': 'successfull',
                'hospitals': result
            });
        }
        catch (error) {
            console.log(err);
            res.status(500).json({
                'res': 'Internal server error'
            });
        }
    });

module.exports = router