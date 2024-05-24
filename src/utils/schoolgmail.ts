export function generateGmailExtension(schoolName: string): string {
  const initials = schoolName
    .split(" ")
    .map((word: string) => word[0].toUpperCase())
    .join(" ");
  return `@${initials}.edu`;
}
