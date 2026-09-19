export type JarvisMode = 'HYBRID' | 'LOCAL' | 'ONLINE' | 'AI_CHAT' | 'DEVICE';

export type NetworkStatus = 'ONLINE' | 'OFFLINE';

export type GeminiStatus = 'CONNECTED' | 'DISCONNECTED' | 'CHECKING' | 'RESTRICTED';

export type ActionStatus =
  | 'IDLE'
  | 'LISTENING'
  | 'EXECUTING'
  | 'SUCCESS'
  | 'FAILED'
  | 'ERROR'
  | 'TIMEOUT'
  | 'NOT_AVAILABLE'
  | 'REQUIRES_CONFIRMATION';

export type CommandRoute = 'LOCAL' | 'ONLINE' | 'AI_CHAT' | 'DEVICE' | 'HYBRID';

export interface CommandHistoryItem {
  id: string;
  timestamp: string;
  command: string;
  route: CommandRoute;
  action: string;
  status: ActionStatus;
  resultMessage: string;
  verified: boolean;
  requiresConfirmation?: boolean;
}

export interface ProjectFileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  content?: string;
  children?: ProjectFileNode[];
}

export interface SecurityConfirmationState {
  isOpen: boolean;
  command: string;
  action: string;
  riskLevel: 'MODERATE' | 'CRITICAL';
  description: string;
  resolveCallback?: (confirmed: boolean) => void;
}
