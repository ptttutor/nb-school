# Docker Quick Start Guide

## เริ่มต้นใช้งาน Docker สำหรับ Development

### 1. เริ่ม Database

```bash
docker-compose up -d
```

### 2. ตั้งค่า Environment

```bash
# Windows PowerShell
Copy-Item .env.docker .env

# Linux/Mac
cp .env.docker .env
```

### 3. Setup Database

```bash
npm install
npx prisma migrate dev --name init
npx tsx prisma/seed.ts
```

### 4. Run Development Server

```bash
npm run dev
```

เปิด http://localhost:3000

---

## Services

- **PostgreSQL**: localhost:5432
  - User: postgres
  - Password: postgres123
  - Database: course_registration

- **pgAdmin**: http://localhost:5050
  - Email: admin@admin.com
  - Password: admin123

---

## Docker Commands

```bash
# เริ่ม services
docker-compose up -d

# หยุด services
docker-compose stop

# ดู logs
docker-compose logs -f

# ลบ containers (เก็บข้อมูล)
docker-compose down

# ลบทั้ง containers และข้อมูล
docker-compose down -v

# เช็คสถานะ
docker-compose ps

# Restart services
docker-compose restart
```

---

## Prisma Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name <name>

# Push schema to DB
npx prisma db push

# Open Prisma Studio
npx prisma studio

# Reset database
npx prisma migrate reset
```

---

## Troubleshooting

### Port already in use

```bash
# หยุด container ที่ใช้ port นั้น
docker-compose down

# ตรวจสอบ process ที่ใช้ port 5432
# Windows
netstat -ano | findstr :5432

# Linux/Mac  
lsof -i :5432
```

### Database connection error

```bash
# ตรวจสอบว่า container ทำงาน
docker-compose ps

# ดู logs
docker-compose logs postgres

# Restart services
docker-compose restart
```

### Reset everything

```bash
# ลบทุกอย่างและเริ่มใหม่
docker-compose down -v
docker-compose up -d
npx prisma migrate reset
npx tsx prisma/seed.ts
```
