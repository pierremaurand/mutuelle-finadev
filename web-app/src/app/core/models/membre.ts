import { Sexe } from './sexe';

export class Membre {
  id?: number;
  nom?: string;
  sexe?: Sexe;
  nomSexe?: string;
  dateNaissance?: string;
  lieuNaissance?: string;
  agenceId?: number;
  nomAgence?: string;
  dateAdhesion?: string;
  telephone?: string;
  email?: string;
  photo?: string;
  estActif?: boolean;
  solde?: number;
  montantCotise?: number;
  encourAdhesion?: number;
  encourCotisation?: number;
  encourAvance?: number;
  encourCredit?: number;
}
