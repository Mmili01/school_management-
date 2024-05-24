
export function generateStudentGmail(
  studentName: string,
  gmailExtension: string
): string {
  return `${studentName.replace(/\s+/g, "").toLowerCase()}@${gmailExtension
    .replace(/\s+/g, "")
    .toLowerCase()}.edu`;
}
