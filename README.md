# Course Registration System (ระบบสมัครเรียน)

เว็บแอปพลิเคชันสำหรับการสมัครเรียนออนไลน์โรงเรียนหนองบัว - ห้องเรียนพิเศษ ISM  
พัฒนาด้วย Next.js, TypeScript, PostgreSQL และ Prisma ORM

## 🎯 คุณสมบัติ

### 📝 สำหรับผู้สมัคร (Guest)
- **สมัครเรียน 2 ระดับชั้น**: มัธยมศึกษาปีที่ 1 และปีที่ 4
- กรอกข้อมูลส่วนตัวและข้อมูลการศึกษา
- กรอกเกรดเฉลี่ยรายวิชา (แยกตามระดับชั้น):
  - **ม.1**: วิทยาศาสตร์และคณิตศาสตร์ ป.5-6
  - **ม.4**: วิทยาศาสตร์และคณิตศาสตร์ ม.1-3
- ดูรายละเอียดการสมัครหลังส่งใบสมัคร
- แก้ไขเกรดเฉลี่ย
- อัพโหลดเอกสารประกอบ
- ดาวน์โหลดใบสมัครเป็น PDF
- ค้นหาการสมัครด้วยเลขบัตรประชาชน

### 👨‍💼 สำหรับผู้ดูแลระบบ (Admin)
- เข้าสู่ระบบด้วย username: `admin` | password: `admin123`
- ดูรายการผู้สมัครทั้งหมดในตาราง
- **ดูรายละเอียดแบบ Drawer** - คลิก "ดูรายละเอียด" เพื่อดูข้อมูลครบถ้วน
- จัดการสถานะการสมัคร (รอดำเนินการ / อนุมัติ / ปฏิเสธ)
- จัดการข่าวสาร (สร้าง / แก้ไข / ลบ / เผยแพร่)

## 🏗️ โครงสร้างโปรเจค (Feature-based Architecture)

```
src/
├── app/                    # Next.js App Router (thin pages)
│   ├── admin/             # Admin dashboard routes
│   ├── api/               # API routes (use services)
│   ├── register/          # Registration routes
│   ├── registration/      # Registration details routes
│   └── search/            # Search routes
│
├── components/            # Shared UI components
│   └── ui/               # shadcn/ui components
│
├── features/             # Feature-based modules
│   ├── registration/     # Registration feature
│   │   ├── components/  # Registration-specific components
│   │   └── hooks/       # Registration-specific hooks
│   └── admin/           # Admin feature
│       ├── components/  # Admin-specific components
│       └── hooks/       # Admin-specific hooks
│
├── services/            # Business logic & data access
│   ├── registration.service.ts
│   ├── admin.service.ts
│   └── index.ts
│
├── types/               # TypeScript types & interfaces
│   ├── registration.types.ts
│   ├── admin.types.ts
│   └── index.ts
│
├── hooks/               # Global custom hooks
│
├── lib/                 # Utilities & configurations
│   ├── prisma.ts       # Prisma client
│   └── utils.ts        # Utility functions
│
└── utils/              # Helper functions
```

### 🎨 Tech Stack

### 🎨 Tech Stack

- **Framework**: Next.js 15.5.12 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **UI Library**: React 19
- **UI Components**: shadcn/ui (Amber/Gold Theme)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Authentication**: bcryptjs
- **File Upload**: Native File API
- **PDF Generation**: Browser native PDF download

## 🎨 Theme & Design

เว็บไซต์ใช้ธีมสีน้ำตาลเหลือง (Amber/Gold) ที่ดูทันสมัยและอบอุ่น:
- **Primary Colors**: Amber 500-600 with Yellow accents
- **Gradients**: Smooth transitions with backdrop blur effects
- **Components**: Modern shadcn/ui components with custom styling
- **Responsive**: Mobile-first design with Tailwind CSS

## การติดตั้ง

### วิธีที่ 1: ใช้ Docker (แนะนำสำหรับการทดสอบ)

**ข้อดี**: ไม่ต้องติดตั้ง PostgreSQL บนเครื่อง, ง่ายและรวดเร็ว

#### 1. เริ่มต้น Database ด้วย Docker

```bash
# เริ่มต้น PostgreSQL และ pgAdmin
docker-compose up -d

# ตรวจสอบว่า container ทำงาน
docker-compose ps
```

**Services ที่รัน:**
- PostgreSQL: `localhost:5432`
- pgAdmin: `http://localhost:5050`
  - Email: `admin@admin.com`
  - Password: `admin123`

#### 2. ติดตั้ง Dependencies

```bash
npm install
```

#### 3. ตั้งค่า Environment Variables

คัดลอกไฟล์ `.env.docker` เป็น `.env`:

```bash
# Windows PowerShell
Copy-Item .env.docker .env

# Windows CMD
copy .env.docker .env

# Linux/Mac
cp .env.docker .env
```

หรือสร้างไฟล์ `.env` ด้วยตัวเอง:

```env
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/course_registration?schema=public"
NEXTAUTH_SECRET="change-this-secret-key-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

#### 4. สร้าง Database Schema

```bash
npx prisma migrate dev --name init
```

#### 5. สร้าง Admin User

```bash
npx tsx prisma/seed.ts
```

**ข้อมูล Admin เริ่มต้น:**
- Username: `admin`
- Password: `admin123`

#### 6. รันโปรเจค

```bash
npm run dev
```

#### หยุดการทำงานของ Docker

```bash
# หยุด containers
docker-compose stop

# หยุดและลบ containers (ข้อมูลจะยังอยู่ใน volumes)
docker-compose down

# หยุดและลบทั้ง containers และข้อมูล
docker-compose down -v
```

---

### วิธีที่ 2: ติดตั้ง PostgreSQL แบบปกติ

#### 1. ติดตั้ง Dependencies

```bash
npm install
```

#### 2. ตั้งค่า Database

สร้างไฟล์ `.env` ในโฟลเดอร์หลัก:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/course_registration?schema=public"
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

**หมายเหตุ**: เปลี่ยน `username` และ `password` เป็นข้อมูลจริงของ PostgreSQL

#### 3. สร้าง Database Schema

```bash
npx prisma migrate dev --name init
```

#### 4. สร้าง Admin User

```bash
npx tsx prisma/seed.ts
```

**ข้อมูล Admin เริ่มต้น:**
- Username: `admin`
- Password: `admin123`

⚠️ **กรุณาเปลี่ยนรหัสผ่านเมื่อใช้งานจริง!**

#### 5. เปิด Prisma Studio (ตัวเลือก)

```bash
npx prisma studio
```

---

## จัดการ Docker Database

### Connect to PostgreSQL Database

```bash
# เข้าไปใน PostgreSQL container
docker exec -it course-registration-db psql -U postgres -d course_registration

# หรือใช้ psql จากเครื่องของคุณ
psql -h localhost -U postgres -d course_registration
```

### ดู Logs

```bash
# ดู logs ของ PostgreSQL
docker-compose logs postgres

# ดู logs แบบ real-time
docker-compose logs -f postgres
```

### Backup และ Restore Database

```bash
# Backup database
docker exec -t course-registration-db pg_dump -U postgres course_registration > backup.sql

# Restore database
docker exec -i course-registration-db psql -U postgres course_registration < backup.sql
```

### เข้าถึง pgAdmin

1. เปิด browser ไปที่ `http://localhost:5050`
2. Login ด้วย:
   - Email: `admin@admin.com`
   - Password: `admin123`
3. เพิ่ม Server:
   - Host: `postgres` (ชื่อ service ใน docker-compose)
   - Port: `5432`
   - Username: `postgres`
   - Password: `postgres123`

---

## การรันโปรเจค

### Development Mode

```bash
npm run dev
```

เปิดเบราว์เซอร์ที่ [http://localhost:3000](http://localhost:3000)

### Production Mode

```bash
npm run build
npm start
```

## NPM Scripts

### Development

```bash
npm run dev          # เริ่ม development server
npm run build        # Build สำหรับ production
npm run start        # เริ่ม production server
npm run lint         # รัน ESLint
```

### Docker Commands

```bash
npm run docker:up              # เริ่ม Docker containers
npm run docker:down            # หยุด containers
npm run docker:down:volumes    # หยุดและลบข้อมูล
npm run docker:logs            # ดู logs แบบ real-time
npm run docker:restart         # Restart containers
```

### Database Commands

```bash
npm run db:migrate    # รัน migrations
npm run db:seed       # Seed database
npm run db:studio     # เปิด Prisma Studio
npm run db:push       # Push schema to database
npm run db:reset      # Reset database
```

### Quick Start with Docker

```bash
# ติดตั้งและเริ่มต้นทุกอย่างในคำสั่งเดียว (Windows PowerShell)
.\docker-setup.ps1

# หรือสำหรับ Linux/Mac (ต้อง chmod +x ก่อน)
chmod +x docker-setup.sh
./docker-setup.sh
```

## โครงสร้างโปรเจค

```
nb-robot/
├── .github/
│   └── copilot-instructions.md
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # สคริปต์สร้าง admin user
├── src/
│   ├── app/
│   │   ├── admin/         # หน้า Admin Dashboard
│   │   ├── register/      # หน้าแบบฟอร์มสมัครเรียน
│   │   ├── api/
│   │   │   ├── register/  # API สมัครเรียน
│   │   │   └── admin/     # API สำหรับ admin
│   │   ├── layout.tsx
│   │   ├── page.tsx       # หน้าแรก
│   │   └── globals.css
│   ├── components/
│   │   └── ui/            # shadcn/ui components
│   └── lib/
│       ├── prisma.ts      # Prisma client
│       └── utils.ts       # Utility functions
├── docker-compose.yml     # Docker services configuration
├── docker-setup.ps1       # Windows setup script
├── docker-setup.sh        # Linux/Mac setup script
├── DOCKER.md             # Docker documentation
├── .env                  # ตัวแปร environment (ห้ามส่งไปใน Git)
├── .env.docker           # ตัวอย่าง env สำหรับ Docker
├── .env.example          # ตัวอย่างไฟล์ .env
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── components.json       # shadcn/ui configuration
└── next.config.ts
```

## การใช้งาน

### สำหรับผู้สมัคร (Guest)

1. เข้าหน้าเว็บหลัก
2. คลิก "สมัครเรียน"
3. กรอกข้อมูลในแบบฟอร์ม
4. เลือกหลักสูตรที่สนใจ
5. กดส่งใบสมัคร
6. รอการอนุมัติจากผู้ดูแลระบบ

### สำหรับผู้ดูแลระบบ (Admin)

1. เข้าหน้าเว็บหลัก
2. คลิก "จัดการระบบ"
3. เข้าสู่ระบบด้วย username และ password
4. ดูรายการผู้สมัครทั้งหมด
5. กรองรายการตามสถานะ
6. อนุมัติหรือปฏิเสธการสมัคร

## Prisma Commands

```bash
# สร้าง migration ใหม่
npx prisma migrate dev --name <migration-name>

# Push schema ไปยัง database
npx prisma db push

# เปิด Prisma Studio
npx prisma studio

# Generate Prisma Client
npx prisma generate

# Reset database
npx prisma migrate reset
```

## หลักสูตรที่มี

- Web Development
- Mobile App Development
- Data Science
- UX/UI Design
- Digital Marketing

## การพัฒนาเพิ่มเติม

### เพิ่มหลักสูตรใหม่

แก้ไขไฟล์ [src/app/register/page.tsx](src/app/register/page.tsx#L95-L101) ในส่วน dropdown หลักสูตร

### ปรับแต่ง UI

แก้ไฟล์ในโฟลเดอร์ `src/app/` และใช้ Tailwind CSS classes

### เพิ่มฟิลด์ข้อมูล

1. แก้ไฟล์ `prisma/schema.prisma`
2. รัน `npx prisma migrate dev`
3. อัพเดทฟอร์มและ API

## การแก้ไขปัญหา

### Database Connection Error

ตรวจสอบว่า:
- PostgreSQL กำลังรันอยู่ (หรือ Docker container ทำงาน)
- ข้อมูลใน `DATABASE_URL` ถูกต้อง
- Database มีอยู่จริง

**สำหรับ Docker:**
```bash
# ตรวจสอบ container
docker-compose ps

# ดู logs
docker-compose logs postgres

# Restart
docker-compose restart
```

### Prisma Client Error

รัน:
```bash
npx prisma generate
```

### Port 3000 ถูกใช้งานแล้ว

เปลี่ยน port:
```bash
PORT=3001 npm run dev
```

### Docker Port Already in Use

```bash
# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5432).OwningProcess

# หยุด Docker containers
docker-compose down

# หรือเปลี่ยน port ใน docker-compose.yml
# ports:
#   - "5433:5432"  # ใช้ port 5433 แทน
```

### Docker Container ไม่ทำงาน

```bash
# ลบและสร้างใหม่
docker-compose down -v
docker-compose up -d

# ตรวจสอบ logs
docker-compose logs -f
```

## เอกสารเพิ่มเติม

- [DOCKER.md](DOCKER.md) - คู่มือการใช้งาน Docker อย่างละเอียด
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

## Security Notice

⚠️ **สำคัญ**: ก่อนนำขึ้น production
1. เปลี่ยน admin password
2. ตั้งค่า `NEXTAUTH_SECRET` ใหม่
3. ใช้ HTTPS
4. เพิ่ม rate limiting
5. เพิ่มการตรวจสอบสิทธิ์ที่แข็งแกร่งกว่า localStorage

## License

MIT

## ผู้พัฒนา

สร้างด้วย ❤️ โดยใช้ Next.js และ Prisma
#   n b - s c h o o l  
 #   n b - s c h o o l  
 