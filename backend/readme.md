# Implementação de Autenticação com JWT e httpOnly

Este guia demonstra uma abordagem segura para autenticação utilizando JWT (JSON Web Tokens), com o objetivo de mitigar ataques CSRF e XSS. A estratégia proposta envolve armazenar o **access_token** em memória e o **refresh_token** em um cookie com a flag httpOnly.

## Contexto e Motivação

A motivação para essa implementação é reduzir os riscos associados a ataques CSRF (Cross-Site Request Forgery) e XSS (Cross-Site Scripting). Ao seguir os princípios do OAuth 2.0 e considerando as ameaças mencionadas no [Modelo de ameaças e considerações de segurança do OAuth 2.0, capítulo 4.1.3](https://www.rfc-editor.org/rfc/rfc6819#section-4.1.3), a proposta se alinha com boas práticas de segurança.

## Estratégias Adotadas

- **access_token** em Memória Transitória:

  - O **access_token** é mantido na memória transitória do cliente, limitando sua exposição.
  - Essa abordagem visa reduzir o impacto de ataques XSS, pois o token não é armazenado em locais persistentes como cookies ou armazenamento local.

- **refresh_token** em Cookie httpOnly:
  - O **refresh_token** é armazenado em um cookie com a flag httpOnly.
    Essa estratégia ajuda a prevenir ataques XSS, já que o cookie httpOnly não pode ser acessado por scripts no navegador.

## Implementação Passo a Passo

- **Geração e Uso do access_token**:

  - Após autenticação, o servidor gera um access_token JWT.
  - O cliente mantém o access_token em memória transitória durante a sessão.

- **Armazenamento do refresh_token em Cookie httpOnly**:

  - O servidor também emite um refresh_token.
  - Este refresh_token é armazenado em um cookie com a flag httpOnly, limitando seu acesso a scripts no navegador.

- **Renovação de Tokens**:

  - Quando o access_token expira, o cliente usa o refresh_token armazenado no cookie para obter um novo access_token e um novo refresh_token.
  - Isso é feito por meio de uma solicitação segura para o servidor, que verifica o refresh_token e emite um novo access_toke e refresh_token.

## Referências Adicionais

Para uma leitura mais detalhada sobre a estratégia adotada e considerações de segurança, consulte o [artigo no Medium](https://medium.com/@mena.meseha/how-to-defend-against-csrf-using-jwt-8adebe64824b) e a [discussão no Reddit](https://www.reddit.com/r/reactjs/comments/z7lmo0/is_storing_both_access_and_refresh_tokens_in/).

Documentação gerada pelo [ChatGPT](https://openai.com/).
