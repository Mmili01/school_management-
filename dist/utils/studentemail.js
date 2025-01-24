"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateStudentGmail = void 0;
function generateStudentGmail(firstName, lastName, surname, emailExtension) {
    const firstInitial = firstName.charAt(0).toLowerCase();
    const secondInitial = lastName.charAt(0).toLowerCase();
    const formattedSurname = surname.toLowerCase();
    return `${firstInitial}${secondInitial}.${formattedSurname}${emailExtension
        .replace(/\s+/g, "")
        .toLowerCase()}.com`;
}
exports.generateStudentGmail = generateStudentGmail;
