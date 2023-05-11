import db from "../models/index";
import { Op } from "sequelize";

let postInfoBlog = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.title || !data.content || !data.thumb || !data.userId || !data.topic) {
        resolve({
          errCode: 1,
          errMessage: "missing data",
        });
      }
      else {
        let blog = await db.Blog.create({
          userId: data.userId,
          title: data.title,
          content: data.content,
          thumb: data.thumb,
          topic : data.topic
        });
        resolve({
          errCode: 0,
          errMessage: "Create a blog success",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let getListBlog = (page, size, q) => {
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
      if (q) {
        const blog = await db.Blog.findAndCountAll({
          where: {
            [Op.or]: [{ title: { [Op.like]: "%" + q + "%" } }],
          },
          include: [
            {
              model: db.User,
              attributes: ["image", "firstName", "lastName" ],
            },
          ],
          raw: true,
          nest: true,

          limit: size,
          offset: page * size,
          order: [["createdAt", "DESC"]],
        });
        if (blog) {
          blog.rows.map((item) => {
            item.thumb = Buffer.from(item.thumb, "base64").toString("binary");
            item.User.image = Buffer.from(item.User.image, "base64").toString(
              "binary"
            );
            return item;
          });
        }
        resolve({
          data: blog.rows,
          totalPages: Math.ceil(blog.count / size),
        });
      } else {
        const blog = await db.Blog.findAndCountAll({
          attributes: ["createdAt", "title", "content", "thumb" , "id"],
          include: [
            {
              model: db.User,
              attributes: ["image", "firstName", "lastName"],
            },
          ],
          raw: true,
          nest: true,

          limit: size,
          offset: page * size,
          order: [["createdAt", "DESC"]],
        });
        if (blog) {
          blog.rows.map((item) => {
            item.thumb = Buffer.from(item.thumb, "base64").toString("binary");
            item.User.image = Buffer.from(item.User.image, "base64").toString(
              "binary"
            );
            return item;
          });
        }
        resolve({
          data: blog.rows,
          totalPages: Math.ceil(blog.count / size),
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let handleDeleteBlog = (blogId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let blog = await db.Blog.findOne({
        where: { id: blogId },
      });
      if (!blog) {
        resolve({
          errCode: 2,
          errMessage: "the isnt exits",
        });
      }
      await db.Blog.destroy({
        where: { id: blogId },
      });
      resolve({
        errCode: 0,
        errMessage: "the blog id delete",
      });
    } catch (error) {
      reject(error);
    }
  });
};
let handleBlogDetails = (blogId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const blog = await db.Blog.findOne({
        where: { id: blogId },
      });
      // if (blogs && blogs.length > 0) {
      //   blogs.map(item => {
      //       item.image = Buffer.from(item.image , 'base64').toString('binary');
      //       return item
      //   })

      //}
      if (blog) {
        blog.thumb = Buffer.from(blog.thumb , 'base64').toString('binary');
      }
      resolve(blog);
    } catch (error) {
      reject(error);
    }
  });
};
let handleEditBlog = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        resolve({
          errCode: 2,
          errMessage: "missing required param",
        });
      }
      let blog = await db.Blog.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (blog) {
        blog.title = data.title,
        blog.content = data.content,
        blog.thumb = data.thumb
 

        await blog.save();
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
module.exports = {
  postInfoBlog,
  getListBlog,
  handleDeleteBlog,
  handleBlogDetails,
  handleEditBlog
};
