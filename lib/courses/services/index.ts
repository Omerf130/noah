export {
  deleteCoursePermanently,
  determineCourseDeletionEligibility,
} from './course-deletion-service'

export {
  archiveCourse,
  createCourse,
  getCourseById,
  getCourseByInternalName,
  getCourseBySlug,
  listCourses,
  publishCourse,
  updateCourse,
  updateCourseMetadata,
} from './course-service'

export {
  assertModuleBelongsToCourse,
  createModule,
  deleteModule,
  generateModuleSlug,
  getModuleById,
  listModulesByCourse,
  moveModuleInCourse,
  reorderModules,
  updateModule,
} from './module-service'

export {
  createLesson,
  deleteLesson,
  getLessonById,
  listLessonsByCourse,
  listLessonsByModule,
  reorderLessons,
  updateLesson,
  updateLessonBlocks,
} from './lesson-service'

export {
  countLessonBlocks,
  getCourseOutline,
  getPublishedCourseOutlineBySlug,
} from './outline-service'

export {
  canPublishCourse,
  countPublishedLessons,
  getCoursePublishSummary,
  getPublishBlockers,
  validateCourseForPublish,
} from './publish-service'

export {
  CourseArchiveNotAllowedError,
  CourseDeletionConfirmationError,
  CourseDeletionFailedError,
  CourseDeletionNotEligibleError,
  CourseDuplicateKeyError,
  CourseInstructorError,
  CourseModuleNotFoundError,
  CourseNotFoundError,
  CourseValidationError,
  LessonNotFoundError,
} from './errors'

export { validateCourseInstructor } from './instructor-service'
