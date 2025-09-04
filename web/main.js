// Elementos HTML
const $list = document.getElementById('list');
const $error = document.getElementById('error');
const $spinner = document.getElementById('spinner');

const form = document.getElementById("postForm");
const output = document.getElementById("output");

const API = 'https://dummyjson.com/products'; // API pública de testes

let currentPage = 0;
const limit = 10;

function showSpinner(show) {
    $spinner.style.display = show ? 'inline-block' : 'none';
}

function showError(msg) {
    $error.textContent = msg || '';
}

// Função para exibir os produtos
function renderProdutos(posts) {
    // innerHTML para modificar o elemento
    // .map transforma o JSON em HTML
    $list.innerHTML = posts.products.map(p => `
    <div class="card d-flex flex-row align-items-center">
      <img src="${p.thumbnail}" alt="${p.title}" class="card-img">
      <div class="card-body">
        <strong>#${p.id} — ${p.title}</strong>
        <p><i class="bi bi-tags"></i> ${p.category}</p>
        <p><i class="bi bi-currency-dollar"></i> R$ ${p.price}</p>
        <p><i class="bi bi-star-fill text-warning"></i> ${p.rating}</p>
        <p><i class="bi bi-box-seam"></i> ${p.stock} em estoque</p>
      </div>
    </div>
  `).join('');
}

//função assincrona que carrega os posts
async function getProdutos(page = 0) {
    showError('');
    showSpinner(true); // mostra o loading

    try {
        const skip = page * limit;
        const res = await fetch(`${API}?limit=${limit}&skip=${skip}`);

        if (!res.ok) {
            throw new Error(`Erro HTTP ${res.status}`);
        }

        const data = await res.json();
        renderProdutos(data);
    } catch (err) {
        showError(err.message ?? 'Falha ao buscar dados');
    } finally {
        showSpinner(false); // some o loading
    }
}


// função para ir pra próxima página
function nextPage() {
    currentPage++;
    getProdutos(currentPage);
}

// função pra voltar página
function prevPage() {
    if (currentPage > 0) {
        currentPage--;
        getProdutos(currentPage);
    }
}


async function createProduto() {
    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // impede recarregar a página

        const title = document.getElementById("title").value;
        const body = document.getElementById("body").value;
        const userId = document.getElementById("userId").value;

        try {
            const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({title, body, userId})
            });

            if (!response.ok) {
                output.textContent = "Erro na requisição: " + response.status;
                return;
            }

            alert(`Post criado com sucesso`)
        } catch (err) {
            output.textContent = "Erro: " + err.message;
        }
    });
}