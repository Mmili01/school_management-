"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateGmailExtension = void 0;
function generateGmailExtension(schoolName) {
    const initials = schoolName
        .split(" ")
        .map((word) => word[0].toUpperCase())
        .join(" ");
    return `@${initials}.edu`;
}
exports.generateGmailExtension = generateGmailExtension;
