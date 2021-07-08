const cloudinary = require('cloudinary')

cloudinary.config({
    cloud_name : 'elkasaby',
    api_key : '724243672246727',
    api_secret: 'EsroFuhGnDGUDSmaRCScix6NH6s'
})

exports.uploads = (file) =>{
    return new Promise(resolve => {
    cloudinary.uploader.upload(file, (result) =>{
    resolve({url: result.url, id: result.public_id})
    }, {resource_type: "auto"})
    })
}
