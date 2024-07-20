import  express  from "express";
import {
  createFaculty,
  getAllFaculties,
  getSingleFaculty,
  updateFaculty,
  deleteFaculty,
} from "../contollers/facultyController";

const router = express.Router()
router.route("/").post(createFaculty).get(getAllFaculties)
router.route("/:id").get(getSingleFaculty).patch(updateFaculty).delete(deleteFaculty)

export {router}