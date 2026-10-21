
const URL = "https://oujdqmplnzyzsodhjkgn.supabase.co";
const KEY = "sb_publishable_JmDk84cFZpi8N2N-X1ow7g_G2aCxTWu";

// SALVAR PRODUTO
async function salvar() {
    const nome = document.getElementById("nome").value.trim();
    const mensagem = document.getElementById("mensagem");

    if (!nome) {
        alert("Digite o nome do produto!");
        return;
    }

    try {
        const resposta = await fetch(`${URL}/rest/v1/produtos`, {
            method: "POST",
            headers: {
                "apikey": KEY,
                "Authorization": `Bearer ${KEY}`,
                "Content-Type": "application/json",
                "Prefer": "return=representation"
            },
            body: JSON.stringify({ nome })
        });

        const resultado = await resposta.text();

        if (!resposta.ok) {
            console.error("Erro ao salvar:", resposta.status, resultado);
            mensagem.innerText = `Erro ${resposta.status}: ${resultado}`;
            return;
        }

        mensagem.innerText = "Produto salvo!";
        document.getElementById("nome").value = "";
        await listarProdutos();

    } catch (erro) {
        console.error("Erro de conexão:", erro);
        mensagem.innerText = "Erro de conexão com o Supabase.";
    }
}

// LISTAR PRODUTOS
async function listarProdutos() {
    const lista = document.getElementById("lista");

    try {
        const resposta = await fetch(
            `${URL}/rest/v1/produtos?select=*`,
            {
                headers: {
                    "apikey": KEY,
                    "Authorization": `Bearer ${KEY}`
                }
            }
        );

        const resultado = await resposta.text();

        if (!resposta.ok) {
            console.error("Erro ao listar:", resposta.status, resultado);
            document.getElementById("mensagem").innerText =
                `Erro ao listar (${resposta.status}): ${resultado}`;
            return;
        }

        const produtos = JSON.parse(resultado);
        lista.innerHTML = "";

        produtos.forEach(produto => {
            const item = document.createElement("li");
            item.innerText = `${produto.id} - ${produto.nome}`;
            lista.appendChild(item);
        });

    } catch (erro) {
        console.error("Erro:", erro);
        document.getElementById("mensagem").innerText =
            "Erro de conexão ao listar produtos.";
    }
}

listarProdutos();
