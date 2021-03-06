// Importation de modules

//Ajout du router express
const express = require('express');
//-----------------------------------------------------------------------------
//Ajout du body-parser : permet d'extraire des objets JSON
const bodyParser = require('body-parser');
//-----------------------------------------------------------------------------
// Ajout de mangoose : permet la gestion de BDD
const mongoose = require('mongoose');
//-----------------------------------------------------------------------------
// Gestion du système de fichier : donne accès au chemin de notre système de fichiers
const path = require('path');
//-----------------------------------------------------------------------------
// Protection de l'application avec helmet
const helmet = require('helmet');
//-----------------------------------------------------------------------------
// Protection de l'application avec rateLimit
const rateLimit = require("express-rate-limit");

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
//-----------------------------------------------------------------------------

require('dotenv').config()

// Importation des routes
const sauceRoutes = require('./routes/sauce');
//-----------------------------------------------------------------------------
const userRoutes = require('./routes/user');
//-----------------------------------------------------------------------------

// Connexion à MangoDB
// on joit la variable globale avec ligne
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
//-----------------------------------------------------------------------------

//console.log('HAHA', process.env)


// Application express
const app = express();
//-----------------------------------------------------------------------------

//Correction des erreurs CORS.
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
//-----------------------------------------------------------------------------

// Utilisation de bodyParser dans l'application
// Il va transformer le corps de la requete en objet utilisable
app.use(bodyParser.json());
//-----------------------------------------------------------------------------

// Protection de l'application avec helmet
app.use(helmet());
//console.log('Helmet activé', helmet)

//-----------------------------------------------------------------------------
//  apply to all requests
app.use(limiter);

// Utilisation du path pour enregistrement des photos sur le BE
app.use('/images', express.static(path.join(__dirname, 'images')));
//-----------------------------------------------------------------------------

// Routes
// on enregistre nos routeurs dans notre application
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;
//-----------------------------------------------------------------------------
