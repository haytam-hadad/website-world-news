const newsContainer = document.getElementById("news-articles");
const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");
const categoryLinks = document.querySelectorAll('.category');
const languageSelect = document.getElementById("language-select");

const apiKey = "7050f6e3f12b4a4794b0ab06803e88e5";
let currentLanguage = 'en';
const url = `https://newsapi.org/v2/top-headlines?language=${currentLanguage}&apiKey=${apiKey}`;

function fetchNews(fetchUrl) {
  fetch(fetchUrl)
    .then(response => response.json())
    .then(data => {
      newsContainer.innerHTML = ''; // Clear old articles
      if (data.articles.length > 0) {
        data.articles.forEach(article => {
          if (article.urlToImage != null) {
            const author = article.author ? article.author : 'Unknown author';
            const timeSincePublished = timeAgo(article.publishedAt);

            const newsArticle = document.createElement("article");
            newsArticle.innerHTML = `
                  <img src="${article.urlToImage}" alt="News Image">
                  <p><small>Published : ${timeSincePublished} <i class="fa-regular fa-clock"></i></small></p>
                  <h2>${article.title}</h2>
                  <p class="desc">${article.description}</p>
                  <p><strong>By: ${author} <i class="fa-solid fa-feather"></i></strong></p>
                  <hr><a href="${article.url}" target="_blank">Click here for more :</a>
                `;
            newsContainer.appendChild(newsArticle);
          }
        });
      } else {
        newsContainer.innerHTML = '<p>No articles found.</p>';
      }
    })
    .catch(error => {
      console.error('Error fetching news:', error);
    });
}


// Initial fetch on page load
fetchNews(url);

// Event listener for search
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) {
    const searchUrl = `https://newsapi.org/v2/everything?q=${query}&language=${currentLanguage}&apiKey=${apiKey}`;
    fetchNews(searchUrl);
  }
});

// Event listeners for category filtering
categoryLinks.forEach(link => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const category = event.target.getAttribute('data-category');
    const categoryUrl = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&language=${currentLanguage}&apiKey=${apiKey}`;
    fetchNews(categoryUrl);
  });
});

// Event listener for language change
languageSelect.addEventListener('change', (event) => {
  currentLanguage = event.target.value;
  const languageUrl = `https://newsapi.org/v2/top-headlines?country=us&language=${currentLanguage}&apiKey=${apiKey}`;
  fetchNews(languageUrl); // Fetch news in the selected language
});


function active(link) {
  categoryLinks.forEach(elem => {
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
    return `${years} year${years > 1 ? 's' : ''} ago`;
  } else if (months > 0) {
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
  }
}