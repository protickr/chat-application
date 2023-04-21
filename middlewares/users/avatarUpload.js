const uploader = require('../../utilities/singleUploader');

const avatarUpload = function (req, res, next) {
  const upload = uploader(
    'avatars',
    ['image/jpg', 'image/jpeg', 'image/png'],
    1000000,
    'Only jpg, jpeg and png files are allowed < 1MB'
  );

  upload.any()(req, res, (err)=>{
    if(!err){
        next()
    }else{
        res.status(500).json({
            errors: {
                avatar: {
                    msg: err.message
                }
            }
        });
    }
  });
};

module.exports = avatarUpload; 