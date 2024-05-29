
export function generateStudentGmail(
  firstName: string,
  lastName:string,
  surname:string,
  gmailExtension: string
): string {
    const firstInitial = firstName.charAt(0).toLowerCase()
    const secondInitial = lastName.charAt(0).toLowerCase()
    const formattedSurname = surname.toLowerCase
  return `${firstInitial}${secondInitial}.${formattedSurname}@${gmailExtension
    .replace(/\s+/g, "")
    .toLowerCase()}.edu.com`;
}
