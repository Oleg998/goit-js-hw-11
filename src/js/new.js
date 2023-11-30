import axios from "axios";
const BASE_URL = `https://pixabay.com/api/`;
const KEY = `40926027-5cb2084dfcf445810afb57cb9`;
const curentIMG = 40;
const photoCard = document.querySelector('.photo-card');
const load = document.querySelector('.load-more');
const search = document.querySelector('.search-form');
let currentPage = 1;

search.addEventListener('submit', onSearch);

async function onSearch(event) {
 event.preventDefault();
 const {searchQuery}=event.currentTarget.elements;
 const result = searchQuery.value.trim();
 
 if (curentIMG < data.totalHits){
  load.hidden = false;
  }
//  getPhoto(result)
// .then(data => {
// photoCard.innerHTML=('beforeend', creatMarkup(data.hits));
// if (curentIMG < data.totalHits) 
//  })
//  .catch(err => console.log(err));
// }

load.addEventListener('click', onLoud);



async function getGallery (photo, num=1) {
  const resp = axios.get(
    `${BASE_URL}?key=${KEY}&q=${photo}&image_type=photo&orientation =horizontal&safesearch =true&per_page=${curentIMG}&page=${num}`
  );
  return resp;
}

getPhoto("tesla")
  .then(data => {
    photoCard.insertAdjacentHTML('beforeend', creatMarkup(data.hits));
   
    if (curentIMG < data.totalHits) {
      load.hidden = false;
    }
  })
  .catch(err => console.log(err));

  function onLoud() {
    currentPage +=1;
    getPhoto("tesla",currentPage)
    .then(data => { 
      photoCard.insertAdjacentHTML('beforeend', creatMarkup(data.hits))
      const totalPage =Math.ceil(data.totalHits/curentIMG)
      console.log(totalPage);
      console.log(currentPage);
      if (currentPage === totalPage ) {
        load.hidden = true;}})
    .catch(err => console.log(err));
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
}}
