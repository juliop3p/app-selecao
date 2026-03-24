import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Componente de botão reutilizável com suporte a estados de carregamento e desabilitado.
 *
 * Troca automaticamente o rótulo durante operações assíncronas via `[carregando]`.
 *
 * @example
 * ```html
 * <app-botao
 *   tipo="submit"
 *   rotulo="Entrar"
 *   rotuloCarregando="Entrando..."
 *   [carregando]="carregando()"
 *   [desabilitado]="form.invalid"
 * />
 * ```
 */
@Component({
  selector: 'app-botao',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './botao.component.html',
  styles: ':host { display: block; }',
})
export class BotaoComponent {
  /** Texto exibido no botão quando não está carregando. */
  public readonly rotulo = input.required<string>();

  /** Texto exibido quando `carregando` é `true`. Padrão: `'Aguarde...'`. */
  public readonly rotuloCarregando = input<string>('Aguarde...');

  /**
   * Indica se uma operação assíncrona está em andamento.
   * Quando `true`, desabilita o botão e exibe `rotuloCarregando`.
   */
  public readonly carregando = input<boolean>(false);

  /**
   * Desabilita o botão independentemente do estado de carregamento.
   * Útil para vincular ao estado de validade do formulário (`form.invalid`).
   */
  public readonly desabilitado = input<boolean>(false);

  /** Tipo HTML do botão. Use `'submit'` em formulários. Padrão: `'button'`. */
  public readonly tipo = input<'button' | 'submit'>('button');
}
