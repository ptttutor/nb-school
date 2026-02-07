import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      idCardOrPassport,
      isSpecialISM,
      gradeLevel,
      title,
      firstNameTH,
      lastNameTH,
      birthDate,
      ethnicity,
      nationality,
      religion,
      phone,
      siblings,
      siblingsInSchool,
      educationStatus,
      schoolName,
      schoolProvince,
      schoolDistrict,
      schoolSubdistrict,
      villageName,
      houseNumber,
      moo,
      road,
      soi,
      province,
      district,
      subdistrict,
      postalCode,
      // เกรดสำหรับ ม.1 (ป.5-6)
      scienceGradeP5,
      scienceGradeP6,
      mathGradeP5,
      mathGradeP6,
      // เกรดสำหรับ ม.4 (ม.1-3)
      scienceGradeM1,
      scienceGradeM2,
      scienceGradeM3,
      mathGradeM1,
      mathGradeM2,
      mathGradeM3,
    } = body;

    // Validate required fields
    if (!title || !firstNameTH || !lastNameTH || !birthDate || 
        !ethnicity || !nationality || !religion || !phone ||
        !houseNumber || !province || !district || !subdistrict || !postalCode) {
      return NextResponse.json(
        { error: "กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน" },
        { status: 400 }
      );
    }

    // ตรวจสอบเลขบัตรประชาชนซ้ำ
    if (idCardOrPassport && idCardOrPassport.trim()) {
      const existingRegistration = await prisma.registration.findFirst({
        where: { idCardOrPassport: idCardOrPassport.trim() }
      });

      if (existingRegistration) {
        return NextResponse.json(
          { error: "เลขบัตรประชาชน/หนังสือเดินทางนี้มีในระบบแล้ว กรุณาตรวจสอบการสมัครของคุณ" },
          { status: 409 }
        );
      }
    }

    // Create registration
    const registration = await prisma.registration.create({
      data: {
        idCardOrPassport,
        isSpecialISM: isSpecialISM !== undefined ? isSpecialISM : true,
        gradeLevel: gradeLevel || "m1",
        title,
        firstNameTH,
        lastNameTH,
        birthDate,
        ethnicity,
        nationality,
        religion,
        phone,
        siblings,
        siblingsInSchool,
        educationStatus,
        schoolName,
        schoolProvince,
        schoolDistrict,
        schoolSubdistrict,
        villageName,
        houseNumber,
        moo,
        road,
        soi,
        province,
        district,
        subdistrict,
        postalCode,
        // เกรดสำหรับ ม.1
        scienceGradeP5,
        scienceGradeP6,
        mathGradeP5,
        mathGradeP6,
        // เกรดสำหรับ ม.4
        scienceGradeM1,
        scienceGradeM2,
        scienceGradeM3,
        mathGradeM1,
        mathGradeM2,
        mathGradeM3,
        status: "pending",
      },
    });

    return NextResponse.json(
      { 
        message: "สมัครเรียนสำเร็จ",
        registration 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" },
      { status: 500 }
    );
  }
}
