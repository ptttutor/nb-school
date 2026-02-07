// Admission Service - handles admission settings

import { prisma } from '@/lib/prisma';
import type { AdmissionSettings, GradeLevel } from '@/types/registration.types';

export class AdmissionService {
  /**
   * Get admission settings by grade level
   */
  static async getByGrade(gradeLevel: GradeLevel): Promise<AdmissionSettings | null> {
    const settings = await prisma.admissionSettings.findFirst({
      where: { gradeLevel },
    });
    
    return settings as AdmissionSettings | null;
  }

  /**
   * Check if admission is open for a grade level
   */
  static async isOpen(gradeLevel: GradeLevel): Promise<boolean> {
    const settings = await this.getByGrade(gradeLevel);
    return settings?.isOpen ?? false;
  }

  /**
   * Get all admission settings
   */
  static async getAll(): Promise<AdmissionSettings[]> {
    return await prisma.admissionSettings.findMany() as AdmissionSettings[];
  }

  /**
   * Update admission settings
   */
  static async update(
    gradeLevel: GradeLevel,
    data: Partial<AdmissionSettings>
  ): Promise<AdmissionSettings> {
    return await prisma.admissionSettings.update({
      where: { gradeLevel },
      data,
    }) as AdmissionSettings;
  }

  /**
   * Create admission settings
   */
  static async create(data: Omit<AdmissionSettings, 'id' | 'createdAt' | 'updatedAt'>): Promise<AdmissionSettings> {
    return await prisma.admissionSettings.create({
      data,
    }) as AdmissionSettings;
  }
}
