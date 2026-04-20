/**
 * นำเข้าข้อมูลครูและรายวิชาจาก Excel เข้าสู่ระบบนิเทศภายใน
 * รัน: npx tsx prisma/import-supervision.ts
 */
import * as XLSX from 'xlsx'
import * as path from 'path'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ---------- Mapping prefix → ชื่อกลุ่มสาระ ----------
const PREFIX_TO_GROUP: Record<string, string> = {
  ท: 'ภาษาไทย',
  ค: 'คณิตศาสตร์',
  ว: 'วิทยาศาสตร์และเทคโนโลยี',
  ส: 'สังคมศึกษา ศาสนาและวัฒนธรรม',
  พ: 'สุขศึกษาและพลศึกษา',
  ศ: 'ศิลปะ',
  ง: 'การงานอาชีพ',
  อ: 'ภาษาต่างประเทศ',
  จ: 'ภาษาต่างประเทศ', // ภาษาจีน → รวมกลุ่มเดียวกัน
  ญ: 'ภาษาต่างประเทศ', // ภาษาญี่ปุ่น → รวมกลุ่มเดียวกัน
  ก: 'กิจกรรมพัฒนาผู้เรียน',
  I: 'ห้องเรียนพิเศษ IS', // IS Program
}

interface TeacherRow {
  teacherCode: number
  prefix: string
  firstName: string
  lastName: string
}

interface SubjectRow {
  classGroup: number
  seq: number
  subjectCode: string
  subjectName: string
  credits: number
  year: number
  semester: number
  teacherCode: number
  prefix: string
  firstName: string
  lastName: string
  gradeLevel: string
}

async function main() {
  console.log('=== เริ่มนำเข้าข้อมูล ===\n')

  // ---------- อ่าน Excel ----------
  const excelDir = path.join(__dirname, '..', 'supervision-module')

  const wb1 = XLSX.readFile(path.join(excelDir, 'teacher_list_sorted (1).xlsx'))
  const ws1 = wb1.Sheets[wb1.SheetNames[0]]
  const rawTeachers = XLSX.utils.sheet_to_json<TeacherRow>(ws1, {
    header: ['teacherCode', 'prefix', 'firstName', 'lastName'],
    range: 1, // skip header row
  })

  const wb2 = XLSX.readFile(path.join(excelDir, 'cleaned_teaching_subjects (1).xlsx'))
  const ws2 = wb2.Sheets[wb2.SheetNames[0]]
  const rawSubjects = XLSX.utils.sheet_to_json<SubjectRow>(ws2, {
    header: [
      'classGroup', 'seq', 'subjectCode', 'subjectName',
      'credits', 'year', 'semester', 'teacherCode',
      'prefix', 'firstName', 'lastName', 'gradeLevel',
    ],
    range: 1,
  })

  console.log(`อ่านครู: ${rawTeachers.length} คน`)
  console.log(`อ่านรายวิชา: ${rawSubjects.length} แถว\n`)

  // ---------- 1. SubjectGroups ----------
  console.log('1. สร้างกลุ่มสาระ...')
  const uniqueGroupNames = [...new Set(Object.values(PREFIX_TO_GROUP))]
  const groupMap: Record<string, string> = {} // name → id

  for (const name of uniqueGroupNames) {
    const g = await prisma.subjectGroup.upsert({
      where: { name },
      update: {},
      create: { name },
    })
    groupMap[name] = g.id
    console.log(`  ✓ ${name}`)
  }

  // ---------- 2. AcademicSemester ----------
  console.log('\n2. สร้างภาคเรียน...')
  // ดึงจากข้อมูล Excel (ทุก row ควรเป็น 2568/2)
  const years = [...new Set(rawSubjects.map((r) => r.year))]
  const semesters = [...new Set(rawSubjects.map((r) => r.semester))]
  console.log(`   ปีการศึกษา: ${years.join(', ')}, ภาคเรียน: ${semesters.join(', ')}`)

  const semMap: Record<string, string> = {} // "year-sem" → id
  for (const year of years) {
    for (const sem of semesters) {
      const s = await prisma.academicSemester.upsert({
        where: { year_semester: { year, semester: sem } },
        update: {},
        create: {
          year,
          semester: sem,
          isActive: true, // ภาคเรียนนี้คือภาคเรียนปัจจุบัน
        },
      })
      semMap[`${year}-${sem}`] = s.id
      console.log(`  ✓ ปีการศึกษา ${year} ภาคเรียนที่ ${sem} (active)`)
    }
  }

  // ---------- 3. SupervisionTeachers ----------
  console.log('\n3. สร้างข้อมูลครู...')

  // คำนวณกลุ่มสาระหลักของแต่ละครู (prefix ที่ปรากฏมากที่สุด)
  const teacherGroupCount: Record<number, Record<string, number>> = {}
  for (const row of rawSubjects) {
    const tc = row.teacherCode
    const prefix = String(row.subjectCode).charAt(0)
    const groupName = PREFIX_TO_GROUP[prefix]
    if (!groupName) continue
    if (!teacherGroupCount[tc]) teacherGroupCount[tc] = {}
    teacherGroupCount[tc][groupName] = (teacherGroupCount[tc][groupName] || 0) + 1
  }

  // หาชื่อกลุ่มสาระหลักของแต่ละครู
  const teacherPrimaryGroup: Record<number, string> = {}
  for (const [tcStr, counts] of Object.entries(teacherGroupCount)) {
    const tc = Number(tcStr)
    const primary = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
    if (primary) teacherPrimaryGroup[tc] = primary[0]
  }

  const teacherIdMap: Record<number, string> = {} // teacherCode → id

  for (const t of rawTeachers) {
    const tc = Number(t.teacherCode)
    const primaryGroupName = teacherPrimaryGroup[tc]
    const subjectGroupId = primaryGroupName ? groupMap[primaryGroupName] : undefined

    const teacher = await prisma.supervisionTeacher.upsert({
      where: { teacherCode: String(tc) },
      update: {
        prefix: t.prefix,
        firstName: t.firstName,
        lastName: t.lastName,
        ...(subjectGroupId ? { subjectGroupId } : {}),
      },
      create: {
        teacherCode: String(tc),
        prefix: t.prefix,
        firstName: t.firstName,
        lastName: t.lastName,
        ...(subjectGroupId ? { subjectGroupId } : {}),
      },
    })
    teacherIdMap[tc] = teacher.id
  }

  console.log(`  ✓ ${rawTeachers.length} คน`)

  // ---------- 4. Subjects (deduplicate by subjectCode+gradeLevel) ----------
  console.log('\n4. สร้างรายวิชา...')

  const subjectKey = (code: string, grade: string) => `${code}__${grade}`
  const subjectIdMap: Record<string, string> = {} // key → id

  const uniqueSubjects = new Map<string, SubjectRow>()
  for (const row of rawSubjects) {
    const key = subjectKey(row.subjectCode, row.gradeLevel)
    if (!uniqueSubjects.has(key)) uniqueSubjects.set(key, row)
  }

  console.log(`  unique subjects: ${uniqueSubjects.size}`)

  // ดึงข้อมูลที่มีอยู่แล้วทั้งหมดด้วย query เดียว
  const existingSubjects = await prisma.subject.findMany({ select: { id: true, subjectCode: true, gradeLevel: true } })
  for (const s of existingSubjects) {
    subjectIdMap[subjectKey(s.subjectCode, s.gradeLevel)] = s.id
  }

  // สร้างเฉพาะที่ยังไม่มี
  const toCreate = [...uniqueSubjects.entries()].filter(([key]) => !subjectIdMap[key])

  if (toCreate.length > 0) {
    const createdSubjects = await Promise.all(
      toCreate.map(([, row]) => {
        const prefix = String(row.subjectCode).charAt(0)
        const groupName = PREFIX_TO_GROUP[prefix]
        const subjectGroupId = groupName ? groupMap[groupName] : undefined
        return prisma.subject.create({
          data: {
            subjectCode: row.subjectCode,
            subjectName: row.subjectName,
            credits: row.credits,
            gradeLevel: row.gradeLevel,
            ...(subjectGroupId ? { subjectGroupId } : {}),
          },
        })
      })
    )
    for (const s of createdSubjects) {
      subjectIdMap[subjectKey(s.subjectCode, s.gradeLevel)] = s.id
    }
  }

  console.log(`  ✓ สร้างใหม่ ${toCreate.length}, มีอยู่แล้ว ${existingSubjects.length} รายวิชา`)

  // ---------- 5. TeacherSubjectAssignments ----------
  console.log('\n5. สร้างการมอบหมายสอน...')

  const assignmentData: {
    teacherId: string
    subjectId: string
    semesterId: string
    classGroup: string
  }[] = []

  let warnCount = 0
  for (const row of rawSubjects) {
    const tc = Number(row.teacherCode)
    const teacherId = teacherIdMap[tc]
    if (!teacherId) { warnCount++; continue }

    const key = subjectKey(row.subjectCode, row.gradeLevel)
    const subjectId = subjectIdMap[key]
    if (!subjectId) { warnCount++; continue }

    const semesterId = semMap[`${row.year}-${row.semester}`]
    if (!semesterId) { warnCount++; continue }

    assignmentData.push({ teacherId, subjectId, semesterId, classGroup: String(row.classGroup) })
  }

  const result = await prisma.teacherSubjectAssignment.createMany({
    data: assignmentData,
    skipDuplicates: true,
  })

  console.log(`  ✓ สร้างใหม่: ${result.count}, ข้ามซ้ำ: ${assignmentData.length - result.count}, คำเตือน: ${warnCount}`)

  // ---------- Summary ----------
  const [gCnt, sCnt, tCnt, subCnt, aCnt] = await Promise.all([
    prisma.subjectGroup.count(),
    prisma.academicSemester.count(),
    prisma.supervisionTeacher.count(),
    prisma.subject.count(),
    prisma.teacherSubjectAssignment.count(),
  ])

  console.log('\n=== สรุป ===')
  console.log(`กลุ่มสาระ:          ${gCnt}`)
  console.log(`ภาคเรียน:           ${sCnt}`)
  console.log(`ครู:                ${tCnt}`)
  console.log(`รายวิชา:            ${subCnt}`)
  console.log(`การมอบหมายสอน:      ${aCnt}`)
  console.log('\n✅ นำเข้าข้อมูลสำเร็จ')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
