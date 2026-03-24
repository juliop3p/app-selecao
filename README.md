# app-selecao

SPA de Recrutamento e Seleção de RH desenvolvido com **Angular 21**, **Tailwind CSS** e **Firebase**.

## Tecnologias

- Angular 21 (Standalone Components, Signals, OnPush)
- Tailwind CSS
- Firebase Authentication
- AngularFire

## Funcionalidades

- Autenticação com e-mail e senha (Login e Cadastro)
- Guards funcionais de rota (`authGuard` e `redirectIfLoggedIn`)
- Componentes reutilizáveis (`app-campo`, `app-botao`)
- Arquitetura em camadas: `core/`, `shared/`, `features/`

## Como executar

### Desenvolvimento (Firebase real)
```bash
npm install
npm run start
```

### Ambiente Local com Emulador (sem internet, dados isolados)

> Requer [Firebase CLI](https://firebase.google.com/docs/cli) instalado globalmente: `npm install -g firebase-tools`

```bash
npm run start:local
```

| Serviço | URL |
|---|---|
| App Angular | http://localhost:4200 |
| Firebase Auth Emulator API | http://localhost:9099 |
| Emulator UI (admin) | http://localhost:4000 |

> ⚠️ Os dados do emulador são **efêmeros** — resetam ao encerrar o processo.
