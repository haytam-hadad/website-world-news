const newsContainer = document.getElementById("news-articles");
const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");
const categoryLinks = document.querySelectorAll(".category");
const languageSelect = document.getElementById("language-select");

const fetch = require('node-fetch');
const apiKey = process.env.MY_NEWS_API_KEY;

exports.handler = async function(event, context) {
  const apiKey = process.env.MY_NEWS_API_KEY;
  const url = `https://newsapi.org/v2/everything?q=keyword&apiKey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error fetching data from API' }),
    };
  }
};


let currentLanguage = "en";
const url = `https://newsapi.org/v2/top-headlines?language=${currentLanguage}&apiKey=${apiKey}`;


function fetchNews(fetchUrl) {
  fetch(fetchUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log("API Response Data:", data);
      newsContainer.innerHTML = ""; // Clear the old content

      if (data.articles.length > 0) {
        data.articles.forEach((article) => {
          if (article.urlToImage != null) {
            const author = article.author ? article.author : "Unknown author";
            const timeSincePublished = timeAgo(article.publishedAt);

            const newsArticle = document.createElement("article");
            newsArticle.innerHTML = `
              <img src="${article.urlToImage}" alt="News Image">
              <p class="Published"><small>Published : ${timeSincePublished} <i class="fa-regular fa-clock"></i></small></p>
              <h2>${article.title}</h2>
              <p class="desc">${article.description}</p>
              <p><strong>By: ${author} <i class="fa-solid fa-feather"></i></strong></p>
              <hr><a href="${article.url}" target="_blank">Click here for more :</a>
            `;

            newsArticle.classList.add("hidden");
            newsContainer.appendChild(newsArticle);
          }
        });
        observeArticles();
      } else {
        newsContainer.innerHTML = "<p>No articles found.</p>";
      }
    })
    .catch((error) => {
      console.error("Error fetching news:", error);
    });
}


fetchNews(url);

searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) {
    const searchUrl = `https://newsapi.org/v2/everything?q=${query}&language=${currentLanguage}&apiKey=${apiKey}`;
    fetchNews(searchUrl);
  }
});

categoryLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const category = event.target.getAttribute("data-category");
    const categoryUrl = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&language=${currentLanguage}&apiKey=${apiKey}`;
    fetchNews(categoryUrl);
  });
});

languageSelect.addEventListener("change", (event) => {
  currentLanguage = event.target.value;
  const languageUrl = `https://newsapi.org/v2/top-headlines?country=us&language=${currentLanguage}&apiKey=${apiKey}`;
  fetchNews(languageUrl);
});

function active(link) {
  categoryLinks.forEach((elem) => {
    elem.classList.remove("active");
  });

  link.classList.add("active");
}

function timeAgo(publishedDate) {
  const now = new Date();
  const published = new Date(publishedDate);
  const diffInSeconds = Math.floor((now - published) / 1000);

  const seconds = diffInSeconds;
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) {
    return `${years} year${years > 1 ? "s" : ""} ago`;
  } else if (months > 0) {
    return `${months} month${months > 1 ? "s" : ""} ago`;
  } else if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else {
    return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
  }
}


function observeArticles() {
  const articles = document.querySelectorAll('article');
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('hidden');
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  });

  articles.forEach(article => {
    observer.observe(article);
  });
}
