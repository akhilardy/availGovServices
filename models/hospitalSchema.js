const mongoose = require('mongoose');
const hospitalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    serviceName: {
        type: [String]
    },
    serviceDescription: {
        type: [String]
    }
},
    {
        timestamps: true
    });

module.exports = HospitalSchema = mongoose.model('HospitalSchema', hospitalSchema);

module.exports.createHospitalEntry = async (newEntry) => {
    try {
        const entry = await newEntry.save();
        console.log("hospital entry has created");
        return entry;
    }
    catch (err) {
        console.log("error in creating the entry");
        throw err;
    }
};
module.exports.updateEntry = async (hosName, serName, serDesc) => {
    try {
        await HospitalSchema.collection.findAndModify({
            name: hosName
        }, [], {
            '$push': {
                'serviceName': {
                    '$each': [serName]
                },
                'serviceDescription': {
                    '$each': [serDesc]
                }
            }
        }, {
            new: true
        }, (err, doc) => {
            if (err)
                console.log(err);
            else
                console.log(doc);
                return doc;
        });
    }
    catch (err) {
        throw err;
    }
};