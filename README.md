# Balcão de Literatura — Congregação Ipê

Inventário de publicações hospedado de graça no GitHub Pages.

- [index.html](index.html) — tela pública, só leitura. Pode mandar esse link pra qualquer um.
- [editor.html](editor.html) — tela de edição. Só quem tem a senha de acesso consegue salvar alterações.
- [data.json](data.json) — onde os dados ficam guardados (é commitado no repositório).
- [style.css](style.css) / [shared.js](shared.js) — código compartilhado entre as duas telas.

Repositório: https://github.com/vctorAgto/inventario-ipe · Site: https://vctoragto.github.io/inventario-ipe/

⚠️ **Importante:** como o repositório é público (necessário pro GitHub Pages gratuito), os dados do `data.json`
(quantidades de publicações) ficam **publicamente visíveis** pra qualquer um com o link. Não é informação sensível
(é só contagem de literatura), mas vale saber — não é privado.

## Acesso do editor: nome + senha

O editor não usa contas individuais de verdade — isso exigiria um servidor (o GitHub Pages é 100% estático e
gratuito, sem backend). Na prática, existe **uma senha de acesso única**, compartilhada com quem for atualizar
o inventário. Por baixo dos panos essa senha é um token do GitHub, mas quem só vai editar quantidades não
precisa saber disso — só preenche "Seu nome" (aparece no histórico de alterações) e "Senha de acesso".

### Criar/trocar a senha de acesso (só quem administra o repositório)

1. Vá em **github.com → foto de perfil → Settings → Developer settings → Personal access tokens → Fine-grained tokens**.
2. Clique em "Generate new token".
3. Em "Repository access", selecione **Only select repositories** e escolha só o `inventario-ipe`.
4. Em "Permissions → Repository permissions", defina **Contents: Read and write**. Não precisa de nenhuma outra permissão.
5. Gere o token e copie (começa com `github_pat_...`) — essa string é a "senha de acesso" que você repassa aos editores.
   Você não vê ela de novo depois, então guarde num lugar seguro.
6. Se alguém que tinha a senha não deve mais editar, revogue o token antigo (Settings → Developer settings →
   Fine-grained tokens → Revoke) e gere um novo para quem continuar editando.

### Configurar o editor (qualquer editor, uma vez por navegador)

1. Abra `https://vctoragto.github.io/inventario-ipe/editor.html`.
2. Preencha **Seu nome** e cole a **Senha de acesso**.
3. Clique em "Salvar" e depois "Carregar do GitHub".
4. Faça o levantamento do mês ou ajuste itens no catálogo; as alterações são salvas no GitHub.

A senha fica salva só no navegador de quem configurou (localStorage) — nunca é enviada pro repositório.
Não precisa preencher usuário/repositório/branch — o editor já vem configurado pra este repositório
(`vctorAgto/inventario-ipe`, branch `main`). Isso só aparece em "Configuração avançada", pra quem for
administrar outro repositório copiado deste.

## Levantamento mensal

A contagem é feita **no começo de cada mês**. Na virada do mês, todos os itens voltam sozinhos para
**Pendente** (a tela pública já mostra isso), e o editor guarda um retrato do mês anterior para comparação.

No editor, toque em **"Começar levantamento"**: é um passo a passo por categoria, igual ao relatório de
estoque do JW Hub (Bíblias, Livros, Brochuras e livretos, Formulários e itens, Folhetos, Revistas para o público).

- Todo item precisa de um número — **nem que seja 0**. Só dá pra concluir quando tudo estiver preenchido.
- O botão **"= n"** repete o número do mês anterior; **"Colocar 0 nos que faltam"** zera os vazios da categoria.
- Cada passo é salvo sozinho no GitHub, então dá pra parar e continuar depois (ou dividir as categorias entre pessoas).
- No fim, a **Revisão** mostra o resumo por categoria, a comparação com o mês anterior e o botão **Copiar resumo**.

A contagem feita no começo do mês é a mesma pedida no relatório de estoque do JW Hub do mês anterior (prazo: dia 10).

## Adicionando ou editando publicações

No editor, clique em **"+ Novo item"** pra cadastrar uma publicação nova. O **código é sempre obrigatório**
— não dá para salvar um item sem código, e o editor bloqueia códigos repetidos. Isso mantém o controle de
versão mês a mês consistente: cada publicação é identificada pelo código oficial (o mesmo usado na loja de
publicações), não pelo título, que pode variar.

Pra corrigir título, código ou categoria de um item que já existe, passe o mouse sobre o card e clique em
o botão **✎** ao lado do item. O mesmo painel também tem um botão **"Remover item"**, caso precise
apagar um item cadastrado por engano.

Vários itens já cadastrados vieram sem código oficial confirmado — eles estão marcados com um código
provisório (prefixo `tmp-`) e uma observação pedindo para confirmar o código real. Vale revisar esses
itens no editor (botão "Editar" no card) e corrigir o código quando tiver a informação certa.

## Tela pública

Compartilhe `https://vctoragto.github.io/inventario-ipe/` (o `index.html`) com a congregação.
Essa tela não pede senha — só lê o `data.json` publicado. Ela atualiza sozinha a cada 30 segundos.

## Publicando pela primeira vez (setup.sh)

Se for clonar este projeto num repositório novo, no terminal integrado do VS Code, dentro da pasta do
projeto, rode `bash setup.sh` — isso inicializa o git, faz o primeiro commit e envia tudo pro GitHub.
Depois, em **Settings → Pages**, selecione a branch `main` e a pasta `/ (root)` — e lembre de deixar o
repositório público (Settings → General → Danger Zone → Change visibility), senão o Pages gratuito não ativa.
