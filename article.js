// HÄMTA ARTIKELNNS ID FRÅN URL:EN
const params = new URLSearchParams(window.location.search);
const articleId = Number(params.get("id"));

// STARTA SIDAN
document.addEventListener('DOMContentLoaded', function() {
loadArticle();
});

// LADDA OCH VISA ARTIKELN
function loadArticle() {
const articles = JSON.parse(localStorage.getItem("avspark-articles")) || [];
const article = articles.find(function (a) {
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
document.title = article.title + " – Avspark";

// VISA HELA ARTIKELNS INNEHÅLL
container.innerHTML = `
    <div class="main-article-content">
        <span class="category-badge">${article.category}</span>
        <h2 class="mt-3">${article.title}</h2>
        <div class="article-meta mb-3">
            <i class="bi bi-person me-1"></i> ${article.author}
            <span class="mx-2">|</span>
            <i class="bi bi-calendar me-1"></i> ${article.date}
        </div>
        <!-- Hela innehållet visas här (inte max 60 tecken som på startsidan) -->
        <p style="font-size:1.1rem; line-height:1.8;">${article.content}</p>
    </div>
`;

// VISA LIKES, DISLIKES OCH KOMMENTARER
document.getElementById("likes-section").style.display = "block";
document.getElementById("comments-section").style.display = "block";

// LADDA IN BEFINTLIGA LIKES OCH KOMMENTARER
renderLikes();
renderComments();
}

// LIKES OCH DISLIKES SOM SPARAS I LOCALSTORAGE MED ARTIKELNS ID SOM NYCKEL
function getLikes() {
const data = localStorage.getItem("avspark-likes-" + articleId);
// OM DET FINNS DATA, PARSA DEN, ANNARS RETURNERA ETT NYTT OBJEKT MED 0 LIKES OCH 0 DISLIKES
return data ? JSON.parse(data) : { likes: 0, dislikes: 0 };
}

// SPARA LIKES OCH DISLIKES FÖR DENNA ARTIKEL
function saveLikes(obj) {
    localStorage.setItem("avspark-likes-" + articleId, JSON.stringify(obj));
}

// UPPDATERA SIFFRORNA PÅ SIDAN
function renderLikes() {
    const data = getLikes();
    document.getElementById("like-count").textContent = data.likes;
    document.getElementById("dislike-count").textContent = data.dislikes;
}

// NÄR ANVÄNDAREN KLICKAR PÅ GILLA-KNAPPEN
function likeArticle() {
    const data = getLikes();
    data.likes++;
    saveLikes(data);
    renderLikes();
}

// NÄR ANVÄNDAREN KLICKAR PÅ OGILLA-KNAPPEN
function dislikeArticle() {
    const data = getLikes();
    data.dislikes++;
    saveLikes(data);
    renderLikes();
}

// KOMMENTARER SOM SPARAS I LOCALSTORAGE MED ARTIKELNS ID SOM NYCKEL

// HÄMTA KOMMENTARER FÖR DENNA ARTIKEL
function getComments() {
    const data = localStorage.getItem("avspark-comments-" + articleId);
    return data ? JSON.parse(data) : [];
}

// SPARA KOMMENTARER FÖR DENNA ARTIKEL
function saveComments(comments) {
    localStorage.setItem("avspark-comments-" + articleId, JSON.stringify(comments));
}

// NÄR ANVÄNDAREN SKICKAR IN EN KOMMENTAR
function addComment() {
    const author = document.getElementById("comment-author").value.trim() || "Anonym"; // Om ingen författare anges, sätt "Anonym"
    const text = document.getElementById("comment-text").value.trim();

    // VALIDERING AV INMATNINGAR
    if (!text) {
        alert("Fyll i en kommentar innan du skickar in.");
        return;
    }

    // SKAPA KOMMENTAR OBJEKT
    const comment = {
        author: author,
        text: text,
        date: new Date().toLocaleString("sv-SE", { year: "numeric", month: "long", day: "numeric"
        })
    };

    // LÄGG TILL OCH SPARA

    const comments = getComments();
    comments.push(comment);
    saveComments(comments);

    // RENSA FORMULÄRFÄLTEN
    document.getElementById("comment-author").value = "";
    document.getElementById("comment-text").value = "";

    // UPPDATERA KOMMENTARLISTAN PÅ SIDAN
    renderComments();
}

// VISA KOMMENTARERNA PÅ SIDAN
function renderComments() {
    const comments = getComments();
    const list = document.getElementById("comments-list");

    // OM DET INTE FINNS NÅGRA KOMMENTARER, VISA ETT MEDDELANDE
    if (comments.length === 0) {
        list.innerHTML = `<p class="text-muted">Inga kommentarer ännu. Var först med att kommentera!</p>`;
        return;
    }

    // BYGG UPP KOMMENTARLISTAN
    let html = "";
    for (let i = 0; i < comments.length; i++) {
        const c = comments[i];
        html += `
            <div class="comment-card">
                <div class="d-flex justify-content-between">
                    <strong><i class="bi bi-person-circle me-1"></i>${c.author}</strong>
                    <small class="text-muted">${c.date}</small>
                </div>
                <p class="mt-1 mb-0">${c.text}</p>
            </div>
        `;
    }

    list.innerHTML = html;
}


