import express from "express";
import homeController from "../controllers/homeControllers";
import userController from "../controllers/userControllers";
import doctorController from "../controllers/doctorControllers";
import patienControllers from "../controllers/patienControllers";
import specialtyControllers from "../controllers/specialyControllers";
import clinicControllers from "../controllers/clinicControllers" ;
import middlewareController from '../controllers/middlewareController';


const router = express.Router();

const initWebRoutes = (app) => {
  router.get("/", homeController.getHomePage);
  router.get("/crud", homeController.getCRUD);

  router.post("/post-crud", homeController.postCRUD);
  router.get("/get-crud", homeController.displayGetCRUD);
  router.get("/edit-crud", homeController.getEditCRUD);
  router.post("/put-crud", homeController.putCRUD);
  router.get("/delete-crud", homeController.deleteCRUD);

  // API
  router.post('/api/login' ,userController.handleLogin);
  router.get('/api/get-user-detail' ,userController.handleGetUserDetails);
  router.get('/api/get-all-users' ,userController.handleGetAllUsers);
  router.post('/api/create-new-user' ,userController.handleCreateNewUser);
  router.put('/api/edit-user' ,userController.handleEditUser);
  router.delete('/api/delete-user' ,userController.handleDeleteUser);
  router.get('/api/allcode' ,userController.getAllCode ) ;

  // API GET  doctor top
  router.get('/api/top-doctor-home' ,doctorController.getTopDoctorHome );
  // GET all doctor 
  router.get('/api/get-all-doctors',doctorController.getAllDoctors );
  // post all doctor inform
  router.post('/api/save-info-doctors' ,doctorController.postInfoDoctors );
  // get all doctor inform
  router.get('/api/get-detail-doctor-by-id', doctorController.getDetailDoctorById);
  // day info date schedule doctor
  router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule);
  // get date 
  router.get('/api/get-schedule-doctor-by-date', doctorController.getScheduleDoctorByDate);
  // get price doctor
  router.get('/api/get-extra-infor-doctor-by-id', doctorController.getExtraInforDoctorById);
  // get profile doctor
  router.get('/api/get-profile-doctor-by-id', doctorController.getProfileDoctorById);
  // get info patien booking
  router.post('/api/patient-book-appointment', patienControllers.postBookAppointment); 
  // verify book 
  router.post('/api/verify-book-appointment', patienControllers.postVerifyBookAppointment); 
  // create new special
  router.post('/api/create-new-specialty', specialtyControllers.createSpecialty); 
  // get specialty
  router.get('/api/get-all-specialty', specialtyControllers.getAllSpecialty); 
  // get infor doctor specialty
  router.get('/api/get-detail-specialty-by-id', specialtyControllers.getDetailSpecialtyById); 
    // create new clinic
  router.post('/api/create-new-clinic', clinicControllers.createClinic);
    // get clinic
  router.get('/api/get-all-clinic', clinicControllers.getAllClinic); 
   // get infor doctor clinic
  router.get('/api/get-detail-clinic-by-id', clinicControllers.getDetailClinicById); 
  
  // get all list patient  for doctor 
   // get infor doctor clinic
  router.get('/api/get-list-patient-for-doctor', doctorController.getListPatientForDoctor); 
  
  // send remedy
  router.post('/api/send-remedy', doctorController.sendRemedy);




  

  return app.use("/", router);
};

export default initWebRoutes;
