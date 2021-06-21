
const express = require('express');
//-----------------------------------------------------------------------------
const bodyParser = require('body-parser');
//-----------------------------------------------------------------------------
const mongoose = require('mongoose');
//-----------------------------------------------------------------------------
const path = require ('path'); // donne accés au chemin de notre système de fichiers


const stuffRoutes = require('./routes/stuff');
//-----------------------------------------------------------------------------
const userRoutes = require('./routes/user');

mongoose.connect('mongodb+srv://Redgogo:Test06220@cluster0.lix0p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


const app = express();
//-----------------------------------------------------------------------------
//ETAPE 5 / METTRE EN PLACE MANGO DB.
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json()); // Il va transformer le corps de la requete en objet utilisable

app.use('/images', express.static(path.join(__dirname, 'images')));

// on enregistre nos routeurs dans notre application
app.use('/api/stuff', stuffRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;