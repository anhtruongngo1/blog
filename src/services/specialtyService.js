import db from "../models/index" 

let createSpecialty = (data) => {
    return new Promise( async(resolve, reject) => {
        try {       
            if (!data.name || !data.avatar || !data.descriptionMarkdown || !data.descriptionHTML
            ) {
                resolve({
                    errCode: 1,
                    errMessage : 'missing parameters'
                })
            } else {
                await db.specialty.create({
                    name : data.name,
                    image: data.avatar,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown : data.descriptionMarkdown
                })
                resolve({
                    errCode: 0,
                    errMessage : 'ok'
                })
            }
        } catch (e) {
            reject(e)
        }
        
    })
} 
let getAllSpecialty = () => {
    return new Promise(async(resolve, reject) => {
        try {
            let data = await db.specialty.findAll();
            if (data && data.length > 0) {
                data.map(item => {
                    item.image =   Buffer.from(item.image , 'base64').toString('binary');  
                    return item
                })
                
            }
            resolve({
                errCode: 0,
                errMessage: 'ok',
                data
            })
            
          } catch (e) {
            reject(e)
          }
      })
}
let getDetailSpecialtyById = (inputId , location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId || !location) {
                resolve({
                    errCode: 1,
                    errMessage: 'missing parameters'
                })
            } else {
                                  
                   let  data = await db.specialty.findOne({
                       where: {
                           id: inputId
                       },
                       attributes: ['descriptionHTML', 'descriptionMarkdown'],
                    //   include: [
                    //         {
                    //             model: db.doctor_infor , as : 'specialtyData' ,
                    //             attributes: ['doctorId' , 'provinceId'],
                    //         },
                    //     ],
                    //     raw : false ,
                    //      nest: true
   
                    })
                if (data) { 
                    let doctorSpecialty = []
                        if (location === 'ALL') {
                             doctorSpecialty = await db.doctor_infor.findAll({ 
                                 where: {
                                     specialtyId: inputId,
                                 },
                                 attributes: ['doctorId' , 'provinceId'],

                               
                             })
                        } else {
                             doctorSpecialty = await db.doctor_infor.findAll({ 
                                where: {
                                    specialtyId: inputId,
                                    provinceId: location
                                },
                                attributes: ['doctorId' , 'provinceId'],

                               
                            })
                    }
                    data.doctorSpecialty = doctorSpecialty
                      
                        
                    }
                    else {
                        data = {}
                    }
                    resolve({
                        errCode: 0,
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
    createSpecialty,
    getAllSpecialty,
    getDetailSpecialtyById
}