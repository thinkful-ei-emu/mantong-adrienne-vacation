'use strict';
/*global $*/

const apiKey = 'CA0sUYQLbxxRRGToSTGCy7BIaRlZpDAZl5xLEBab';
const searchURL = 'https://developer.nps.gov/api/v1/parks?api_key=CA0sUYQLbxxRRGToSTGCy7BIaRlZpDAZl5xLEBab';

/**
 * Creates a query string from a params object
 * @param {object} params 
 * @returns {string} query string
 */
function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
  return queryItems.join('&');
}

/**
 * Performs the fetch call to get parks
 * @param {string} query 
 * @param {number} limit 
 */
function getParks(query, limit) {
  const params = {
    stateCode: query,
    language: 'en',
    limit:limit-1,
  };
  const queryString = formatQueryParams(params);
  const url = searchURL + '&' + queryString;
  

  //   const options = {
  //     headers: new Headers({'X-Api-Key': apiKey})
  //   };

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson, limit))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

/**
 * Appends formatted HTML results to the page
 * @param {object} responseJson 
 * @param {number} limit
 */ 
function displayResults(responseJson, limit) {
  console.log('responseJson: ',responseJson);
  // clear the error message
  $('#js-error-message').empty();
  // if there are previous results, remove them
  $('#results-list').empty();
  // iterate through the parks array, stopping at the max number of results
  responseJson.data.forEach(park => {
    // For each object in the parks array:
    // Add a list item to the results list with 
    // the park full name, 
    // description, Web URL
    $('#results-list').append(
      `
        <li><h3><a href="${park.url}">${park.name}</a></h3>
        <p>${park.description}</p>
        </li>
      `
    );
  });
  // unhide the results section  
  $('#results').removeClass('hidden');
}

/**
 * Handles the form submission
 */
function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    const limit = $('#js-max-results').val();
    getParks(searchTerm, limit);
  });
}

$(watchForm);