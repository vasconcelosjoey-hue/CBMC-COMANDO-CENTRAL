
export enum Role {
  PRESIDENTE = 'Presidente',
  VICE_PRESIDENTE = 'Vice-presidente',
  TESOUREIRO = 'Tesoureiro',
  PREFEITO = 'Prefeito',
  SECRETARIO = 'Secretário',
  CAPITAO_ESTRADA = 'Capitão de Estrada',
  SARGENTO_ARMAS = 'Sargento de Armas',
  MEMBRO = 'Membro',
  PROSPERO = 'Próspero'
}

export enum MemberStatus {
  ATIVO = 'Ativo',
  AFASTADO = 'Afastado',
  PUNIDO = 'Punido',
  PROSPERO = 'Em Próspero'
}

export enum PaymentStatus {
  PAGO = 'Pago',
  ATRASO = 'Em atraso'
}

export interface Member {
  id: string;
  cumbraId: string; // Número oficial (F4-01, 10, etc)
  name: string;
  fullName: string;
  role: Role;
  roleHistory: string[];
  joinDate: string;
  status: MemberStatus;
  paymentStatus: PaymentStatus;
  adminNotes?: string;
  photoUrl?: string;
}

export interface Announcement {
  id: string;
  author: string;
  authorRole: Role;
  date: string;
  title: string;
  content: string;
}

export interface ClubEvent {
  id: string;
  title: string;
  date: string;
  type: 'VISITA' | 'REUNIAO' | 'ANIVERSARIO' | 'GIRO' | 'MANUTENCAO' | 'OUTRO';
  location: string;
  responsible: string;
  isOfficial: boolean;
  participants?: string[];
}

export interface ArchiveItem {
  id: string;
  title: string;
  year: number;
  type: 'image' | 'video';
  url: string;
  eventId?: string;
}
