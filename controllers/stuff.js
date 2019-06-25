const fs = require('fs');
const Thing = require('../models/thing');

exports.createThing = (req, res, next) => {
    // console.log('isi req', req.body);
    // console.log('isi file: ', req.file)
    // console.log("server req: ", req.body.thing);
    // to add a file to the request, the front end needed to send the request data as form-data as opposed to JSON — 
    // the request body contains a thing string, which is simply a stringified thing object — 
    // we therefore need to parse it using JSON.parse() to get a usable object
    req.body.thing = JSON.parse(req.body.thing);
    // console.log(req.body.thing);
    // we also need to resolve the full URL for our image, as req.file.filename only contains the filename segment — 
    // we use req.protocol to get the first segment ( 'http' , in this case); we add the '://', 
    // and then use req.get('host') to resolve the server host ('localhost:3000' in this case); 
    // we finally add '/images/' and the filename to complete our URL
    const url = req.protocol + '://' + req.get('host');
    // console.log(url);
    // console.log(req.file.filename);
    const thing = new Thing({
        title: req.body.thing.title,
        description: req.body.thing.description,
        imageUrl: url + '/images/' + req.file.filename,
        price: req.body.thing.price,
        userId: req.body.thing.userId
    });
    // console.log(thing);
    thing.save().then( 
        () => {
            res.status(201).json({
                message: 'Post saved successfully!'
            });
        }
    ).catch( (error) => {
        res.status(400).json({
            error: error
        });
    });
};

exports.getOneThing = (req, res, next) => {
    Thing.findOne({_id: req.params.id}).then( (thing) => {
        res.status(200).json(thing);
    }).catch( (error) => {
        res.status(404).json({
            error: error
        });
    });
};

// exports.modifyThing = (req, res, next) => {
//     let thing = new Thing({ _id: req.params._id });
//     if (req.file) {
//       const url = req.protocol + '://' + req.get('host');
//       req.body.thing = JSON.parse(req.body.thing);
//       thing = {
//         _id: req.params.id,
//         title: req.body.thing.title,
//         description: req.body.thing.description,
//         imageUrl: url + '/images/' + req.file.filename,
//         price: req.body.thing.price,
//         userId: req.body.thing.userId
//       };
//     } else {
//       thing = {
//         _id: req.params.id,
//         title: req.body.title,
//         description: req.body.description,
//         imageUrl: req.body.imageUrl,
//         price: req.body.price,
//         userId: req.body.userId
//       };
//     }
//     Thing.updateOne({_id: req.params.id}, thing).then(
//       () => {
//         res.status(201).json({
//           message: 'Thing updated successfully!'
//         });
//       }
//     ).catch(
//       (error) => {
//         res.status(400).json({
//           error: error
//         });
//       }
//     );
//   };

exports.modifyThing = (req, res, next) => {
    // we first create a new instance of our Thing model with the received _id 
    // so as not to cause problems when trying to update that Thing in the database
    let thing = new Thing({ _id: req.params._id });
    // console.log(thing);
    // if we receive a new file with the request (via multer), we handle the form-data and generate the image URL
    if (req.file) {
        const url = req.protocol + '://' + req.get('host');
        req.body.thing = JSON.parse(req.body.thing);
        // console.log(req.body.thing);
        thing = {
            _id: req.params.id,
            title: req.body.thing.title,
            description: req.body.thing.description,
            imageUrl: url + '/images/' + req.file.filename,
            price: req.body.thing.price,
            userId: req.body.thing.userId
        };
        
        // if we do not receive a new file, we simply capture the request body JSON
    } else {
        // Using the new keyword with a Mongoose model creates a new _id field by default. 
        // In this case, that would throw an error, as we would be trying to modify an immutable field on a database document. 
        // Therefore, we must use the id parameter from the request to set our Thing up with the same _id as before
        thing = {
            _id: req.params.id,
            title: req.body.title,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
            price: req.body.price,
            userId: req.body.userId
        };
    }

    Thing.updateOne({_id: req.params.id}, thing).then( () => {
        res.status(201).json({
            message: 'Thing updated successfully!'
        });
    }).catch( (error) => {
        res.status(400).json({
            error: error
        });
    });
};

exports.deleteThing = (req, res, next) => {
    // we use the ID we receive as a parameter to access the corresponding Thing in the database
    Thing.findOne({ _id: req.params.id }).then(
        (thing) => {
            // we use the fact that we know there is an /images/ segment in our image URL to separate out the file name
            const filename = thing.imageUrl.split('/images/')[1];
            // we then use the fs package's unlink function to delete that file, 
            // passing it the file to be deleted and the callback to be executed once that file has been deleted
            fs.unlink('images/' + filename, () => {
                Thing.deleteOne({_id: req.params.id}).then( 
                    () => {
                        res.status(200).json({
                            message: "Deleted!"
                        });
                    }
            
                ).catch( (error) => {
                    res.status(400).json({
                        error: error
                    });
                });
            });
        }
    );
};

exports.getAllStuff = (req, res, next) => {
    // console.log(req.headers);
    Thing.find().then( (things) => {
        res.status(200).json(things);
    }).catch( (error) => {
        res.status(400).json({
            error: error
        });
    });
};