import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const BASE_URL = `https://pixabay.com/api/`;
const KEY = `40926027-5cb2084dfcf445810afb57cb9`;
const curentIMG = 40;
const photoCard = document.querySelector('.photo-card');
const search = document.querySelector('.search-form');
let currentPage = 1;
let resultSearch;

let simpleGallery = new SimpleLightbox('.large-img', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});

const target = document.querySelector('.js-guard');
let options = {
  root: null,
  rootMargin: '200px',
  threshold: 1.0,
};

search.addEventListener('submit', onSearch);

async function onSearch(event) {
  event.preventDefault();
  currentPage = 1;
  observer.unobserve(target);
  const { searchQuery } = event.currentTarget.elements;
  resultSearch = searchQuery.value.trim();
  if (resultSearch.length === 0) {
    return Notiflix.Notify.warning('Enter text to search the gallery.');
  }

  try {
    const gallery = await getGallery(resultSearch, currentPage);
    if (curentIMG < gallery.totalHits) {
      observer.observe(target);
    }
    if (gallery.totalHits === 0) {
      return Notiflix.Notify.failure(
        '❌Sorry, there are no images matching your search query. Please try again.'
      );
    }
    photoCard.innerHTML = creatMarkup(gallery.hits);
    Notiflix.Notify.success(
      '✅ Hooray! We found ' + `${gallery.totalHits}` + ' images.'
    );
    simpleGallery.refresh();
  } catch (err) {
    console.log(err);
  } finally {
    event.target.reset();
  }
}

let observer = new IntersectionObserver(onLouder, options);

function onLouder(entries, observer) {
  entries.forEach(async entry => {
    if (entry.isIntersecting) {
      currentPage += 1;

      try {
        const gallery = await getGallery(resultSearch, currentPage);
        photoCard.insertAdjacentHTML('beforeend', creatMarkup(gallery.hits));

        simpleGallery.refresh();
        const totalPage = Math.ceil(gallery.totalHits / curentIMG);
        if (currentPage === totalPage) {
          observer.unobserve(target);
          Notiflix.Notify.warning(
            "We're sorry, but you've reached the end of search results."
          );
        }
      } catch (err) {
        console.log(err);
      }
    }
  });
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
      }) => `<li class=info-item>  <a class='large-img' href=${largeImageURL}>  <img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
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
