import { ROLE } from "../../../auth/role";

export interface ITaskRoleMapper{
    value: ROLE;
    viewValue: string;
}

export const VISIBLE_ROLES: ITaskRoleMapper[] = [
    { value: ROLE.PERFORMER, viewValue: 'Физическое лицо'},
    { value: ROLE.LEGAL_ENTITY_FULL, viewValue: 'Организация'},
]
