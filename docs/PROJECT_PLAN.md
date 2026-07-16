# DIO Focus Player — Plano de Produto e Implementação

> Status: MVP 0.1.0 implementado para validação local
> Versão do documento: 1.1
> Data: 16 de julho de 2026
> Produto: extensão não oficial para Google Chrome

## 1. Resumo executivo

O DIO Focus Player é uma extensão não oficial para Chrome que melhora a experiência de estudo na plataforma DIO quando o aluno usa uma janela estreita ou divide a tela com ferramentas como Obsidian e Notion.

O produto reorganiza localmente a página da aula para priorizar o player, preservando o acesso ao sumário e aos controles da plataforma. A extensão não altera servidores, não baixa aulas, não acessa credenciais e não envia dados do usuário.

### Problema

Na página atual de aulas, o player e o sumário ocupam colunas lado a lado. Em tela dividida, a coluna do sumário reduz significativamente o espaço disponível para o vídeo.

O script original compartilhado pela comunidade demonstra que a reorganização é útil, mas depende de classes CSS geradas automaticamente, como `.iDHUNI` e `.bBIjVk`. Essas classes podem mudar e tornar a solução frágil.

### Proposta de valor

Permitir que o aluno assista às aulas confortavelmente em tela dividida, com ativação reversível, comportamento previsível e acesso preservado ao conteúdo da aula.

### Propósito único

> Adaptar o layout das páginas de aula da DIO para priorizar o player em janelas estreitas.

Todas as funcionalidades presentes e futuras devem estar diretamente relacionadas a esse propósito.

## 2. Objetivos e métricas de sucesso

### Objetivos do MVP

- Detectar páginas compatíveis de aula sem depender exclusivamente de classes geradas.
- Alternar entre o layout original e o modo foco.
- Ativar o modo foco automaticamente quando houver pouco espaço horizontal.
- Preservar player, cabeçalho, progresso, sumário e controles essenciais.
- Manter o sumário acessível abaixo do player ou por controle recolhível.
- Persistir preferências apenas no navegador do usuário.
- Funcionar durante a navegação interna da aplicação DIO sem recarregamento completo.
- Restaurar integralmente o layout original ao desativar a extensão.

### Indicadores de sucesso

- 100% dos cenários automatizados do MVP aprovados.
- Nenhum erro não tratado no console nos fluxos suportados.
- Ativação e restauração sem perda de conteúdo ou funcionalidade da página.
- Tempo de reação percebido inferior a 300 ms após mudança relevante do DOM ou largura.
- Nenhuma chamada de rede originada pela extensão no MVP.
- Somente permissões estritamente necessárias no manifesto.

## 3. Escopo

### Incluído no MVP

- Chrome Manifest V3.
- Suporte exclusivo a `https://web.dio.me/*`.
- Modo manual: ligado ou desligado.
- Modo automático baseado no espaço disponível.
- Player responsivo, respeitando sua proporção.
- Sumário reposicionado abaixo do player.
- Popup acessível com estado e preferências.
- Persistência local das configurações.
- Compatibilidade com navegação SPA.
- Diagnóstico local de página incompatível.
- Testes unitários, de integração e end-to-end.
- Documentação de instalação local, privacidade e publicação.

### Fora do MVP

- Anotações, transcrições ou resumos.
- Integração com Notion, Obsidian ou serviços externos.
- Contas e sincronização em nuvem.
- Telemetria ou analytics.
- Download, gravação ou alteração do conteúdo das aulas.
- Alteração de progresso, XP, respostas ou certificados.
- Suporte oficial a Firefox, Safari ou plataformas diferentes da DIO.
- Código ou configuração carregados remotamente.

### Evoluções possíveis após validação

- Atalho de teclado para alternar o modo foco.
- Tamanhos compacto, confortável e máximo.
- Painel lateral recolhível, além do sumário abaixo do player.
- Compatibilidade validada com Edge e Brave.
- Configuração opcional por curso ou dispositivo.
- Mecanismo versionado de diagnóstico de mudanças do layout.

Essas evoluções não fazem parte do compromisso do MVP e deverão passar pelo mesmo processo de especificação e aceite.

## 4. Restrições e princípios de produto

- A extensão deve ser apresentada como produto não oficial.
- O uso do logotipo oficial da DIO depende de revisão de marca e, para publicação, preferencialmente de autorização.
- O ícone principal deve ter identidade própria para evitar confusão com um produto oficial.
- A extensão nunca deve impedir o usuário de retornar ao layout original.
- Falhas de detecção devem resultar em nenhuma alteração, não em alterações especulativas.
- As classes CSS atuais da DIO podem ser usadas somente como fallback isolado e testado.
- Todo processamento do MVP será local.
- A arquitetura deve permitir substituição dos adaptadores Chrome e DIO sem reescrever as regras de negócio.

## 5. Desenvolvimento orientado por especificação (SDD)

Cada funcionalidade seguirá este fluxo:

1. **Problema:** descrever a necessidade observável do usuário.
2. **Cenários:** escrever exemplos em Given/When/Then.
3. **Contrato:** definir entradas, saídas, erros e efeitos permitidos.
4. **Teste:** criar um teste que falhe pela razão esperada.
5. **Implementação mínima:** implementar somente o necessário para o cenário.
6. **Refatoração:** melhorar o código mantendo os testes aprovados.
7. **Validação integrada:** testar com fixture e Chrome carregando a extensão.
8. **Evidência:** registrar comandos, resultados e limitações conhecidas.

Nenhuma task funcional estará concluída apenas porque o código foi escrito. A conclusão exige critérios de aceite verificáveis e evidência de teste.

### Exemplo de especificação

```gherkin
Funcionalidade: modo foco automático

  Cenário: ativar quando o player tiver pouco espaço
    Dado que uma página de aula compatível está aberta
    E o modo automático está habilitado
    Quando a largura disponível ficar abaixo do limite configurado
    Então o modo foco deve ser aplicado uma única vez
    E o sumário deve permanecer acessível

  Cenário: não alterar uma página desconhecida
    Dado que a estrutura da página não pode ser reconhecida com segurança
    Quando o detector analisar o documento
    Então nenhum estilo estrutural deve ser aplicado
    E o popup deve informar que a página não é compatível
```

## 6. Arquitetura proposta

Será usada Clean Architecture de forma pragmática. A extensão é pequena, portanto as camadas serão explícitas sem criar abstrações genéricas ou um framework interno.

```text
┌──────────────────────────────────────────────────────┐
│ Frameworks e drivers                                 │
│ Chrome APIs, DOM real, Manifest V3, popup            │
├──────────────────────────────────────────────────────┤
│ Adaptadores de interface                             │
│ DIO DOM adapter, Chrome storage, UI controller       │
├──────────────────────────────────────────────────────┤
│ Casos de uso                                         │
│ Avaliar modo, aplicar, restaurar, atualizar settings │
├──────────────────────────────────────────────────────┤
│ Domínio                                              │
│ Settings, estado, decisão de layout, portas          │
└──────────────────────────────────────────────────────┘
```

### Regra de dependência

Dependências de código apontam para dentro:

- domínio não importa Chrome, DOM, CSS ou popup;
- casos de uso dependem somente de entidades e contratos do domínio;
- adaptadores implementam contratos definidos internamente;
- bootstrap conecta implementações concretas às portas;
- testes do domínio não precisam abrir um navegador.

### Estrutura inicial prevista

```text
dio-extension/
├── manifest.json
├── src/
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── FocusSettings.js
│   │   │   └── FocusState.js
│   │   ├── services/
│   │   │   └── LayoutPolicy.js
│   │   └── ports/
│   │       ├── PageLayoutPort.js
│   │       ├── SettingsRepository.js
│   │       └── StatusPresenter.js
│   ├── application/
│   │   ├── EvaluateFocusMode.js
│   │   ├── EnableFocusMode.js
│   │   ├── DisableFocusMode.js
│   │   ├── RefreshPageCompatibility.js
│   │   └── UpdateSettings.js
│   ├── infrastructure/
│   │   ├── chrome/
│   │   │   └── ChromeSettingsRepository.js
│   │   └── dio/
│   │       ├── DioPageLayoutAdapter.js
│   │       ├── DioElementLocator.js
│   │       └── DioNavigationObserver.js
│   ├── presentation/
│   │   ├── content/
│   │   │   ├── ContentController.js
│   │   │   └── focus-mode.css
│   │   └── popup/
│   │       ├── PopupController.js
│   │       ├── popup.html
│   │       └── popup.css
│   └── bootstrap/
│       ├── content.js
│       └── popup.js
├── assets/
│   └── icons/
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   └── fixtures/
└── docs/
    ├── PROJECT_PLAN.md
    ├── PRIVACY.md
    └── STORE_LISTING.md
```

Os nomes podem ser simplificados durante a implementação se os testes demonstrarem que alguma separação não agrega valor.

## 7. Contratos e interfaces

JavaScript não possui interfaces nativas. Os contratos serão representados por módulos documentados e validados por testes de contrato. Não será criada uma hierarquia de classes abstratas apenas para simular interfaces.

### `PageLayoutPort`

Responsabilidade: abstrair o layout da página sem expor detalhes da DIO aos casos de uso.

```js
/**
 * @typedef {Object} PageCompatibility
 * @property {boolean} compatible
 * @property {'ready'|'loading'|'unsupported'} reason
 */

/** @interface */
export const PageLayoutPort = {
  inspect() {},
  getAvailableWidth() {},
  applyFocusLayout() {},
  restoreOriginalLayout() {},
  isFocusLayoutApplied() {},
  subscribeToChanges(listener) {},
};
```

Requisitos:

- `applyFocusLayout` e `restoreOriginalLayout` devem ser idempotentes;
- a restauração deve remover apenas alterações feitas pela extensão;
- `subscribeToChanges` deve retornar uma função de descarte;
- nenhuma operação deve alterar uma página incompatível.

### `SettingsRepository`

Responsabilidade: persistir configurações sem acoplar o domínio ao `chrome.storage`.

```js
/** @interface */
export const SettingsRepository = {
  load() {},
  save(settings) {},
  subscribe(listener) {},
};
```

### `StatusPresenter`

Responsabilidade: publicar o estado observável para popup e testes sem incluir regra de negócio.

```js
/** @interface */
export const StatusPresenter = {
  show(status) {},
};
```

### Entidade `FocusSettings`

```js
{
  enabled: true,
  activationMode: 'automatic', // 'automatic' | 'manual'
  breakpointPx: 1100,
  summaryMode: 'below' // inicialmente apenas 'below'
}
```

Invariantes:

- `breakpointPx` deve estar dentro de uma faixa segura definida pela especificação;
- valores ausentes ou inválidos devem usar defaults versionados;
- configurações desconhecidas devem ser ignoradas de maneira compatível.

### Serviço `LayoutPolicy`

Regra pura que decide entre `enable`, `disable` ou `no-change` com base em:

- configuração do usuário;
- compatibilidade da página;
- largura disponível;
- estado atual.

Por ser puro, esse serviço terá testes rápidos sem DOM.

## 8. Aplicação de SOLID

### Single Responsibility Principle

- `DioElementLocator` somente localiza e classifica elementos.
- `DioPageLayoutAdapter` somente aplica e restaura alterações no DOM.
- `LayoutPolicy` somente decide o estado desejado.
- `ChromeSettingsRepository` somente converte e persiste configurações.
- controllers apenas traduzem eventos externos para casos de uso.

### Open/Closed Principle

Novos layouts da DIO serão suportados por estratégias de localização adicionadas ao adaptador, sem alterar os casos de uso. Suporte futuro a outro navegador exigirá outro repositório/adaptador, não mudanças no domínio.

### Liskov Substitution Principle

Implementações reais e fakes devem obedecer aos mesmos testes de contrato, principalmente idempotência, restauração e descarte de listeners.

### Interface Segregation Principle

O popup não receberá acesso direto ao DOM da DIO. O detector não dependerá da persistência. Portas pequenas evitam objetos com métodos que seus consumidores não usam.

### Dependency Inversion Principle

Casos de uso recebem portas por composição no bootstrap. Chrome e DIO são detalhes externos substituíveis.

## 9. Estratégia de detecção do layout

A detecção seguirá uma cadeia explícita e conservadora:

1. confirmar domínio e tipo de rota compatíveis;
2. localizar o player por elementos e atributos semânticos estáveis;
3. localizar o sumário por sua relação estrutural e conteúdo funcional;
4. identificar o menor contêiner comum que representa as duas colunas;
5. validar que player e sumário são elementos distintos e visíveis;
6. usar seletores conhecidos da versão atual apenas como fallback;
7. retornar `unsupported` se a confiança mínima não for atingida.

O detector não usará texto de uma aula específica, posição absoluta de um filho ou uma única classe gerada como evidência suficiente.

### Alterações no DOM

- `MutationObserver` observará somente o ancestral necessário.
- Eventos serão agrupados com debounce para evitar processamento excessivo.
- `ResizeObserver` será preferido para mudanças do espaço disponível ao player.
- Todo observer terá ciclo de vida e função de descarte testados.
- Reavaliações não poderão duplicar estilos, listeners ou elementos.

## 10. Segurança, privacidade e conformidade

### Permissões previstas

- host restrito a `https://web.dio.me/*`;
- `storage` para preferências locais.

Qualquer permissão adicional exigirá nova especificação, justificativa e aprovação.

### Regras obrigatórias

- Manifest V3.
- Nenhum `eval`, `new Function` ou código remoto.
- Nenhuma biblioteca por CDN.
- Nenhuma leitura de cookies, tokens ou armazenamento da aplicação DIO.
- Nenhuma coleta de conteúdo de aula.
- Nenhuma telemetria no MVP.
- Mensagens entre contextos com formato validado e lista fechada de ações.
- Content Security Policy compatível com Manifest V3.
- Ícones e imagens empacotados localmente.

### Marca e conteúdo

- Nome de trabalho: **DIO Focus Player — extensão não oficial**.
- A interface deve declarar que não há vínculo oficial com a DIO.
- O logotipo fornecido pode ser usado durante prototipação local.
- A publicação do logotipo oficial como ícone ou material promocional dependerá de autorização ou análise jurídica de marca.
- A captura da aula é evidência de design e teste; não deve ser publicada sem revisão de conteúdo e privacidade.

## 11. Estratégia de testes

### Pirâmide

1. **Unitários:** entidades, política de decisão, normalização e casos de uso.
2. **Contratos:** todas as implementações e fakes das portas.
3. **Integração:** adaptador DIO contra fixtures versionadas do DOM.
4. **End-to-end:** extensão empacotada e carregada no Chrome.
5. **Exploratórios:** página real autenticada, larguras, zoom e navegação.

### Matriz mínima

| Área | Cenário | Resultado esperado |
|---|---|---|
| Política | Automático abaixo do limite | `enable` |
| Política | Automático acima do limite | `disable` |
| Política | Manual ligado | `enable` independentemente da largura |
| Compatibilidade | Página desconhecida | Nenhuma mutação |
| DOM | Aplicar duas vezes | Uma única aplicação |
| DOM | Restaurar duas vezes | Estado original preservado |
| DOM | Troca de aula na SPA | Nova estrutura detectada |
| DOM | Player carregado depois | Aplicação após detecção segura |
| Storage | Valor inválido | Defaults aplicados |
| Popup | Teclado e foco | Todos os controles operáveis |
| E2E | Instalação limpa | Defaults previsíveis |
| E2E | Desativar extensão | Layout original restaurado |
| Segurança | Rede | Nenhuma requisição da extensão |

### Compatibilidade manual

- Janela ampla, meia tela e estreita.
- Zoom de 80%, 100%, 125%, 150% e 200%.
- Sumário expandido e recolhido.
- Troca entre aulas sem reload.
- Player carregando, pausado, executando e em tela cheia.
- Navegação para uma página DIO que não contém aula.
- Extensão habilitada, desabilitada e recarregada.

## 12. Backlog em tasks pequenas e testáveis

Cada task deve resultar em um commit revisável quando o repositório Git existir. Tasks marcadas como dependentes só começam após a aprovação da predecessora.

### Épico A — Fundação e especificação

#### TASK-001 — Inicializar o repositório e controles de qualidade

**Objetivo:** criar a estrutura mínima de desenvolvimento, sem funcionalidade de produto.

**Entregas:**

- repositório Git;
- `package.json` e scripts documentados;
- `.gitignore`, ESLint e formatador;
- runner de testes;
- estrutura inicial de diretórios.

**Aceite:**

- instalação reproduzível;
- lint, testes vazios e `git diff --check` executam com sucesso;
- nenhuma dependência de produção sem aprovação.

#### TASK-002 — Formalizar cenários do MVP

**Objetivo:** converter este plano em cenários Given/When/Then versionados.

**Entregas:** especificações de compatibilidade, modo automático, modo manual e restauração.

**Aceite:** cada comportamento do MVP possui pelo menos um cenário positivo e um negativo; ambiguidades estão registradas como decisões pendentes.

#### TASK-003 — Criar fixtures sanitizadas da página

**Objetivo:** representar somente a estrutura necessária da tela real, sem conteúdo protegido ou dados pessoais.

**Aceite:** fixtures cobrem página pronta, carregando, incompatível e após navegação SPA; funcionam offline.

### Épico B — Domínio

#### TASK-004 — Especificar e implementar `FocusSettings`

**Testes primeiro:** defaults, validação, limites e migração de valores inválidos.

**Aceite:** entidade não importa APIs externas e todos os invariantes estão cobertos.

#### TASK-005 — Especificar e implementar `LayoutPolicy`

**Testes primeiro:** matriz de automático, manual, incompatível e estado atual.

**Aceite:** função pura retorna somente `enable`, `disable` ou `no-change`.

#### TASK-006 — Definir portas e testes de contrato

**Entregas:** contratos de layout, settings e apresentação de status.

**Aceite:** fakes mínimos passam nos testes; contratos documentam erros, idempotência e descarte.

### Épico C — Casos de uso

#### TASK-007 — Implementar ativação e desativação

**Testes primeiro:** ativação compatível, ativação repetida, restauração e falha segura.

**Aceite:** casos de uso dependem apenas das portas e do domínio.

#### TASK-008 — Implementar avaliação do modo foco

**Testes primeiro:** todas as decisões da política acionam o efeito correto uma única vez.

**Aceite:** nenhuma regra de largura fica no controller ou adaptador DOM.

#### TASK-009 — Implementar atualização de configurações

**Testes primeiro:** persistência válida, rejeição de entrada inválida e reavaliação após mudança.

**Aceite:** salvar uma configuração não manipula diretamente o DOM.

### Épico D — Integração com o DOM da DIO

#### TASK-010 — Implementar localizador semântico

**Testes primeiro:** fixtures pronta, carregando e incompatível.

**Aceite:** detecção primária não depende das classes `.iDHUNI` e `.bBIjVk`.

#### TASK-011 — Implementar estratégia de fallback isolada

**Testes primeiro:** fallback usado somente quando a estratégia primária falhar e todos os elementos esperados forem validados.

**Aceite:** remover o fallback não afeta casos de uso nem detector primário.

#### TASK-012 — Aplicar o layout de uma coluna

**Testes primeiro:** classe própria, player responsivo, sumário abaixo e preservação do cabeçalho.

**Aceite:** nenhuma propriedade inline preexistente é perdida; duas aplicações não duplicam alterações.

#### TASK-013 — Restaurar o layout original

**Testes primeiro:** restauração após aplicação, restauração repetida e DOM parcialmente reconstruído.

**Aceite:** somente artefatos da extensão são removidos.

#### TASK-014 — Observar resize e navegação SPA

**Testes primeiro:** debounce, troca de rota, reconstrução do contêiner e descarte.

**Aceite:** não há duplicação de observers/listeners; alterações irrelevantes não causam reprocessamento contínuo.

### Épico E — Persistência e Chrome

#### TASK-015 — Implementar repositório de configurações Chrome

**Testes primeiro:** load, save, defaults, erro da API e notificação de mudança.

**Aceite:** passa no mesmo contrato do fake; persiste somente configurações do produto.

#### TASK-016 — Criar Manifest V3 mínimo

**Aceite:** validação do manifesto aprovada; host limitado à DIO; sem permissões não utilizadas; nenhum código remoto.

#### TASK-017 — Compor o content script

**Objetivo:** ligar casos de uso e adaptadores no bootstrap.

**Aceite:** controller não cria regras de domínio; página incompatível permanece intacta; erros são tratados localmente.

### Épico F — Popup e acessibilidade

#### TASK-018 — Especificar os estados do popup

**Estados:** ativo, inativo, automático, carregando, incompatível e erro recuperável.

**Aceite:** wireframe e textos aprovados antes da implementação visual.

#### TASK-019 — Implementar popup acessível

**Aceite:** HTML semântico; labels associados; foco visível; navegação por teclado; contraste adequado; sem dependência do mouse.

#### TASK-020 — Integrar popup aos casos de uso

**Testes primeiro:** carregar estado, alternar modo, alterar limite e restaurar defaults.

**Aceite:** mensagens são validadas; popup fechado não interrompe o content script.

### Épico G — Qualidade e publicação

#### TASK-021 — Criar testes E2E da extensão empacotada

**Cenários:** instalação limpa, automático, manual, persistência, SPA, incompatibilidade e restauração.

**Aceite:** testes observam o comportamento visível, não detalhes internos frágeis.

#### TASK-022 — Validar na DIO real

**Aceite:** checklist manual preenchido com data, Chrome usado e limitações; dados da conta não são capturados nos artefatos.

#### TASK-023 — Auditoria de segurança, privacidade e desempenho

**Aceite:** permissões justificadas; nenhuma chamada de rede; nenhum código remoto; observers descartados; política de privacidade revisada.

#### TASK-024 — Preparar pacote para teste local

**Aceite:** build reproduzível; ZIP contém apenas arquivos necessários; instalação por `chrome://extensions` documentada e testada.

#### TASK-025 — Preparar publicação opcional

**Aceite:** nome, marca, ícones, screenshots, descrição, propósito único, suporte e política de privacidade revisados; autorização de uso de marca resolvida.

## 13. Sequência de releases

### Release 0.1 — Prova técnica

Tasks 001 a 014. Demonstra detecção, aplicação e restauração contra fixtures. Não é considerada pronta para usuários.

### Release 0.2 — MVP instalável

Tasks 015 a 021. Pode ser carregada localmente e testada por um grupo restrito.

### Release 0.3 — Beta validada

Tasks 022 a 024. Compatibilidade real documentada e pacote reproduzível.

### Release 1.0 — Publicação

Task 025, condicionada à revisão de marca e aos requisitos vigentes da Chrome Web Store.

## 14. Definition of Ready

Uma task está pronta para implementação quando:

- problema e resultado esperado estão claros;
- dependências anteriores foram concluídas;
- critérios de aceite são observáveis;
- fixtures ou dados necessários estão disponíveis e sanitizados;
- permissões ou dependências novas foram aprovadas;
- riscos e casos negativos relevantes foram identificados.

## 15. Definition of Done

Uma task funcional só está concluída quando:

- especificação e testes foram criados ou atualizados;
- o teste falhou inicialmente pela razão esperada, quando aplicável;
- implementação mínima está aprovada pelos testes relevantes;
- lint e verificações estáticas passam;
- testes unitários e de integração relevantes passam;
- teste E2E passa quando o fluxo atravessa Chrome/DOM;
- `git diff --check` passa;
- documentação afetada foi atualizada;
- falhas e limitações foram registradas sem ocultação;
- não existem alterações não relacionadas no diff.

## 16. Riscos e mitigação

| Risco | Impacto | Mitigação |
|---|---|---|
| DIO altera o DOM | Alto | Detecção semântica, fallbacks isolados, fixtures versionadas e falha segura |
| Seletores atingem elemento errado | Alto | Validação por múltiplos sinais e nenhuma mutação com baixa confiança |
| Observers degradam desempenho | Médio | Escopo restrito, debounce, idempotência e testes de descarte |
| Restauração danifica estilos | Alto | Classes próprias e registro somente dos artefatos criados pela extensão |
| Reprovação na Web Store | Médio | Propósito único, permissões mínimas, transparência e revisão antes do envio |
| Uso indevido da marca DIO | Alto | Identidade própria, aviso de produto não oficial e autorização antes da publicação |
| Fixture diverge da plataforma | Médio | Teste real versionado por data e atualização controlada das fixtures |
| Complexidade arquitetural excessiva | Médio | Portas somente em fronteiras externas e revisão contínua de abstrações sem uso |

## 17. Decisões propostas para aprovação

1. Nome de trabalho: **DIO Focus Player — extensão não oficial**.
2. MVP restrito a páginas de aula em `web.dio.me`.
3. Modo automático habilitado por padrão com limite inicial de 1100 px, calibrado após o teste real.
4. Sumário abaixo do player no MVP.
5. JavaScript modular com tipos via JSDoc; TypeScript será avaliado na TASK-001 sem adoção automática.
6. Nenhum framework de UI no MVP.
7. Nenhuma telemetria, backend ou chamada de rede.
8. Dependências apenas de desenvolvimento e somente após aprovação do conjunto proposto.
9. Logotipo oficial apenas no protótipo local até a situação de marca ser resolvida.
10. Validação na página real como requisito da beta, não como substituto dos testes automatizados.

## 18. Questões ainda abertas

- Quais rotas exatas da DIO representam páginas de aula?
- O modo foco deve ser automático por padrão ou exigir a primeira ativação consciente?
- O limite será baseado na largura da janela ou na largura efetiva do contêiner do player? A recomendação é usar o contêiner.
- O sumário deve iniciar expandido ou recolhido? A recomendação é recolhido em janelas estreitas.
- Há autorização para usar o logotipo oficial em uma publicação pública?
- A primeira entrega será apenas para teste local ou já deverá incluir os materiais da Chrome Web Store?

## 19. Gate de aprovação

Antes da implementação, devem ser aprovados:

- propósito e escopo do MVP;
- decisões propostas da seção 17;
- comportamento do modo automático;
- apresentação do sumário;
- estratégia de marca;
- conjunto de ferramentas e dependências de desenvolvimento da TASK-001.

Após a aprovação, a implementação deve começar pela TASK-001 e avançar na ordem dos épicos, mantendo cada entrega pequena, testável e reversível.
