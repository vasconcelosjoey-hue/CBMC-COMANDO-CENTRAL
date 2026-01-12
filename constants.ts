
import { Role, MemberStatus, PaymentStatus, Member, Announcement, ClubEvent } from './types';

export const ROLES_HIERARCHY: Role[] = [
  Role.PRESIDENTE,
  Role.VICE_PRESIDENTE,
  Role.TESOUREIRO,
  Role.PREFEITO,
  Role.SECRETARIO,
  Role.CAPITAO_ESTRADA,
  Role.SARGENTO_ARMAS,
  Role.MEMBRO
];

export const MOCK_MEMBERS: Member[] = [
  {
    id: 'm1',
    cumbraId: 'F4 01',
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
    cumbraId: 'F4 02',
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
    cumbraId: 'F4 03',
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
    id: 'm22',
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
    role: Role.MEMBRO,
    roleHistory: ['Membro'],
    joinDate: '1991 12 17',
    status: MemberStatus.ATIVO,
    paymentStatus: PaymentStatus.PAGO,
    photoUrl: 'https://picsum.photos/seed/moco/200/200'
  },
  {
    id: 'm27',
    cumbraId: '-',
    name: 'JAKÃO',
    fullName: 'MÁRCIO ROBERTO DA SILVA ARAÚJO',
    role: Role.MEMBRO,
    roleHistory: ['Membro'],
    joinDate: '1979 01 16',
    status: MemberStatus.ATIVO,
    paymentStatus: PaymentStatus.PAGO,
    photoUrl: 'https://picsum.photos/seed/jakao/200/200'
  }
];

export const MOCK_EVENTS: ClubEvent[] = [
  // JANEIRO 2026
  { id: 'jan 10', title: 'REUNIÃO DE ATA', date: '2026-01-10', type: 'REUNIAO', location: 'SEDE CBMC', responsible: 'DIA INTEIRO', isOfficial: true },
  { id: 'jan 16', title: 'JAKÃO', date: '2026-01-16', type: 'ANIVERSARIO', location: 'X', responsible: 'ANIVERSÁRIO', isOfficial: false },
  { id: 'jan 18', title: 'CAFÉ NA ESTRADA', date: '2026-01-18', type: 'GIRO', location: 'X', responsible: 'DIA INTEIRO', isOfficial: true },
  { id: 'jan 26', title: 'JOHNNY', date: '2026-01-26', type: 'ANIVERSARIO', location: 'X', responsible: 'ANIVERSÁRIO', isOfficial: false },
  { id: 'jan 30', title: 'GIRO NOTURNO', date: '2026-01-30', type: 'GIRO', location: 'X', responsible: 'DIA INTEIRO', isOfficial: true },
  { id: 'jan 31', title: 'VISITA AO CUMPADRE', date: '2026-01-31', type: 'VISITA', location: 'KUARENTA', responsible: 'DIA INTEIRO', isOfficial: true },

  // FEVEREIRO 2026
  { id: 'feb 01', title: 'MANUTENÇÃO GERAL', date: '2026-02-01', type: 'MANUTENCAO', location: 'SEDE CBMC', responsible: 'DIA INTEIRO', isOfficial: true },
  { id: 'feb 14', title: 'REUNIÃO DE ATA', date: '2026-02-14', type: 'REUNIAO', location: 'SEDE CBMC', responsible: 'DIA INTEIRO', isOfficial: true },
  { id: 'feb 15', title: 'CAFÉ NA ESTRADA', date: '2026-02-15', type: 'GIRO', location: 'X', responsible: 'DIA INTEIRO', isOfficial: true },
  { id: 'feb 27 giro', title: 'GIRO NOTURNO', date: '2026-02-27', type: 'GIRO', location: 'X', responsible: 'DIA INTEIRO', isOfficial: true },
  { id: 'feb 27 ani', title: 'ZANGGADO', date: '2026-02-27', type: 'ANIVERSARIO', location: 'X', responsible: 'ANIVERSÁRIO', isOfficial: false },
  { id: 'feb 28', title: 'VISITA AO CUMPADRE', date: '2026-02-28', type: 'VISITA', location: 'DRÁKULA', responsible: 'DIA INTEIRO', isOfficial: true },

  // MARÇO 2026
  { id: 'mar 14', title: 'REUNIÃO DE ATA', date: '2026-03-14', type: 'REUNIAO', location: 'SEDE CBMC', responsible: 'DIA INTEIRO', isOfficial: true },
  { id: 'mar 15 ani', title: 'BACON', date: '2026-03-15', type: 'ANIVERSARIO', location: 'X', responsible: 'ANIVERSÁRIO', isOfficial: false },
  { id: 'mar 15 cafe', title: 'CAFÉ NA ESTRADA', date: '2026-03-15', type: 'GIRO', location: 'X', responsible: 'DIA INTEIRO', isOfficial: true },
  { id: 'mar 17 ani', title: 'JONAS', date: '2026-03-17', type: 'ANIVERSARIO', location: 'X', responsible: 'ANIVERSÁRIO', isOfficial: false },
  { id: 'mar 23 ani', title: 'KUARENTA', date: '2026-03-23', type: 'ANIVERSARIO', location: 'X', responsible: 'ANIVERSÁRIO', isOfficial: false },
  { id: 'mar 27 giro', title: 'GIRO NOTURNO', date: '2026-03-27', type: 'GIRO', location: 'X', responsible: 'DIA INTEIRO', isOfficial: true },
  { id: 'mar 28 visita', title: 'VISITA AO CUMPADRE', date: '2026-03-28', type: 'VISITA', location: 'MARCÃO', responsible: 'DIA INTEIRO', isOfficial: true },

  // ABRIL 2026
  { id: 'apr 05', title: 'MANUTENÇÃO GERAL', date: '2026-04-05', type: 'MANUTENCAO', location: 'SEDE CBMC', responsible: 'DIA INTEIRO', isOfficial: true },
  { id: 'apr 11', title: 'REUNIÃO DE ATA', date: '2026-04-11', type: 'REUNIAO', location: 'SEDE CBMC', responsible: 'DIA INTEIRO', isOfficial: true },
  { id: 'apr 19', title: 'CAFÉ NA ESTRADA', date: '2026-04-19', type: 'GIRO', location: 'SEDE CBMC', responsible: 'MANHÃ', isOfficial: true },
  { id: 'apr 24', title: 'GIRO NOTURNO', date: '2026-04-24', type: 'GIRO', location: 'X', responsible: 'DIA INTEIRO', isOfficial: true },
  { id: 'apr 25', title: 'VISITA AO CUMPADRE', date: '2026-04-25', type: 'VISITA', location: 'BACON', responsible: 'DIA INTEIRO', isOfficial: true },

  // MAIO 2026
  { id: 'mai 09', title: 'REUNIÃO DE ATA', date: '2026-05-09', type: 'REUNIAO', location: 'SEDE CBMC', responsible: 'DIA INTEIRO', isOfficial: true },
  { id: 'mai 17', title: 'CAFÉ NA ESTRADA', date: '2026-05-17', type: 'GIRO', location: 'X', responsible: 'DIA INTEIRO', isOfficial: true },
  { id: 'mai 29', title: 'GIRO NOTURNO', date: '2026-05-29', type: 'GIRO', location: 'X', responsible: 'DIA INTEIRO', isOfficial: true },
  { id: 'mai 30', title: 'VISITA AO CUMPADRE', date: '2026-05-30', type: 'VISITA', location: 'PAUL', responsible: 'DIA INTEIRO', isOfficial: true },

  // JUNHO 2026
  { id: 'jun 06', title: 'PERVERSO', date: '2026-06-06', type: 'ANIVERSARIO', location: 'X', responsible: 'ANIVERSÁRIO', isOfficial: false },
  { id: 'jun 07', title: 'MANUTENÇÃO GERAL', date: '2026-06-07', type: 'MANUTENCAO', location: 'SEDE CBMC', responsible: 'DIA INTEIRO', isOfficial: true },
  { id: 'jun 13', title: 'REUNIÃO DE ATA', date: '2026-06-13', type: 'REUNIAO', location: 'SEDE CBMC', responsible: 'DIA INTEIRO', isOfficial: true },
  { id: 'jun 21', title: 'CAFÉ NA ESTRADA', date: '2026-06-21', type: 'GIRO', location: 'X', responsible: 'DIA INTEIRO', isOfficial: true },
  { id: 'jun 26', title: 'GIRO NOTURNO', date: '2026-06-26', type: 'GIRO', location: 'X', responsible: 'DIA INTEIRO', isOfficial: true },
  { id: 'jun 27', title: 'VISITA AO CUMPADRE', date: '2026-06-27', type: 'VISITA', location: 'JONAS', responsible: 'DIA INTEIRO', isOfficial: true },

  // JULHO 2026
  { id: 'jul 11 sj', title: 'SEM JOÃO', date: '2026-07-11', type: 'OUTRO', location: 'X', responsible: 'DIA INTEIRO', isOfficial: true },
  { id: 'jul 11 ata', title: 'REUNIÃO DE ATA', date: '2026-07-11', type: 'REUNIAO', location: 'SEDE CBMC', responsible: 'DIA INTEIRO', isOfficial: true },
  { id: 'jul 19', title: 'CAFÉ NA ESTRADA', date: '2026-07-19', type: 'GIRO', location: 'X', responsible: 'DIA INTEIRO', isOfficial: true },
  { id: 'jul 25', title: 'VISITA AO CUMPADRE', date: '2026-07-25', type: 'VISITA', location: 'JB', responsible: 'DIA INTEIRO', isOfficial: true },
  { id: 'jul 31', title: 'GIRO NOTURNO', date: '2026-07-31', type: 'GIRO', location: 'X', responsible: 'DIA INTEIRO', isOfficial: true },

  // AGOSTO 2026
  { id: 'aug 02', title: 'MANUTENÇÃO GERAL', date: '2026-08-02', type: 'MANUTENCAO', location: 'SEDE CBMC', responsible: 'DIA INTEIRO', isOfficial: true },
  { id: 'aug 06', title: 'VIAGEM CUMBRA 18 ANOS', date: '2026-08-06', type: 'GIRO', location: 'X', responsible: 'DIA INTEIRO', isOfficial: true },
  { id: 'aug 07', title: 'VIAGEM CUMBRA 18 ANOS', date: '2026-08-07', type: 'GIRO', location: 'X', responsible: 'DIA INTEIRO', isOfficial: true },
  { id: 'aug 08', title: 'REUNIÃO DE ATA', date: '2026-08-08', type: 'REUNIAO', location: 'X', responsible: 'DIA INTEIRO', isOfficial: true },
  { id: 'aug 09', title: 'VIAGEM CUMBRA 18 ANOS', date: '2026-08-09', type: 'GIRO', location: 'X', responsible: 'DIA INTEIRO', isOfficial: true },
  { id: 'aug 16', title: 'CAFÉ NA ESTRADA', date: '2026-08-16', type: 'GIRO', location: 'X', responsible: 'DIA INTEIRO', isOfficial: true },
  { id: 'aug 24', title: 'JB', date: '2026-08-24', type: 'ANIVERSARIO', location: 'X', responsible: 'ANIVERSÁRIO', isOfficial: false },
  { id: 'aug 28', title: 'GIRO NOTURNO', date: '2026-08-28', type: 'GIRO', location: 'X', responsible: 'DIA INTEIRO', isOfficial: true },
  { id: 'aug 29', title: 'VISITA AO CUMPADRE', date: '2026-08-29', type: 'VISITA', location: 'KATATAU', responsible: 'DIA INTEIRO', isOfficial: true },

  // SETEMBRO 2026
  { id: 'sep 12', title: 'REUNIÃO DE ATA', date: '2026-09-12', type: 'REUNIAO', location: 'SEDE CBMC', responsible: 'DIA INTEIRO', isOfficial: true },
  { id: 'sep 20', title: 'CAFÉ NA ESTRADA', date: '2026-09-20', type: 'GIRO', location: 'X', responsible: 'DIA INTEIRO', isOfficial: true },
  { id: 'sep 25', title: 'GIRO NOTURNO', date: '2026-09-25', type: 'GIRO', location: 'X', responsible: 'DIA INTEIRO', isOfficial: true },
  { id: 'sep 26 visita', title: 'VISITA AO CUMPADRE', date: '2026-09-26', type: 'VISITA', location: 'MOCO', responsible: 'DIA INTEIRO', isOfficial: true },
  { id: 'sep 26 ani', title: 'MESTRE', date: '2026-09-26', type: 'ANIVERSARIO', location: 'X', responsible: 'ANIVERSÁRIO', isOfficial: false },

  // OUTUBRO 2026
  { id: 'oct 04', title: 'MANUTENÇÃO GERAL', date: '2026-10-04', type: 'MANUTENCAO', location: 'SEDE CBMC', responsible: 'DIA INTEIRO', isOfficial: true },
  { id: 'oct 10', title: 'REUNIÃO DE ATA', date: '2026-10-10', type: 'REUNIAO', location: 'SEDE CBMC', responsible: 'DIA INTEIRO', isOfficial: true },
  { id: 'oct 18', title: 'CAFÉ NA ESTRADA', date: '2026-10-18', type: 'GIRO', location: 'X', responsible: 'DIA INTEIRO', isOfficial: true },
  { id: 'oct 19', title: 'DRÁKULA', date: '2026-10-19', type: 'ANIVERSARIO', location: 'X', responsible: 'ANIVERSÁRIO', isOfficial: false },
  { id: 'oct 30', title: 'GIRO NOTURNO', date: '2026-10-30', type: 'GIRO', location: 'X', responsible: 'DIA INTEIRO', isOfficial: true },
  { id: 'oct 31', title: 'VISITA AO CUMPADRE', date: '2026-10-31', type: 'VISITA', location: 'JAKÃO', responsible: 'DIA INTEIRO', isOfficial: true },

  // NOVEMBRO 2026
  { id: 'nov 05', title: 'MARCÃO', date: '2026-11-05', type: 'ANIVERSARIO', location: 'X', responsible: 'ANIVERSÁRIO', isOfficial: false },
  { id: 'nov 14', title: 'REUNIÃO DE ATA', date: '2026-11-14', type: 'REUNIAO', location: 'SEDE CBMC', responsible: 'DIA INTEIRO', isOfficial: true },
  { id: 'nov 15', title: 'CAFÉ NA ESTRADA', date: '2026-11-15', type: 'GIRO', location: 'X', responsible: 'DIA INTEIRO', isOfficial: true },
  { id: 'nov 20', title: 'PAUL', date: '2026-11-20', type: 'ANIVERSARIO', location: 'X', responsible: 'ANIVERSÁRIO', isOfficial: false },
  { id: 'nov 27 giro', title: 'GIRO NOTURNO', date: '2026-11-27', type: 'GIRO', location: 'X', responsible: 'DIA INTEIRO', isOfficial: true },
  { id: 'nov 27 ani', title: 'KATATAU', date: '2026-11-27', type: 'ANIVERSARIO', location: 'X', responsible: 'ANIVERSÁRIO', isOfficial: false },
  { id: 'nov 28', title: 'VISITA AO CUMPADRE', date: '2026-11-28', type: 'VISITA', location: 'JOHNNY', responsible: 'DIA INTEIRO', isOfficial: true },

  // DEZEMBRO 2026
  { id: 'dec 06 manut', title: 'MANUTENÇÃO GERAL', date: '2026-12-06', type: 'MANUTENCAO', location: 'SEDE CBMC', responsible: 'DIA INTEIRO', isOfficial: true },
  { id: 'dec 06 ani', title: 'BOB PAI', date: '2026-12-06', type: 'ANIVERSARIO', location: 'X', responsible: 'ANIVERSÁRIO', isOfficial: false },
  { id: 'dec 12 confra', title: 'CONFRATERNIZAÇÃO NATALINA', date: '2026-12-12', type: 'OUTRO', location: 'X', responsible: 'DIA INTEIRO', isOfficial: true },
  { id: 'dec 12 ata', title: 'REUNIÃO DE ATA', date: '2026-12-12', type: 'REUNIAO', location: 'SEDE CBMC', responsible: 'DIA INTEIRO', isOfficial: true },
  { id: 'dec 17', title: 'MOCO', date: '2026-12-17', type: 'ANIVERSARIO', location: 'X', responsible: 'ANIVERSÁRIO', isOfficial: false },
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a1',
    title: 'ATUALIZAÇÃO GERAL',
    content: 'Todas as escalas de manutenção e visitas para o ano de 2026 foram publicadas. Favor consultar o calendário e a escala de manutenção mensal.',
    author: 'PERVERSO',
    authorRole: Role.PRESIDENTE,
    date: '2026-01-06'
  }
];
