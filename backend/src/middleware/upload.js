const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let folder = 'categories';
        if (req.originalUrl.includes('/brands')) {
            folder = 'brands';
        } else if (req.originalUrl.includes('/banners')) {
            folder = 'banners';
        } else if (req.originalUrl.includes('/sellers')) {
            folder = 'sellers';
        }
        const dir = path.join(__dirname, '../../uploads', folder);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

module.exports = {
    upload
};
