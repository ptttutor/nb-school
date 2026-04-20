/**
 * สร้าง account ครูทุกคนในระบบ โดยใช้รหัสครูเป็น username และ password
 * รัน: npx tsx prisma/create-teacher-accounts.ts
 *
 * - username = รหัสครู (เช่น "101")
 * - password = รหัสครู (เช่น "101") → ครูควรเปลี่ยนรหัสผ่านหลัง login ครั้งแรก
 * - role     = TEACHER
 * - เชื่อมกับ SupervisionTeacher ผ่าน teacherId
 */
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('=== สร้าง account ครู ===\n')

  const teachers = await prisma.supervisionTeacher.findMany({
    include: { user: true },
    orderBy: { teacherCode: 'asc' },
  })

  console.log(`พบครูทั้งหมด: ${teachers.length} คน\n`)

  let created = 0
  let skipped = 0

  // สร้าง bcrypt hash ทีเดียวใช้ร่วมกันไม่ได้ (salt unique ต่อ user)
  // batch โดย hash ทีละกลุ่ม 10 คน เพื่อความเร็ว
  const teachersWithoutAccount = teachers.filter((t) => !t.user)
  console.log(`มี account แล้ว: ${teachers.length - teachersWithoutAccount.length} คน`)
  console.log(`ต้องสร้างใหม่: ${teachersWithoutAccount.length} คน\n`)

  const BATCH = 10
  for (let i = 0; i < teachersWithoutAccount.length; i += BATCH) {
    const batch = teachersWithoutAccount.slice(i, i + BATCH)
    await Promise.all(
      batch.map(async (teacher) => {
        const username = teacher.teacherCode // เช่น "101"
        const hash = await bcrypt.hash(teacher.teacherCode, 10)
        const displayName = `${teacher.prefix}${teacher.firstName} ${teacher.lastName}`

        await prisma.supervisionUser.create({
          data: {
            username,
            password: hash,
            displayName,
            role: 'TEACHER',
            teacherId: teacher.id,
          },
        })
        created++
        process.stdout.write(`  ✓ ${username} ${displayName}\n`)
      })
    )
  }

  skipped = teachers.length - teachersWithoutAccount.length

  console.log('\n=== สรุป ===')
  console.log(`สร้างใหม่: ${created} account`)
  console.log(`มีอยู่แล้ว (ข้าม): ${skipped} account`)
  console.log('\n✅ เสร็จสิ้น')
  console.log('\nหมายเหตุ: username และ password เริ่มต้น = รหัสครู (เช่น 101)')
  console.log('ควรแจ้งให้ครูเปลี่ยนรหัสผ่านหลัง login ครั้งแรก')
}

main()
  .catch((e) => { console.error('❌', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
