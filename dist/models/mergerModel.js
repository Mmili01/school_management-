"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.School = exports.Course = exports.Lecturer = exports.Student = exports.User = exports.Department = exports.Faculty = void 0;
const facultyModel_1 = require("./facultyModel");
Object.defineProperty(exports, "Faculty", { enumerable: true, get: function () { return facultyModel_1.Faculty; } });
const departmentModel_1 = require("./departmentModel");
Object.defineProperty(exports, "Department", { enumerable: true, get: function () { return departmentModel_1.Department; } });
const userModel_1 = require("./userModel");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return userModel_1.User; } });
const studentsModel_1 = require("./studentsModel");
Object.defineProperty(exports, "Student", { enumerable: true, get: function () { return studentsModel_1.Student; } });
const lecturerModel_1 = require("./lecturerModel");
Object.defineProperty(exports, "Lecturer", { enumerable: true, get: function () { return lecturerModel_1.Lecturer; } });
const courseModel_1 = require("./courseModel");
Object.defineProperty(exports, "Course", { enumerable: true, get: function () { return courseModel_1.Course; } });
const schoolsModel_1 = require("./schoolsModel");
Object.defineProperty(exports, "School", { enumerable: true, get: function () { return schoolsModel_1.School; } });
