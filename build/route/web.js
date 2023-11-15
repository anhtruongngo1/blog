"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _homeControllers = _interopRequireDefault(require("../controllers/homeControllers"));
var _userControllers = _interopRequireDefault(require("../controllers/userControllers"));
var _doctorControllers = _interopRequireDefault(require("../controllers/doctorControllers"));
var _patienControllers = _interopRequireDefault(require("../controllers/patienControllers"));
var _specialyControllers = _interopRequireDefault(require("../controllers/specialyControllers"));
var _clinicControllers = _interopRequireDefault(require("../controllers/clinicControllers"));
var _middlewareController = _interopRequireDefault(require("../controllers/middlewareController"));
var _blogControllers = _interopRequireDefault(require("../controllers/blogControllers"));
var _uploader = _interopRequireDefault(require("../config/uploader"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var router = _express["default"].Router();
var initWebRoutes = function initWebRoutes(app) {
  router.get("/", _homeControllers["default"].getHomePage);
  router.get("/crud", _homeControllers["default"].getCRUD);
  router.post("/post-crud", _homeControllers["default"].postCRUD);
  router.get("/get-crud", _homeControllers["default"].displayGetCRUD);
  router.get("/edit-crud", _homeControllers["default"].getEditCRUD);
  router.post("/put-crud", _homeControllers["default"].putCRUD);
  router.get("/delete-crud", _homeControllers["default"].deleteCRUD);

  // API
  router.post("/api/login", _userControllers["default"].handleLogin);
  router.get("/api/get-user-detail", _userControllers["default"].handleGetUserDetails);
  router.get("/api/get-all-users", _userControllers["default"].handleGetAllUsers);
  router.post("/api/create-new-user", _uploader["default"].single("image"), _userControllers["default"].handleCreateNewUser);
  router.post("/api/edit-user", _uploader["default"].single("image"), _userControllers["default"].handleEditUser);
  router["delete"]("/api/delete-user", _userControllers["default"].handleDeleteUser);
  router.get("/api/allcode", _userControllers["default"].getAllCode);
  // API GET  doctor top
  router.get("/api/top-doctor-home", _doctorControllers["default"].getTopDoctorHome);
  // GET all doctor
  router.get("/api/get-all-doctors", _doctorControllers["default"].getAllDoctors);
  //GET all doctor by special
  router.get("/api/get-doctor-by-special", _doctorControllers["default"].getDoctorBySpecial);
  //GET all doctor by clinic
  router.get("/api/get-doctor-by-clinic", _doctorControllers["default"].getDoctorByClinic);

  //GET SEARCH DOCTOR
  router.get("/api/get-search-doctor", _doctorControllers["default"].getSearchDoctor);
  // post all doctor inform
  router.post("/api/save-info-doctors", _doctorControllers["default"].postInfoDoctors);
  // get all doctor inform
  router.get("/api/get-detail-doctor-by-id", _doctorControllers["default"].getDetailDoctorById);
  // day info date schedule doctor
  router.post("/api/bulk-create-schedule", _doctorControllers["default"].bulkCreateSchedule);
  // get date
  router.get("/api/get-schedule-doctor-by-date", _doctorControllers["default"].getScheduleDoctorByDate);
  // get price doctor
  router.get("/api/get-extra-infor-doctor-by-id", _doctorControllers["default"].getExtraInforDoctorById);
  // get profile doctor
  router.get("/api/get-profile-doctor-by-id", _doctorControllers["default"].getProfileDoctorById);
  // get info patien booking
  router.post("/api/patient-book-appointment", _patienControllers["default"].postBookAppointment);
  // verify book
  router.post("/api/verify-book-appointment", _patienControllers["default"].postVerifyBookAppointment);
  // create new special
  router.post("/api/create-new-specialty", _uploader["default"].single("image"), _specialyControllers["default"].createSpecialty);
  // get specialty
  router.get("/api/get-all-specialty", _specialyControllers["default"].getAllSpecialty);
  // delete specialty
  router.get("/api/delete-specialty", _specialyControllers["default"].deleteSpecialty);
  // edit specialty
  router.post("/api/edit-specialty", _uploader["default"].single("image"), _specialyControllers["default"].handleEditSpecial);

  // get infor doctor specialty
  router.get("/api/get-detail-specialty-by-id", _specialyControllers["default"].getDetailSpecialtyById);
  // create new clinic
  router.post("/api/create-new-clinic", _uploader["default"].single("image"), _clinicControllers["default"].createClinic);
  // delete clinic
  router.get("/api/delete-clinic", _clinicControllers["default"].deleteClinic);
  //  edit clinic
  // edit specialty
  router.post("/api/edit-clinic", _uploader["default"].single("image"), _clinicControllers["default"].handleEditClinic);
  // get clinic
  router.get("/api/get-all-clinic", _clinicControllers["default"].getAllClinic);
  // get infor doctor clinic
  router.get("/api/get-detail-clinic-by-id", _clinicControllers["default"].getDetailClinicById);

  // api Blog
  router.post("/api/save-info-blogs", _uploader["default"].single("image"), _blogControllers["default"].postInfoBlog);
  router.get("/api/get-list-blog", _blogControllers["default"].getListBlog);
  router["delete"]("/api/delete-blog", _blogControllers["default"].handleDeleteBlog);
  router.get("/api/get-blog-detail", _blogControllers["default"].handleBlogDetails);
  router.put("/api/edit-blog", _blogControllers["default"].handleEditBlog);

  // get all list patient  for doctor
  // get infor doctor clinic
  router.get("/api/get-list-patient-for-doctor", _doctorControllers["default"].getListPatientForDoctor);
  router.get("/api/get-history-patient-for-doctor", _doctorControllers["default"].getListHistoryPatient);
  // get list history patient
  // send remedy
  router.post("/api/send-remedy", _uploader["default"].single("image"), _doctorControllers["default"].sendRemedy);
  return app.use("/", router);
};
var _default = exports["default"] = initWebRoutes;