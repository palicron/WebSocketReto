var express = require("express");
var fs = require("fs");
const Mensajes = require("../Mensajes");
var router = express.Router();
const ws = require("../wslib");
const Joi = require("joi");
const val = Joi.object().keys({
  message: Joi.string().min(5).required(),
  author: Joi.string().required(),
  ts: Joi.number().integer().required(),
});

//ruta api
router.get("/", function (req, res, next) {
  res.send("api");
});
//get all mensajes
router.get("/messages", function (req, res) {
  Mensajes.findAll().then((result) => {
    res.send(JSON.stringify(result));
  });
});
//Get  mesajes con id
router.get("/messages/:mesageid", function (req, res) {
  Mensajes.findAll().then((result) => {
    if (result == null) {
      res.send("Mensaje no existe");
    } else {
      var message = "";
      for (let i = 0; i < result.length; i++) {
        if (result[i].ts == req.params.mesageid) {
          message = result[i];
          break;
        }
      }
      res.send(message);
    }
  });
});

// create new mensaje
router.post("/messages", function (req, res) {
  var gg = val.validate(req.body);
  if (gg.error) {
    res.send(gg.error);
  } else {
    var jj = req.body;
    Mensajes.create({
      message: jj.message,
      author: jj.author,
      ts: jj.ts,
    }).then((result) => {
      res.send(result);
      ws.refreshArray();
      s;
    });
  }
});

//update mensaje
router.put("/messages/", function (req, res) {
  var update = req.body;
  var gg = val.validate(req.body);
  if (gg.error) {
    res.send("Formato malo");
  } else {
    Mensajes.update(req.body, {
      where: { ts: req.body.ts },
    }).then((response) => {
      if (response[0] !== 0) {
        res.send("Mesaje Update");
        ws.refreshArray();
      } else {
        res.send("No existe el mensaje");
      }
    });
  }
});

//delete mesaje
router.delete("/messages/:mesageid", function (req, res) {
  Mensajes.findAll().then((result) => {
    if (result == null) {
      res.send("Mensaje no existe");
    } else {
      var f = false;
      for (let i = 0; i < result.length; i++) {
        console.log(i);
        if (result[i].ts == req.params.mesageid) {
          result[i].destroy();
          f = true;
          break;
        }
      }
      if (f) {
        res.send("Eliminado");
        ws.refreshArray();
      } else {
        res.send("No existe el mensaje");
      }
    }
  });
});

module.exports = router;
