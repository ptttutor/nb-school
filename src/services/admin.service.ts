// Admin & News Service - handles admin and news operations

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import type { Admin, News, CreateNewsData, UpdateNewsData } from '@/types';

export class AdminService {
  /**
   * Verify admin credentials
   */
  static async login(username: string, password: string): Promise<Admin | null> {
    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return null;
    }

    return admin as Admin;
  }

  /**
   * Create admin (for seeding/setup only)
   */
  static async create(username: string, password: string): Promise<Admin> {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    return await prisma.admin.upsert({
      where: { username },
      update: {},
      create: {
        username,
        password: hashedPassword,
      },
    }) as Admin;
  }
}

export class NewsService {
  /**
   * Get all news (optionally filter by published status)
   */
  static async getAll(publishedOnly: boolean = false): Promise<News[]> {
    return await prisma.news.findMany({
      where: publishedOnly ? { published: true } : undefined,
      include: {
        admin: {
          select: {
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    }) as News[];
  }

  /**
   * Get news by ID
   */
  static async getById(id: string): Promise<News | null> {
    return await prisma.news.findUnique({
      where: { id },
      include: {
        admin: {
          select: {
            username: true,
          },
        },
      },
    }) as News | null;
  }

  /**
   * Create news
   */
  static async create(data: CreateNewsData): Promise<News> {
    return await prisma.news.create({
      data: {
        title: data.title,
        content: data.content,
        imageUrl: data.imageUrl || null,
        published: false,
        adminId: data.adminId,
      },
      include: {
        admin: {
          select: {
            username: true,
          },
        },
      },
    }) as News;
  }

  /**
   * Update news
   */
  static async update(id: string, data: UpdateNewsData): Promise<News> {
    return await prisma.news.update({
      where: { id },
      data,
      include: {
        admin: {
          select: {
            username: true,
          },
        },
      },
    }) as News;
  }

  /**
   * Toggle news published status
   */
  static async togglePublished(id: string, published: boolean): Promise<News> {
    return await prisma.news.update({
      where: { id },
      data: { published },
      include: {
        admin: {
          select: {
            username: true,
          },
        },
      },
    }) as News;
  }

  /**
   * Delete news
   */
  static async delete(id: string): Promise<News> {
    return await prisma.news.delete({
      where: { id },
    }) as News;
  }
}
