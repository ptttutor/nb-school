# Project Architecture

## Overview

โปรเจคนี้ใช้ **Feature-based Architecture** ตามหลักการ **Domain-Driven Design** เพื่อความสามารถในการขยายและบำรุงรักษาได้ง่าย

## Core Principles

1. ✅ **App Router Only** - ใช้ Next.js App Router เท่านั้น
2. ✅ **Server Components Default** - ใช้ Server Components เป็นหลัก
3. ✅ **Feature-based Organization** - จัดโค้ดตาม Feature/Domain
4. ✅ **Thin Route Files** - `page.tsx` และ `layout.tsx` ต้องเบาและไม่มี business logic
5. ✅ **Separation of Concerns** - แยก UI, Logic, และ Data Access อย่างชัดเจน
6. ✅ **Composition over Duplication** - ใช้ Composition แทนการทำซ้ำ

## Folder Structure

### `/src/app/` - Routes & Pages
**Purpose**: จัดการ routing และ rendering เท่านั้น

- ไม่ควรมี business logic
- เรียกใช้ services และ features
- ส่ง props ให้ components
- Handle errors และ loading states

**Example**:
```tsx
// app/register/[grade]/page.tsx
import { RegistrationForm } from '@/features/registration/components';

export default function RegisterPage({ params }: { params: { grade: string } }) {
  return <RegistrationForm grade={params.grade} />;
}
```

### `/src/components/` - Shared Components
**Purpose**: Component ที่ใช้ร่วมกันทั้งโปรเจค

- UI components ที่ reusable
- shadcn/ui components
- Layout components
- ไม่มี business logic เฉพาะ feature

### `/src/features/` - Feature Modules
**Purpose**: จัดกลุ่มโค้ดตาม Feature/Domain

แต่ละ feature มี:
- `components/` - Components เฉพาะ feature นั้น
- `hooks/` - Custom hooks เฉพาะ feature
- `utils/` - Helper functions เฉพาะ feature (optional)

**Example Structure**:
```
features/
├── registration/
│   ├── components/
│   │   ├── RegistrationForm.tsx
│   │   ├── GradeSelector.tsx
│   │   └── RegistrationDetail.tsx
│   ├── hooks/
│   │   ├── useRegistrationForm.ts
│   │   └── useGradeValidation.ts
│   └── index.ts
│
└── admin/
    ├── components/
    │   ├── AdminDashboard.tsx
    │   ├── RegistrationTable.tsx
    │   └── RegistrationDrawer.tsx
    ├── hooks/
    │   ├── useAdminAuth.ts
    │   └── useRegistrationList.ts
    └── index.ts
```

### `/src/services/` - Business Logic & Data Access
**Purpose**: จัดการ business logic และ data operations

- **Single Responsibility**: 1 service = 1 domain
- ใช้ Prisma สำหรับ database operations
- ใช้ static methods (Class-based services)
- Return typed data จาก `/types/`

**Example**:
```typescript
// services/registration.service.ts
export class RegistrationService {
  static async getById(id: string): Promise<Registration | null> {
    return await prisma.registration.findUnique({ where: { id } });
  }

  static async create(data: RegistrationFormData): Promise<Registration> {
    return await prisma.registration.create({ data });
  }
}
```

### `/src/types/` - Type Definitions
**Purpose**: Central type definitions

- Interfaces และ Types ทั้งหมด
- แยกไฟล์ตาม domain
- Export centrally จาก `index.ts`

**Example**:
```typescript
// types/registration.types.ts
export interface Registration {
  id: string;
  gradeLevel: 'm1' | 'm4';
  status: 'pending' | 'approved' | 'rejected';
  // ...
}

export type GradeLevel = 'm1' | 'm4';
```

### `/src/hooks/` - Global Custom Hooks
**Purpose**: Hooks ที่ใช้ร่วมกันทั้งโปรเจค

- State management hooks
- Side-effect hooks
- Utility hooks

### `/src/lib/` - Libraries & Configurations
**Purpose**: External library configs และ utilities

- `prisma.ts` - Prisma client configuration
- `utils.ts` - Utility functions (cn, etc.)

### `/src/utils/` - Helper Functions
**Purpose**: Pure utility functions

- ไม่มี dependencies
- Pure functions เท่านั้น
- ใช้ร่วมกันได้ทั้งโปรเจค

## Data Flow

```
User Action
    ↓
Component (features/*/components/)
    ↓
Custom Hook (features/*/hooks/) [optional]
    ↓
API Route (app/api/*/)
    ↓
Service (services/*.service.ts)
    ↓
Prisma (lib/prisma.ts)
    ↓
Database
```

## Best Practices

### ✅ DO

1. **Keep route files thin**
   ```tsx
   // ✅ GOOD
   export default function Page() {
     return <Feature Component />;
   }
   ```

2. **Use services for data access**
   ```tsx
   // ✅ GOOD
   const registration = await RegistrationService.getById(id);
   ```

3. **Type everything**
   ```tsx
   // ✅ GOOD
   import type { Registration } from '@/types';
   ```

4. **Separate concerns**
   - Component = UI
   - Hook = State + Side Effects
   - Service = Data Access + Business Logic

### ❌ DON'T

1. **Don't put business logic in routes**
   ```tsx
   // ❌ BAD
   export default async function Page() {
     const data = await prisma.registration.findMany();
     // business logic here...
   }
   ```

2. **Don't duplicate types**
   ```tsx
   // ❌ BAD - define twice
   interface Registration { ... }
   ```

3. **Don't mix responsib ilities**
   ```tsx
   // ❌ BAD - component doing data access
   function Component() {
     const data = await fetch('/api/...');
   }
   ```

## Migration Guide

เมื่อต้องการ refactor existing code:

1. **สร้าง types ก่อน** - ใน `/src/types/`
2. **สร้าง service** - ย้าย data access logic ไปที่ `/src/services/`
3. **สร้าง feature components** - ย้าย component ไปที่ `/src/features/*/components/`
4. **สร้าง hooks ถ้าต้องการ** - แยก stateful logic ออกมา
5. **อัพเดท route files** - ให้เรียกใช้ services และ components ใหม่

## Example: Complete Feature

```
features/registration/
├── components/
│   ├── RegistrationForm.tsx          # Form component
│   ├── GradeInputSection.tsx         # Grade input section
│   └── RegistrationDetail.tsx        # Detail view component
│
├── hooks/
│   ├── useRegistrationForm.ts        # Form state management
│   └── useGradeValidation.ts         # Validation logic
│
└── index.ts                           # Public exports

services/
└── registration.service.ts            # Data access layer

types/
└── registration.types.ts              # Type definitions

app/
└── register/
    └── [grade]/
        └── page.tsx                   # Route (thin, calls feature)
```

## Benefits

✅ **Scalable** - เพิ่ม feature ใหม่ได้ง่าย  
✅ **Maintainable** - แก้ไขและ debug ได้ง่าย  
✅ **Testable** - Test แต่ละส่วนแยกกันได้  
✅ **AI-Friendly** - โครงสร้างชัดเจน AI เข้าใจง่าย  
✅ **Team-Friendly** - หลายคนทำงานร่วมกันได้ดี  

## References

- [Next.js App Router Best Practices](https://nextjs.org/docs/app)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
