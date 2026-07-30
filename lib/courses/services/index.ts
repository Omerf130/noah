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
  deleteModuleFromCourse,
  generateModuleSlug,
  getModuleById,
  listModulesByCourse,
  moveModuleInCourse,
  reorderModules,
  updateModule,
  updateModuleMetadata,
} from './module-service'

export {
  assertLessonBelongsToModule,
  createLesson,
  createLessonInModule,
  deleteLesson,
  deleteLessonFromModule,
  generateLessonSlug,
  getLessonById,
  lessonSlugExists,
  listLessonsByCourse,
  listLessonsByModule,
  moveLessonInModule,
  moveLessonToModule,
  reorderLessons,
  updateLesson,
  updateLessonBlocks,
  updateLessonMetadata,
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
  LessonCountSyncError,
  LessonDeletionFailedError,
  LessonDuplicateSlugError,
  LessonNotFoundError,
  ModuleCountSyncError,
  ModuleDeletionFailedError,
} from './errors'

export { validateCourseInstructor } from './instructor-service'
