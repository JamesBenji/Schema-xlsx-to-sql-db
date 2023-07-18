const path = require('path');

const fileExtLimiter = (allowedExtArray) => {
    return (req, res, next) => {
        const file = req.files;
        const fileExtensions = [];

        Object.keys(file).forEach(key => {
            fileExtensions.push(path.extname(files[key].name))
        })

        const allowed = fileExtensions.every(ext => allowedExtArray.includes(ext))

        if (!allowed){
            const message = `Upload failed. Only ${allowedExtArray.toString()} files allowed`.replaceAll(",", ", ");

            return res.status(422).json({ status: "error", message })
        }

        next();
    }
}

module.exports = fileExtLimiter