const photoCard = document.querySelector('.photo-card');

async function getPhoto(photo) {
  const BASE_URL = `https://pixabay.com/api/`;
  const KEY = `40926027-5cb2084dfcf445810afb57cb9`;
  const resp = await fetch(
    `${BASE_URL}?key=${KEY}&q=${photo}&image_type=photo&orientation =horizontal&safesearch =true&per_page=40&page`
  );
  if (!resp.ok) {
    throw new Error(resp.statusText);
  }
  return resp.json();
}

getPhoto('dog')
  .then(data =>
    photoCard.insertAdjacentHTML('beforeend', creatMarkup(data.hits))
  )
  .catch(err => console.log(err));

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
