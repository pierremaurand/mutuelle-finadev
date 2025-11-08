import { Sexe } from './sexe';

export class MembreRequest {
  nom: string = '';
  sexe: Sexe = Sexe.Masculin;
  dateNaissance: string = '';
  lieuNaissance: string = '';
  agenceId: number = 0;
  dateAdhesion: string = '';
  telephone: string = '';
  email: string = '';
  photo: string = '';
  estActif: boolean = true;
}
