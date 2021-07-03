//importar mongoose y destructurarlo

const mongoose = require("mongoose");
const {Schema, model} = mongoose;


const userSchema = new Schema({
    name: {
        type:String,
        required: [true, "Necesitas añadir un nombre"],
        minlength: 1,
    },
    email: {
        type: String,
        unique: [true, "Este correo ya existe"],
        required: [true, "Necesitas añadir un correo"]
    },
    password: {
        type: String,
        required: [true, "Debes incluir una constraseña"]
    },
    image: {
        type: String,
        default: "https://i.blogs.es/ab74c7/fotografo-de-perros_-santos-roman-piccolo-italiano/450_1000.jpg",
    },
    pet: {
        type: String,
        required: [true, "Debes poner el tipo de mascota"]
    },
    breed: {
        type: String,
        required: [true, "Debes incluir una raza"]
    },
    role:{
        type:String,
        default: "USER",
        enum:["ADMIN", "USER"]
    }

}, {timestamp:true});

                // Lleva dos valores model("Elnombre del modelo", estructura)
module.exports = model("User", userSchema)