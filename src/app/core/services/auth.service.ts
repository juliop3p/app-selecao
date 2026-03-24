import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from '@angular/fire/auth';
import { from, Observable } from 'rxjs';

/** Mapa de erros do Firebase Auth para mensagens amigáveis em português. */
const MENSAGENS_ERRO: Record<string, string> = {
  // Formato SDK (@angular/fire)
  'auth/invalid-credential': 'E-mail ou senha incorretos.',
  'auth/user-not-found': 'Usuário não encontrado.',
  'auth/wrong-password': 'Senha incorreta.',
  'auth/invalid-email': 'E-mail inválido.',
  'auth/email-already-in-use': 'Este e-mail já está em uso.',
  'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
  'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.',
  // Formato REST API (fallback)
  'EMAIL_EXISTS': 'Este e-mail já está em uso.',
  'INVALID_PASSWORD': 'Senha incorreta.',
  'EMAIL_NOT_FOUND': 'Usuário não encontrado.',
  'USER_DISABLED': 'Conta desabilitada. Entre em contato com o suporte.',
  'TOO_MANY_ATTEMPTS_TRY_LATER': 'Muitas tentativas. Tente novamente mais tarde.',
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly auth = inject(Auth);
  private readonly roteador = inject(Router);

  /** Signal reativo com o usuário atual (null = não autenticado). */
  public readonly usuarioAtual = toSignal(authState(this.auth), { initialValue: undefined });

  /** Observable do estado de autenticação — usado pelos guards. */
  public readonly estadoAuth$: Observable<unknown> = authState(this.auth);

  /**
   * Realiza o login com e-mail e senha.
   * @returns Mensagem de erro traduzida, ou null em caso de sucesso.
   */
  public async login(email: string, senha: string): Promise<string | null> {
    try {
      await signInWithEmailAndPassword(this.auth, email, senha);
      await this.roteador.navigate(['/dashboard']);
      return null;
    } catch (erro: unknown) {
      return this.traduzirErro(erro);
    }
  }

  /**
   * Cadastra um novo usuário com nome, e-mail e senha.
   * @returns Mensagem de erro traduzida, ou null em caso de sucesso.
   */
  public async cadastrar(nome: string, email: string, senha: string): Promise<string | null> {
    try {
      const credencial = await createUserWithEmailAndPassword(this.auth, email, senha);
      await updateProfile(credencial.user, { displayName: nome });
      await this.roteador.navigate(['/dashboard']);
      return null;
    } catch (erro: unknown) {
      return this.traduzirErro(erro);
    }
  }

  /** Encerra a sessão do usuário atual. */
  public sair(): Observable<void> {
    return from(signOut(this.auth));
  }

  private traduzirErro(erro: unknown): string {
    const err = erro as { code?: string; message?: string };
    const chave = err.code ?? err.message ?? '';
    return MENSAGENS_ERRO[chave] ?? 'Ocorreu um erro inesperado. Tente novamente.';
  }
}
