import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthService } from '@core/services/auth.service';

/**
 * Guard que protege rotas privadas (ex: /dashboard).
 * Redireciona para /auth/login se o usuário não estiver autenticado.
 */
export const guardAutenticacao = () => {
  const servicoAuth = inject(AuthService);
  const roteador = inject(Router);

  return servicoAuth.estadoAuth$.pipe(
    take(1),
    map(usuario => (usuario ? true : roteador.parseUrl('/auth/login'))),
  );
};

/**
 * Guard que protege rotas públicas de autenticação (ex: /auth/login, /auth/register).
 * Redireciona para /dashboard se o usuário JÁ estiver autenticado.
 */
export const redirecionarSeAutenticado = () => {
  const servicoAuth = inject(AuthService);
  const roteador = inject(Router);

  return servicoAuth.estadoAuth$.pipe(
    take(1),
    map(usuario => (usuario ? roteador.parseUrl('/dashboard') : true)),
  );
};
