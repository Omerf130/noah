import { connectDb } from '../../db/connect'
import { User } from '../../db/models'
import {
  assertInstructorOptionDtoSafety,
  mapToInstructorOptionDtos,
  type InstructorOptionDto,
} from '../mappers/to-instructor-option-dto'

/**
 * Temporary rule: until a dedicated instructor role exists, only active admins
 * are offered as instructor options.
 */
export async function listInstructorOptions(): Promise<InstructorOptionDto[]> {
  await connectDb()

  const users = await User.find({ role: 'admin', isActive: true })
    .select({ fullName: 1, email: 1 })
    .sort({ fullName: 1 })
    .lean()

  const options = mapToInstructorOptionDtos(
    users.map((user) => ({
      _id: user._id,
      fullName: String(user.fullName),
      email: String(user.email),
    })),
  )

  for (const option of options) {
    assertInstructorOptionDtoSafety(option)
  }

  return options
}
