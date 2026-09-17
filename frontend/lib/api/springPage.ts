/** Forme d'une reponse Spring Data Page. Toutes les listes admin en renvoient une. */
export interface SpringPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
