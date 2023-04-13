import patientService from '../services/patientService'

let postBookAppointment = async (req, res) => {
    try {
        let infor = await patientService.postBookAppointment(req.body)
        return res.status(200).json({
            infor
        })
        
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errcode: -1,
            errMessage: 'Erorr from sever'
        })
        
    }

}
let postVerifyBookAppointment = async (req, res) => {
    try {
        let infor = await patientService.postVerifyBookAppointment(req.body)
        return res.status(200).json({
            infor
        })
        
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errcode: -1,
            errMessage: 'Erorr from sever'
        })
        
    }
 }
module.exports = {
    postBookAppointment: postBookAppointment,
    postVerifyBookAppointment
}