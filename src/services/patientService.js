import db from "../models/index" 
import emailService from "./emailService"
import { v4 as uuidv4 } from 'uuid';

let buildUrlEmail = (doctorId, token ) => {
  
  let   result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${userId}`
    return result
}

let postBookAppointment = (data) => {
    return new Promise( async(resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.date || !data.timeType || !data.fullName 
                || !data.selectedGender || !data.address
                ) {
                resolve({
                    errcode: 1,
                    errMessage : 'missing parameters'
                })
            } else {
                let token = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'

                await emailService.sendSimpleEmail({
                    reciveEmail: data.email,
                    patientName: data.fullName,
                    time: data.timeString,
                    doctorName: data.doctorName,
                    redirectLink : buildUrlEmail(data.doctorId , token)
                })


                //upsert user
                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: 'R3',
                        gender: data.selectedGender,
                        address: data.address,
                        firstName: data.fullName,
                    },

                });

                // create booking recod
                if (user && user[0]) {
                    await db.booking.findOrCreate({
                        where: { patientId: user[0].id },
                        defaults: {
                            
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId:user[0].id ,
                            date: data.date ,
                            timeType: data.timeType ,
                            token : token
                        }
                        
                    })                  
                }
                resolve({
                    errcode: 0,
                    errMessage : 'save infor patient success'
                
                })
            }
            
        } catch (e) {
             reject(e)
        }
    })
}
let postVerifyBookAppointment = (data) => {
    return new Promise( async(resolve, reject) => {
        try {
            if (!data.token && !data.doctorId ) {
                resolve({
                    errcode: 1,
                    errMessage : 'missing parameters'
                })
            } else {
                let appointment = await db.booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1'
                    },
                    raw : false
                })
                if (appointment) {
                    appointment.statusId = 'S2'
                    await appointment.save()
                    resolve({
                        errcode: 0,
                        errMessage : 'update appointment success'
                    })
                } else {
                    resolve({
                        errcode: 2,
                        errMessage : 'appointment has already been exits'
                    })
                }


            }
             

            
         } catch (e) {
            reject(e)
         }
     })
 }
module.exports = {
    postBookAppointment,
    postVerifyBookAppointment
}