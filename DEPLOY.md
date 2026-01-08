# Guia de Deploy e Instalação (iOS)

## 1. Deploy para Vercel

## 1. Deploy para Vercel

Você tem duas opções principais. A **Opção A** (CLI) é mais rápida para agora. A **Opção B** (GitHub) é melhor para manter o projeto a longo prazo.

### Opção A: Via Terminal (Mais Rápido)
Não precisa criar repositório no GitHub agora. O código sobe direto do seu computador.

1.  No terminal do projeto, execute:
    ```bash
    npx vercel
    ```
2.  Siga as instruções interativas:
    - **Set up and deploy?**: `y`
    - **Which scope?**: Selecione seu usuário.
    - **Link to existing project?**: `n`.
    - **Project name**: `irontrack` (ou outro nome).
    - **Directory**: `./` (padrão).

### Opção B: Via GitHub (Recomendado para Longo Prazo)
Se preferir conectar com o GitHub para deploys automáticos:

1.  Crie um repositório vazio no [GitHub.com](https://github.com/new).
2.  No terminal, conecte e suba o código:
    ```bash
    git remote add origin https://github.com/SEU_USUARIO/NOME_DO_REPO.git
    git branch -M main
    git push -u origin main
    ```
3.  Vá no [Dashboard da Vercel](https://vercel.com/new), clique em **"Import"** ao lado do seu repositório do GitHub e siga os passos.

---

### Configuração Pós-Deploy (Importante)

> [!IMPORTANT]
> Para que o Login e Sync funcionem em produção, vá no Dashboard da Vercel > Settings > Environment Variables e adicione:
> - `VITE_SUPABASE_URL`: (Sua URL do Supabase)
> - `VITE_SUPABASE_ANON_KEY`: (Sua Key do Supabase)

## 2. Instalar no iPhone (PWA)

O aplicativo foi otimizado para funcionar como um app nativo no iOS.

1.  Abra o **Safari** no seu iPhone.
2.  Acesse a URL do seu deploy (ex: `https://irontrack.vercel.app`).
3.  Toque no botão **Compartilhar** (ícone quadrado com seta pra cima).
4.  Role para baixo e selecione **"Adicionar à Tela de Início"** (Add to Home Screen).
5.  Confirme o nome e toque em **Adicionar**.

O app aparecerá na sua tela inicial com o ícone do IronTrack e abrirá em tela cheia (sem barra de navegação do Safari).
