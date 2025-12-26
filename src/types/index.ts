import { Timestamp } from 'firebase/firestore';

export type AddonCategory = 'UI' | 'Combat' | 'Utility' | 'Social' | 'Profession' | 'Other';

export type RequestStatus = 'requested' | 'in-progress' | 'completed' | 'rejected' | 'analyzing';

export type Priority = 'low' | 'medium' | 'high';

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  createdAt: Timestamp;
  isAdmin: boolean;
  replyTo?: string; // ID of the comment this is replying to
  replyToUserName?: string; // Name of the user being replied to
}

export interface AddonRequest {
  id: string;
  title: string;
  description: string;
  category: AddonCategory;
  status: RequestStatus;
  priority: Priority;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  userId: string;
  userName: string;
  userAvatar?: string;
  upvotes: number;
  upvotedBy: string[];
  comments: Comment[];
  screenshots?: string[];
  githubRepo?: string;
  downloadUrl?: string;
  tags?: string[];
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  isAdmin: boolean;
  createdAt: Timestamp;
}

