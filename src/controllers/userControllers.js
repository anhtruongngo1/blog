import userSevices from '../services/userSevices'


let refreshtokenData = [];

let  handleLogin = async(req, res) => {

    let email = req.body.email
    let password = req.body.password
    console.log('check' , req.body);


    // check email exist
    if(!email|| !password) {
        return res.status(500).json({
            errcode: '1' ,
            message: 'missing inputs  parameter'
        })
    }
    let userData = await userSevices.handleUserLogin(email, password);
    refreshtokenData.push( userData.refreshToken)
    return res.status(200).json({
        errcode: userData.errCode ,
        errMessage:  userData.errMessage  ,
        user : userData.user ? userData.user : {} ,
        accessToken : userData.accessToken,
      
    })
}
let handleGetUserDetails = async (req, res) => {
        let id = req.query.id;

        if(!id){
            return res.status(200).json({
                errcode: 1 ,
                errMessage : 'Misiggggggggggggg' ,
                users : []
            })
        }
        let users = await userSevices.handleGetUserDetails(id)


        return res.status(200).json({
            errcode: 0 ,
            errMessage : '0' ,
            users
        })
}
let handleGetAllUsers= async (req, res) => {
    let {page , size} = req.query;

    if(!page || !size){
    page = 0 ;
    size = 5 ;
    }
    let users = await userSevices.getAllUsers(page,size)


    return res.status(200).json({
        errcode: 0 ,
        errMessage : '0' ,
        users 
    })
}
let handleCreateNewUser = async  (req, res) => {
     let isValid = req.body
     if(isValid && isValid!== undefined) {
         let message = await userSevices.createNewUser(req.body)
         return res.status(200).json(message)

     }
    }
let handleEditUser = async (req, res) =>{
    let data = req.body ;
    let message = await userSevices.updateUserData(data)
    return res.status(200).json(message)
    }
let handleDeleteUser = async (req, res) =>{
    if(!req.body.id){
        return res.status(200).json({
            errcode : 1 ,
            errMessage : 'mising id'
        })
    }
    let message = await userSevices.deleteUser(req.body.id)
    return res.status(200).json(message)
    }
    let getAllCode = async (req, res) => {
        try {
        //    setTimeout( async() =>{
                let data = await userSevices.getAllCodeService(req.query.type) ;
                return res.status(200).json(data)  
          //  }, 5000)
          
        } catch (e) {
            console.log('getallcode err',e)
            return res.status(200).json({
                errcode : -1 ,
                errMessage: 'eror from sever'
            })
        }
    }
module.exports = {
    handleLogin ,
    handleGetUserDetails ,
    handleGetAllUsers ,
    handleCreateNewUser ,
    handleEditUser ,
    handleDeleteUser ,
    getAllCode

}