const mongoose = require('mongoose');

const mongoUrl = 'mongodb://Kabbage:Kabbage123@ds151450.mlab.com:51450/kardology'; 
//'mongodb://Kabbage:Kabbage123@ds151450.mlab.com:51450/kardology'; 

function mongoSetup(){
    mongoose.connect(mongoUrl)
    .then(() => {
        console.log("connection successful");
    })
    .catch(error => {
        console.log(error);
        console.log("connection failed");
    });
}

module.exports = { mongoSetup };


