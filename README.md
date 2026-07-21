
# Kaiji

"No mundo dos negócios e do desenvolvimento, assim como nas mesas de apostas subterrâneas, o ser humano que não joga para vencer já aceitou a sua derrota."

Kaiji é uma extensão de produtividade gamificada de alto risco para o Visual Studio Code, inspirada na filosofia de sobrevivência e risco da obra de Nobuyuki Fukumoto. Ela transforma o ato rotineiro de salvar código em uma aposta psicológica e financeira real para o seu cérebro, estimulando o foco por meio de recompensas variáveis de alta tensão.

---

## A Filosofia do Risco: Por que Apostar é Fascinante?

A maioria dos programadores vive uma rotina monótona de escrita previsível de código. Porém, a mente humana não foi projetada para a estabilidade tediosa; nós evoluímos para responder ao risco, à escassez e à adrenalina da incerteza.

Apostar o seu esforço é a única forma de atribuir valor real à vida e ao trabalho. Quando você salva um arquivo com centenas de linhas modificadas, você não está apenas enviando dados ao disco rígido. Você está colocando sua força vital e seu tempo precioso na mesa de apostas. A incerteza de qual baú de recompensa será revelado gera uma descarga de dopamina que transforma o trabalho exaustivo em um jogo de sobrevivência psicológica pura. Como diria Tonegawa: "O dinheiro é mais importante que a própria vida, pois as pessoas gastam suas vidas para consegui-lo." No Kaiji, o seu código é a sua ficha de apostas.

---

## Como a Extensão Funciona Atualmente

A extensão monitora as suas alterações em tempo real de forma local e segura. A mecânica atual está dividida em três pilares:

### 1. O Esforço (A Aposta)

Toda vez que você salva um arquivo de texto no editor, a extensão analisa o diferencial de caracteres adicionados em relação ao estado anterior do arquivo. Salvamentos vazios ou repetitivos são descartados pela banca (sistema anti-cheat).

O nível de esforço determina o tipo de caixa de recompensa que você recebe:

* Alteração Irrelevante (menos de 30 caracteres): Ganha de 1 a 3 moedas de consolação diretamente na carteira.
* Alteração Pequena (entre 30 e 149 caracteres): Garante uma Caixa Comum.
* Alteração Média (entre 150 e 499 caracteres): Garante uma Caixa Incomum.
* Alteração Grande (entre 500 e 1499 caracteres): Garante uma Caixa Rara.
* Alteração Épica (1500 caracteres ou mais): Garante a lendária Caixa Lendária (Jackpot).

### 2. A Abertura das Caixas (O Gacha)

Após o salvamento, uma tela de abertura de caixas é exibida com base na raridade conquistada. Ao abrir a caixa:

* O usuário recebe uma quantia variável de moedas baseada na raridade da caixa.
* O usuário ganha uma decoração aleatória correspondente àquela raridade específica de forma gratuita, adicionando-a ao seu inventário imediatamente.

### 3. O Espaço Decorativo Isométrico em 3D e a Loja

Utilizando o comando de visualização, você pode abrir o seu escritório de apostas virtual.

* Painel Isométrico: Um quarto renderizado em projeção isométrica 3D onde os seus itens comprados ou ganhos (mesas, aparelhos, decorações lendárias) são posicionados e exibidos dinamicamente.
* Loja do Teiai Group: Um mercado dividido em abas (Móveis, Aparelhos e Outros) que permite utilizar as suas moedas acumuladas para comprar novos itens decorativos e expandir seu império visual.

---

## Catálogo de Itens Decorativos e Raridades

O jogo atualmente conta com 16 decorações exclusivas para colecionar, divididas em quatro categorias de prestígio:

* Comum (Filtro de iluminação padrão): Caneca de Café, Mini Cacto, Luminária de Mesa, Tapete Básico.
* Incomum (Móveis estruturais): Cadeira Ergonômica, Estante de Livros, Teclado Mecânico RGB, Monitores de Áudio.
* Rara (Tecnologia e colecionáveis): Monitor Ultrawide, Bonsai Imperial, Fliperama Portátil, Luminária de Lava.
* Lendária (Setups de alta escala): Supercomputador Quântico, Projetor Estelar, Estátua de Dragão Dourado, Portal Interdimensional.

---

## Como Rodar e Testar Localmente

Caso queira iniciar o projeto em modo de desenvolvimento para testes:

1. Abra a pasta raiz da extensão no VS Code.
2. Abra o terminal integrado e inicie a compilação contínua do TypeScript:
   npm run watch
3. Pressione a tecla F5 para abrir a janela de testes (Extension Development Host).
4. Na janela de testes, abra uma pasta que possua um repositório Git iniciado.
5. Abra a paleta de comandos (Ctrl+Shift+P ou Cmd+Shift+P) e execute:
   Kaiji: Abrir Meu Espaço

Sempre que salvar modificações reais em seus arquivos nesta janela de testes, as caixas de recompensas serão acionadas automaticamente.
