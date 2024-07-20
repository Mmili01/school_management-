"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateStudentGmail = void 0;
function generateStudentGmail(firstName, lastName, surname, gmailExtension) {
    const firstInitial = firstName.charAt(0).toLowerCase();
    const secondInitial = lastName.charAt(0).toLowerCase();
    const formattedSurname = surname.toLowerCase;
    return `${firstInitial}${secondInitial}.${formattedSurname}@${gmailExtension
        .replace(/\s+/g, "")
        .toLowerCase()}.edu.com`;
}
exports.generateStudentGmail = generateStudentGmail;
