import type { Participant } from '@/features/event/draw/types'

const PROFILE_IMAGES = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB-iSjGM7JN7_Hf5OXH_TxFXv2GOrIw2GGUrh1Xkk8Uu1cyDabBi-kHZ3M3L2yqbtUD1M9fePLnGlxo-ATeIEV3uKFVpQUVTUGrB9zUL18v6CRVlomNGg64VMIJd2hT4r0Lr6aH00TJbbaU2VGzFAr7cbgAT0uz3vAOZSPYUVuARz9aPzZWbu9RDheHtvhpyPDl40tXQOk0Vu-J1I-gUuiNYQY4NoyDJvNOo4WbiF2s6MVusldHOfwD69Xs8kGwsFN8_k_tlENo44I',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCyNizw4IJovu6RCpxUaWaQKRhKG2wLD2H2OCKanw9E82FspDiq26svfZW3tcVlzCLUifv2p2cqhVGlphI_5Ot2JpPFZiT5MzwTs7fHkCZgZQ4xkgUiTt7PgbMQVPzx9Bxh2sngzrCPGu3h8v9UC6pgxKLjGicdrkAykJ8VRNVIBMSTN9q0ZiVUxyQmBIesj03kubMJASIWBbMeD-7f0slC_k9HlS-oouv2b6chAfaPgDF-Rm9B5vlkONJH-fzxBK9VqFFOKPzD9eU',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuChUF8qUe2c-1ikYEnqqRlKzYSwwEoHcKyh6dDBQ6MSi5yeX6eSpYJDP24DLZOhj40h6kTI9HBmFcYWI21sOzPkUIO2TNF_9qYKTf0Q-HRsr7HbFhmaCqukrpnwGXVlSyh44UTj5BauIPi7e_ZoY3jeTCTqdrMXY97GCL2t3-15tbhG8VXDiGtilvOlMnUggaQui3ZYRCl4x4nduQmenwlynXT0zI-HvVuwnIzZB6qM2BS7R5ycjtAP5kI0KHf1AVAS-Kb2zESHy7A',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA74DCN0uJ1mFHt5k0QwLB5qRqEeQTBEpSSr92Gx4yo5rPvp9MLwdH7CtqGuL-daJhYKkF6lxiFO__KQow5hPhyM2Mc7iwGPINGKccPIrXfLYeffDGB-DCdAJ0jYJH-YnRFbvGM2A6Tqv2V44_vy_AZ65D7qxKZwcPoMWCitc_2DK0rL_j4skzMFybFyvF6YIJF1zfi1NgttcVOWjUtbryEDVr_6DWouUw0F9Tmz-RNWLGOdAMEtGb3UErT2LOpeEYtduA4qPI7mOc',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDxkhLDOgQC13OAJ7uzLsSmza-CemAqVVCMpvSAsMW4XZ2lQjVHLA2Reg3AdBRrYO8b6wNcgaPPGY0nFctnjF18VMOrz_jPv5hs2WHK6R5Kr9z56gq6aYb07HLZdczi-B-7weUZKwI_yAEaUS-jltN2MlWnQwuyGO-kkmifLcLkrhD6-_U7AStnlKQ9NBuemZLVpYcGuHIa5AmJu4_bSbGgwN8iAFW3xJgq8nFs_uVEDXvyQHRhIEgFoU3DyOAMtNMb7uorsw4CNEI',
] as const

const PREFIXES = [
  '행운의', '럭키', '별빛', '달빛', '꿈꾸는',
  '반짝이', '즐거운', '신나는', '웃는', '빛나는',
  '용감한', '멋진', '착한', '귀여운', '강한',
  '푸른', '하얀', '붉은', '검은', '황금',
] as const

const SUFFIXES = [
  '별', '달', '해', '꽃', '나무',
  '바다', '하늘', '구름', '바람', '새',
  '토끼', '고양이', '강아지', '사자', '호랑이',
  '용', '봉황', '유니콘', '팬더', '코알라',
] as const

function generateParticipants(): Participant[] {
  const participants: Participant[] = []

  for (let i = 0; i < 100; i++) {
    const prefix = PREFIXES[i % PREFIXES.length]
    const suffix = SUFFIXES[Math.floor(i / PREFIXES.length) % SUFFIXES.length]
    participants.push({
      id: `participant_${i + 1}`,
      nickname: `${prefix}${suffix}`,
      profileImage: PROFILE_IMAGES[i % PROFILE_IMAGES.length],
    })
  }

  return participants
}

export const MOCK_PARTICIPANTS = generateParticipants()
