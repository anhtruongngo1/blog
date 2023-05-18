import blogService from "../services/blogService"

let postInfoBlog = async(req, res) => {
    try {
        const image = req.file
        let response = await blogService.postInfoBlog(req.body , image)
        return res.status(200).json(response)
        
    } catch (e) {
        console.log(e)
        return res.status(404).json({
        errCode: -1 ,
        errMessage: 'Erorr'
    })
    }
}
let getListBlog= async (req, res) => {
    let {page , size  , q} = req.query;

    if(!page || !size){
    page = 0 ;
    size = 5 ;
    }

    let blog = await blogService.getListBlog(page,size  , q)


    return res.status(200).json({
        errCode: 0 ,
        errMessage : '0' ,
        blog 
    })
}
    let handleDeleteBlog = async (req, res) =>{
    if(!req.query.id){
        return res.status(200).json({
            errCode : 1 ,
            errMessage : 'mising id'
        })
    }
    let message = await blogService.handleDeleteBlog(req.query.id)
    return res.status(200).json(message)
}
let handleBlogDetails = async (req, res) => {
    let id = req.query.id;

    if(!id){
        return res.status(200).json({
            errCode: 1 ,
            errMessage : 'Misiggggggggggggg' ,
            blog : []
        })
    }
    let blog = await blogService.handleBlogDetails(id)


    return res.status(200).json({
        errCode: 0 ,
        errMessage : '0' ,
        blog               
    })
}
let handleEditBlog = async (req, res) =>{
    let data = req.body ;
    let message = await blogService.handleEditBlog(data)
    return res.status(200).json(message)
    }
module.exports = {
    postInfoBlog,
    getListBlog,
    handleDeleteBlog,
    handleBlogDetails,
    handleEditBlog

}