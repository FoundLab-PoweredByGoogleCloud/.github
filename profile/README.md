# FoundLab

<p align="center">
  <img src="https://img.shields.io/badge/FoundLab-Auditable%20Infrastructure-0A0A0A?style=for-the-badge&logo=none" />
  <img src="https://img.shields.io/badge/Trust-Verify-111111?style=for-the-badge&logo=lock" />
  <img src="https://img.shields.io/badge/AI%20Safety-Runtime%20Enforcement-1A1A1A?style=for-the-badge" />
</p>

---

# Sobre a FoundLab

A **FoundLab** é uma empresa de engenharia de infraestrutura especializada em **confiança auditável para sistemas críticos e inteligência artificial**.

Partimos de um problema simples: à medida que software e agentes de IA deixam de apenas recomendar e passam a **tomar decisões, acionar ferramentas e participar de transações reais**, confiar que o sistema “fez a coisa certa” deixa de ser suficiente.

É necessário conseguir provar.

Por isso, construímos infraestrutura para transformar políticas, autorizações, sinais de risco e requisitos institucionais em **decisões determinísticas, verificáveis e auditáveis no momento da execução**.

Nossa tese pode ser resumida em três palavras:

> **Don’t trust. Verify.**

---

## O que construímos

A FoundLab desenvolve uma **Auditable Trust Infrastructure (ATI)**: uma camada de infraestrutura que opera entre sistemas inteligentes e ações com consequência real.

Em vez de tratar segurança, governança e compliance apenas como processos posteriores — logs, relatórios, revisões ou documentação — nossa arquitetura leva esses controles para o **runtime**.

Antes de uma ação crítica ser executada, o sistema deve ser capaz de responder:

* Quem está solicitando esta ação?
* Existe autoridade para executá-la?
* Para qual finalidade?
* Sob qual política e versão?
* Quais controles precisam ser satisfeitos?
* A execução deve ser permitida ou negada?
* Qual evidência comprova posteriormente essa decisão?

O objetivo não é tornar a IA “mais confiável” por promessa. É construir uma fronteira técnica na qual confiança possa ser **verificada por evidência**.

---

## Nossa arquitetura

O principal produto dessa tese é o **REX Guard**, nossa infraestrutura de controle de transações e ações mediadas por IA.

O REX Guard não é um modelo de linguagem.

Ele funciona como uma camada independente de controle responsável por autenticação, escopo, políticas determinísticas, autorização, execução governada e produção de evidências verificáveis.

Conceitualmente:

**A IA interpreta.**
**A instituição autoriza.**
**O sistema executa.**
**A evidência prova.**

Essa separação é fundamental.

Modelos probabilísticos podem interpretar contexto, linguagem e intenção. Mas decisões institucionais críticas não devem depender exclusivamente da interpretação probabilística de um modelo.

A autoridade permanece fora do modelo.

---

## Como pensamos engenharia

Na FoundLab, uma funcionalidade não está concluída porque funciona em uma demonstração.

Ela precisa possuir evidência suficiente para sustentar aquilo que afirmamos sobre ela.

Isso significa trabalhar com princípios como:

**Fail-closed.** Na ausência de autoridade, evidência ou condição necessária, a operação crítica deve ser bloqueada.

**Determinismo onde importa.** Modelos podem participar da interpretação; autorização e enforcement exigem regras reproduzíveis.

**Auditabilidade por construção.** Evidência não deve ser reconstruída depois do incidente. Ela nasce junto da decisão.

**Least privilege.** Nenhum agente, serviço ou componente recebe mais autoridade do que precisa.

**Segregação de funções.** Quem interpreta, quem autoriza e quem executa não precisa — e frequentemente não deve — ser o mesmo componente.

**Reprodutibilidade.** Uma decisão relevante deve poder ser explicada a partir de sua política, contexto autorizado, versão e evidência correspondente.

**Claims proporcionais à evidência.** Nunca afirmamos que algo está comprovado quando foi apenas projetado, simulado ou parcialmente testado.

---

## Nosso padrão de verdade

Existe uma diferença importante entre:

`DESIGNED → IMPLEMENTED → TESTED → OBSERVED → PROVEN`

Esses estados não são intercambiáveis.

Código escrito não significa comportamento comprovado.
Um teste passando não significa produção validada.
Uma arquitetura documentada não significa implementação existente.

Por isso, valorizamos evidência primária: código, testes, traces, métricas, artefatos assinados, decisões registradas e resultados reproduzíveis.

Quando algo falha, a resposta esperada não é esconder o problema.

É **identificá-lo, classificá-lo, corrigir sua causa e produzir evidência da correção**.

---

## O que esperamos de quem entra

Trabalhar na FoundLab significa operar em um ambiente onde autonomia vem acompanhada de responsabilidade técnica.

Esperamos que cada pessoa:

* diferencie fato, hipótese e inferência;
* documente decisões relevantes;
* mantenha rastreabilidade do que produz;
* questione claims que excedam a evidência disponível;
* trate segurança e auditabilidade como requisitos arquiteturais;
* prefira uma negativa verificável a uma aprovação ambígua;
* exponha riscos cedo;
* entregue artefatos reproduzíveis, não apenas explicações;
* preserve propriedade intelectual, credenciais e informações institucionais;
* considere o impacto sistêmico antes de alterar componentes críticos.

Discordância técnica é aceitável e necessária.

Falta de evidência apresentada como certeza, não.

---

## Por que isso existe

Sistemas inteligentes estão adquirindo capacidade operacional.

Eles consultam dados, produzem propostas, movimentam fluxos, acionam APIs, interagem com infraestrutura e progressivamente recebem autoridade para executar ações que antes dependiam diretamente de pessoas.

Esse movimento cria uma nova pergunta para empresas, instituições financeiras e ambientes regulados:

**quando uma máquina executa uma ação, como provar que ela estava autorizada a fazê-la?**

A FoundLab existe para construir essa camada.

Não queremos que organizações precisem escolher entre velocidade de inovação e controle institucional. Nossa engenharia busca tornar autorização, política, execução e evidência partes programáveis da própria infraestrutura.

Essa é a responsabilidade de quem entra aqui.

---

## Quem somos

Somos engenheiros que não aceitam confiança sem verificação.

Somos obcecados por sistemas que não apenas funcionam, mas que podem ser explicados, auditados e reproduzidos sob qualquer condição.

Acreditamos que infraestrutura crítica não pode depender de suposições implícitas, nem de interpretações probabilísticas quando o que está em jogo é execução real.

Trabalhamos para reduzir ambiguidade onde ela é perigosa e para torná-la explícita onde ela é inevitável.

Não construímos apenas software.

Construímos fronteiras técnicas entre intenção e ação, entre interpretação e autorização, entre execução e responsabilidade.

---

<p align="center">
  <img src="https://img.shields.io/badge/FoundLab-Don’t%20Trust%20Verify-black?style=for-the-badge" />
</p>
