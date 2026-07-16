# Política de privacidade — DIO Focus Player

Última atualização: 16 de julho de 2026.

O DIO Focus Player é uma extensão não oficial que adapta localmente o layout das páginas de aula da DIO.

## Dados processados

A extensão verifica a estrutura visual da página aberta para localizar o player e o sumário. Esse processamento ocorre somente no dispositivo do usuário. O conteúdo da aula não é coletado, copiado ou transmitido.

São armazenadas localmente:

- ativação do modo foco;
- modo automático ou manual;
- limite de largura preferido;
- preferência de exibição do sumário;
- último estado técnico da extensão na página.

Essas preferências são removidas sempre que a extensão é instalada, atualizada ou recarregada em `chrome://extensions`. Atualizar somente a página da aula não apaga as preferências.

## Compartilhamento e rede

A extensão não possui servidor, não envia telemetria, não exibe anúncios e não compartilha dados com terceiros. O MVP não realiza chamadas de rede.

## Permissões

- `storage`: salvar preferências e o estado técnico local.
- `activeTab`: identificar temporariamente se a aba aberta é uma aula, uma página externa ou a tela de login quando o usuário abre o popup.
- acesso a `https://web.dio.me/*`: aplicar o modo foco somente nas páginas da DIO.

A extensão não lê cookies nem tokens de autenticação. O estado “login necessário” é inferido apenas pelo endereço público `auth.dio.me` exibido na aba ativa.

## Controle do usuário

O usuário pode desativar o modo foco pelo popup ou remover a extensão pelo Chrome. A remoção elimina os dados mantidos pelo armazenamento da extensão conforme o comportamento do navegador.

## Contato

O canal de suporte será definido antes de uma eventual publicação na Chrome Web Store.
