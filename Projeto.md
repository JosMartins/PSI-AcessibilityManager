# Projeto

## Projeto de PSI 2023/24

### Objetivo do projeto

O objetivo deste projeto é desenvolver uma plataforma de monitorização de acessibilidade web, destinada aos webmasters de websites, que permita a avaliação e acompanhamento contínuo da acessibilidade das páginas web. A plataforma deve ser capaz de receber como entrada o endereço de um website e as páginas específicas a serem monitorizadas, fornecendo indicadores relativos à acessibilidade dessas páginas.

### Execução do projeto

As características deste projeto requerem uma equipa composta por 3 elementos, com competências e responsabilidades bem definidas e distintas, que serão avaliadas. Devido à importância do projeto, o processo de avaliação seguirá regras rigorosas. A constituição das equipas é realizada na atividade Grupos de PSI na página de PSI no Moodle.

As funcionalidades serão implementadas ao longo de 3 sprints de desenvolvimento de software, cada um com duas semanas de duração.

Em cada sprint pretende-se que seja construída uma versão completa de funcionalidades do sistema de informação na framework escolhida. No final de cada sprint é feita uma demonstração das funcionalidades.

As funcionalidades a serem desenvolvidas em cada sprint estão detalhadas a seguir:

### Sprint 1

**User Story 1**: Como webmaster, quero ser capaz de inserir um website na plataforma de monitorização de acessibilidade. Critérios de Aceitação:

* Deve ser possível inserir o URL de um website.
* A plataforma deve verificar a validade do URL fornecido.
* Após a inserção do URL, o website deve ser registado na plataforma com o estado 'Por avaliar'.

**User Story 2**: Como webmaster, quero poder especificar as páginas do website que desejo monitorizar. Critérios de Aceitação:

* Deve ser possível adicionar URLs específicos de páginas do website.
* A plataforma deve validar os URLs fornecidos e deve garantir que o URL pertence ao domínio do website.
* As páginas devem ser associadas corretamente ao website registado.

**User Story 3**: Como webmaster, desejo ter a capacidade de visualizar os websites inseridos para monitorização de acessibilidade. Critérios de Aceitação:

* Deve haver uma página ou painel na plataforma dedicado à visualização dos websites registados.
* A lista de websites deve incluir informações como URL, data de registo, data da última avaliação, e estado de monitorização (Por avaliar; Em avaliação; Avaliado; Erro na avaliação).
* Deve ser possível ordenar a lista de websites por data de registo e data da última avaliação.
* Deve ser possível filtrar a lista de websites por estado de monitorização.

**User Story 4**: Como webmaster, desejo ter a capacidade de visualizar detalhes específicos de um website inserido para monitorização de acessibilidade. Critérios de Aceitação:

* Deve ser possível aceder a uma visualização detalhada de um website registado a partir da lista de websites.
* A visualização detalhada deve incluir informações como URL, data de registo, data da última avaliação, e lista de páginas monitorizadas.
* A lista de páginas monitorizadas deve incluir informações como URL da página, data da última avaliação da página e estado da página (conforme ou não conforme - uma página é conforme se não tiver erros de acessibilidade de nível A e AA)

### Sprint 2

**User Story 5**: Como webmaster, desejo poder executar avaliações de acessibilidade de páginas de websites registados. Critérios de Aceitação:

* Deve haver uma opção na plataforma para iniciar uma avaliação de acessibilidade de um website.
* Ao selecionar essa opção, deve ser possível escolher a página ou páginas do website que desejo avaliar.
* A plataforma deve iniciar a avaliação automaticamente, utilizando o pacote [qualweb core](https://www.npmjs.com/package/@qualweb/core).
* Durante a avaliação da página ou páginas do website, o estado do website deve ser apresentado como 'Em avaliação'.
* Após a conclusão da avaliação, o estado do website deve ser apresentado como 'Avaliado' se a avaliação tiver sido concluída com sucesso, ou como 'Erro na avaliação' se tiver existido algum erro que impediu a avaliação de alguma das páginas. Neste último caso, as páginas que não foram avaliadas em consequência do erro, devem ser identificadas na lista de páginas do website mudando o seu estado para 'Erro na avaliação'.
* Os resultados da avaliação da página ou páginas deverão ser armazenados na plataforma.

**User Story 6** : Como webmaster, desejo ter a capacidade de visualizar indicadores agregados de acessibilidade de um website registado.
Critérios de Aceitação:

* A visualização detalhada de um website (US4) deve, adicionalmente, incluir os seguintes indicadores de acessibilidade agregados a partir da última avaliação de acessibilidade realizada a cada uma das páginas do website:
  * Total e percentagem de páginas sem erros de acessibilidade
  * Total e percentagem de páginas com pelo menos um erro de acessibilidade
  * Total e percentagem de páginas com pelo menos um erro de acessibilidade de nível A
  * Total e percentagem de páginas com pelo menos um erro de acessibilidade de nível AA
  * Total e percentagem de páginas com pelo menos um erro de acessibilidade de nível AAA
  * Lista com os 10 erros de acessibilidade mais comuns no total de todas as páginas do website avaliadas

**User Story 9**: Como webmaster, desejo poder apagar website e páginas.
* Critérios de Aceitação:

* Ao visualizar a lista de páginas de um website, deve ser possível selecionar páginas da lista e dar a ordem para as apagar.
* Deve ser possivel dar a ordem para apagar um website, ou a partir da lista de websites ou na visualização dos detalhes do website.
* Ao remover um website que tenha pelo menos uma página, deve ser pedida uma confirmação ao utilizador que pretende mesmo apagar o website. Caso o utilizador confirme que quer apagar o website, todas as páginas do website são também apagadas.
* Ao apagar uma página, qualquer avaliação que tenha sido realizada dessa página deve ser também apagada.


### Sprint 3

**User Story 7**: Como webmaster, desejo poder visualizar detalhadamente os resultados da avaliação de acessibilidade de uma página de um website.
Critérios de Aceitação:

* Após a conclusão da avaliação de acessibilidade de uma página, deve haver uma opção clara para visualizar os resultados detalhados.
* A visualização dos resultados deve incluir:
  * Total e percentagem de testes passados
  * Total e percentagem de testes com aviso
  * Total e percentagem de testes falhados
  * Total e percentagem de testes não aplicáveis
  * Lista de todos os testes realizados com indicação do seu resultado
  * Possibilidade de filtrar os resultados por tipo de teste (Regra ACT ou Técnica WCAG)
  * Possibilidade de filtrar os resultados por resultado (Passado; Aviso; Falhado; Não aplicável)
  * Possibilidade de filtrar os resultados por nível de conformidade (A; AA; AAA)
  * Para cada teste, deve ser possível listar todos os elementos avaliados com indicação do resultado do teste

**User Story 8**: Como webmaster, desejo ter a capacidade de gerar relatórios sobre a acessibilidade do website.
Critérios de Aceitação:

* Deve ser possível gerar relatórios com os indicadores agregados de acessibilidade de um website.
* Os relatórios devem ser exportáveis nos formatos PDF ou HTML.

## Requisitos adicionais

* Todas as funcionalidades devem poder ser executadas usando apenas o teclado.
* A plataforma deve ser desenhada recorrendo a um dos seguintes Design Systems:
  * [Apple Human Interface Guidelines](https://developer.apple.com/design/?ref=designerup.co)  
  * [Google Material Design](https://m3.material.io/)  
  * [IBM Carbon Design System](https://carbondesignsystem.com/?ref=designerup.co)  
  * [Microsoft Fluent Design System](https://fluent2.microsoft.design/?ref=designerup.co#/)  

## Restrições

Quaisquer imagens e vídeos ilustrativos devem estar alojados externamente.

## Entregas

No final de cada sprint, cada grupo deve entregar um vídeo com a demonstração das funcionalidades implementadas pelo grupo durante o sprint. O vídeo deverá ter no máximo 2 minutos. O vídeo pode demonstrar a aplicação em execução num qualquer computador, mas o código deverá permanecer no servidor da cadeira.

No final de cada sprint, cada aluno (e não cada grupo) deverá entregar um relatório de progresso descrevendo as tarefas que concluiu durante o sprint e as tarefas que ficaram por conlcuir.

Os vídeos, com um máximo de 2 minutos, que demonstram os resultados obtidos em cada sprint devem ser entregues através da atividade existente na página da disciplina no Moodle. O nome do ficheiro deve seguir o seguinte formato: psi_xxx_sprint_y, onde xxx é o número do grupo e y o número do sprint.

Os relatórios, com um máximo de 2 páginas, devem ser entregues através da atividade existente na página da disciplina no Moodle. O nome do ficheiro deve seguir o seguinte formato: <span style="color:pink">xxxxx_sprint_y</span>, onde <span style="color:pink">xxxxx</span> é o número do aluno e <span style="color:pink">y</span> o número do sprint.

### Datas das entregas

* Entrega do sprint 1 (todos os grupos) - 29 de abril
* Entrega do sprint 2 (todos os grupos) - 13 de maio
* Entrega do sprint 3 (todos os grupos) - 24 de maio

### Avaliações

A avaliação do projeto tem em consideração a qualidade do produto desenvolvido e a qualidade do processo de desenvolvimento. Os três sprints têm o mesmo peso na avaliação.  

## Aspetos técnicos

Os projetos utilizarão servidores implementando o stack tecnológico MEAN (MongoDB, Express, Angular, NodeJS). Os clientes terão obrigatoriamente de ser browsers web. É ainda necessário estruturar o sistema de informação de acordo com as seguintes quatro camadas: 1) cliente browser; 2) servidor web com lógica de apresentação; 3) servidor aplicacional com regras de negócio; e 4) servidor de base de dados.

## Plataforma de execução do projeto

O projeto deve ser executado no servidor appserver.alunos.di.fc.ul.pt

O acesso ao servidor é feito através de ssh sendo o username o número do grupo. A password inicial é também o número do grupo e deve ser alterada após o primeiro login

`> ssh psi050@appserver.alunos.di.fc.ul.pt`

O appserver tem instalados node, npm e mongo. Todos os módulos necessários para funcionamento do projeto devem ser instalados recorrendo ao npm.

Cada grupo tem uma base de dados criada no servidor mongo. O nome da base de dados é igual ao número do grupo (p.ex. o grupo psi050 deve usar a base de dados psi050).

Cada grupo tem um utilizador no servidor mongo. O nome do utilizador é igual ao número do grupo. A password também é igual ao número do grupo. Para acederem à consola do mongo usem o comando (substituindo psiXXX pelo número do grupo)

`mongo --username psiXXX --password --authenticationDatabase psiXXX appserver.alunos.di.fc.ul.pt/psiXXX`

Cada grupo tem dois portos abertos para acesso por http a servidores node. O primeiro porto no intervalo 3001 a 3050 e o segundo porto no intervalo 3051 a 3100. Por exemplo, o grupo psi003 deve usar os portos 3003 e 3053. É assim importante que configurem os servidores node (para o front-end e back-end) nesses portos.

A forma de executar o servidor node que serve o front-end Angular deve ser a seguinte (onde o XXXX que define o porto deve ser o específico de cada grupo)

`ng serve --port XXXX --host 0.0.0.0 --disableHostCheck true`

Para o servidor node que serve o back-end não é necessário mudar a forma de execução.

A connection string para acesso à base de dados mongo deve ser a seguinte (onde devem substituir psiXXX pelo número do grupo)

`mongodb://psiXXX:psiXXX@localhost:27017/psiXXX?retryWrites=true&authSource=psiXXX`

## Utilização do pacote @qualweb/core

Para adicionaram o pacote ao projeto devem instalá-lo usando o comando

<span style="color:pink">$npm i @qualweb/core --save</span>

Para poderem executar uma avaliação de acessibilidade devem

1. instanciar um avaliador QualWeb,
2. executar a avaliação e
3. aceder ao relatório.

Para instanciar um avaliador QualWeb devem aplicar os seguintes passos

```javascript
// importar avaliador do pacote
const { QualWeb } = require('@qualweb/core');

// o avaliador usa instâncias do browser Chrome para executar a avaliação
// definir as diferentes opções a usar
// plugins para bloquear anúncios e para que não seja detectado que o browser que está a ser usado em modo automático
const plugins = {
      adBlock: true, // Default value = false
      stealth: true // Default value = false
    };
// o avaliador cria um cluster de páginas em avaliação
// definir o tempo que cada tab do browser vai esperar pelo fim do carregamento da página
const clusterOptions = {
      timeout: 60 * 1000, // Timeout for loading page. Default value = 30 seconds
    };
// opções para lançamento do browser
const launchOptions = {
    };

// criar instância do avaliador
const qualweb = new QualWeb(plugins);

// iniciar o avalidor
await qualweb.start(clusterOptions, launchOptions);
```

Para executar uma avaliação devem aplicar os seguintes passos

```javascript
// especificar as opções, incluindo o url a avaliar
const qualwebOptions = {
      url: 'https://act-rules.github.io/pages/about/' // substituir pelo url a avaliar
    };

// executar a avaliação, recebendo o relatório
const report = await qualweb.evaluate(qualwebOptions);

// parar o avaliador
await qualweb.stop();
```

Se pretenderem o relatório em formato EARL devem executar os seguintes passos

```javascript
// especificar opções do relatório
const earlOptions = {
    };

// transformar o relatório para formato EARL
const earlReport = generateEARLReport(report, earlOptions);
```
