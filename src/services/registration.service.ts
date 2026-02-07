// Registration Service - handles all registration-related data operations

import { prisma } from '@/lib/prisma';
import type { Registration, RegistrationFormData, RegistrationStatus, GradeData } from '@/types';

export class RegistrationService {
  /**
   * Create a new registration
   */
  static async create(data: Partial<RegistrationFormData>): Promise<Registration> {
    return await prisma.registration.create({
      data: {
        ...data,
        isSpecialISM: true,
        status: 'pending',
      } as any,
    }) as Registration;
  }

  /**
   * Get registration by ID
   */
  static async getById(id: string): Promise<Registration | null> {
    return await prisma.registration.findUnique({
      where: { id },
    }) as Registration | null;
  }

  /**
   * Get registration by ID card or passport
   */
  static async getByIdCard(idCard: string): Promise<Registration | null> {
    return await prisma.registration.findFirst({
      where: { idCardOrPassport: idCard.trim() },
    }) as Registration | null;
  }

  /**
   * Get all registrations
   */
  static async getAll(orderBy: 'asc' | 'desc' = 'desc'): Promise<Registration[]> {
    return await prisma.registration.findMany({
      orderBy: {
        createdAt: orderBy,
      },
    }) as Registration[];
  }

  /**
   * Update registration grades
   */
  static async updateGrades(id: string, grades: GradeData): Promise<Registration> {
    return await prisma.registration.update({
      where: { id },
      data: grades,
    }) as Registration;
  }

  /**
   * Update registration status
   */
  static async updateStatus(id: string, status: RegistrationStatus): Promise<Registration> {
    return await prisma.registration.update({
      where: { id },
      data: { status },
    }) as Registration;
  }

  /**
   * Add document to registration
   */
  static async addDocument(id: string, documentUrl: string): Promise<Registration> {
    const registration = await this.getById(id);
    if (!registration) {
      throw new Error('Registration not found');
    }

    return await prisma.registration.update({
      where: { id },
      data: {
        documents: [...registration.documents, documentUrl],
      },
    }) as Registration;
  }

  /**
   * Remove document from registration
   */
  static async removeDocument(id: string, documentUrl: string): Promise<Registration> {
    const registration = await this.getById(id);
    if (!registration) {
      throw new Error('Registration not found');
    }

    return await prisma.registration.update({
      where: { id },
      data: {
        documents: registration.documents.filter((doc: string) => doc !== documentUrl),
      },
    }) as Registration;
  }

  /**
   * Delete registration
   */
  static async delete(id: string): Promise<Registration> {
    return await prisma.registration.delete({
      where: { id },
    }) as Registration;
  }
}
