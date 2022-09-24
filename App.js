const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
var methodOverride = require('method-override')

const {body,validationResult , check} = require('express-validator');


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
//gunakan flash
app.use(flash());

//gunakan methode override
app.use(methodOverride('_method'));

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
            layout:'layouts/main-layout'

        })
    });

       //process  tambah data contact
       app.post('/contact',
       [
           body('name').custom(async (value) => {
               const duplikat =await Contact.findOne({name :value});
               if(duplikat) {
                   throw new Error('nama contact sudah digunakan');
               }
   
               return true;
           }),
           check('email','Email Tidak Valid').isEmail(),
           check('nohp','No Hp Tidak Valid').isMobilePhone('id-ID'),
   
       ]
       , (req,res) => {
           const errors = validationResult(req);
           if(!errors.isEmpty()){
               // return res.status(400).json({ errors: errors.array() });
   
               res.render('add-contact', {
                   title:'Form tambah data contact',
                   layout :'layouts/main-layout',
                   errors :errors.array(),
               })
           }else{
            Contact.insertMany(req.body ,  (error ,result) => {
                //kirimkan flash message
                req.flash('msg','Data contact berhasil ditambahkan');
                res.redirect('/contact');
            });
            }
           // res.send(req.body);
   
   
   
       });

          //procces delete contact
    // app.get('/contact/delete/:name', async(req,res) => {
    //     const contact = await Contact.findOne({name :req.params.name});

    //     //jika kontak tidak ada
    //     if(!contact) {
    //         res.status(404);
    //         res.send('<h1>404</h1>');
    //     }else{
    //        Contact.deleteOne({_id : contact._id}).then(() => {
    //            req.flash('msg','Data contact berhasil dihapus');
    //             res.redirect('/contact');
    //        });
    //     }
    // });

    app.delete('/contact', (req,res) => {
        Contact.deleteOne({name : req.body.name}).then((result ) => {
           req.flash('msg','Data contact berhasil dihapus');
            res.redirect('/contact'); 
        });
    })

      //form ubah data contact
      app.get('/contact/edit/:nama',async (req,res) => {
        const contact = await Contact.findOne({name :req.params.nama});

        res.render('edit-contact',{
            title:'Form ubah Data Contact',
            layout:'layouts/main-layout.ejs',
            contact,
        })
    });

    //proccess ubah data 
    app.put('/contact',
    [
        body('name').custom(async (value, {req}) => {
            const duplikat = await Contact.findOne({name :value});
            //apakah isi value sama dengan old nama / duplikat
            if(value !== req.body.oldNama && duplikat) {
                //maka nama sudah digunakan
                throw new Error('nama contact sudah digunakan');
            }

            return true;
        }),
        check('email','Email Tidak Valid').isEmail(),
        check('nohp','No Hp Tidak Valid').isMobilePhone('id-ID'),

    ]
    , (req,res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.render('edit-contact', {
                title:'Form ubah data contact',
                layout :'layouts/main-layout',
                errors :errors.array(),
                contact: req.body,
            })
        }else{   
            Contact.updateOne({_id : req.body._id},
            {
                $set : {
                    name:req.body.name,
                    email:req.body.email,
                    nohp:req.body.nohp,
                }
            }

            ).then((result) => {

                req.flash('msg','Data contact berhasil ubah');
                res.redirect('/contact');
            });
         }
        // res.send(req.body);



    })

   //halaman detail contact
   app.get('/contact/:name', async (req,res) => {
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