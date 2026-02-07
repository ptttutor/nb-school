export interface HeroImage {
  id: string;
  imageUrl: string;
  title?: string | null;
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
