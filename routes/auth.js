const express = require ('express');
const router = express.Router();

//importamos modelo a utilizar
const User = require("../models/User")

//importamos herramientas
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const {clearRes,createJWT} = require("../util/auth-mid")

//Este archivo solo vamos 3 rutas LOGIN - SIGNUP - LOGOUT
// todas con el  metodo post

router.post('/signup', (req, res, next)  => {
    //destructuramoss del body para obtener solo los datos reelevantes 

    const {email,name,password,confirmPassword,pet,breed} = req.body
 
    //validar si el passsword es correcto ? 
    if(password != confirmPassword){
        return  res.status(403).json({msg:"Las contraseñas no coinciden"})
    }

    //ahora encriptamosso hasheamos el password
    
    bcrypt.hash(password,10)
    .then(hashedPass =>{
        const user = {
            email,
            password:hashedPass,
            name,
            pet,
            breed
        }

        User.create(user)
        .then(userCreated =>{
            //esto se va a convertir en util! porque lo voy a utilizar en otra ruta

            const newUser = clearRes(userCreated.toObject())

            res.cookie("token", createJWT(userCreated) ,{
                expires:  new Date(Date.now + 86400000 ),
                secure:false, // si lo ponemoss en true unicamente esta cooki funciona en peticions hacia httpss
                httpOnly:true
            } ).status(200).json({ result:newUser })

        })

    })
    .catch( error => res.status(400).json( {error} ) )

});

//Ruta login para obvio hacer login 
router.post("/login",(req,res)=>{

    const { email , password} = req.body;
                //email = "dyaln@perro.com"
    User.findOne({ email })
    .then(user =>{

        if(user === null){
            return res.status(404).json({ msg:"El correo o contraseña son erroneos" })
        }

        bcrypt.compare(password, user.password)
        .then(match=>{

            if(match){

                const newUser = clearRes(user.toObject())

                res.cookie("token", createJWT(user) ,{
                    expires:  new Date(Date.now + 86400000 ),
                    secure:false, // si lo ponemoss en true unicamente esta cooki funciona en peticions hacia httpss
                    httpOnly:true
                } ).status(200).json({ result:newUser })
    
            }else{
                return res.status(404).json({ msg:"El correo o contraseña son erroneos" })
            }

        })

    })
    .catch( error => res.status(400).json( {error} ) )

})


router.post("/logout",(req,res)=>{
    res.clearCookie("token").json({ msg: "vuelve pronto"})
})


module.exports = router;