export type UserRole = 'student' | 'moderator' | 'admin';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  campusVerified: boolean;
  avatarUrl?: string;
  department: string;
  studentId: string;
  recoveryRating: number; // 0-100%
  stats: {
    lostReported: number;
    foundReported: number;
    recoveredCount: number;
  };
}

export type ItemType = 'lost' | 'found';

export type ItemCategory = 
  | 'electronics'
  | 'id_cards'
  | 'keys'
  | 'bags_wallets'
  | 'clothing'
  | 'books_stationery'
  | 'accessories'
  | 'other';

export type ItemStatus = 
  | 'draft'
  | 'active'
  | 'matched'
  | 'claim_pending'
  | 'verification'
  | 'handover_pending'
  | 'recovered'
  | 'expired'
  | 'cancelled'
  | 'disputed';

export type RiskTier = 1 | 2 | 3; // 1: Low-risk, 2: Personal, 3: High-Value / Sensitive

export interface Item {
  id: string;
  type: ItemType;
  category: ItemCategory;
  subcategory?: string;
  title: string;
  brand?: string;
  color?: string;
  locationId: string;
  locationName: string;
  incidentDate: string; // ISO date string
  approximateTime?: string;
  publicDescription: string;
  imageUrls: string[];
  status: ItemStatus;
  riskTier: RiskTier;
  reporterId: string;
  reporterName: string;
  hasPrivateEvidence: boolean;
  activeClaimId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VerificationFact {
  id: string;
  prompt: string; // e.g. "What stickers/markings are on the laptop lid?"
  expectedAnswer: string; // stored securely
  caseSensitive?: boolean;
}

export interface PrivateEvidence {
  itemId: string;
  reporterId: string;
  serialNumber?: string;
  serialNumberHash?: string;
  secretQuestions: VerificationFact[];
  finderPrivateNotes?: string;
  privateImageUrls?: string[];
  createdAt: string;
}

export interface MatchScoreDetails {
  categoryScore: number;
  brandScore: number;
  colorScore: number;
  locationScore: number;
  dateScore: number;
  textScore: number;
  identifierScore: number;
  totalScore: number;
}

export type MatchClassification = 'strong' | 'possible' | 'weak';

export interface MatchRecord {
  id: string;
  lostItemId: string;
  foundItemId: string;
  score: number;
  scoreDetails: MatchScoreDetails;
  classification: MatchClassification;
  status: 'open' | 'dismissed' | 'claimed' | 'resolved';
  createdAt: string;
}

export type ClaimStatus = 
  | 'pending_verification'
  | 'passed'
  | 'failed'
  | 'escalated'
  | 'approved'
  | 'rejected'
  | 'completed';

export interface Claim {
  id: string;
  foundItemId: string;
  lostItemId?: string;
  claimantId: string;
  claimantName: string;
  claimantEmail: string;
  status: ClaimStatus;
  submittedAnswers: Record<string, string>; // questionId -> answer
  attemptCount: number;
  maxAttempts: number;
  riskTier: RiskTier;
  moderatorRequired: boolean;
  moderatorNotes?: string;
  reviewedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export type HandoverStatus = 'pending' | 'ready' | 'completed' | 'cancelled';

export interface Handover {
  id: string;
  itemId: string;
  claimId: string;
  finderId: string;
  claimantId: string;
  locationName: string;
  handoverCode: string; // 6-digit OTP code (e.g. 748291)
  status: HandoverStatus;
  createdAt: string;
  completedAt?: string;
  verifiedBy: 'finder' | 'moderator';
}

export interface CampusNotification {
  id: string;
  recipientId: string;
  title: string;
  message: string;
  type: 'match_found' | 'claim_update' | 'handover_ready' | 'item_recovered' | 'escalation_alert';
  linkTarget?: string;
  read: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  action: 
    | 'REPORT_CREATED'
    | 'REPORT_EDITED'
    | 'MATCH_DETECTED'
    | 'CLAIM_SUBMITTED'
    | 'VERIFICATION_PASSED'
    | 'VERIFICATION_FAILED'
    | 'CLAIM_ESCALATED'
    | 'CLAIM_APPROVED'
    | 'CLAIM_REJECTED'
    | 'HANDOVER_SCHEDULED'
    | 'HANDOVER_COMPLETED'
    | 'ITEM_RECOVERED';
  targetType: 'item' | 'claim' | 'handover' | 'user';
  targetId: string;
  timestamp: string;
  metadata?: Record<string, any>;
}
