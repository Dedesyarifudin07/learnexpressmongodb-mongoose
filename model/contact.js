const mongoose = require('mongoose');

const Contact = mongoose.model('Contacts', 
{
     name: {
        type:String,
        required :true,
    } ,
    nohp: {
        type:String,
        required :true,
    },
    email:{
        type:String,
        required :true,
    }
});

module.exports = Contact;