# DIO Focus Player 1.0.1: mais controle sobre a tela, mais foco nos estudos

Quem estuda com a aula aberta de um lado e o editor de código do outro sabe: cada pedaço da tela faz diferença. Foi pensando nessa rotina que desenvolvi o **DIO Focus Player**, uma extensão independente para adaptar a visualização das aulas da DIO.

Na versão **1.0.1**, trabalhei nas correções do modo foco e na compatibilidade com diferentes formatos de aula. A ideia continua simples: dar mais espaço ao vídeo e deixar você escolher quais informações quer manter por perto.

## O que mudou nesta atualização?

Durante os testes em aulas reais, apareceram problemas que atrapalhavam essa experiência. Em algumas páginas, a extensão indicava que o modo foco estava ativo, mas o layout não respondia. Em outras, o cabeçalho acabava abaixo do vídeo ou o próprio player desaparecia.

Esta atualização reúne os ajustes para esses casos:

- **Compatibilidade com aulas novas, antigas e projetos:** melhorias no reconhecimento do player e na adaptação dos layouts testados.
- **Correção do vídeo que desaparecia:** ajuste do espaço ocupado pelo player ao ativar o modo foco, preservando a proporção do vídeo e os controles de reprodução.
- **Cabeçalho no lugar certo:** correção do posicionamento do título da aula, que podia aparecer abaixo do vídeo.
- **Opções de ocultação independentes:** cabeçalho, barra de progresso e lista de aulas respondem às escolhas feitas no painel da extensão.
- **Restauração do layout:** ao desligar o modo foco, a página volta à apresentação original.

## Você escolhe o que fica na tela

Ativar o modo foco precisa respeitar a forma como cada pessoa estuda. Por isso, as três opções podem ser controladas separadamente:

1. Ocultar o cabeçalho da aula.
2. Ocultar a barra de progresso.
3. Ocultar a lista de aulas.

Quer deixar o vídeo em destaque e continuar acompanhando o progresso? Basta ocultar o cabeçalho e a lista, mantendo a barra visível. Prefere navegar entre as aulas com a lista sempre aberta? É só deixá-la desmarcada nas opções de ocultação.

Esse controle faz diferença principalmente quando a janela está dividida com um editor, anotações ou o projeto que você está desenvolvendo durante a aula.

## Uma lição que ficou desta versão

Desenvolver uma extensão que adapta outra página exige testar além de um único cenário. Uma mudança pode funcionar no formato mais recente e apresentar problemas em uma aula antiga ou em um projeto.

Nesta atualização, combinei verificações automatizadas com testes nas aulas reais. Conferir o vídeo, o cabeçalho e as combinações das opções de visibilidade ajudou a encontrar diferenças que não apareciam no primeiro teste.

É esse cuidado que quero continuar levando para o projeto: ajustes pequenos, guiados pelo uso real e pelo retorno de quem estuda com a extensão.

## Conheça o projeto e compartilhe sua experiência

O código está no [GitHub do DIO Focus Player](https://github.com/davidsonsilva/DIO-Focus-Player).

Se encontrar algum comportamento inesperado, você pode [abrir uma issue](https://github.com/davidsonsilva/DIO-Focus-Player/issues) com o formato da aula, as opções selecionadas e uma captura da tela. Esses detalhes ajudam bastante a reproduzir o problema.

E na sua rotina: você prefere manter a lista de aulas à vista ou deixar o máximo de espaço possível para o vídeo? Conta nos comentários!

*O DIO Focus Player é uma extensão independente e não oficial, sem vínculo com a DIO.*
