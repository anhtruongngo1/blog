import db from "../models/index" 
require('dotenv').config();
import _ from 'lodash';
import emailService from '../services/emailService'
let getTopDoctorHome = (limitInput) => {
    return new Promise(async(resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limitInput ,
                where: {roleId :'R2'},
                order: [["createdAt" , "DESC"]] ,
                attributes: {
                    exclude:['password']
                } ,
                include:[
                    {model : db.Allcode, as:'positionData', attributes:['valueEn' , 'valueVi'] },
                    {model : db.Allcode, as:'genderData', attributes:['valueEn' , 'valueVi'] },
                    ],
             raw : true ,
             nest: true

            })

            resolve({
                errCode : 0,
                data : users
            })

        } catch (e) {
            reject(e)
        }

    })
}
 let getAllDoctors = () => {
     return new Promise(async (resolve, reject) => {
         try {
             let doctors = await db.User.findAll({
                 where :{roleId: 'R2'} ,
                 attributes: {
                    exclude:['password','image']
                } ,
             })
             resolve({
                 errCode : 0 ,
                 data: doctors
             })
         } catch (e) {
             reject(e)
         }
     })
}
 let saveDetailInfoDoctor =(inputData) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (!inputData.doctorId || !inputData.contentHTML
                     || !inputData.action || !inputData.selectedPrice || !inputData.specialtyId
                    || !inputData.selectedPayment || !inputData.selectedProvince || !inputData.nameClinic
                    || !inputData.addressClinic || !inputData.note|| !inputData.clinicId
                ) {
                  resolve({
                    errcode:1,
                    errMessage: 'missing parameter ' 
                  })
                } else {


                    // update to markdown
                    if (inputData.action ==='ADD') {
                        
                        await db.Markdown.create({
                            contentHTML: inputData.contentHTML,
                            contentMarkdowmn: inputData.contentMarkdown,
                            description: inputData.description,
                            doctorId: inputData.doctorId ,                      
                        })                  
                    } else if (inputData.action === 'EDIT') {
                        let doctorMarkdown = await db.Markdown.findOne({
                            where: { doctorId: inputData.doctorId },
                            raw : false
                        })
                        if (doctorMarkdown) {
                            doctorMarkdown.contentHTML = inputData.contentHTML;
                            doctorMarkdown.contentMarkdowmn = inputData.contentMarkdown;
                            doctorMarkdown.description = inputData.description;
                            doctorMarkdown.doctorId = inputData.doctorId;
                            doctorMarkdown.updatedAt = new Date()

                            await doctorMarkdown.save()
                        }                     
                    }

                    // upsert to info table

                    let doctorInfor = await db.doctor_infor.findOne({
                        where: {
                            doctorId: inputData.doctorId,
                        },
                        raw : false
                    })
                    if (doctorInfor) {
                        //update
                        doctorInfor.priceId = inputData.selectedPrice,
                        doctorInfor.provinceId = inputData.selectedProvince,
                        doctorInfor.paymentId = inputData.selectedPayment,
                        doctorInfor.addressClinic = inputData.addressClinic, 
                        doctorInfor.nameClinic = inputData.nameClinic,
                        doctorInfor.note = inputData.note,
                        doctorInfor.specialtyId = inputData.specialtyId,
                        doctorInfor.clinicId = inputData.clinicId
                            
                        await doctorInfor.save()
                        resolve({
                            errcode: 0 ,
                            errMessage :'update info success'
                        })
                               
                            
                        
                            
                    } else {
                        // create
                        await db.doctor_infor.create({
                            doctorId: inputData.doctorId,
                            priceId : inputData.selectedPrice,
                            provinceId : inputData.selectedProvince,
                            paymentId : inputData.selectedPayment,
                            addressClinic : inputData.addressClinic, 
                            nameClinic : inputData.nameClinic,
                            note: inputData.note,
                            specialtyId: inputData.specialtyId,
                            clinicId : inputData.clinic
                        })
                        resolve({
                            errcode: 0 ,
                            errMessage :'Save info success'
                        })
                    }
                 
                }

            } catch (error) {
                reject(error)
            }
        })
    }
    let getDetailDoctorById = (inputId) => {
        return new Promise(async(resolve, reject) =>{
            try {
                if(!inputId){
                    resolve({
                        errcode:1,
                        errMessage: 'missing parameter id'
                    })
                } else{
                    let data = await db.User.findOne({
                        where :{
                            id : inputId
                        } ,
                        attributes: {
                            exclude:['password' ,]
                        } ,
                        include:[
                            {model : db.Markdown,
                                 attributes:['description' , 'contentHTML' ,'contentMarkdowmn'],
                            },
                            { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                            {model : db.doctor_infor,
                                attributes: {
                                    exclude:['id' ,'doctorId']
                                },
                                include:[
                                    { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi'] },
                                    { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi'] },
                                    { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi'] },
                                    { model: db.specialty, as: 'specialtyData', attributes: ['name'] }
                                ]

                           }
                            ],
                     raw : false ,
                     nest: true
                    })
                    if(data && data.image ) {
                       data.image =  Buffer.from(data.image , 'base64').toString('binary');        
                    }
            

                    resolve({
                        errcode : 0 ,
                        data : data
                    })
                }

            } catch (e) {
                reject(e)
            }
        })
}

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;
let bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.doctorId || !data.date) {
                resolve({
                    errcode: 1,
                    errMessage: 'missing parameter required '
                })
            } else {
                let schedule = data.arrSchedule;
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    })
                }
                // get all exis
                let existing = await db.schedule.findAll(
                    {
                        where: { doctorId: data.doctorId, date: data.date },
                        attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                        raw: true
                    }
                );
                // create data
                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date;
                    
                })
                if (toCreate && toCreate.length > 0) {
                    await db.schedule.bulkCreate(toCreate)
                    
                }
                resolve({
                    errcode: 0,
                    errMessage: 'OK'
                })

            }
            } catch (e) {
                reject(e)
            }
        })
}
let getScheduleByDate =  (id , dateInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id || !dateInput) {
                resolve({
                    errcode: -1,
                    errMessage: 'missing parameter'
                })
            } else {
                let dataSchedule = await db.schedule.findAll({ 
                    where: {
                        doctorId: id,
                        date: dateInput
                    },
                    include:[
                        {model : db.Allcode, as:'timeTypeData' ,
                        attributes:['valueEn' , 'valueVi']
                        },
                        {model : db.User, as:'doctorData' ,
                        attributes:['firstName' , 'lastName']
                        }
                        ],
                 raw : false ,
                 nest: true
                })
                if(!dataSchedule) dataSchedule = [];
                
                resolve({
                    errcode: 0,
                    data : dataSchedule
                })

            }

        } catch (e) {
            reject(e)
        }
     })
}
let getExtraInforDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errcode: 1,
                    errMessage: 'missing parameter id'
                 })
            } else {
                let data = await db.doctor_infor.findOne({
                    where: { doctorId: inputId },
                    raw: false,
                    nest : true ,
                    attributes: {
                        exclude:['id' ,'doctorId']
                    },
                    include:[
                        { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi'] }
                    ]

               
                    
                })
                if (!data) data = {};
                resolve({
                    errcode: 0,
                    data: data
                })
                
             }
             
         } catch (e) {
             reject(e)
         }
     })
}
let getProfileDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
         try {
             if (!inputId) {
                 resolve({
                     errcode: 1,
                     errMessage :'missing parameter id'
                 })
             } else {
                let data = await db.User.findOne({
                    where: { id: inputId },
                    raw: false,
                    nest : true ,
                    attributes: {
                        exclude:['password']
                    },
                    include: [
                        {model : db.Markdown,
                            attributes:['description'],
                       },
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        {model : db.doctor_infor,
                            attributes: {
                                exclude:['id' ,'doctorId']
                            },
                            include:[
                                { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi'] }
                            ]

                       }
                        ]

               
                    
                })
                if(data && data.image ) {
                    data.image =  Buffer.from(data.image , 'base64').toString('binary');        
                 }
                if (!data) data = {};
                resolve({
                    errcode: 0,
                    data: data
                })
                 
             }
         } catch (e) {
             reject(e)
         }
     })
}
 
let getListPatientForDoctor = (doctorId , date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errcode: 1,
                    errMessage :'missing parameter id'
                })
            } else {
                let data = await db.booking.findAll({
                    where: {
                        statusId: 'S2',
                        doctorId: doctorId,
                        date: date
                    },
                    include: [
                        {
                            model: db.User, as: 'patientData',
                            attributes: ['email', 'firstName', 'address', 'gender'],
                            include: [
                                { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                            ]
                        },
                        { model: db.Allcode, as: 'timeTypeDataPatient', attributes: ['valueEn', 'valueVi'] },
                    ],
                    raw: false,
                    nest : true

                })


                resolve({
                    errcode: 0,
                    data: data
                })
                
            }

            
            
        } catch (e) {
            reject(e)
        }
    })
}
let sendRemedy = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.patientId || !data.timeType) {
                resolve({
                    errcode: 1,
                    errMessage: 'missing parameter id'
                })

            } else {
                //update patient status
                let appointment = await db.booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        patientId: data.patientId,
                        timeType: data.timeType,
                        statusId: 'S2'
                    },
                    raw : false
                })
                if (appointment) {
                    appointment.statusId = 'S3'
                    await appointment.save()
                }

                // send email remedy
                    await emailService.sendAttachment(data)

                resolve({
                    errcode: 0,
                    errMessage: 'OKE'
                })
                
            }
        } catch (e) {
            reject(e)
            
        }
    })
}
    

module.exports = {
    getTopDoctorHome : getTopDoctorHome ,
    getAllDoctors : getAllDoctors ,
    saveDetailInfoDoctor ,
    getDetailDoctorById,
    bulkCreateSchedule,
    getScheduleByDate,
    getExtraInforDoctorById,
    getProfileDoctorById,
    getListPatientForDoctor,
    sendRemedy
    
}