import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule, ValidationErrors } from '@angular/forms';

import { ErroFormulario } from '@shared/models/formulario.model';

/**
 * Componente de campo de formulário reutilizável.
 *
 * Renderiza um label, um input e uma lista de mensagens de erro dinâmicas
 * baseadas no estado do `FormControl` informado.
 *
 * @example
 * ```html
 * <app-campo
 *   rotulo="E-mail"
 *   tipo="email"
 *   placeholder="seu@email.com"
 *   [controle]="email"
 *   [erros]="[
 *     { chave: 'required', mensagem: 'Campo obrigatório.' },
 *     { chave: 'email', mensagem: 'Informe um e-mail válido.' }
 *   ]"
 * />
 * ```
 */
@Component({
  selector: 'app-campo',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './campo.component.html',
  styles: ':host { display: block; }',
})
export class CampoComponent {
  /** Texto exibido no label acima do input. */
  public readonly rotulo = input.required<string>();

  /** Tipo do elemento `<input>`. Padrão: `'text'`. */
  public readonly tipo = input<string>('text');

  /** Texto de placeholder exibido quando o campo está vazio. */
  public readonly placeholder = input<string>('');

  /** `FormControl` vinculado ao campo via `[formControl]`. */
  public readonly controle = input.required<FormControl>();

  /**
   * Lista de erros do controle a serem exibidos abaixo do input.
   * Cada item mapeia uma chave de erro Angular para uma mensagem amigável.
   *
   * @example
   * ```ts
   * [{ chave: 'required', mensagem: 'Campo obrigatório.' }]
   * ```
   */
  public readonly erros = input<ErroFormulario[]>([]);

  /**
   * Erros em nível de grupo do formulário (ex: `form.errors`).
   * Utilizado para validadores cruzados como confirmação de senha.
   *
   * @example
   * ```html
   * [erroExterno]="form.errors"
   * ```
   */
  public readonly erroExterno = input<ValidationErrors | null>(null);
}
