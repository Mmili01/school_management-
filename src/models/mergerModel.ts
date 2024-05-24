import { Faculty } from "./facultyModel";
import { Department } from "./departmentModel";
import { User } from "./userModel";
import { Student } from "./studentsModel";
import { lecturer } from "./lecturerModel";
import { Course } from "./courseModel";
import { School } from "./schoolsModel";

export { Faculty, Department, User, Student, lecturer, Course, School };

School.hasMany(Faculty, { foreignKey: "facultyCode" });
Faculty.hasMany(Department, { foreignKey: "departmentName" });
Department.hasMany(Course, { foreignKey: "courseCode" });
Department.hasMany(User, { foreignkey: "" });
User.hasMany(Student, { foreignKey: "regNumber" });
User.hasMany(lecturer, { foreignKey: "" });

School.sync().then(() => {
  console.log("School Model Synced");
});
