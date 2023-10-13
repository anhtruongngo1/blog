"use strict";

var jwt = require('jsonwebtoken');
var verify = function verify(req, res, next) {
  var token = req.headers.token;
  if (token) {
    var accessToken = token.split(" ")[1];
    jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, function (err, user) {
      if (err) {
        return res.status(403).json("token is not valid");
      }
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("you're not  authenticated");
  }
};
var verifyTokenAndAdminAuth = function verifyTokenAndAdminAuth(req, res, next) {
  var token = req.headers.Authorization;
  console.log('token', token);
  ;
  if (token) {
    var accessToken = token.split(" ")[1];
    jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, function (err, user) {
      if (err) {
        return res.status(403).json({
          errCode: 1,
          errMessage: " token is not valid"
        });
      }
      req.user = user;
      console.log('chekc role', req.user.roleId);
      if (req.user.roleId === "R1") {
        // 
        next();
      } else {
        return res.status(403).json({
          errCode: 2,
          errMessage: "you are not loggin "
        });
      }
    });
  } else {
    return res.status(401).json("you're not  authenticated");
  }
};
var verifyTokenUser = function verifyTokenUser(req, res, next) {
  var token = req.headers.Authorization;
  console.log('checktoken', token);
  if (token) {
    var accessToken = token.split(" ")[1];
    jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, function (err, user) {
      if (err) {
        return res.status(403).json({
          errCode: 1,
          errMessage: " token is not valid"
        });
      }
      req.user = user;
      if (req.user.id == req.body.id || req.user.roleId === "R1") {
        // 
        next();
      } else {
        return res.status(403).json({
          errCode: 2,
          errMessage: "you are not allowed "
        });
      }
    });
  } else {
    return res.status(401).json("you're not  authenticated");
  }
};
module.exports = {
  verify: verify,
  verifyTokenAndAdminAuth: verifyTokenAndAdminAuth,
  verifyTokenUser: verifyTokenUser
};