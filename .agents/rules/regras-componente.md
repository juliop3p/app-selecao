---
trigger: glob
globs: *.ts
---

# ⚡ PROTOCOLO DE COMPONENTES ANGULAR (STRICT MODE)

ESTAS REGRAS SÃO INEGOCIÁVEIS. APLIQUE-AS EM TODOS OS ARQUIVOS `*.ts`.

---

## 1) ARQUITETURA OBRIGATÓRIA

- **DEFINE** todos os componentes como `standalone: true`. O uso de `NgModule` é **PROIBIDO** para novos componentes.
- **IMPONHA** `changeDetection: ChangeDetectionStrategy.OnPush`. Sem exceções.
- **GARANTA** que o componente tenha **UMA ÚNICA** responsabilidade (SRP). Se ele faz "tudo", quebre-o em sub-componentes.

## 2) ESTADO E REATIVIDADE (SIGNALS FIRST)

- **USE EXCLUSIVAMENTE** `Signals` para gerenciamento de estado local.
- **SUBSTITUA** getters ou cálculos complexos por `computed()`.
- **PROIBIDO** usar `zone.js` hacks ou manipulação manual de detecção de mudanças se um Signal puder resolver.
- **VINCULE** os signals diretamente no template (ex: `{{ count() }}`).

## 3) BLINDAGEM DE MEMÓRIA (NO LEAKS)

- **IMPLEMENTE** `DestroyRef` com `takeUntilDestroyed` para qualquer `subscribe` manual inevitável.
- **JAMAIS** deixe um listener, timer (`setInterval`) ou stream RxJS aberto sem lógica de teardown.
- **PREFIRA** o `AsyncPipe` ou leitura de Signals no template ao invés de subscriptions no `.ts`.

## 4) HIGIENE DE CÓDIGO (CLEANUP IMEDIATO)

- **DETECTE E APAGUE** código morto antes de finalizar a resposta.
  - Variáveis não lidas? **APAGUE.**
  - Imports cinzas (não usados)? **APAGUE.**
  - Métodos comentados? **APAGUE.**
- O código entregue deve estar pronto para produção, sem lixo.

## 5) GESTÃO DE IMPORTS (PRECISÃO CIRÚRGICA)

- O array `imports: []` deve conter **APENAS** o que o template HTML está consumindo.
- **É PROIBIDO** importar "SharedModules" gigantescos. Importe componente por componente (Tree Shaking).
- **VERIFIQUE** se pipes e diretivas importados estão realmente em uso.

## 6) SISTEMA DE ARQUIVOS

- **GERE** obrigatoriamente o par: `.ts` e `.html`.
- **É PROIBIDO** criar arquivos `.scss` ou `.css` vazios.
  - Se não houver estilo customizado, **NÃO CRIE** o arquivo e remova o `styleUrls` do decorator.
  - Evite poluição de arquivos desnecessários no projeto.

## 7) ISOLAMENTO DE TIPOS

- **MOVA** interfaces e `types` para arquivos de modelo dedicados (`.model.ts`).
- **NÃO DECLARE** `interface` dentro do arquivo do componente. O componente deve conter apenas a classe de visualização.

## 8) ENCAPSULAMENTO

- **DECLARE EXPLICITAMENTE** a visibilidade:
  - `public` para o que o template acessa.
  - `protected` para heranças.
  - `private` para lógica interna.
- **NÃO USE** o padrão de visibilidade implícita (public default).


## 4) CONSISTÊNCIA VISUAL E LÓGICA

- **ANALISE** o diretório atual antes de criar. Siga o padrão de nomenclatura e estrutura dos vizinhos.
- **NÃO INVENTE** padrões de nomenclatura novos se o projeto já usa um (ex: `handleSave` vs `onSave`).

## 10) REUTILIZAÇÃO INTELIGENTE

- **ANTES DE CODAR**: Execute uma busca mental no projeto.
  - "Já existe um botão/card/modal que faz isso?"
- **SE EXISTIR**: Reutilize ou estenda.
- **SE TIVER DÚVIDA**: Pergunte: "Existe um componente de X? Devo criar um novo ou adaptar?"