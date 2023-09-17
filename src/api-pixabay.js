import axios from 'axios';

const apiKey = '39499742-e6ee54a981069064b6b4afa72';

export const searchPics = (text, page) => {
  const url = `https://pixabay.com/api/?key=${apiKey}&q=${text}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;
  return axios.get(url);
};
