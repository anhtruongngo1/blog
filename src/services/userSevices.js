import db from "../models/index";
import bcrypt from "bcryptjs";
var jwt = require("jsonwebtoken");
const salt = bcrypt.genSaltSync(10);
require("dotenv").config();
let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (e) {
      reject(e);
    }
  });
};
let handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};
      let isExist = await checkUserEmail(email);
      if (isExist) {
        // user all ready exist
        let user = await db.User.findOne({
          attributes: [
            "email",
            "roleId",
            "password",
            "firstName",
            "lastName",
            "id",
          ],
          where: { email: email },
          raw: true,
        });
        if (user) {
          // compare password
          let check = await bcrypt.compareSync(password, user.password);
          if (check) {
            userData.errCode = 0;
            userData.errMessage = "Oke";
            delete user.password;
            userData.user = user;
            userData.accessToken = jwt.sign(
              {
                id: user.id,
                roleId: user.roleId,
              },
              process.env.JWT_ACCESS_KEY,
              { expiresIn: "30d" }
            );
            userData.refreshToken = jwt.sign(
              {
                id: user.id,
                roleId: user.roleId,
              },
              process.env.JWT_REFRESH_KEY,
              { expiresIn: "365d" }
            );
          } else {
            userData.errCode = 3;
            userData.errMessage = "wrong password";
          }
        } else {
          userData.errCode = 2;
          userData.errMessage = `User not found`;
        }
      } else {
        userData.errCode = 1;
        userData.errMessage = `Your Email isn't exist please enter your email!`;
      }
      resolve(userData);
    } catch (error) {
      reject(error);
    }
  });
};

let checkUserEmail = (userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { email: userEmail },
      });
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (error) {
      reject(error);
    }
  });
};

let handleGetUserDetails = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = "";
      if (userId === "All") {
        users = await db.User.findAll({
          attributes: {
            exclude: ["password", "image"],
          },
        });
      }
      if (userId && userId !== "All") {
        users = await db.User.findOne({
          where: { id: userId },
        });
      }
      // if (users && users.length > 0) {
      //   users.map(item => {
      //       item.image = Buffer.from(item.image , 'base64').toString('binary');
      //       return item
      //   })

      //}
      resolve(users);
    } catch (error) {
      reject(error);
    }
  });
};
let getAllUsers = (page, size) => {
  return new Promise(async (resolve, reject) => {
    try {
      const pageAsNumber = Number.parseInt(page);
      const sizeAsNumber = Number.parseInt(size);

      // let page = 0 ;
      if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
        page = pageAsNumber;
      }
      //let size = 10 ;
      if (
        !Number.isNaN(sizeAsNumber) &&
        sizeAsNumber > 0 &&
        sizeAsNumber < 10
      ) {
        size = sizeAsNumber;
      }

      const users = await db.User.findAndCountAll({
        attributes: {
          exclude: ["password"],
        },
        include: [{ model: db.Allcode, as: "positionData" , attributes: ["valueEn" , "valueVi"]},
        { model: db.Allcode, as: "roleData" , attributes: ["valueEn" , "valueVi"]}
      ],
        raw: true,
        nest: true,

        limit: size,
        offset: page * size,
      });
      if (users && users.length > 0) {
        users.map(item => {
            item.image =   Buffer.from(item.image , 'base64').toString('binary');  
            return item
        })
        
    }
      resolve({
        data: users.rows,
        totalPages: Math.ceil(users.count / size),
      });
    } catch (error) {
      reject(error);
    }
  });
};
let createNewUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let check = await checkUserEmail(data.email);
      if (check === true) {
        resolve({
          errCode: 1,
          errMessage: "email is already in use",
        });
      } else {
        let hashPasswordFromBcrypt = await hashUserPassword(data.password);
        await db.User.create({
          email: data.email,
          password: hashPasswordFromBcrypt,
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          phoneNumber: data.phoneNumber,
          gender: data.gender,
          roleId: data.roleId,
          positionId: data.positionId,
          image: data.image,
        });
        resolve({
          errCode: 0,
          errMessage: "ok",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let deleteUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: userId },
      });
      if (!user) {
        resolve({
          errCode: 2,
          errMessage: "the isnt exits",
        });
      }
      await db.User.destroy({
        where: { id: userId },
      });
      resolve({
        errCode: 0,
        errMessage: "the user id delete",
      });
    } catch (error) {
      reject(error);
    }
  });
};
let updateUserData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        resolve({
          errCode: 2,
          errMessage: "missing required param",
        });
      }
      let user = await db.User.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (user) {
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;
        user.phonenumber = data.phoneNumber;
        user.gender = data.gender;
        user.roleId = data.roleId;
        user.positionId = data.positionId;
        user.image = data.avatar;

        await user.save();
        resolve({
          errCode: 0,
          errMessage: "update is success",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "do not is found",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let getAllCodeService = (typeInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!typeInput) {
        resolve({
          errCode: 1,
          errMessage: "missing param type",
        });
      } else {
        let res = {};
        let allCode = await db.Allcode.findAll({
          where: { type: typeInput },
        });
        res.errCode = 0;
        res.data = allCode;
        resolve(res);
      }
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  handleUserLogin,
  handleGetUserDetails,
  getAllUsers,
  createNewUser,
  deleteUser,
  updateUserData,
  getAllCodeService,
};
