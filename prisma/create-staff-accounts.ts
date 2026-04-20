/**
 * สร้าง account ผู้ตรวจและผู้บริหาร
 * แก้ไขรายชื่อใน ACCOUNTS ด้านล่าง แล้วรัน: npx tsx prisma/create-staff-accounts.ts
 */
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ===== แก้ไขรายชื่อที่นี่ =====
const ACCOUNTS = [
  // หัวหน้าสาระ (SUBJECT_HEAD) — กำหนด username/password/ชื่อที่แสดง
  { username: 'head_thai',    password: 'head_thai',    displayName: 'หัวหน้าสาระภาษาไทย',                        role: 'SUBJECT_HEAD' },
  { username: 'head_math',    password: 'head_math',    displayName: 'หัวหน้าสาระคณิตศาสตร์',                     role: 'SUBJECT_HEAD' },
  { username: 'head_sci',     password: 'head_sci',     displayName: 'หัวหน้าสาระวิทยาศาสตร์และเทคโนโลยี',        role: 'SUBJECT_HEAD' },
  { username: 'head_social',  password: 'head_social',  displayName: 'หัวหน้าสาระสังคมศึกษา ศาสนาและวัฒนธรรม',    role: 'SUBJECT_HEAD' },
  { username: 'head_health',  password: 'head_health',  displayName: 'หัวหน้าสาระสุขศึกษาและพลศึกษา',             role: 'SUBJECT_HEAD' },
  { username: 'head_art',     password: 'head_art',     displayName: 'หัวหน้าสาระศิลปะ',                          role: 'SUBJECT_HEAD' },
  { username: 'head_career',  password: 'head_career',  displayName: 'หัวหน้าสาระการงานอาชีพ',                    role: 'SUBJECT_HEAD' },
  { username: 'head_eng',     password: 'head_eng',     displayName: 'หัวหน้าสาระภาษาต่างประเทศ',                 role: 'SUBJECT_HEAD' },
  { username: 'head_act',     password: 'head_act',     displayName: 'หัวหน้าสาระกิจกรรมพัฒนาผู้เรียน',           role: 'SUBJECT_HEAD' },
  { username: 'head_is',      password: 'head_is',      displayName: 'หัวหน้าสาระห้องเรียนพิเศษ IS',              role: 'SUBJECT_HEAD' },

  // หัวหน้าวิชาการ (ACADEMIC_HEAD)
  { username: 'academic_head', password: 'academic_head', displayName: 'หัวหน้าวิชาการ', role: 'ACADEMIC_HEAD' },

  // รองผู้อำนวยการฝ่ายวิชาการ (VICE_PRINCIPAL_ACADEMIC)
  { username: 'vice_academic', password: 'vice_academic', displayName: 'รองผู้อำนวยการฝ่ายวิชาการ', role: 'VICE_PRINCIPAL_ACADEMIC' },

  // รองผู้อำนวยการฝ่ายอื่น (VICE_PRINCIPAL)
  { username: 'vice_1', password: 'vice_1', displayName: 'รองผู้อำนวยการฝ่ายบริหารงานทั่วไป', role: 'VICE_PRINCIPAL' },
  { username: 'vice_2', password: 'vice_2', displayName: 'รองผู้อำนวยการฝ่ายบุคคล',          role: 'VICE_PRINCIPAL' },

  // ผู้อำนวยการ (PRINCIPAL)
  { username: 'principal', password: 'principal', displayName: 'ผู้อำนวยการ', role: 'PRINCIPAL' },
] as const
// ================================

async function main() {
  console.log('=== สร้าง account ผู้ตรวจและผู้บริหาร ===\n')

  let created = 0
  let skipped = 0

  for (const acc of ACCOUNTS) {
    const existing = await prisma.supervisionUser.findUnique({ where: { username: acc.username } })
    if (existing) {
      console.log(`  ⏭ ข้าม (มีอยู่แล้ว): ${acc.username}`)
      skipped++
      continue
    }

    const hash = await bcrypt.hash(acc.password, 10)
    await prisma.supervisionUser.create({
      data: {
        username: acc.username,
        password: hash,
        displayName: acc.displayName,
        role: acc.role,
      },
    })
    console.log(`  ✓ สร้าง [${acc.role}] ${acc.username} — ${acc.displayName}`)
    created++
  }

  console.log('\n=== สรุป ===')
  console.log(`สร้างใหม่: ${created}`)
  console.log(`ข้ามซ้ำ:  ${skipped}`)
  console.log('\n✅ เสร็จสิ้น')
}

main()
  .catch((e) => { console.error('❌', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
