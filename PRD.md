

# 🛡️ PRD: IronTrack Ultra Professional V1

## 1. Objetivos do Produto

Criar a ferramenta de musculação mais completa do mercado iOS, operando fora das restrições da App Store para garantir **gratuidade perpétua**, **instalação via web** e **zero expiração de licença**, mantendo uma experiência de usuário (UX) indistinguível de um app nativo.

---

## 2. Gestão de Treinos e Personalização (Workout Builder)

* **Hierarquia de Dados:** Estrutura em 4 níveis: Programa > Fichas (A, B, C) > Exercícios > Séries.
* **Customização de Exercícios:** * Banco de dados nativo (+500 itens).
* Criação de exercícios personalizados com upload de fotos/GIFs e tags de grupo muscular.


* **Sistemas de Séries:** Suporte para Séries Normais, **Warm-up** (Aquecimento), **Drop-sets**, **Rest-pause** e **Cluster Sets**.
* **Edição em Bloco:** Selecionar múltiplos exercícios para mover, excluir ou copiar para outro dia.
* **Substituição Dinâmica:** Função "Trocar Exercício" que sugere substitutos baseados no mesmo padrão de movimento (ex: Supino Inclinado com Barra por Supino Inclinado com Halter).

---

## 3. O Modo Treino (Interface de Execução)

* **Registro Veloz:** Input numérico otimizado para Peso e Repetições com "Auto-fill" baseado no último treino.
* **Cronômetro de Descanso Inteligente:**
* Contagem regressiva automática pós-série.
* Configuração de tempos diferentes por exercício.
* Aviso sonoro e vibração (Haptic Feedback) via Web Audio API.
* Minimização do timer para um "Floating Bubble" enquanto o usuário navega pelo app.


* **Calculadora de Anilhas Integrada:** Algoritmo que calcula a combinação exata de anilhas disponível na sua academia para atingir o peso da barra.
* **RPE & RIR Track:** Escala de esforço percebido e repetições em reserva para monitorar a intensidade real.
* **Notas de Execução:** Notas persistentes que aparecem toda vez que o exercício for aberto (ex: "Cotovelos fechados neste exercício").

---

## 4. Inteligência, Biometria e Análise

* **Gráficos de Progressão:**
* Volume Total de Carga ().
* Evolução de 1RM (Força máxima estimada).
* Frequência semanal por grupo muscular.


* **Body Analytics:** Registro de Peso Corporal, Percentual de Gordura e Medidas (Braço, Perna, etc.) com gráfico de linha temporal.
* **Mapa de Calor Muscular (Heatmap):** Modelo humano 3D ou 2D que escurece os músculos treinados na semana, indicando fadiga acumulada.
* **Integração de Biofeedback:** Registro diário de Qualidade de Sono, Estresse e Nível de Energia para cruzar com a performance do treino.

---

## 5. Estratégia de Distribuição e Custo Zero (iOS Web Distribution)

* **PWA (Progressive Web App):**
* Implementação de `manifest.json` para ícone na Home Screen.
* Uso de `Service Workers` para garantir que o app abra instantaneamente sem internet.


* **Hospedagem & Backend:**
* **Frontend:** Vercel/Netlify (Plano Grátis).
* **Database/Auth:** Supabase (Plano Grátis - PostgreSQL).


* **Instalação Permanente:** Guia visual integrado ao app ensinando o usuário a clicar em "Compartilhar" > "Adicionar à Tela de Início".
* **Zero Expiração:** Ao contrário do Xcode/AltStore, este app nunca expira após 7 dias.

---

## 6. Funcionalidades Extras e Social

* **Modo Offline First:** Sincronização em segundo plano (Background Sync) para quando a internet da academia falha.
* **Social Share:** Gerador de "Cards de Resumo" estéticos para compartilhamento em Stories (Instagram/WhatsApp).
* **Badges de Conquista:** Gamificação baseada em metas (ex: "Levinatador de 10 Toneladas", "Frequência 100%").
* **Backup em Nuvem:** Login via Google/Apple para recuperar dados em qualquer novo dispositivo.

---

## 7. Requisitos de UI/UX (Design Apple Estilo)

* **Dark Mode Nativo:** Fundo `#000000` para telas OLED.
* **Safe Area Compliance:** Respeito à Dynamic Island e à barra inferior do iOS.
* **Feedback Háptico:** Vibrações curtas ao confirmar séries e vibrações longas ao terminar o descanso.
* **Layout Adaptável:** Grid otimizado para iPhone SE até Pro Max.

---

## 8. Cronograma Sugerido de Desenvolvimento

1. **Fase 1:** Configuração do Banco de Dados (Supabase) e Autenticação.
2. **Fase 2:** Desenvolvimento do Editor de Treinos (CRUD).
3. **Fase 3:** Implementação do Modo Treino e Lógica do Cronômetro.
4. **Fase 4:** Dashboards de Gráficos e Heatmap Muscular.
5. **Fase 5:** Configuração PWA e Deploy Final.

---
