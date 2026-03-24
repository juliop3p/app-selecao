/**
 * Interface que representa um erro de validação de formulário.
 *
 * Mapeia uma chave de erro Angular (`Validators`) para uma mensagem
 * amigável em português exibida no template.
 *
 * @example
 * ```ts
 * const erros: ErroFormulario[] = [
 *   { chave: 'required', mensagem: 'Campo obrigatório.' },
 *   { chave: 'email',    mensagem: 'Informe um e-mail válido.' },
 * ];
 * ```
 */
export interface ErroFormulario {
  /** Chave do erro retornada pelo Angular Validators (ex: `'required'`, `'email'`). */
  chave: string;
  /** Mensagem amigável exibida ao usuário quando o erro estiver ativo. */
  mensagem: string;
}
