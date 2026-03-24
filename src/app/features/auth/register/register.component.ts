import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { CampoComponent } from '@shared/components/campo/campo.component';
import { BotaoComponent } from '@shared/components/botao/botao.component';
import { AuthService } from '@core/services/auth.service';

/** Regex de validação de senha: mínimo 8 caracteres, uma maiúscula, uma minúscula e um número. */
const PADRAO_SENHA = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

/**
 * Validador de grupo que verifica se os campos `senha` e `confirmarSenha` são idênticos.
 * @returns `{ senhasNaoConferem: true }` quando os valores divergem, caso contrário `null`.
 */
function validarConfirmacaoSenha(controle: AbstractControl): ValidationErrors | null {
  const senha = controle.get('senha')?.value;
  const confirmarSenha = controle.get('confirmarSenha')?.value;
  return senha && confirmarSenha && senha !== confirmarSenha ? { senhasNaoConferem: true } : null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CampoComponent, BotaoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './register.component.html',
})
/**
 * Componente de cadastro de novo usuário.
 *
 * Apresenta formulário reativo com validações de nome, e-mail, senha
 * e confirmação de senha. Delega a criação da conta ao `AuthService`
 * e redireciona o usuário ao Dashboard após o sucesso.
 */
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly servicoAuth = inject(AuthService);

  /** Indica que a requisição de cadastro está em andamento. */
  protected readonly carregando = signal(false);
  /** Mensagem de erro retornada pelo Firebase Auth, ou `null` quando não há erro. */
  protected readonly erroAutenticacao = signal<string | null>(null);

  public readonly form = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.pattern(PADRAO_SENHA)]],
    confirmarSenha: ['', Validators.required],
  }, { validators: validarConfirmacaoSenha });

  protected get nome() { return this.form.controls.nome; }
  protected get email() { return this.form.controls.email; }
  protected get senha() { return this.form.controls.senha; }
  protected get confirmarSenha() { return this.form.controls.confirmarSenha; }

  /**
   * Submete o formulário de cadastro.
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

    const erro = await this.servicoAuth.cadastrar(
      this.form.value.nome!,
      this.form.value.email!,
      this.form.value.senha!,
    );

    this.carregando.set(false);
    this.erroAutenticacao.set(erro);
  }
}
