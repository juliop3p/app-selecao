import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { CampoComponent } from '@shared/components/campo/campo.component';
import { BotaoComponent } from '@shared/components/botao/botao.component';
import { AuthService } from '@core/services/auth.service';

/** Regex de validação de senha: mínimo 8 caracteres, uma maiúscula, uma minúscula e um número. */
const PADRAO_SENHA = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CampoComponent, BotaoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.component.html',
})
/**
 * Componente de autenticação por e-mail e senha.
 *
 * Apresenta o formulário de login com validações reativas e delega
 * a autenticação ao `AuthService`. Erros do Firebase são traduzidos
 * para mensagens amigáveis via signal `erroAutenticacao`.
 */
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly servicoAuth = inject(AuthService);

  /** Indica que a requisição de login está em andamento. */
  protected readonly carregando = signal(false);
  /** Mensagem de erro retornada pelo Firebase Auth, ou `null` quando não há erro. */
  protected readonly erroAutenticacao = signal<string | null>(null);

  public readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.pattern(PADRAO_SENHA)]],
  });

  protected get email() { return this.form.controls.email; }
  protected get senha() { return this.form.controls.senha; }

  /**
   * Submete o formulário de login.
   * Valida o formulário localmente antes de acionar o `AuthService`.
   * Em caso de erro do Firebase, exibe a mensagem traduzida na UI.
   */
  public async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.carregando.set(true);
    this.erroAutenticacao.set(null);

    const erro = await this.servicoAuth.login(
      this.form.value.email!,
      this.form.value.senha!,
    );

    this.carregando.set(false);
    this.erroAutenticacao.set(erro);
  }
}
