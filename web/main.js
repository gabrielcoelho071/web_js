// Elementos HTML
const $list = document.getElementById('list');
const $error = document.getElementById('error');
const $spinner = document.getElementById('spinner');

const form = document.getElementById("postForm");
const output = document.getElementById("output");

const API = 'https://dummyjson.com/products'; // API pública de testes

let currentPage = 0;
const limit = 18;

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
        <div class="card">
          <div class="card__shine"></div>
          <div class="card__glow"></div>
          <div class="card__content">
            <div class="card__badge"><strong>#${p.id}</strong></div>
            <div style="--bg-color: #a78bfa" class="card__image"><img src="${p.thumbnail}" alt="${p.title}" class="card-img"></div>
            <div class="card__text">
              <p class="card__title">${p.title}</p>
              <p class="card__description">${p.category}</p>
            </div>
            <div class="card__footer">
              <div class="card__price">R$ ${p.price}</div>
              <div class="card__button">
                <svg height="16" width="16" viewBox="0 0 24 24">
                  <path
                    stroke-width="2"
                    stroke="currentColor"
                    d="M4 12H20M12 4V20"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
            </div>
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