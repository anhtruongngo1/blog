import doctorService from "../services/doctorService"
let getTopDoctorHome =  async(req, res) => {
    let limit = req.query.limit;
    if(!limit) limit = 10;
    try {
        let response =  await doctorService.getTopDoctorHome(+limit)
        return res.status(200).json(response)
        
    } catch (e) {
        console.log(e)
        res.status(200).json({
            error: -1 ,
            message: 'Erorr from sever'

        })
    }
}
let  getAllDoctors = async(req, res) => {
    try {
        let doctors = await doctorService.getAllDoctors() 
        return res.status(200).json(doctors)
    } catch (e) {
        console.log(e)
        return res.status(404).json({
        errCode: -1 ,
        errMessage: 'Erorr'
    })
    }
}
let  getSearchDoctor = async(req, res) => {
    try {
        let doctors = await doctorService.getSearchDoctor(req.query.q , req.query.type) 
        return res.status(200).json(doctors)
    } catch (e) {
        console.log(e)
        return res.status(404).json({
        errCode: -1 ,
        errMessage: 'Erorr'
    })
    }
}
    let postInfoDoctors = async(req, res) => {
        try {
            let response = await doctorService.saveDetailInfoDoctor(req.body)
            return res.status(200).json(response)
            
        } catch (e) {
            console.log(e)
            return res.status(404).json({
            errCode: -1 ,
            errMessage: 'Erorr'
        })
        }
    }
    let getDetailDoctorById = async(req, res) => {
        try {
            let infor = await doctorService.getDetailDoctorById(req.query.id) 
            return res.status(200).json(infor)
            
        } catch (e) {
            console.log(e);
            return res.status(200).json({
                errCode: -1 ,
                errMessage: 'Erorr'
            })
        }
}
let bulkCreateSchedule = async (req, res) => {
        try {
            let infor = await doctorService.bulkCreateSchedule(req.body)
            return res.status(200).json({
                infor
            })
        } catch (e) {
            console.log(e);
            return res.status(200).json({
                errCode: -1 ,
                errMessage: 'Erorr'
            })
        }
}
let getScheduleDoctorByDate = async (req, res) => {
     try {
         let infor = await doctorService.getScheduleByDate(req.query.doctorId, req.query.date);
         console.log(req.query.doctorId, req.query.date);
        return res.status(200).json({
            infor
        })
     } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1 ,
            errMessage: 'Erorr from sever'
        })
     }
}
let getExtraInforDoctorById = async (req, res) => {
     try {
        let infor = await doctorService.getExtraInforDoctorById(req.query.doctorId);
       return res.status(200).json({
           infor
       })
     } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1 ,
            errMessage: 'Erorr from sever'
        })
     }   
}
let getProfileDoctorById = async (req, res) => {
    try {
        let infor = await doctorService.getProfileDoctorById(req.query.doctorId)
        return res.status(200).json({
            infor
        })
          
      } catch (e) {
          console.log(e);
          return res.status(200).json({
              errCode: -1,
              errMessage: 'Erorr from sever'
          })
      }
}
let getListPatientForDoctor = async (req, res) => {
    try {
        let infor = await doctorService.getListPatientForDoctor(req.query.doctorId , req.query.date)
        return res.status(200).json(
            infor
        )
          
      } catch (e) {
          console.log(e);
          return res.status(200).json({
              errCode: -1,
              errMessage: 'Erorr from sever'
          })
      }
}
let sendRemedy = async (req, res) => {
    try {
        let infor = await doctorService.sendRemedy(req.body)
        return res.status(200).json(
            infor
        )
          
      } catch (e) {
          console.log(e);
          return res.status(200).json({
              errCode: -1,
              errMessage: 'Erorr from sever'
          })
      }
    }
module.exports = {
    getTopDoctorHome ,
    getAllDoctors ,
    postInfoDoctors ,
    getDetailDoctorById,
    getSearchDoctor ,
    bulkCreateSchedule,
    getScheduleDoctorByDate,
    getExtraInforDoctorById,
    getProfileDoctorById,
    getListPatientForDoctor,
    sendRemedy
}