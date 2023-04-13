import db from "../models/index" 

let createClinic = (data) => {
    return new Promise( async(resolve, reject) => {
        try {       
            if (!data.name || !data.address ||!data.avatar || !data.descriptionMarkdown || !data.descriptionHTML ){
                resolve({
                    errcode: 1,
                    errMessage : 'missing parameters'
                })
            } else {
                await db.clinic.create({
                    name: data.name,
                    address: data.address ,
                    image: data.avatar,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown : data.descriptionMarkdown
                })
                resolve({
                    errcode: 0,
                    errMessage : 'ok'
                })
            }
        } catch (e) {
            reject(e)
        }
        
    })
} 
let getAllClinic = () => {
    return new Promise(async(resolve, reject) => {
        try {
            let data = await db.clinic.findAll();
            if (data && data.length > 0) {
                data.map(item => {
                    item.image =   Buffer.from(item.image , 'base64').toString('binary');  
                    return item
                })
                
            }
            resolve({
                errcode: 0,
                errMessage: 'ok',
                data
            })
            
          } catch (e) {
            reject(e)
          }
      })
}
let getDetailClinicById = (inputId ) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId ) {
                resolve({
                    errcode: 1,
                    errMessage: 'missing parameters'
                })
            } else {
                                  
                   let  data = await db.clinic.findOne({
                       where: {
                           id: inputId
                       },
                       attributes: ['name','address','descriptionHTML', 'descriptionMarkdown'],
         
   
                    })
                if (data) { 
                    let doctorClinic = []
                    doctorClinic = await db.doctor_infor.findAll({ 
                                 where: {
                                     clinicId: inputId,
                                 },
                                 attributes: ['doctorId' , 'provinceId'],

                               
                             })
                        
                    
                    data.doctorClinic = doctorClinic
                      
                        
                    }
                    else {
                        data = {}
                    }
                    resolve({
                        errcode: 0,
                        errMessage: 'ok',
                        data
                    })             
             
            }
            
          } catch (e) {
            reject(e)
          }
      })
  }

module.exports = {
    createClinic,
    getAllClinic,
    getDetailClinicById
}