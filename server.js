var express  = require('express'),
    path     = require('path'),
    bodyParser = require('body-parser'),
    app = express(),
    expressValidator = require('express-validator');


/*Set EJS template Engine*/
app.set('views','./views');
app.set('view engine','ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true })); //support x-www-form-urlencoded
app.use(bodyParser.json());
app.use(expressValidator());

/*MySql connection*/
var connection  = require('express-myconnection'),
    mysql = require('mysql');

app.use(

    connection(mysql,{
        host     : 'localhost',
        user     : 'root',
        password : 'password',
        database : 'bookkart',
        debug    : false //set true if you wanna see debug logger
    },'request')

);

app.get('/',function(req,res){
    res.send('Welcome');
});


//RESTful route
var router = express.Router();



router.use(function(req, res, next) {
    console.log(req.method, req.url);
    next();
});

var curut = router.route('/books');
var curut1 = router.route('/genre');


//show the CRUD interface | GET
curut.get(function(req,res,next){


    req.getConnection(function(err,conn){

        if (err) return next("Cannot Connect");

       var query=  conn.query('SELECT * FROM books',function(err,rows){

            if(err){
                console.log(err);
                return next("Mysql error, check your query");
            }

            res.render('user',{title:"RESTful Crud Example",data:rows});
            //document.write("document");

         });
        
    });

});


curut1.get(function(req,res,next){


    req.getConnection(function(err,conn){

        if (err) return next("Cannot Connect");

       var query=  conn.query('SELECT * FROM genre',function(err,rows){

            if(err){
                console.log(err);
                return next("Mysql error, check your query");
            }

            res.render('genre',{title:"GENRES",data:rows});
            //document.write("document");

         });
        
    });

});


//post data to DB | POST
curut.post(function(req,res,next){

    //validation
     req.assert('book_id',' Enter book id').notEmpty();
    req.assert('title','Enter title').notEmpty();
    req.assert('genre','enter genre').notEmpty();
    req.assert('cost',' enter cost').notEmpty();
    req.assert('no_of_copies',' enter no of copies').notEmpty();
    req.assert('description','enter description').notEmpty();
   
    

    var errors = req.validationErrors();
    if(errors){
        res.status(422).json(errors);
        return;
    }

   
    var data = {
        book_id:req.body.book_id,
        title:req.body.title,
        genre:req.body.genre,
        cost:req.body.cost,
        no_of_copies:req.body.no_of_copies,
        description:req.body.description


     };

     req.getConnection(function (err, conn){

        if (err) return next("Cannot Connect");

        var query = conn.query("INSERT INTO books set ? ",data, function(err, rows){

           if(err){
                console.log(err);
                return next("Mysql error, check your query");
           }

          res.sendStatus(200);
           });

     });

    });

curut1.post(function(req,res,next){

    //validation
     
   
    

    var errors = req.validationErrors();
    if(errors){
        res.status(422).json(errors);
        return;
    }

    //get data
    var data = {
        g_id:req.body.g_id,
        name:req.body.name,
        

     };


    //inserting into mysql
    req.getConnection(function (err, conn){

        if (err) return next("Cannot Connect");

        var query = conn.query("INSERT INTO genre set ? ",data, function(err, rows){

           if(err){
                console.log(err);
                return next("Mysql error, check your query");
           }

          res.sendStatus(200);

        });

     });

});


//now for Single route (GET,DELETE,PUT)
var curut2 = router.route('/books/:book_id');
var curut3 = router.route('/genre/:g_id');

/*------------------------------------------------------
route.all is extremely useful. you can use it to do
stuffs for specific routes. for example you need to do
a validation everytime route /api/user/:user_id it hit.

remove curut2.all() if you dont want it
------------------------------------------------------*/
curut2.all(function(req,res,next){
    console.log("You need to smth about curut2 Route ? Do it here");
    console.log(req.params);
    next();
});

//get data to update
curut2.get(function(req,res,next){

    var book_id = req.params.book_id;

    req.getConnection(function(err,conn){

        if (err) return next("Cannot Connect");

        var query = conn.query("SELECT * FROM books WHERE book_id = ? ",[book_id],function(err,rows){

            if(err){
                console.log(err);
                return next("Mysql error, check your query");
            }

            //if user not found
            if(rows.length < 1)
                return res.send("User Not found");

            res.render('edit',{title:"Edit user",data:rows});
        });

    });

});

//update data
curut2.put(function(req,res,next){
    var book_id = req.params.book_id;
    console.log(res);
    //validation
     req.assert('book_id',' Enter book id').notEmpty();
    req.assert('title','Enter title').notEmpty();
    req.assert('genre','enter genre').notEmpty();
    req.assert('cost',' enter cost').notEmpty();
    req.assert('no_of_copies','enter no of copies').notEmpty();
    req.assert('description','enter description').notEmpty();
    

    var errors = req.validationErrors();
    if(errors){
        res.status(422).json(errors);
        return;
    }

    //get data
    
    var data = {
       
        
        
        no_of_copies:req.body.no_of_copies-1,
        


     };
    //inserting into mysql
    req.getConnection(function (err, conn){

        if (err) return next("Cannot Connect");

        var query = conn.query("UPDATE books set ? WHERE book_id = ? ",[data,book_id], function(err, rows){

           if(err){
                console.log(err);
                return next("Mysql error, check your query");
           }

          res.sendStatus(200);

        });

     });

});


curut3.all(function(req,res,next){
    console.log("You need to smth about curut2 Route ? Do it here");
    console.log(req.params);
    next();
});

//get data to update
curut3.get(function(req,res,next){

    var g_id = req.params.g_id;

    req.getConnection(function(err,conn){

        if (err) return next("Cannot Connect");

        var query = conn.query("SELECT * FROM genre WHERE g_id = ? ",[g_id],function(err,rows){

            if(err){
                console.log(err);
                return next("Mysql error, check your query");
            }

            //if user not found
            if(rows.length < 1)
                return res.send("User Not found");

            res.render('genreedit',{title:"Edit genre",data:rows});
        });

    });

});

//update data
curut3.put(function(req,res,next){
    var g_id = req.params.g_id;

    //validation
     
    

    var errors = req.validationErrors();
    if(errors){
        res.status(422).json(errors);
        return;
    }

    var data = {
        g_id:req.body.g_id,
        name:req.body.name,
        

     };

    //get data
    
    
    //inserting into mysql
    req.getConnection(function (err, conn){

        if (err) return next("Cannot Connect");

        var query = conn.query("UPDATE genre set ? WHERE g_id = ? ",[data,g_id], function(err, rows){

           if(err){
                console.log(err);
                return next("Mysql error, check your query");
           }

          res.sendStatus(200);

        });

     });

});

//delete data


//delete data
curut2.delete(function(req,res,next){

    var book_id = req.params.book_id;

     req.getConnection(function (err, conn) {

        if (err) return next("Cannot Connect");

        var query = conn.query("DELETE FROM books  WHERE book_id = ? ",[book_id], function(err, rows){

             if(err){
                console.log(err);
                return next("Mysql error, check your query");
             }

             res.sendStatus(200);

        });
        //console.log(query.sql);

     });
});


curut3.delete(function(req,res,next){

    var g_id = req.params.g_id;

     req.getConnection(function (err, conn) {

        if (err) return next("Cannot Connect");

        var query = conn.query("DELETE FROM genre  WHERE g_id = ? ",[g_id], function(err, rows){

             if(err){
                console.log(err);
                return next("Mysql error, check your query");
             }

             res.sendStatus(200);
              

        });
        //console.log(query.sql);

     });
});



//now we need to apply our router here
app.use('/api', router);

//start Server
var server = app.listen(3000,function(){

   console.log("Listening to port %s",server.address().port);

});


