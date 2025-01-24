import { BadRequestError } from "../errors";
import { Department } from "../models/departmentModel";
import { Student } from "../models/studentsModel";

export async function generateRegNumber(departmentId: number): Promise<string> {
  const currentYear = new Date().getFullYear();

  const department = await Department.findOne({ where: {id: departmentId } });

  if (!department) {
    throw new BadRequestError("Department not found");
  }

  const departmentCode = department.departmentId.toString().padStart(3,"0")

  const studentCount = await Student.count({ where: { departmentId } });
 

  return `${currentYear}${departmentCode}${studentCount + 1}`;
}
