import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { searchPics } from './api-pixabay.js';

const searchForm = document.querySelector('#search-form');
const searchQuery = document.querySelector('[name="searchQuery"]');
const gallery = document.querySelector('.gallery');
const loadButton = document.querySelector('.load-more');

let searchText = '';
let currentPage = 1;
let lightBox;

loadButton.style.visibility = 'hidden';

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  currentPage = 1;
  searchText = searchQuery.value;
  searchPics(searchText, currentPage)
    .then(response => {
      console.log(response);
      gallery.innerHTML = '';
      gallery.style.display = 'flex';
      gallery.style.flexWrap = 'wrap';
      gallery.style.gap = '50px';
      gallery.marginTop = '50px';
      if (response.data.hits.length === 0) {
        Notiflix.Notify.failure(
          `Sorry, there are no images matching your search query. Please try again.`
        );
        return;
      }
      Notiflix.Notify.success(
        `Hooray! We found ${response.data.totalHits} images.`
      );

      drawImages(response.data.hits);

      lightbox = new SimpleLightbox('.gallery a', {});
      if (currentPage * 40 >= response.data.totalHits) {
        loadButton.style.visibility = 'hidden';
      } else {
        loadButton.style.visibility = 'visible';
      }
    })
    .catch(e => {
      Notiflix.Notify.failure(`Error`);
    });
});

loadButton.addEventListener('click', e => {
  currentPage = currentPage + 1;
  searchPics(searchText, currentPage).then(response => {
    drawImages(response.data.hits);
    lightbox.refresh();
    if (currentPage * 40 >= response.data.totalHits) {
      loadButton.style.visibility = 'hidden';
      Notiflix.Notify.failure(
        `We're sorry, but you've reached the end of search results.`
      );
      return;
    } else {
      loadButton.style.visibility = 'visible';
    }
  });
});

function drawImages(hits) {
  for (const photoData of hits) {
    const galleryBlock = document.createElement('div');
    galleryBlock.classList.add('photo-card');
    const galleryLink = document.createElement('a');
    galleryLink.href = photoData.largeImageURL;
    const galleryImg = document.createElement('img');
    galleryImg.src = photoData.previewURL;
    galleryImg.alt = photoData.tags;
    const galleryInfo = document.createElement('div');
    galleryInfo.classList.add('info');
    galleryInfo.style.display = 'flex';
    galleryInfo.style.justifyContent = 'center';
    galleryInfo.style.gap = '6px';
    galleryInfo.style.fontSize = '7px';
    const galleryInfoLikes = document.createElement('p');
    galleryInfoLikes.classList.add('info-item');
    galleryInfoLikes.style.textAlign = 'center';
    const galleryInfoTitleLikes = document.createElement('b');
    const galleryInfoTitleLikesNumber = document.createElement('p');
    galleryInfoTitleLikesNumber.innerHTML = photoData.likes;
    galleryInfoTitleLikes.innerHTML = 'Likes';
    const galleryInfoViews = document.createElement('p');
    galleryInfoViews.classList.add('info-item');
    galleryInfoViews.style.textAlign = 'center';
    const galleryInfoTitleViews = document.createElement('b');
    const galleryInfoTitleViewsNumber = document.createElement('p');
    galleryInfoTitleViewsNumber.innerHTML = photoData.views;
    galleryInfoTitleViews.innerHTML = 'Views';
    const galleryInfoComments = document.createElement('p');
    galleryInfoComments.classList.add('info-item');
    galleryInfoComments.style.textAlign = 'center';
    const galleryInfoTitleComments = document.createElement('b');
    const galleryInfoTitleCommentsNumber = document.createElement('p');
    galleryInfoTitleCommentsNumber.innerHTML = photoData.comments;
    galleryInfoTitleComments.innerHTML = 'Comments';
    const galleryInfoDownloads = document.createElement('p');
    galleryInfoDownloads.classList.add('info-item');
    galleryInfoDownloads.style.textAlign = 'center';
    const galleryInfoTitleDownloads = document.createElement('b');
    const galleryInfoTitleDownloadsNumber = document.createElement('p');
    galleryInfoTitleDownloadsNumber.innerHTML = photoData.downloads;
    galleryInfoTitleDownloads.innerHTML = 'Downloads';

    gallery.append(galleryBlock);
    galleryLink.append(galleryImg);
    galleryBlock.append(galleryLink);
    galleryBlock.append(galleryInfo);
    galleryInfo.append(galleryInfoLikes);
    galleryInfo.append(galleryInfoViews);
    galleryInfo.append(galleryInfoComments);
    galleryInfo.append(galleryInfoDownloads);
    galleryInfoLikes.append(galleryInfoTitleLikes);
    galleryInfoViews.append(galleryInfoTitleViews);
    galleryInfoComments.append(galleryInfoTitleComments);
    galleryInfoDownloads.append(galleryInfoTitleDownloads);
    galleryInfoTitleLikes.append(galleryInfoTitleLikesNumber);
    galleryInfoTitleViews.append(galleryInfoTitleViewsNumber);
    galleryInfoTitleComments.append(galleryInfoTitleCommentsNumber);
    galleryInfoTitleDownloads.append(galleryInfoTitleDownloadsNumber);
  }
}
