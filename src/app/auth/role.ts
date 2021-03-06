export enum ROLE {
  SUPER_USER = 'SUPER_USER',
  PARTNER = 'PARTNER',
  PERFORMER = "PERFORMER",
  LEGAL_ENTITY_FULL = "LEGAL_ENTITY_FULL",
  MEMBER_PERFORMER = 'MEMBER_PERFORMER',
  MEMBER_STORE = 'MEMBER_STORE',
  MEMBER_ANOTHER = 'MEMBER_ANOTHER',
  BAD_PERFORMER = 'BAD_PERFORMER',
  BAD_PARTNER = 'BAD_PARTNER'
}

export const ROLE_MAPPER = {
  [ROLE.SUPER_USER]: 'SUPER_USER',
  [ROLE.PARTNER]: 'PARTNER',
  [ROLE.PERFORMER]: 'PERFORMER',
  [ROLE.LEGAL_ENTITY_FULL]: 'LEGAL_ENTITY_FULL',
  [ROLE.MEMBER_ANOTHER]: 'MEMBER_ANOTHER',
  [ROLE.MEMBER_STORE]: 'MEMBER_STORE',
  [ROLE.MEMBER_PERFORMER]: 'MEMBER_PERFORMER',
  [ROLE.BAD_PERFORMER]: 'BAD_PERFORMER',
  [ROLE.BAD_PARTNER]: 'BAD_PARTNER',
}
