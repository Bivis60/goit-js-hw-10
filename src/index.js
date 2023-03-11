import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

countryList.style.listStyle = 'none';
countryList.style.display = 'flex';
countryList.style.gap = '15px';
countryList.style.flexDirection = 'column';
countryInfo.style.display = 'flex';
countryInfo.style.flexDirection = 'column';
countryInfo.style.alignItems = 'center';

input.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));

function onInputSearch(e) {
  e.preventDefault();

  const inputValue = input.value.trim();

  if (!inputValue) {
    resetHTML();
    return;
  }

  fetchCountries(inputValue)
    .then(result => {
      if (result.length > 10) {
        Notify.info(
          'Too many matches found. Please, enter a more specific name.'
        );
        return;
      }
      renderedCountries(result);
    })
    .catch(error => {
      resetHTML();
      Notify.failure('Oops, there is no country with that name');
    });
}

function renderedCountries(result) {
  const inputLength = result.length;

  if (inputLength === 1) {
    countryList.innerHTML = '';
    renderCard(result);
  }

  if (inputLength > 1 && inputLength <= 10) {
    countryInfo.innerHTML = '';
    renderList(result);
  }
}

function renderList(countries) {
  const markup = countries
    .map(({ name, flags }) => {
      return `<li>
                    <img src="${flags.svg}" alt="flag of ${name}" width="60" height="auto">
                    <span>${name.official}</span>
                </li>`;
    })
    .join('');
  countryList.innerHTML = markup;
}

function renderCard(result) {
  const markup = result
    .map(({ flags, name, capital, population, languages }) => {
      languages = Object.values(languages).join(', ');
      return `
            <img src="${flags.svg}" alt="flag of ${name}" width="240" height="auto">
            <h1> ${name.official}</h1>
            <p><b>Capital: ${capital}</b></p>
            <p><b>Population: ${population}</b></p>
            <p><b>Languages: ${languages}</b></p>`;
    })
    .join('');
  countryInfo.innerHTML = markup;
}

function resetHTML() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}
