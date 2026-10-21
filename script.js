```javascript
const URL_SUPABASE = "https://oujdqmplnzyzsodhjkgn.supabase.co";
const KEY = "sb_publishable_JmDk84cFZpi8N2N-X1ow7g_G2aCxTWu";

const formulario = document.getElementById("formProduto");
const lista = document.getElementById("lista");
const mensagem = document.getElementById("mensagem");

const cabecalhos = {
    apikey: KEY,
    Authorization: `Bearer ${KEY}`,
    "Content-Type": "application/json"
};

// CADASTRAR PRODUTO
formulario.addEventListener("submit", async function (evento) {
    evento.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const precoTexto = document.getElementById("preco").value.trim();
    const preco = Number(precoTexto);
    const imagem = document.getElementById("imagem").value.trim();

    if (
        !nome ||
        !descricao ||
        !imagem ||
        precoTexto === "" ||
        !Number.isFinite(preco) ||
        preco <= 0
    ) {
        mensagem.textContent = "Preencha todos os campos corretamente.";
        return;
    }

    let urlImagem;

    try {
        urlImagem = new URL(imagem);

        if (!["http:", "https:"].includes(urlImagem.protocol)) {
            throw new Error("URL inválida");
        }
    } catch {
        mensagem.textContent = "Informe um link válido para a imagem.";
        return;
    }

    const produto = {
        nome: nome,
        descricao: descricao,
        preco: preco,
        imagem: urlImagem.href
    };

    mensagem.textContent = "Salvando produto...";

    try {
        const resposta = await fetch(
            `${URL_SUPABASE}/rest/v1/produtos`,
            {
                method: "POST",
                headers: {
                    ...cabecalhos,
                    Prefer: "return=representation"
                },
                body: JSON.stringify(produto)
            }
        );

        if (!resposta.ok) {
            const erro = await resposta.text();
            console.error("Erro ao salvar:", erro);

            mensagem.textContent =
                "Não foi possível salvar. Confira as colunas e permissões do Supabase.";
            return;
        }

        formulario.reset();
        mensagem.textContent = "Produto cadastrado com sucesso!";

        await listarProdutos();

    } catch (erro) {
        console.error("Erro de conexão:", erro);
        mensagem.textContent = "Erro de conexão com o Supabase.";
    }
});

// LISTAR PRODUTOS
async function listarProdutos() {
    lista.replaceChildren();

    try {
        const resposta = await fetch(
            `${URL_SUPABASE}/rest/v1/produtos?select=*&order=id.desc`,
            {
                headers: {
                    apikey: KEY,
                    Authorization: `Bearer ${KEY}`
                }
            }
        );

        if (!resposta.ok) {
            const erro = await resposta.text();
            console.error("Erro ao listar:", erro);
            mensagem.textContent = "Erro ao carregar os produtos.";
            return;
        }

        const produtos = await resposta.json();

        if (produtos.length === 0) {
            const vazio = document.createElement("p");
            vazio.textContent = "Nenhum produto cadastrado ainda.";
            lista.appendChild(vazio);
            return;
        }

        produtos.forEach(produto => {
            const card = document.createElement("article");
            card.className = "card";

            const foto = document.createElement("img");
            foto.src = produto.imagem;
            foto.alt = produto.nome || "Produto";
            foto.loading = "lazy";

            foto.addEventListener("error", () => {
                foto.alt = "Imagem indisponível: " + produto.nome;
                foto.style.display = "none";
            });

            const conteudo = document.createElement("div");
            conteudo.className = "card-conteudo";

            const titulo = document.createElement("h3");
            titulo.textContent = produto.nome || "Produto sem nome";

            const texto = document.createElement("p");
            texto.className = "descricao";
            texto.textContent = produto.descricao || "Sem descrição.";

            const precoElemento = document.createElement("p");
            precoElemento.className = "preco";

            const valor = Number(produto.preco);

            if (
                produto.preco === null ||
                produto.preco === undefined ||
                produto.preco === "" ||
                !Number.isFinite(valor)
            ) {
                precoElemento.textContent = "Preço não informado";
            } else {
                precoElemento.textContent = valor.toLocaleString(
                    "pt-BR",
                    {
                        style: "currency",
                        currency: "BRL"
                    }
                );
            }

            conteudo.append(titulo, texto, precoElemento);
            card.append(foto, conteudo);
            lista.appendChild(card);
        });

    } catch (erro) {
        console.error("Erro ao listar:", erro);
        mensagem.textContent = "Erro de conexão ao carregar produtos.";
    }
}

// CARREGAR AO ABRIR O SITE
listarProdutos();
```
