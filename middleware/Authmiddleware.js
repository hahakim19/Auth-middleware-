const jwt = require('jsonwebtoken')
const mysql = require('mysql');




////////////////////////////////////////////////////////////////////////////////////////////////

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '123456789',
        database: 'pfe'
    }

)
db.connect((err) => {

    if (err) console.log(err);
  
});
////////////////////////////////////////////////////////////////////////////////////////////////
const requireAuth=(req,res,next)=>{
    const token =req.cookies.jwt;

    if(token)
    {
        jwt.verify(token,'tigre tigre',(err,decodedToken)=>{
            if (err) {
                res.redirect('/login')

            }
            else {
                console.log(decodedToken)
                next();

            }

        })
    }
    else res.redirect('/login')
            
}
const requireAuthAd=(req,res,next)=>{
    const token =req.cookies.jwt;

    if(token)
    {
        jwt.verify(token,'mimosa',(err,decodedToken)=>{
            if (err) {
                res.redirect('/login')

            }
            else {
                console.log(decodedToken)
                next();

            }

        })
    }
    else res.redirect('/login')
            
}


/// check current user 

const checkuser=(req,res,next)=>{

    const token = req.cookies.jwt
    if (token)
    {
        jwt.verify(token,'tigre tigre',(err,decodedToken)=>{
            if (err) {
                res.locals.user="123"
                next()
            }
            else { console.log('le trruc decoder ',decodedToken.id)
                db.query('SELECT username FROM utilisateur WHERE idutilisateur=?',[decodedToken.id.idutilisateur],(err,data)=>{
                        if(!err){
                            console.log('data',data[0].username)
                            res.locals.user=data[0];
                            next();
                        }
                        else console.log(err)

                })

            }
        
        })
    }
    else {
        res.locals.user="456"
        next();
    }

}
const checkuser2=(req,res,next)=>{

    const token = req.cookies.jwt
    if (token)
    {
        jwt.verify(token,'mimosa',(err,decodedToken)=>{
            if (err) {
                res.locals.user=null
                next()
            }
            else { console.log('le trruc decoder ',decodedToken.id)
                db.query('SELECT username FROM utilisateur WHERE idutilisateur=?',[decodedToken.id.idutilisateur],(err,data)=>{
                        if(!err){
                            console.log('data',data[0].username)
                            res.locals.user=data[0];
                            next();
                        }
                        else console.log(err)

                })

            }
        
        })
    }
    else {
        res.locals.user=null
        next();
    }

}




module.exports={requireAuth,checkuser,requireAuthAd,checkuser2}