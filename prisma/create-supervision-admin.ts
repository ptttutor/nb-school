import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const hash = await bcrypt.hash('admin123', 10)
  const user = await prisma.supervisionUser.upsert({
    where: { username: 'admin' },
    update: { password: hash },
    create: {
      username: 'admin',
      password: hash,
      displayName: 'ผู้ดูแลระบบวิชาการ',
      role: 'ACADEMIC_ADMIN',
    },
  })
  console.log('✅ สร้าง SupervisionUser สำเร็จ')
  console.log('username:', user.username)
  console.log('password: admin123')
  console.log('role:', user.role)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
