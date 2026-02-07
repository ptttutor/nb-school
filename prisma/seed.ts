const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Creating admin user...");

  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.admin.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: hashedPassword,
    },
  });

  console.log("Admin user created successfully!");
  console.log("Username: admin");
  console.log("Password: admin123");

  // Create sample news
  console.log("\nCreating sample news...");

  await prisma.news.createMany({
    data: [
      {
        title: "เปิดรับสมัครเรียน ประจำเทอม 1/2567",
        content: "ขณะนี้เปิดรับสมัครเรียนแล้ว สำหรับหลักสูตรต่างๆ ในภาคเรียนที่ 1 ปีการศึกษา 2567 สามารถสมัครได้ตั้งแต่บัดนี้จนถึงวันที่ 31 มีนาคม 2567 มีหลากหลายหลักสูตรให้เลือกเรียน",
        published: true,
        adminId: admin.id,
      },
      {
        title: "ประกาศผลการสอบคัดเลือก รอบที่ 1",
        content: "สามารถตรวจสอบผลการสอบคัดเลือกเข้าศึกษาต่อ รอบที่ 1 ได้แล้ววันนี้ ผู้ที่ผ่านการคัดเลือกต้องมารายงานตัวภายในวันที่กำหนด พร้อมเอกสารประกอบครบถ้วน",
        published: true,
        adminId: admin.id,
      },
      {
        title: "กำหนดการปฐมนิเทศนักเรียนใหม่",
        content: "ขอเชิญนักเรียนใหม่ทุกท่านเข้าร่วมงานปฐมนิเทศ ในวันที่ 1 เมษายน 2567 เวลา 09:00 น. ณ หอประชุมใหญ่ เพื่อรับทราบข้อมูลสำคัญเกี่ยวกับการเรียนการสอน",
        published: true,
        adminId: admin.id,
      },
    ],
  });

  console.log("Sample news created successfully!");
  console.log("\n⚠️ Please change the default password in production!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
