import { BadRequestError } from "../errors"
import {Department } from "../models/departmentModel"
import { Student } from "../models/studentsModel"


 export const generateRegNumber = async (departmentId:number) =>{
    const currentYear = new Date().getFullYear
    const department = await Department.findByPk(departmentId)

    if(!departmentId){
        throw new BadRequestError("Department not found")
    }

    const departmentCode = department?.departmentId.toString().padStart(3,"0")
    const studentCount = await Student.count({where:{departmentId}})

    return `${currentYear}${departmentCode}${studentCount}`
}