//on a installé multer on va à present le charger

const multer = require("multer");

const MIME_TYPES = {
    "image/jpg":'jpg',
    "image/jpeg":'jpg',
    "image/png":'png'
};

const storage = multer.diskStorage({
    destination:(req, file, callback)=>{// fonction destination indique à multer d'enregistrer les fichiers dans le dossier images
        callback(null, 'images')
    },
    filename:(req, file, callback)=>{// filename indique à multer d'utiliser le nom d'origine
        const name = file.originalname.split(' ').join('_');// remplacer les espaces par des underscores
        const extension = MIME_TYPES[file.mimetype];// elle utilise la constante dictionnaire de tye MIME pour resoudre l'extension des fichiers appropriée.
        callback(null, name + Date.now () + '.' + extension);// ajouter un timestamp Date.now() comme nom de fichier. 
    }
});

// Exportation de multer
module.exports = multer({storage}).single('image');// nous exportons multer entierement configuré 
//lui passons la constante storage
// et lui indiquons que nous generons uniquement les telechargements des fichiers images.