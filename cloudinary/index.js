/*jshint esversion: 6 */
// crypto - included with node - creates a unique string which we can use on images
const crypto = require('crypto');
const cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'mike-chalmers',
  api_key: '691283465219522',
  api_secret: process.env.CLOUDINARY_SECRET
});
const cloudinaryStorage = require('multer-storage-cloudinary');
const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'surf-shop',
  allowedFormats: ['jpeg', 'jpg', 'png', 'gif'],
  filename: function (req, file, cb) {
  	let buf = crypto.randomBytes(16);
  	buf = buf.toString('hex');
  	let uniqFileName = file.originalname.replace(/\.jpeg|\.jpg|\.png|\.gif/ig, '');
  	uniqFileName += buf;
    cb(undefined, uniqFileName );
  }
});
module.exports = {
	cloudinary,
	storage
};
