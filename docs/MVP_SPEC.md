# Especificação executável do MVP

## Modo automático

> Removido temporariamente na versão 0.3.0. O núcleo usa apenas ativação manual pelo toggle principal.

```gherkin
Cenário: largura disponível abaixo do limite
  Dado que a página da aula foi reconhecida
  E o modo automático está habilitado
  Quando o contêiner tiver largura inferior ao limite
  Então o modo foco deve ser aplicado uma única vez
  E o sumário deve continuar no documento

Cenário: largura disponível acima do limite
  Dado que o modo foco está aplicado automaticamente
  Quando o contêiner ficar mais largo que o limite
  Então somente as classes adicionadas pela extensão devem ser removidas
```

## Modo manual

```gherkin
Cenário: usuário liga o modo foco
  Dado que uma página compatível está aberta
  Quando o usuário marcar o toggle principal
  Então o modo foco deve ser aplicado independentemente da largura
  E o sumário deve permanecer visível abaixo do player
```

## Compatibilidade

```gherkin
Cenário: página não reconhecida
  Dado que player e sumário não puderam ser localizados com segurança
  Quando a extensão avaliar a página
  Então nenhum layout deve ser aplicado
  E o popup deve informar incompatibilidade
```

## Navegação interna

```gherkin
Cenário: usuário muda de aula sem recarregar
  Dado que a aplicação reconstruiu o conteúdo da aula
  Quando a mudança do DOM for observada
  Então a compatibilidade deve ser reavaliada
  E listeners e estilos não devem ser duplicados
```

## Compatibilidade conhecida

Em 16 de julho de 2026, o layout real compartilhado usa `.iDHUNI` como grid principal e `.bBIjVk` na região rolável. Essas classes são aceitas somente por uma estratégia de fallback que exige ao menos duas regiões distintas. Se a DIO alterar a estrutura, o fallback deve falhar sem modificar a página.

## Autenticação

```gherkin
Cenário: usuário ainda não está autenticado
  Dado que a DIO redirecionou a aba ativa para auth.dio.me
  Quando o usuário abrir o popup
  Então a extensão deve solicitar que ele faça login
  E nenhum cookie ou token deve ser lido
```
