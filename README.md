# Balcão de Literatura — Congregação Ipê

Inventário de publicações hospedado de graça no GitHub Pages.

- [index.html](index.html) — tela pública, só leitura. Pode mandar esse link pra qualquer um.
- [editor.html](editor.html) — tela de edição. Só quem tem o token de acesso consegue salvar alterações.
- [data.json](data.json) — onde os dados ficam guardados (é commitado no repositório).
- [style.css](style.css) / [shared.js](shared.js) — código compartilhado entre as duas telas.

Repositório: https://github.com/vctorAgto/inventario-ipe

## 1. Criar o repositório no GitHub

1. Crie um repositório **público** chamado `inventario-ipe` em github.com/new
   (tem que ser público pro GitHub Pages gratuito funcionar). **Não** marque as opções
   de adicionar README/.gitignore/licença — o repositório deve nascer vazio.
2. Suba todos os arquivos desta pasta pra raiz do repositório (veja o `setup.sh` abaixo).

⚠️ **Importante:** como o repositório precisa ser público pro Pages gratuito funcionar, os dados do `data.json`
(quantidades de publicações) ficam **publicamente visíveis** pra qualquer um com o link. Não é informação sensível
(é só contagem de literatura), mas vale saber — não é privado.

## 2. Subir o código (setup.sh)

No terminal integrado do VS Code, dentro desta pasta, rode:

```bash
bash setup.sh
```

Isso inicializa o git, faz o primeiro commit e envia tudo para
`https://github.com/vctorAgto/inventario-ipe`.

## 3. Ativar o GitHub Pages

1. No repositório, vá em **Settings → Pages**.
2. Em "Source", selecione a branch `main` e a pasta `/ (root)`.
3. Salve. Em alguns minutos o site fica disponível em:
   `https://vctorAgto.github.io/inventario-ipe/`

## 4. Criar o token de acesso (só pra quem for editar)

1. Vá em **github.com → foto de perfil → Settings → Developer settings → Personal access tokens → Fine-grained tokens**.
2. Clique em "Generate new token".
3. Em "Repository access", selecione **Only select repositories** e escolha só o `inventario-ipe`.
4. Em "Permissions → Repository permissions", defina **Contents: Read and write**. Não precisa de nenhuma outra permissão.
5. Gere o token e copie (começa com `github_pat_...`). Você não vê ele de novo depois, então guarde num lugar seguro.

## 5. Configurar a tela de edição

1. Abra `https://vctorAgto.github.io/inventario-ipe/editor.html`.
2. Preencha usuário (`vctorAgto`), nome do repositório (`inventario-ipe`), branch (`main`) e cole o token.
3. Clique em "Salvar configuração" e depois "Carregar do GitHub".
4. Edite as quantidades/status/observações e clique em "Salvar no GitHub".

O token fica salvo só no navegador de quem configurou (localStorage) — nunca é enviado pro repositório.
Se compartilhar o link do editor com mais pessoas, cada uma precisa configurar o próprio token
(ou, mais simples, todas usam o mesmo token, mas aí qualquer uma delas pode revogar o acesso das outras
gerando um token novo).

## 6. Adicionando publicações novas

No editor, clique em **"+ Novo item"**. O **código é sempre obrigatório** — não dá para salvar um
item sem código, e o editor bloqueia códigos repetidos. Isso mantém o controle de versão mês a mês
consistente: cada publicação é identificada pelo código oficial (o mesmo usado na loja de publicações),
não pelo título, que pode variar.

Vários itens já cadastrados vieram sem código oficial confirmado — eles estão marcados com um código
provisório (prefixo `tmp-`) e uma observação pedindo para confirmar o código real. Vale revisar esses
itens no editor e corrigir o código quando tiver a informação certa (edite o campo direto no `data.json`
pelo GitHub, ou apague o item e recrie com "+ Novo item" usando o código correto).

## 7. Tela pública

Compartilhe `https://vctorAgto.github.io/inventario-ipe/` (o `index.html`) com a congregação.
Essa tela não pede token — só lê o `data.json` publicado. Ela atualiza sozinha a cada 30 segundos.
