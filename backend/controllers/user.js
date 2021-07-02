// Le controlleur logique metier login a besoin de ses deux MDW


// On aura besoin du modele de cryptage pour les mots de passe npm install --save bcrypt
const bcrypt = require('bcrypt'); //on l'importe ici

// On aura besoin de npm install --save jsonwebtoken
const jwt = require('jsonwebtoken'); // on l'importe ici

// On aura besoin de notre model MDW
const User = require('../models/User');

// On importe le validateur de mot de passe
const passwordValidator = require('../middleware/passwordValidator');

// On importe crypto qui va coder l'email de l'utilisateur
const CryptoJS = require("crypto-js");


// Enregistrement de nos utilisateurs
exports.signup = (req, res, next) => {
    if (passwordValidator.validate(req.body.password)) { // controle de la validation du mot de passe
        bcrypt.hash(req.body.password, 10) // on va commencer par Hasher le MP avec fon assync/ 10 trs de hashage
            .then(hash => { // on va recuperer le hash du MP et l'enregistrer comme le nv user dans la BD
                var key = CryptoJS.enc.Hex.parse(process.env.Crypto_key); 
                var iv = CryptoJS.enc.Hex.parse(process.env.Crypto_iv); 
                const user = new User({// notre modele mangoose va créér un nouveau user
                    email: CryptoJS.AES.encrypt(req.body.email, key, { iv: iv }).toString(),// cryptage du mot de passe
                    //email:req.body.email,
                    password: hash  // on va enregistrer le MP de la ligne l.17
                });
                user.save() // on enregistre dans la BD
                    .then(() => res.status(201).json({ message: 'Utilisateur créé !' })) // 201 pour création de ressources
                    .catch(error => res.status(400).json({ error }));
            })
            .catch(error => res.status(500).json({ error }))
    }
    else {
        return res.status(400).json({ message: 'Le mot de passe doit contenir au moins un chiffre, une minuscule, une majuscule et être composé de 8 caractères minimum !' })
    }
};

// Connecter les utilisateurs existants
exports.login = (req, res, next) => {
    var key = CryptoJS.enc.Hex.parse(process.env.Crypto_key);
    var iv = CryptoJS.enc.Hex.parse(process.env.Crypto_iv);
    User.findOne({ email: CryptoJS.AES.encrypt(req.body.email, key, { iv: iv }).toString() }) // On recupere l'utilisateur dans la base qui correspond a l email entré
        .then(user => {
            if (!user) { // si email pas bon on renvoie une erreur
                return res.status(401).json({ error: "Utilisateur non trouvé !" });
            }// Si trouvé alors 
            bcrypt.compare(req.body.password, user.password) //on compare le MP entré avec le hash dans la BD
                .then(valid => {
                    if (!valid) { // Si comparaison retourne false
                        return res.status(401).json({ error: "Mot de passe incorrect !" });
                    }
                    res.status(200).json({ // si valable (true) on va renvoyer au F-e un id et un token d'authentification
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            `${process.env.TOKEN}`,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

