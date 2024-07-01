
export function generateLecturerEmail(
    firstName: string,
    lastName:string,
    surname:string,
    emailExtension: string
  ): string {
      const firstInitial = firstName.charAt(0).toLowerCase()
      const secondInitial = lastName.charAt(0).toLowerCase()
      const formattedSurname = surname.toLowerCase
    return `${firstInitial}${secondInitial}.${formattedSurname}@${emailExtension
      .replace(/\s+/g, "")
      .toLowerCase()}.edu.com`;
  }
  