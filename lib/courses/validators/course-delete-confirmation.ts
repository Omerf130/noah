export function matchesCourseDeleteConfirmation(
  courseTitle: string,
  confirmationTitle: string,
): boolean {
  return confirmationTitle.trim() === courseTitle.trim()
}
