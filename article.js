// HÄMTA ARTIKELNS ID FRÅN URL:EN
const params    = new URLSearchParams(window.location.search);
const articleId = Number(params.get("id"));

// STARTA SIDAN
document.addEventListener('DOMContentLoaded', function() {
    loadArticle();
});

// SKYDDAR MOT XSS GENOM ATT ERSÄTTA FARLIGA TECKEN
function sanitize(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

// LADDA OCH VISA ARTIKELN
function loadArticle() {
    const articles = JSON.parse(localStorage.getItem("avspark-articles")) || [];
    const article  = articles.find(function (a) {
        return a.id === articleId;
    });
    const container = document.getElementById("article-container");

    if (!article) {
        container.innerHTML = `
            <div class="main-article-content text-center py-5">
                <i class="bi bi-exclamation-circle text-danger" style="font-size:3rem;"></i>
                <h3 class="mt-3">Artikeln hittades inte</h3>
                <p class="text-muted">Den kan ha raderats eller så är länken felaktig.</p>
                <a href="index.html" class="btn btn-dark mt-2">Gå till startsidan</a>
            </div>
        `;
        return;
    }

    // UPPDATERA SIDANS TITEL MED ARTIKELNS RUBRIK
    document.title = sanitize(article.title) + " – Avspark";

    // VISA HELA ARTIKELNS INNEHÅLL
    // sanitize() används på all användardata för att skydda mot XSS
    container.innerHTML = `
        <div class="main-article-content">
            <span class="category-badge">${sanitize(article.category)}</span>
            <h2 class="mt-3">${sanitize(article.title)}</h2>
            <div class="article-meta mb-3">
                <i class="bi bi-person me-1"></i> ${sanitize(article.author)}
                <span class="mx-2">|</span>
                <i class="bi bi-calendar me-1"></i> ${sanitize(article.date)}
            </div>
            <p style="font-size:1.1rem; line-height:1.8;">${sanitize(article.content)}</p>
        </div>
    `;

    // VISA LIKES, DISLIKES OCH KOMMENTARER
    document.getElementById("likes-section").style.display    = "block";
    document.getElementById("comments-section").style.display = "block";

    // LADDA IN BEFINTLIGA LIKES OCH KOMMENTARER
    renderLikes();
    renderComments();
}

// LIKES OCH DISLIKES SOM SPARAS I LOCALSTORAGE MED ARTIKELNS ID SOM NYCKEL
function getLikes() {
    const data = localStorage.getItem("avspark-likes-" + articleId);
    return data ? JSON.parse(data) : { likes: 0, dislikes: 0 };
}

function saveLikes(obj) {
    localStorage.setItem("avspark-likes-" + articleId, JSON.stringify(obj));
}

function renderLikes() {
    const data = getLikes();
    document.getElementById("like-count").textContent    = data.likes;
    document.getElementById("dislike-count").textContent = data.dislikes;
}

function likeArticle() {
    const data = getLikes();
    data.likes++;
    saveLikes(data);
    renderLikes();
}

function dislikeArticle() {
    const data = getLikes();
    data.dislikes++;
    saveLikes(data);
    renderLikes();
}

// KOMMENTARER SOM SPARAS I LOCALSTORAGE MED ARTIKELNS ID SOM NYCKEL
function getComments() {
    const data = localStorage.getItem("avspark-comments-" + articleId);
    return data ? JSON.parse(data) : [];
}

function saveComments(comments) {
    localStorage.setItem("avspark-comments-" + articleId, JSON.stringify(comments));
}

function addComment() {
    const author = document.getElementById("comment-author").value.trim() || "Anonym";
    const text   = document.getElementById("comment-text").value.trim();

    if (!text) {
        alert("Fyll i en kommentar innan du skickar in.");
        return;
    }

    const comment = {
        author: author,
        text: text,
        date: new Date().toLocaleDateString("sv-SE", { year: "numeric", month: "long", day: "numeric" })
    };

    const comments = getComments();
    comments.push(comment);
    saveComments(comments);

    document.getElementById("comment-author").value = "";
    document.getElementById("comment-text").value   = "";

    renderComments();
}

// VISA KOMMENTARERNA PÅ SIDAN
// sanitize() används på all användardata för att skydda mot XSS
function renderComments() {
    const comments = getComments();
    const list     = document.getElementById("comments-list");

    if (comments.length === 0) {
        list.innerHTML = `<p class="text-muted">Inga kommentarer ännu. Var först med att kommentera!</p>`;
        return;
    }

    let html = "";
    for (let i = 0; i < comments.length; i++) {
        const c = comments[i];
        html += `
            <div class="comment-card">
                <div class="d-flex justify-content-between">
                    <strong><i class="bi bi-person-circle me-1"></i>${sanitize(c.author)}</strong>
                    <small class="text-muted">${sanitize(c.date)}</small>
                </div>
                <p class="mt-1 mb-0">${sanitize(c.text)}</p>
            </div>
        `;
    }

    list.innerHTML = html;
}