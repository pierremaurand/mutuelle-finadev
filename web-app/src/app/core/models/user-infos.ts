import { Role } from './role';
import { Sexe } from './sexe';

export class UserInfos {
  id?: number;
  login?: string;
  nom?: string;
  sexe?: Sexe;
  role?: Role;
  estActif?: boolean;
  photo?: string;
}
