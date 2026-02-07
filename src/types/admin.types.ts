// Admin & News Types

export interface Admin {
  id: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminLoginCredentials {
  username: string;
  password: string;
}

export interface AdminLoginResponse {
  admin: {
    id: string;
    username: string;
  };
}

export interface News {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  adminId: string;
  admin?: {
    username: string;
  };
}

export interface NewsFormData {
  title: string;
  content: string;
  imageUrl: string;
}

export interface CreateNewsData extends NewsFormData {
  adminId: string;
}

export interface UpdateNewsData {
  title?: string;
  content?: string;
  imageUrl?: string;
  published?: boolean;
}
