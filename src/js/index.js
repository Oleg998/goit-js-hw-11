import axios from 'axios';
import Notiflix from 'notiflix';
const BASE_URL = `https://pixabay.com/api/`;
const KEY = `40926027-5cb2084dfcf445810afb57cb9`;
const curentIMG = 40;
const photoCard = document.querySelector('.photo-card');
const load = document.querySelector('.load-more');
const search = document.querySelector('.search-form');
const searchBtn = document.getElementById('searchButton');
let currentPage = 1;
let resultSearch;

load.addEventListener('click', onLoud);

search.addEventListener('submit', onSearch);

async function onSearch(event) {
  event.preventDefault();
  currentPage=1
  load.hidden = true
  const { searchQuery } = event.currentTarget.elements;
  resultSearch = searchQuery.value.trim();
  if (resultSearch.length === 0) {
    return Notiflix.Notify.warning('Enter text to search the gallery.');
  }

  try {
    const gallery = await getGallery(resultSearch, currentPage);
    if (curentIMG < gallery.totalHits) {
      load.hidden = false;
    }
    if (gallery.totalHits === 0) { 
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    photoCard.innerHTML = creatMarkup(gallery.hits);
    Notiflix.Notify.success(
      'Hooray! We found ' + `${ gallery.totalHits }` + ' images.'
    );
  } catch (err) {
    console.log(err);
  } finally {
    event.target.reset();
  }
}

async function onLoud() {
  currentPage += 1;
  try {
    
    const gallery = await getGallery(resultSearch, currentPage);
    photoCard.insertAdjacentHTML('beforeend', creatMarkup(gallery.hits));
    const totalPage = Math.ceil(gallery.totalHits / curentIMG);
    console.log(`currentPage:`,currentPage);
    if (currentPage === totalPage) {
      load.hidden = true;
      Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.")
    }
  } catch (err) {
    console.log(err);
  }
}

async function getGallery(name, currentPage) {
  const params = new URLSearchParams({
    key: KEY,
    q: name,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: currentPage,
    per_page: 40,
  });
  const { data } = await axios.get(`${BASE_URL}`, { params });
  return data;
}

function creatMarkup(arr) {
  return arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<li class=info-item> <img src="${webformatURL}" alt="${tags}" loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b>Likes</b>${likes}
      </p>
      <p class="info-item">
        <b>Views</b>${views}
      </p>
      <p class="info-item">
        <b>Comments</b>${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>${downloads}
      </p></li>`
    )
    .join('');
}
