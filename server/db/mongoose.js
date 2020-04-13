const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

console.log('Application db establishing connection...');

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log(`Application dbconnection: established`)
}).catch(err => {
    console.error(`Application dbconnection: error ${err.message}`);
    process.exit(-1)
})

module.exports = { mongoose }