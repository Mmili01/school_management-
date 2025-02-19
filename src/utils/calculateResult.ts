export function calculateScore(score: number): string {
  if (score >= 70) {
    return "A";
  } else if (score >= 60) {
    return "B";
  } else if (score >= 50) {
    return "C";
  } else if (score >= 45) {
    return "D";
  } else if (score >= 40) {
    return "E";
  } else {
    return "F";
  }
}
