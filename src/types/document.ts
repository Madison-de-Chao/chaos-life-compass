export interface DocumentFile {
  id: string;
  fileName: string;
  originalName: string;
  uploadedBy: string;
  uploadedAt: Date;
  content: DocumentContent;
  shareSettings: ShareSettings;
}

export interface DocumentContent {
  title: string;
  sections: DocumentSection[];
}

export interface DocumentSection {
  id: string;
  type: 'heading' | 'paragraph' | 'table' | 'image' | 'quote';
  level?: number; // For headings: 1, 2, 3
  content: string;
  imageUrl?: string;
}

export interface ShareSettings {
  isPublic: boolean;
  password?: string;
  shareLink?: string;
  expiresAt?: Date;
}

export interface FileRecord {
  id: string;
  fileName: string;
  uploadedBy: string;
  uploadedAt: Date;
  viewCount: number;
  hasPassword: boolean;
}
