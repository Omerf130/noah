import mongoose from 'mongoose'
import { connectDb } from '../../db/connect'
import { User } from '../../db/models'
import { CourseInstructorError } from './errors'

/**
 * Temporary rule: until a dedicated instructor role exists, only active admins
 * may be assigned as course instructors.
 */
export async function validateCourseInstructor(instructorId: string): Promise<void> {
  await connectDb()

  if (!mongoose.Types.ObjectId.isValid(instructorId)) {
    throw new CourseInstructorError('invalid')
  }

  const user = await User.findById(instructorId).select({ role: 1, isActive: 1 }).lean()

  if (!user || user.role !== 'admin') {
    throw new CourseInstructorError('invalid')
  }

  if (!user.isActive) {
    throw new CourseInstructorError('inactive')
  }
}
