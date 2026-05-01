// STARTA SIDAN
document.addEventListener('DOMContentLoaded', function() {
    renderArticles();
});

// LOCALSTORAGE
function getArticles() {
    const data = localStorage.getItem("avspark-articles");
    return data ? JSON.parse(data) : [];
}

// SPARAR EN ARRAY MED ARTIKLAR I LOCALSTORAGE
function saveArticles(articles) {
    localStorage.setItem("avspark-articles", JSON.stringify(articles));
}

// SKAPA ARTIKEL
function createArticle() {
    const title = document.getElementById("input-title").value.trim();
    const category = document.getElementById("input-category").value.trim();
    const content = document.getElementById("input-content").value.trim();
    const author = document.getElementById("input-author").value.trim() || "Redaktionen"; // Om ingen författare anges, sätt "Redaktionen"


// HÄMTA DATUM FRÅN DATUMFÄLTET, OM INGET DATUM VÄLJS ANVÄNDS DAGENS DATUM AUTOMATISKT
const dateInput = document.getElementById("input-date").value;
const date = dateInput
    ? new Date(dateInput).toLocaleDateString("sv-SE", { year: "numeric", month: "long", day: "numeric" })
    : new Date().toLocaleDateString("sv-SE", { year: "numeric", month: "long", day: "numeric" });

// VALIDERING AV INMATNINGAR
if (!title || !content) {
    showToast("Fyll i titel och innehåll för att skapa en artikel.", "danger");
    return;
}

// SKAPA ARTIKEL OBJEKT
const article = {
    id: Date.now(), // Unikt ID baserat på tidsstämpel
    title: title,
    category: category,
    content: content,
    author: author,
    date: date,
}

// LÄGG TILL DEN NYA ARTIKELN I LISTAN OCH SPARA
const articles = getArticles();
articles.unshift(article); // Lägg till i början av arrayen så att nyaste artikeln visas först
saveArticles(articles);

// STÄNG MODALEN
const modal = bootstrap.Modal.getInstance(document.getElementById("articleModal"));
modal.hide();

// RENSA FORMULÄRFÄLTEN TILL NÄSTA GÅNG
document.getElementById("input-title").value = "";
document.getElementById("input-content").value = "";
document.getElementById("input-author").value = "";
document.getElementById("input-date").value = ""; //  RENSA DATUMFÄLTET

// UPPDATERA SIDAN OCH VISA EN TOAST
renderArticles();
showToast("Artikel skapad!", "success");
}

// RADERA ARTIKEL
function deleteArticle(id) {
    const articles = getArticles().filter(function (a) {
        return a.id !== id;
    });
    saveArticles(articles);
    renderArticles();
    showToast("Artikel raderad!", "warning");
}

// RENDERA ARTIKLAR
function renderArticles() {
    const articles = getArticles();
    const featuredContainer = document.getElementById("featured-article");
    const gridContainer = document.getElementById("article-grid");
    const noArticleMsg = document.getElementById("no-articles-msg");

    // RENSA INNEHÅLL
    featuredContainer.innerHTML = "";
    gridContainer.innerHTML = "";

    // VISA MEDDELANDE OM INGA ARTIKLAR FINNS
    if (articles.length === 0) {
        noArticleMsg.style.display = "block";
        return;
    }
    noArticleMsg.style.display = "none";

    // VISA DEN NYASTE ARTIKELN SOM HUVUD ARTIKEL
    const featured = articles[0];
    featuredContainer.innerHTML = createArticleHTML(featured);

    // VISA RESTEN AV ARTIKLARNA I GRID
    for (let i = 1; i < articles.length; i++) {
        const col = document.createElement("div");
        col.className = "col-md-6";
        col.innerHTML = createCardHTML(articles[i]);
        gridContainer.appendChild(col);
    }
}

    // SKAPA HTML FÖR HUVUD ARTIKEL
    function createArticleHTML(article) {
        // VISA MAX 60 TECKEN AV INNEHÅLLET I FÖRHANDSVISNINGEN
        const shortContent = article.content.length > 60 ? article.content.substring(0, 60) + "..." : article.content;

        return `
        <article class="main-article">
            <div class="main-article-content">
                <span class="category-badge">${article.category}</span>
                <h2 class="mt-3">${article.title}</h2>
                <div class="article-meta">
                    <i class="bi bi-person me-1"></i> ${article.author}
                    <span class="mx-2">|</span>
                    <i class="bi bi-calendar me-1"></i> ${article.date}
                </div>
                <p class="mt-3">${shortContent}</p>
                <div class="d-flex gap-2">
                    <!-- Klicka för att gå till artikelsidan -->
                    <a href="article.html?id=${article.id}" class="btn btn-dark">
                        Läs Mer <i class="bi bi-arrow-right ms-1"></i>
                    </a>
                    <button class="btn btn-outline-danger" onclick="deleteArticle(${article.id})">
                        <i class="bi bi-trash"></i> Radera
                    </button>
                </div>
            </div>
        </article>
    `;
}

    // SKAPA HTML FÖR KORT I GRID
    function createCardHTML(article) {
        const shortContent = article.content.length > 60 ? article.content.substring(0, 60) + "..." : article.content;

        return `
        <article class="article-card">
            <div class="article-card-body">
                <span class="category-badge">${article.category}</span>
                <h5 class="mt-2">${article.title}</h5>
                <p class="text-muted small">${shortContent}</p>
                <p class="article-meta mb-2">
                    <i class="bi bi-calendar me-1"></i> ${article.date}
                </p>
                <div class="d-flex gap-2">
                    <!-- Länk till full artikel -->
                    <a href="article.html?id=${article.id}" class="btn btn-sm btn-dark">
                        Läs Mer <i class="bi bi-arrow-right ms-1"></i>
                    </a>
                    <!-- Raderingsknapp -->
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteArticle(${article.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        </article>
    `;
}

// VISA TOAST-MEDDELANDE
function showToast(message, typ) {
    const toastEl = document.getElementById("liveToast");
    const toastMsg = document.getElementById("toast-message");

    // SÄTT MEDDELANDETEXT
    toastMsg.textContent = message;

    // ANPASSA TOASTENS UTSEENDE BASERAT PÅ TYP
    toastEl.className = "toast align-items-center text-white border-0";
    if (typ === "success") toastEl.classList.add("bg-success");
    if (typ === "danger") toastEl.classList.add("bg-danger");
    if (typ === "warning") toastEl.classList.add("bg-warning", "text-dark");

    // VISA TOASTEN
    const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
    toast.show();
}