# DIO Focus Player

Extensão não oficial para Google Chrome que prioriza o player das aulas da DIO em janelas estreitas e telas divididas.

## Novidades da versão 1.0.1

A versão `1.0.1` corrige o modo foco nos formatos novos e antigos de aulas da DIO, incluindo aulas de projetos (`/lab/`).

- Reconhecimento do player em páginas onde o modo foco aparecia como ativo, mas não ajustava o layout.
- Correção do desaparecimento do vídeo, preservando sua proporção e os controles de reprodução.
- Cabeçalho da aula posicionado acima do vídeo.
- Controle independente para ocultar cabeçalho, barra de progresso e lista de aulas.
- Reaplicação das escolhas ao alterar as opções e restauração do layout ao desligar o modo foco.

<p align="center">
  <img src="imagens/artigo-1.0.1/infografico.png" width="640" alt="Cinco melhorias da versão 1.0.1: compatibilidade ampliada, vídeo visível, cabeçalho no lugar, controles separados e restauração do layout.">
</p>

Leia o [artigo sobre a atualização](docs/ARTIGO_DIO_1.0.1.md) ou consulte as [notas da versão para a loja](docs/STORE_LISTING.md#novidades-da-versão-101).

## Como usar

Abra uma aula da DIO, clique no ícone da extensão e ative o **Modo foco**. Selecione apenas os elementos que deseja ocultar: cabeçalho, barra de progresso ou lista de aulas. Por exemplo, você pode manter o progresso visível e ocultar os outros dois elementos.

Desative o modo foco para restaurar o layout original. O modo automático continua fora desta versão.

## Instalação para desenvolvimento

Requisitos: Node.js 22 ou superior.

```powershell
npm install
npm run validate
```

Depois:

1. Abra `chrome://extensions`.
2. Ative o **Modo do desenvolvedor**.
3. Clique em **Carregar sem compactação**.
4. Selecione a pasta `dist` deste projeto.
5. Abra uma aula em `https://web.dio.me/`.

## Comandos

- `npm test`: executa testes unitários e de casos de uso.
- `npm run check`: verifica manifesto, permissões e código dinâmico/remoto.
- `npm run build`: gera a extensão em `dist/`.
- `npm run validate`: executa todas as verificações acima.

## Arquitetura

As regras de produto ficam em `src/domain`, os casos de uso em `src/application` e os detalhes de Chrome/DIO em `src/infrastructure`. Os entrypoints em `src/bootstrap` compõem as dependências. Consulte [docs/PROJECT_PLAN.md](docs/PROJECT_PLAN.md).

## Privacidade

A extensão não envia dados nem faz chamadas de rede. Preferências e o último estado conhecido são armazenados localmente pelas APIs do Chrome. Leia [docs/PRIVACY.md](docs/PRIVACY.md).

## Landing page pública

A divulgação do projeto usa uma landing page separada com política de privacidade própria:

- [site/index.html](site/index.html)
- [site/privacy.html](site/privacy.html)
- [docs/STORE_LISTING.md](docs/STORE_LISTING.md)

## Marca

Este projeto não é afiliado, patrocinado ou mantido pela DIO. DIO e seu logotipo pertencem aos respectivos proprietários. O uso do logotipo no protótipo local não autoriza sua publicação na Chrome Web Store.

## Licença

O código-fonte é distribuído sob a [GNU General Public License v3.0 ou posterior](LICENSE). Você pode usar, estudar, modificar e redistribuir o projeto, inclusive comercialmente, desde que cumpra a GPLv3, mantenha a mesma liberdade nas versões distribuídas e disponibilize o código-fonte correspondente.

A licença do código não concede direitos sobre marcas, logotipos, vídeos, screenshots ou conteúdo da DIO e de outros terceiros. Consulte [NOTICE.md](NOTICE.md) para os avisos completos.
