// RegistrationInfo Component - Display detailed registration information

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { Registration } from "@/types/registration.types";

interface RegistrationInfoProps {
  registration: Registration;
  gradeText: string;
}

export function RegistrationInfo({ registration, gradeText }: RegistrationInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">รายละเอียดการสมัคร</CardTitle>
      </CardHeader>
      <CardContent>
        {/* ข้อมูลพื้นฐาน */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-600">ระดับชั้นที่สมัคร</Label>
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-600 text-white">
                {registration.gradeLevel === "m4" ? "ม.4" : "ม.1"}
              </Badge>
              <span className="font-medium">{gradeText}</span>
            </div>
          </div>
          <div>
            <Label className="text-gray-600">คำนำหน้า</Label>
            <p className="font-medium">{registration.title}</p>
          </div>
          <div>
            <Label className="text-gray-600">ชื่อ-นามสกุล</Label>
            <p className="font-medium">
              {registration.firstNameTH} {registration.lastNameTH}
            </p>
          </div>
          {registration.idCardOrPassport && (
            <div>
              <Label className="text-gray-600">เลขบัตรประชาชน/พาสปอร์ต</Label>
              <p className="font-medium">{registration.idCardOrPassport}</p>
            </div>
          )}
          <div>
            <Label className="text-gray-600">วัน/เดือน/ปีเกิด</Label>
            <p className="font-medium">
              {new Date(registration.birthDate).toLocaleDateString("th-TH", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div>
            <Label className="text-gray-600">เชื้อชาติ</Label>
            <p className="font-medium">{registration.ethnicity}</p>
          </div>
          <div>
            <Label className="text-gray-600">สัญชาติ</Label>
            <p className="font-medium">{registration.nationality}</p>
          </div>
          <div>
            <Label className="text-gray-600">ศาสนา</Label>
            <p className="font-medium">{registration.religion}</p>
          </div>
          <div>
            <Label className="text-gray-600">เบอร์โทรศัพท์</Label>
            <p className="font-medium">{registration.phone}</p>
          </div>
        </div>

        {/* ข้อมูลการศึกษา */}
        {registration.schoolName && (
          <EducationSection registration={registration} />
        )}

        {/* ที่อยู่ */}
        <AddressSection registration={registration} />

        {/* ข้อมูลครอบครัว */}
        {(registration.siblings || registration.siblingsInSchool) && (
          <FamilySection registration={registration} />
        )}
      </CardContent>
    </Card>
  );
}

function EducationSection({ registration }: { registration: Registration }) {
  return (
    <div className="mt-6 pt-6 border-t">
      <h3 className="font-semibold mb-4">ข้อมูลการศึกษา</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {registration.educationStatus && (
          <div>
            <Label className="text-gray-600">สถานะการศึกษา</Label>
            <p className="font-medium">{registration.educationStatus}</p>
          </div>
        )}
        <div>
          <Label className="text-gray-600">โรงเรียน</Label>
          <p className="font-medium">{registration.schoolName}</p>
        </div>
        {registration.schoolProvince && (
          <div>
            <Label className="text-gray-600">จังหวัด</Label>
            <p className="font-medium">{registration.schoolProvince}</p>
          </div>
        )}
        {registration.schoolDistrict && (
          <div>
            <Label className="text-gray-600">อำเภอ</Label>
            <p className="font-medium">{registration.schoolDistrict}</p>
          </div>
        )}
        {registration.schoolSubdistrict && (
          <div>
            <Label className="text-gray-600">ตำบล</Label>
            <p className="font-medium">{registration.schoolSubdistrict}</p>
          </div>
        )}
      </div>

      {/* Grades */}
      {registration.gradeLevel === "m4" ? (
        <M4GradesSection registration={registration} />
      ) : (
        <M1GradesSection registration={registration} />
      )}
    </div>
  );
}

function M4GradesSection({ registration }: { registration: Registration }) {
  if (!registration.scienceCumulativeM1M3 && 
      !registration.mathCumulativeM1M3 && 
      !registration.englishCumulativeM1M3) {
    return null;
  }

  return (
    <div className="mt-4 pt-4 border-t">
      <h4 className="font-semibold mb-3 text-green-700">
        คะแนนเฉลี่ยสะสม (ม.1-3 จำนวน 5 ภาคเรียน)
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {registration.scienceCumulativeM1M3 && (
          <div>
            <Label className="text-gray-600">วิทยาศาสตร์</Label>
            <p className="font-medium text-green-600">
              {registration.scienceCumulativeM1M3}
            </p>
          </div>
        )}
        {registration.mathCumulativeM1M3 && (
          <div>
            <Label className="text-gray-600">คณิตศาสตร์</Label>
            <p className="font-medium text-green-600">
              {registration.mathCumulativeM1M3}
            </p>
          </div>
        )}
        {registration.englishCumulativeM1M3 && (
          <div>
            <Label className="text-gray-600">ภาษาอังกฤษ</Label>
            <p className="font-medium text-green-600">
              {registration.englishCumulativeM1M3}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function M1GradesSection({ registration }: { registration: Registration }) {
  if (!registration.gradeP4 && !registration.gradeP5) {
    return null;
  }

  return (
    <div className="mt-4 pt-4 border-t">
      <h4 className="font-semibold mb-3 text-green-700">เกรดเฉลี่ย</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {registration.gradeP4 && (
          <div>
            <Label className="text-gray-600">ประถมศึกษาปีที่ 4</Label>
            <p className="font-medium text-green-600">{registration.gradeP4}</p>
          </div>
        )}
        {registration.gradeP5 && (
          <div>
            <Label className="text-gray-600">ประถมศึกษาปีที่ 5</Label>
            <p className="font-medium text-green-600">{registration.gradeP5}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function AddressSection({ registration }: { registration: Registration }) {
  return (
    <div className="mt-6 pt-6 border-t">
      <h3 className="font-semibold mb-4">ที่อยู่ตามทะเบียนบ้าน</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {registration.villageName && (
          <div>
            <Label className="text-gray-600">หมู่บ้าน</Label>
            <p className="font-medium">{registration.villageName}</p>
          </div>
        )}
        <div>
          <Label className="text-gray-600">บ้านเลขที่</Label>
          <p className="font-medium">{registration.houseNumber}</p>
        </div>
        {registration.moo && (
          <div>
            <Label className="text-gray-600">หมู่ที่</Label>
            <p className="font-medium">{registration.moo}</p>
          </div>
        )}
        {registration.soi && (
          <div>
            <Label className="text-gray-600">ซอย</Label>
            <p className="font-medium">{registration.soi}</p>
          </div>
        )}
        {registration.road && (
          <div>
            <Label className="text-gray-600">ถนน</Label>
            <p className="font-medium">{registration.road}</p>
          </div>
        )}
        <div>
          <Label className="text-gray-600">ตำบล/แขวง</Label>
          <p className="font-medium">{registration.subdistrict}</p>
        </div>
        <div>
          <Label className="text-gray-600">อำเภอ/เขต</Label>
          <p className="font-medium">{registration.district}</p>
        </div>
        <div>
          <Label className="text-gray-600">จังหวัด</Label>
          <p className="font-medium">{registration.province}</p>
        </div>
        <div>
          <Label className="text-gray-600">รหัสไปรษณีย์</Label>
          <p className="font-medium">{registration.postalCode}</p>
        </div>
      </div>
    </div>
  );
}

function FamilySection({ registration }: { registration: Registration }) {
  return (
    <div className="mt-6 pt-6 border-t">
      <h3 className="font-semibold mb-4">ข้อมูลครอบครัว</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {registration.siblings && (
          <div>
            <Label className="text-gray-600">จำนวนพี่น้อง</Label>
            <p className="font-medium">{registration.siblings} คน</p>
          </div>
        )}
        {registration.siblingsInSchool && (
          <div>
            <Label className="text-gray-600">พี่น้องที่เรียนโรงเรียนนี้</Label>
            <p className="font-medium">{registration.siblingsInSchool} คน</p>
          </div>
        )}
      </div>
    </div>
  );
}
