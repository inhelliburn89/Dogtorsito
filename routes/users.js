const express = require('express');
const router = express.Router();
//import el model(s) que se necesite
const User = require("../models/User");
/* GET users listing. */

//importamos loss utils
const { checkRole,veryToken } = require("../util/auth-mid")



/* Tengo que crear un crud completo si es necesario
   C.R.U.D
   C = Create   / POST
   R = Read     / GET
   U = Update   / POST, PATCH, PUT
   D = Delete   / DELETE
*/

/* 
  GET users listing.
 Listar puros Alumnoss o USER
*/
router.get('/students',veryToken,checkRole(["ADMIN"]), (req, res, next)=> {
  
    User.find({$nor:[{ role:"ADMIN" }]})
    .then( users =>{
      res.status(200).json({result:users})
    })
    .catch( error => res.status(400).json( {error} ) )

});

//Vamos a actualizar mi  perfil!!!
router.patch("/editMyUser", veryToken,checkRole(["ADMIN","USER"]) ,(req,res)=>{
    //voy a destructurar al req.user  para ssacar mi id esto gracasl veryToken
    //  req.user lo creammos con el middelware veryToken
    const { _id } = req.user
    const {role,...restUser} = req.body //para evitar ser hackeado y se coloquen el role en ADMIN
    User.findByIdAndUpdate(_id, restUser, {new:true})
    .then( user =>{
      res.status(200).json({result:user})
    })
    .catch( error => res.status(400).json( {error} ) )
})


//Vamos a eliminar

router.delete("/:id/deleteUser", veryToken , checkRole(["ADMIN"]), (res,req)=>{
  //sacamos el parametro id del req.params
  const { id }= req.params

  User.findByIdAndDelete(id)
  .then( () =>{
    res.status(200).json({msg:"Usuario borrado"})
  })
  .catch( error => res.status(400).json( {error} ) )

})





module.exports = router;


module.exports = router;
