
import { Role, MemberStatus, PaymentStatus, Member, Announcement, ClubEvent } from './types';

export const ROLES_HIERARCHY: Role[] = [
  Role.PRESIDENTE,
  Role.VICE_PRESIDENTE,
  Role.TESOUREIRO,
  Role.PREFEITO,
  Role.SECRETARIO,
  Role.CAPITAO_ESTRADA,
  Role.SARGENTO_ARMAS,
  Role.MEMBRO,
  Role.PROSPERO
];

// ORDEM INSTITUCIONAL EXATA DA LISTA OFICIAL
export const MOCK_MEMBERS: Member[] = [
  {
    id: 'm1',
    cumbraId: 'F4-01',
    name: 'JOHNNY',
    fullName: 'JOSÉ ABENILDO QUARESMA DOS SANTOS',
    role: Role.SARGENTO_ARMAS,
    roleHistory: ['Sargento de Armas', 'Capitão de Estrada'],
    joinDate: '1969 01 26',
    status: MemberStatus.ATIVO,
    paymentStatus: PaymentStatus.PAGO,
    photoUrl: 'https://picsum.photos/seed/johnny/200/200'
  },
  {
    id: 'm2',
    cumbraId: 'F4-02',
    name: 'ZANGGADO',
    fullName: 'MÁRCIO AURÉLIO CUNHA DE OLIVEIRA',
    role: Role.VICE_PRESIDENTE,
    roleHistory: ['Vice Presidente'],
    joinDate: '1971 02 27',
    status: MemberStatus.ATIVO,
    paymentStatus: PaymentStatus.PAGO,
    photoUrl: 'https://picsum.photos/seed/zanggado/200/200'
  },
  {
    id: 'm3',
    cumbraId: 'F4-03',
    name: 'PERVERSO',
    fullName: 'ADRIANO JOSÉ QUARESMA DOS SANTOS',
    role: Role.PRESIDENTE,
    roleHistory: ['Presidente'],
    joinDate: '1972 06 06',
    status: MemberStatus.ATIVO,
    paymentStatus: PaymentStatus.PAGO,
    photoUrl: 'https://picsum.photos/seed/perverso/200/200'
  },
  {
    id: 'm10',
    cumbraId: '10',
    name: 'MESTRE',
    fullName: 'CLAYBSON AVELINO DOS SANTOS MOURA',
    role: Role.TESOUREIRO,
    roleHistory: ['Tesoureiro', 'Capitão de Estrada'],
    joinDate: '1986 09 26',
    status: MemberStatus.ATIVO,
    paymentStatus: PaymentStatus.PAGO,
    photoUrl: 'https://picsum.photos/seed/mestre/200/200'
  },
  {
    id: 'm11',
    cumbraId: '11',
    name: 'KUARENTA',
    fullName: 'AILTON FRANCISCO GUEDES',
    role: Role.MEMBRO,
    roleHistory: ['Membro'],
    joinDate: '1973 03 23',
    status: MemberStatus.ATIVO,
    paymentStatus: PaymentStatus.PAGO,
    photoUrl: 'https://picsum.photos/seed/kuarenta/200/200'
  },
  {
    id: 'm12',
    cumbraId: '12',
    name: 'BOB PAI',
    fullName: 'JOCELEM BEZERRA DO NASCIMENTO',
    role: Role.MEMBRO,
    roleHistory: ['Membro'],
    joinDate: '1965 12 06',
    status: MemberStatus.ATIVO,
    paymentStatus: PaymentStatus.PAGO,
    photoUrl: 'https://picsum.photos/seed/bobpai/200/200'
  },
  {
    id: 'm15',
    cumbraId: '15',
    name: 'DRÁKULA',
    fullName: 'ARISTÓTELES DANTAS BARBOSA',
    role: Role.MEMBRO,
    roleHistory: ['Membro'],
    joinDate: '1978 10 19',
    status: MemberStatus.ATIVO,
    paymentStatus: PaymentStatus.PAGO,
    photoUrl: 'https://picsum.photos/seed/drakula/200/200'
  },
  {
    id: 'm16',
    cumbraId: '16',
    name: 'MARCÃO',
    fullName: 'MARCOS AURÉLIO DO NASCIMENTO',
    role: Role.PREFEITO,
    roleHistory: ['Prefeito'],
    joinDate: '1968 11 05',
    status: MemberStatus.ATIVO,
    paymentStatus: PaymentStatus.PAGO,
    photoUrl: 'https://picsum.photos/seed/marcao/200/200'
  },
  {
    id: 'm17',
    cumbraId: '17',
    name: 'BACON',
    fullName: 'FRANCIS RANES DA SILVA FRANÇA',
    role: Role.MEMBRO,
    roleHistory: ['Membro'],
    joinDate: '1984 03 15',
    status: MemberStatus.ATIVO,
    paymentStatus: PaymentStatus.PAGO,
    photoUrl: 'https://picsum.photos/seed/bacon/200/200'
  },
  {
    id: 'm20',
    cumbraId: '20',
    name: 'PAUL',
    fullName: 'PAULIELISON CAVALCANTE DE PAIVA',
    role: Role.MEMBRO,
    roleHistory: ['Membro'],
    joinDate: '1992 11 20',
    status: MemberStatus.ATIVO,
    paymentStatus: PaymentStatus.PAGO,
    photoUrl: 'https://picsum.photos/seed/paul/200/200'
  },
  {
    id: 'm23',
    cumbraId: '23',
    name: 'JONAS',
    fullName: 'WELTON JONATHA C DA S SIQUEIRA',
    role: Role.MEMBRO,
    roleHistory: ['Membro'],
    joinDate: '1994 03 17',
    status: MemberStatus.ATIVO,
    paymentStatus: PaymentStatus.PAGO,
    photoUrl: 'https://picsum.photos/seed/jonas/200/200'
  },
  {
    id: 'm24',
    cumbraId: '24',
    name: 'JB',
    fullName: 'JOEY GONZAGA DE VASCONCELOS',
    role: Role.SECRETARIO,
    roleHistory: ['Secretário'],
    joinDate: '1987 08 24',
    status: MemberStatus.ATIVO,
    paymentStatus: PaymentStatus.PAGO,
    photoUrl: 'https://picsum.photos/seed/jb/200/200'
  },
  {
    id: 'm25',
    cumbraId: '25',
    name: 'KATATAU',
    fullName: 'ANDERSON OLIVEIRA DA SILVA',
    role: Role.MEMBRO,
    roleHistory: ['Membro'],
    joinDate: '1989 11 27',
    status: MemberStatus.ATIVO,
    paymentStatus: PaymentStatus.PAGO,
    photoUrl: 'https://picsum.photos/seed/katatau/200/200'
  },
  {
    id: 'm26',
    cumbraId: '-',
    name: 'MOCO',
    fullName: 'JOÃO MARCOS GOMES DE LIMA',
    role: Role.PROSPERO,
    roleHistory: ['Próspero'],
    joinDate: '1991 12 17',
    status: MemberStatus.PROSPERO,
    paymentStatus: PaymentStatus.PAGO,
    photoUrl: 'https://picsum.photos/seed/moco/200/200'
  },
  {
    id: 'm27',
    cumbraId: '-',
    name: 'JAKÃO',
    fullName: 'MÁRCIO ROBERTO DA SILVA ARAÚJO',
    role: Role.PROSPERO,
    roleHistory: ['Próspero'],
    joinDate: '1979 01 16',
    status: MemberStatus.PROSPERO,
    paymentStatus: PaymentStatus.PAGO,
    photoUrl: 'https://picsum.photos/seed/jakao/200/200'
  }
];

export const MOCK_EVENTS: ClubEvent[] = [
  { id: 'jan 10', title: 'REUNIÃO DE ATA', date: '2026-01-10', type: 'REUNIAO', location: 'SEDE CBMC', responsible: 'DIA INTEIRO', isOfficial: true },
  { id: 'jan 16', title: 'JAKÃO', date: '2026-01-16', type: 'ANIVERSARIO', location: 'X', responsible: 'ANIVERSÁRIO', isOfficial: false },
  { id: 'jan 18', title: 'CAFÉ NA ESTRADA', date: '2026-01-18', type: 'GIRO', location: 'X', responsible: 'DIA INTEIRO', isOfficial: true },
  { id: 'jan 26', title: 'JOHNNY', date: '2026-01-26', type: 'ANIVERSARIO', location: 'X', responsible: 'ANIVERSÁRIO', isOfficial: false },
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a1',
    title: 'ATUALIZAÇÃO GERAL',
    content: 'Todas as escalas de manutenção e visitas para o ano de 2026 foram publicadas. Favor consultar o calendário e a escala de manutenção mensal.',
    author: 'F4-03 PERVERSO',
    authorRole: Role.PRESIDENTE,
    date: '2026-01-06'
  }
];
