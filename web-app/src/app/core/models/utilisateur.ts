import { Role } from './role';
import { Sexe } from './sexe';

export class Utilisateur {
  id!: number;
  login!: string;
  nom!: string;
  sexe?: Sexe;
  role?: Role;
}
