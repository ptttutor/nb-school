# Next.js Project Structure – Best Practice

## Overview
This document defines the **standard project structure and rules** for building scalable, maintainable Next.js applications.

- Framework: **Next.js 13+ (App Router)**
- Language: **TypeScript**
- Scale: Medium → Large / Production
- Goal: AI-readable, predictable, and feature-oriented architecture

---

## Core Principles

1. Use **App Router only**
2. Default to **Server Components**
3. Organize code by **Feature (Domain-based)**
4. Keep `page.tsx` and `layout.tsx` **thin**
5. Business logic must NOT live in route files
6. Separate UI, logic, and data access clearly
7. Prefer composition over duplication

---

## Root Folder Structure

```txt
src/
├─ app/
├─ components/
├─ features/
├─ hooks/
├─ lib/
├─ services/
├─ store/
├─ types/
├─ utils/
├─ styles/
└─ middleware.ts
