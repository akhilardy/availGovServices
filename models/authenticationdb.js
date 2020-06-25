const mongoose = require('mongoose');
const authentication = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    regNo: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});
module.exports = Authentication = mongoose.model("Authentication", authentication);
module.exports.createEntry = async (newEntry) => {
    try {
        const newObj = await newEntry.save();
        return newObj;
    }
    catch (err) {
        console.log("error in creating record");
        throw err;
    }
};
module.exports.isValid = async (registrationNum) => {
    try {
        console.log("register number:" + registrationNum)
        const res = await Authentication.findOne({ regNo: registrationNum });
        // console.log(res);
        return res;
    }
    catch (err) {
        console.log(err);
    }
}
