const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/Pelajar', {
    useNewUrlParser:true,
    useUnifiedTopology :true,
    useCreateIndex:true,
});

// const Contact = require('../model/contact');

// // menambahkan 1 data
// const contact1 = new Contact({
//     name:'Ahmad syarifudin',
//     nohp:'089675434d67',
//     email:'Dedesyarifudin@gmail.com'
// });


// //simpan ke collection
// contact1.save().then((contact) => console.log(contact))