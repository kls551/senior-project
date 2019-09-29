// var mongoose = require('mongoose');
var passport = require('passport');
var settings = require('../config/settings');
require('../config/passport')(passport);
// var express = require('express');
var jwt = require('jsonwebtoken');
// var router = express.Router();
// var User = require("../models/user");

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

const mongodb_conn_module = require('./mongodbConnModule');
var db = mongodb_conn_module.connect();

var Item = require('../models/item');
var User = require('../models/user');
var Order = require('../models/order');

app.get('/items', (req, res) => {
  Item.find({}, 'name description brand attr busAttr', function(error, items) {
    if (error) {
      console.error(error);
    }
    res.send({
      items: items
    });
  }).sort({ _id: -1 });
});

app.get('/orders', (req, res) => {
  Order.find({}, 'orderDate totalAmount items note', function(error, items) {
    if (error) {
      console.error(error);
    }
    res.send({
      items: items
    });
  }).sort({ _id: -1 });
});

app.post('/add_item', (req, res) => {
  var db = req.db;
  var name = req.body.name;
  var description = req.body.description;

  var attr = false,
    quan = false;

  if (req.body.weight) {
    // weight: Number, type: String, price: Number
    attr = true;
  }
  if (req.body.quantity) {
    quan = true;
  }

  var new_item = new Item({
    name: name,
    description: description,
    brand: req.body.brand
  });

  var exist = Item.findOne({ brand: req.body.brand }, (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result) {
      new_item = result;
    }
    if (attr) {
      new_item.attr.push({
        weight: req.body.weight,
        type: req.body.type,
        price: req.body.price
      });
    }
    if (quan) {
      new_item.busAttr.push({
        quantity: req.body.quantity
      });
    }
    new_item.save(function(error) {
      if (error) {
        console.log(error);
      }
      res.send({
        success: true
      });
    });
  });
});

app.put('/items/:id', (req, res) => {
  var db = req.db;
  Item.findById(req.params.id, 'name description weight', function(
    error,
    item
  ) {
    if (error) {
      console.error(error);
    }

    item.name = req.body.name;
    item.description = req.body.description;
    item.weight = req.body.weight;
    item.save(function(error) {
      if (error) {
        console.log(error);
      }
      res.send({
        success: true
      });
    });
  });
});

app.delete('/items/:id', (req, res) => {
  Item.remove(
    {
      _id: req.params.id
    },
    function(err, item) {
      if (err) res.send(err);
      res.send({
        success: true
      });
    }
  );
});

app.get('/item/:id', (req, res) => {
  var db = req.db;
  Item.findById(req.params.id, 'name description brand', function(error, item) {
    if (error) {
      console.error(error);
    }
    res.send(item);
  });
});

app.post('/login', function(req, res) {
  User.findOne(
    {
      name: req.body.username
    },
    function(err, user) {
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
            res.json({ success: true, token: 'JWT ' + token });
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

app.post('/register', function(req, res) {
  if (!req.body.username || !req.body.password) {
    res.json({ success: false, msg: 'Please pass username and password.' });
  } else {
    var newUser = new User({
      name: req.body.username,
      email: 'hello@gmail.com',
      password: req.body.password,
      admin: false
    });
    // save the user
    newUser.save(function(err) {
      if (err) {
        res.send({ success: false, msg: 'Username already exists.' });
      }
      res.send({ success: true, msg: 'Successful created new user.' });
    });
  }
});

app.post('/order', function(req, res) {
  if (!req.body.totalAmount || !req.body.items) {
    res.json({ success: false, msg: 'Please pass items and totalAmount.' });
  } else {
    var newOrder = new Order({
      totalAmount: req.body.totalAmount,
      items: req.body.items,
      note: req.body.note
    });
    // save the user
    newOrder.save(function(err) {
      if (err) {
        res.send({ success: false, msg: "Can't post..err!" });
      }
      res.send({ success: true, msg: 'Successful created new order.' });
    });
  }
});

app.post('/users', (req, res) => {
  var name = req.body.name;
  var password = req.body.password;

  var new_user = new User({
    name: name,
    password: password,
    admin: req.body.admin
  });

  var exist = User.findOne({ name: name }, (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result) {
      new_user = result;
    }
    new_user.save(function(error) {
      if (error) {
        console.log(error);
      }
      res.send({
        success: true
      });
    });
  });
});

app.delete('/users/:id', (req, res) => {
  User.remove(
    {
      _id: req.params.id
    },
    function(err, item) {
      if (err) res.send(err);
      res.send({
        success: true
      });
    }
  );
});

app.get('/users', (req, res) => {
  User.find({}, 'name password admin', function(error, users) {
    if (error) {
      console.error(error);
    }
    res.send({
      users: users
    });
  }).sort({ _id: -1 });
});

app.listen(process.env.PORT || 8081);
