import { runAdminPromoteFromEnv } from '../lib/admin/admin-service'

async function main() {
  const result = await runAdminPromoteFromEnv(process.env)

  if (result.exitCode === 0) {
    console.log(result.message)
  } else {
    console.error(result.message)
    process.exitCode = result.exitCode
  }
}

void main()
