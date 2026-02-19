
export interface UserRecord {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface ProfileRecord {
  userId: string;
  name: string;
  email: string;
  syncedAt: string;
}

export type TabType = 'architecture' | 'user-service' | 'profile-service' | 'infrastructure';

export interface CodeSnippet {
  path: string;
  language: string;
  content: string;
}
