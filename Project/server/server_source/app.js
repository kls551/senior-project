var passport = require('passport');
var settings = require('../config/settings');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var Grid = require('gridfs');
var mongoose = require('mongoose');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage')
const path = require('path')


const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

app.use(express.static(__dirname + '/../images'));


// const mongoUrl = 'mongodb://localhost:27017/TeaShop'
const mongoUrl = 'mongodb+srv://kls:teashop@soe-g4xtc.azure.mongodb.net/test?retryWrites=true&w=majority'

mongoose.connect(mongoUrl, { 
  useNewUrlParser: true });
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function(callback){
  console.log("Connection Succeeded");
});

/*** COLLECTION FOR IMAGES */
// db.once('open', () => {
//   gfs = Grid(db.db, mongoose.mongo)
//   gfs.collection('uploads')
//   console.log('Connection Successful')
// })

var Item = require('../models/item');
var User = require('../models/user');
var Order = require('../models/order');

/****************************** MIGHT BE USED IN FUTURE MONGODB IMAGE STORAGE***/
// const storage = new GridFsStorage({
//   url: mongoUrl,
//   file: (req, file) => {
//     return new Promise((resolve, reject) => {
//       crypto.randomBytes(16, (err, buf) => {
//         if (err) {
//           return reject(err)
//         }
//         const filename = file.originalname + '_' + req.params.id
//         const fileInfo = {
//           filename: filename,
//           metadata: req.params.id,
//           bucketName: 'uploads',
//         }
//         resolve(fileInfo)
//       })
//     })
//   },
// })

/* local */
const storage1 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + '/../images')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname + '_' + req.params.id)
  }
});

var upload = multer({storage: storage1});

getToken = (headers) => {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

app.post('/images/:id', passport.authenticate('jwt', { session: false }), upload.single('img'), (req, res) => {
  var token = getToken(req.headers);
  if (token) {
    Item.findOne({ _id: req.params.id }, (error, item) => {
      if (error)
        console.log(error);
      
      item.images.push(req.query.filename + "_" + req.params.id)
      item.save((error) => {
        if (error)
          res.status(500).send(error)
        
        res.status(201).send('success')
      })
    })
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
})

app.get('/images/:filename', (req, res) => {

    var options = {
      root: path.join(__dirname, '/../images'),
      dotfiles: 'deny',
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
      }
    }
  
    var fileName = req.params.filename
    res.sendFile(fileName, options, function (err) {
      if (err) {
        res.status(400).send(err)
      } else {
        console.log('Sent:', fileName)
      }
    })
  
  /************** MONGODB IMAGE STORAGE */
  // gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
  //   // Check if file
  //   if (!file || file.length === 0) {
  //     return res.status(404).json({
  //       err: 'No file exists',
  //     })
  //   }

  //   if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
  //     const readstream = gfs.createReadStream(file.filename)
  //     readstream.pipe(res)
  //   } else {
  //     res.status(404).json({
  //       err: 'Not an image',
  //     })
  //   }
  // })
})

app.get('/items', passport.authenticate('jwt', { session: false }), (req, res) => {
  var token = getToken(req.headers);
  if (token) {
    let filter = {};
    if (req.query.option === "low") {
      filter = {
        'busAttr.quantity': {
          '$lt': 10
        }
      }
    }
    Item.find(filter, 'name description brand attr busAttr images', (error, items) =>{
      if (error) {
        console.error(error);
      }
      res.send({
        items: items
      });
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

app.post('/item', passport.authenticate('jwt', { session: false }), (req, res) => {
  var token = getToken(req.headers);
  if (token) {
    Item.findOne({ name: req.body.item.name }, (err, result) => {
      if (err) {
        console.log(err);
      }
      if (result) {
        res.status(400).json({ msg: 'item exists' });
      }
      new Item(req.body.item).save((error, item) => {
        if (error) {
          console.log(error);
          res.send({
            success: false
          })
        }
        res.send({
          success: true, itemId: item._id
        });
      });
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

app.post('/items/images', passport.authenticate('jwt', { session: false }), (req, res) => {
  var token = getToken(req.headers);
  if (token) {
    Item.findById(req.params.id, 'name description images', function(
      error,
      item
    ) {
      if (error) {
        console.error(error);
        res.send({
          success: false
        })
      }

      item.images.push(fs.readFileSync(req.body.imagePath));
      item.save(function(error) {
        if (error) {
          console.log(error);
        }
        res.send({
          success: true
        });
      });
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

app.put('/items/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  var token = getToken(req.headers);
  if (token) {
    Item.findByIdAndUpdate(req.params.id, req.body.item, function(
      error,
      item
    ) {
      if (error) {
        console.error(error);
        res.status(400);
      } else {
        res.status(200).send({item: item});
      }
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

app.delete('/items/:id', async (req, res) => {
  var token = getToken(req.headers);
  if (token) {
    try {
      Item.findById(req.params.id, (err, item) => {
        item.images.forEach(image => {
          console.log(image)
          fs.unlink(__dirname + `/../images/${image}`, (err) => {
            if (err) console.log(err)
          });
        })
      });
      await Item.deleteOne(
        {
          _id: req.params.id
        }, (err) => {
          if (err) res.send(err);
          res.send({
            success: true
          });
        }
      );
    } catch (err) {
      res.send(err)
    }
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

app.get('/item/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  var token = getToken(req.headers);
  if (token) {
    var db = req.db;
    Item.findById(req.params.id, 'name description brand', function(error, item) {
      if (error) {
        console.error(error);
      }
      res.send(item);
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

app.post('/login', function(req, res) {
  User.findOne({name: req.body.username.toLowerCase()}, (err, user) => {
      if (err) throw err;

      if (!user) {
        res.status(401).send({
          success: false,
          msg: 'Authentication failed. User not found.'
        });
      } else {
        // check if password matches
        user.comparePassword(req.body.password, function(err, isMatch) {
          if (isMatch && !err) {
            // if user is found and password is right create a token
            var token = jwt.sign(user.toJSON(), settings.secret);
            // return the information including token as JSON
            res.json({
              success: true,
              token: 'JWT ' + token,
              admin: user.admin,
              name: user.name,
              tax: user.tax
            });
          } else {
            res.status(401).send({
              success: false,
              msg: 'Authentication failed. Wrong password.'
            });
          }
        });
      }
    }
  );
});

app.get('/order/aggregate/year', passport.authenticate('jwt', { session: false }), (req, res) => {
  var token = getToken(req.headers);
  if (token) {
    let aggQuery = [
      {
        '$project': {
          'items': 1,
          'year': {
            '$year': '$orderDate'
          }
        }
      }, {
        '$match': {
          'year': parseInt(req.query.year)
        }
      }, {
        '$unwind': '$items'
      }, {
        '$group': {
          '_id': {
            'index': '$items.index',
            'item_id': '$items.item'
          },
          'totalQuantity': {
            '$sum': '$items.quantity'
          },
          'totalPrice': {
            '$sum': {
              '$multiply': [
                '$items.quantity', '$items.price'
              ]
            }
          }
        }
      }, {
        '$lookup': {
          'from': 'items',
          'localField': '_id.item_id',
          'foreignField': '_id',
          'as': 'item'
        }
      }
    ];

    Order.aggregate(aggQuery)
    .exec((err, orders) => {
      if (err) {
        console.log(err);
        res.status(400).send(err);
      }
      res.send(orders);
    });
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
});

app.get('/order/aggregate', passport.authenticate('jwt', { session: false }), (req, res) => {
  var token = getToken(req.headers);
  if (token) {
    let aggQuery = [
      {
        '$project': {
          'items': 1,
          'month': {
            '$month': '$orderDate'
          },
          'year': {
            '$year': '$orderDate'
          }
        }
      }, {
        '$match': {
          'month': parseInt(req.query.month),
          'year': parseInt(req.query.year)
        }
      }, {
        '$unwind': '$items'
      }, {
        '$group': {
          '_id': {
            'index': '$items.index',
            'item_id': '$items.item'
          },
          'totalQuantity': {
            '$sum': '$items.quantity'
          },
          'totalPrice': {
            '$sum': {
              '$multiply': [
                '$items.quantity', '$items.price'
              ]
            }
          }
        }
      }, {
        '$lookup': {
          'from': 'items',
          'localField': '_id.item_id',
          'foreignField': '_id',
          'as': 'item'
        }
      }, {
        '$sort': { '_id.month' : 1, '_id.year' : 1}
      }
    ];

    Order.aggregate(aggQuery)
    .exec((err, orders) => {
      if (err) {
        console.log(err);
        res.status(400).send(err);
      }
      res.send(orders);
    });
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
});

app.get('/orders', passport.authenticate('jwt', { session: false }), (req, res) => {
  var token = getToken(req.headers);
  if (token) {
    if (req.query.agg) {
      let jsonAggregate = []
      if (req.query.agg === 'month') {
        jsonAggregate = [
          {
            $group: {
              _id: {
                year: { $year: '$orderDate' },
                month: { $month: '$orderDate' }
              },
              totalAmount: { $sum: '$totalAmount' },
              revenue: { $sum: '$revenue' },
            }
          },
          {
            $sort: {
              '_id.month': 1, '_id.year': 1
            }
          }
        ];
      } else if (req.query.agg === 'year') {
        jsonAggregate = [
          {
            $group: {
              _id: {
                year: { $year: '$orderDate' },
              },
              totalAmount: { $sum: '$totalAmount' },
              revenue: { $sum: '$revenue' },
            }
          },
          {
            $sort: {
              '_id.year': 1
            }
          }
        ];
      }
      Order.aggregate(jsonAggregate)
        .exec((err, or) => {
          if (err)
            console.log(err)
          res.send(or)
        });
    } else {
      Order.find({
        orderDate: { $gte: new Date(req.query.startDate), $lte: new Date(req.query.endDate) }
      }, 'seller orderDate totalAmount revenue items')
        .populate('items.item')
        .populate('seller', 'name')
        .sort({ 'orderDate': 1 })
        .exec((error, orders) => {
          if (error) {
            console.error(error);
          }
          res.send(orders);
        });
    }
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

app.post('/order', passport.authenticate('jwt', { session: false }), function (req, res) {
  var token = getToken(req.headers);
  if (token) {
    User.findOne({ name: req.body.sellerName }, (err, user) => {
      if (!user) {
        console.log(err);
        res.status(400);
      } else {
        let body = {
          seller: user._id,
          totalAmount: req.body.totalAmount,
          revenue: req.body.revenue,
          items: req.body.items
        }
        var newOrder = new Order(body);
        newOrder.save(function(err) {
          if (err) {
            res.send({ success: false, msg: "Can't order..err!" });
          }
          user.cart = [];
          user.save((err) => {
            if (err)
              res.status(400);
            res.send({ success: true, msg: 'Successful created new order.' });
          })
        });
      }
    })
  } else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

app.delete('/order/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  var token = getToken(req.headers);
  if (token) {
    Order.deleteOne({ _id: req.params.id }, (err) => {
      if (err) res.send(err)
      else res.send({success: true})
    })
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

app.post('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
  var token = getToken(req.headers);
  if (token) {
    req.body.name = req.body.name.toLowerCase();
    var new_user = new User(req.body);

    new_user.save(function (error) {
      if (error) {
        res.status(400).send(error.errmsg);
      } else {
        res.send({
          success: true
        });
      }
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

app.get('/cart/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
  var token = getToken(req.headers);
  if (token) {
    User.findOne({ name: req.params.name.toLowerCase() }, 'cart')
      .populate('cart.item')
      .exec((err, cart) => {
        if (err) {
          console.error(err);
        }
        res.send(cart)
      })
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
});

app.put('/cart/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
  var token = getToken(req.headers);
  if (token) {
    let body = {
      quantity: req.body.quantity,
      index: req.body.itemIndex,
      item: req.body.itemId
    }

    User.findOne({ name: req.params.name.toLowerCase() }, (err, user) => {
      if (err) throw err;

      if (!user) {
        res.status(401).send({
          success: false,
          msg: 'Authentication failed. User not found.'
        });
      } else {
        let itemExist = user.cart.findIndex(item => {
          return item.item.toString() === body.item && body.index === item.index
        });
        if (itemExist >= 0) {
          user.cart[itemExist].quantity += body.quantity;
          if (user.cart[itemExist].quantity <= 0) {
            user.cart.splice(itemExist, 1);
          }
        } else {
          user.cart.push(body);
        }
        user.save((error) => {
          if (error) {
            console.log(error);
          }
          else {
            Item.findById(body.item, 'busAttr', (err, item) => {
              if (item) {
                item.busAttr[body.index].quantity -= body.quantity;
                item.save((err) => {
                  if (err) {
                    console.log(err);
                  }
                  else {
                    res.send({
                      success: true
                    })
                  }
                })
              }
            });
          }
        });
      }
    });
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
});

app.delete('/users/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  var token = getToken(req.headers);
  if (token) {
    User.update({ _id: req.params.id }, {deleted: true}, (err, user) => {
      if (err) res.send(err);
      else 
        res.send({
          success: true
        });
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
  var token = getToken(req.headers);
  if (token) {
    User.find({deleted: false}, 'name email admin', function (error, users) {
      if (error) {
        console.error(error);
      }
      res.send({
        users: users
      });
    }).sort({ _id: -1 });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

app.get('/user/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
  var token = getToken(req.headers);
  if (token) {
    User.findOne({ name: req.params.name }, 'name email admin', function (error, user) {
      if (user) {
        res.send(user)
      }
    });
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
});

app.put('/tax', passport.authenticate('jwt', { session: false }), (req, res) => {
  var token = getToken(req.headers);
  if (token) {
    User.updateMany({}, { tax: req.body.tax }, (err) => {
      if (err) {
        console.log(err);
        res.send(err);
      }
      res.send({ updated: true });
    });
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
});

app.put('/user/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  var token = getToken(req.headers);
  if (token) {
    User.findById(req.params.id, 'name admin password', (err, user) => {
      if (err) {
        res.status(500).send(err);
      }
      if (user) {
        user.name = req.body.name;
        user.admin = req.body.admin;
        user.email = req.body.email;
        if (req.body.oldPassword && req.body.password === req.body.conPassword) {
          user.comparePassword(req.body.oldPassword, function (err, isMatch) {
            if (isMatch && !err) {
              user.password = req.body.password;

              user.save((err, user) => {
                res.json({
                  success: true,
                  user: user
                });
              })
            } else {
              res.status(401).send({ msg: 'Password mitmatch or missing fields' })
            }
          });
        } else if (req.body.oldPassword) {
          console.log('here');
          res.status(401).send({ msg: 'Password mitmatch or missing fields' })
        } else {
          user.save((err, user) => {
            if (err) {
              res.status(500);
            }
            res.send({ success: true, user: user });
          })
        }
      }
    });
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
});
  
app.listen(process.env.PORT || 8081);
