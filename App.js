const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

require('./utils/db');
const Contact = require('./model/contact');

const app = express();
const port = 3001;

//setup ejs
app.set('view engine','ejs');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));

//konfigurasi 
app.use(cookieParser('secret'));
app.use(
    session({
    cookie: {maxAge : 6000},
    secret :'secret',
    resave:true,
    saveUninitialized :true,
    })
);

app.use(flash());

// halaman home
app.get('/',(req,res) => {
    
    // res.json(
    //     {user:'tobi',email:'@GMAIL.COM'},
        
    // )
    // res.sendFile('./views/index.html',{root :__dirname})
    const mahasiswa = [
        {
            nama:'Dede syarifudin',
            email :'dede@gmail.com'
        },
        {
            nama:' syarifudin',
            email :'syarifudin@gmail.com'
        },
        {
            nama:'alhadid07',
            email :'alhadid07@gmail.com'
        }, 
        {
            nama:'ahmadbedoel',
            email :'ahmad@gmail.com'
        }
        
    ]
    res.render('index',{
        nama:'Dedesyarifudin' ,
        title:'halaman home',
        mahasiswa,
        layout:'layouts/main-layout'
    })
    
    });
//halaman about
    app.get('/about',(req,res) => {
        // res.send('halaman about ')
        // res.sendFile('./views/about.html',{root :__dirname})
        res.render('about',{
            layout:'layouts/main-layout',
            title:'halaman about'
        })
       
        });

//halaman contact
app.get('/contact', async (req,res) => {

    const contacts = await Contact.find();
    
    res.render('contact',{
        layout:'layouts/main-layout',
        title:'halaman contact',
        contacts,
        msg:req.flash('msg')
        })
    });

     //halaman form tambah data
     app.get('/contact/add',(req,res) => {
        res.render('add-contact',{
            title:'Form Tambah Data Contact',
            layout:'layouts/main-layout.ejs'

        })
    });

   //halaman detail contact
   app.get('/contact/:name', async (req,res) => {
    // res.send('halaman contack')
    // res.sendFile('./views/contact.html',{root :__dirname})
    const contact =await  Contact.findOne({name :req.params.name});
    
    res.render('detail',{
        layout:'layouts/main-layout',
        title:'halaman detail contact',
        contact,
        })
    });


app.listen(port, () => {
    console.log(`mongo contact app running at || http://localhost:${port}`);
})