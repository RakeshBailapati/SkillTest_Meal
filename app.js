// inital getting all required elements using DOM query
const searchBox = document.getElementById('search-box');
const resultsContainer = document.getElementById('results-container');
const moreButton = document.getElementById('more-button');
const favoritesList = document.getElementById('favorites-list'); 
// initalizing master array
var Mealdata = [];
// getting data from localstorage
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Saving favorites data into localstorage and removing if dublicates present
function saveFavoritesToLocalStorage() {
    let uniqueArrayFav = favorites.filter((value, index, self) => self.indexOf(value) === index);
    favorites=uniqueArrayFav;
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// updating result of favorites in fav list dynamically
function updateFavoritesList() {
    favoritesList.innerHTML = '';
    favorites.forEach(favItem => {
        const li = document.createElement('li');
        li.textContent = favItem.strMeal;
        favoritesList.appendChild(li);
    });
    // getting result-item div child item using is query
    const resultItems = resultsContainer.querySelectorAll('.result-item');
    // looping each item if it is not favorite item then we are changing heart symbol to red to normal
    resultItems.forEach(resultItem => {
        const h3Element = resultItem.querySelector('h3');
        if (h3Element) {
            const mealName = h3Element.textContent;
            const isFavorite = favorites.some(favItem => favItem.strMeal === mealName);
            const favoriteIcon = resultItem.querySelector('.favorite-icon img');

            if (favoriteIcon) {
                favoriteIcon.src = isFavorite ? 'imgs/heart-red.svg' : 'imgs/heart-linear.svg';
            }
        }
    });
}

// adding data to localstorage
function addToFavorites(item) {
    favorites.push(item);
    saveFavoritesToLocalStorage();
    updateFavoritesList();
}
// removing item from favorites list
function removeFromFavorites(item) {
    const index = favorites.findIndex(favItem => favItem.strMeal === item.strMeal);
    if (index !== -1) {
        favorites.splice(index, 1);
        saveFavoritesToLocalStorage();
        updateFavoritesList();
    }
}
// Fetching data from API
var query="a"
async function fetchData(query) {
    const apiUrl = 'https://www.themealdb.com/api/json/v1/1/search.php?f=' + query;
    //var Mealdata = []; // Initialize the array
  
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      let data = await response.json();
      Mealdata.push(...data.meals);
      //const uniqueArray = Mealdata.filter((value, index, self) => self.indexOf(value) === index);
      const uniqueArray = Array.from(
        new Set(Mealdata.map((item) => item.idMeal))
      ).map((id) => {
        return Mealdata.find((item) => item.idMeal=== id);
      });
      console.log(uniqueArray);
      Mealdata=[];
      Mealdata=[...uniqueArray];
      console.log(uniqueArray);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }


// calling fetch function for inital load for page
fetchData(query);
// when input have entered it will handle fetch the data from APi and displays the result data
searchBox.addEventListener('input', function () {
    const query = searchBox.value.trim().toLowerCase();

    // Clear previous results
    resultsContainer.innerHTML = '';
    moreButton.style.display = 'none';
    // No query, no results
    if (query.length === 0) {
        return;
    }
    //calling API to get data  
    fetchData(query);
    // This is to sleep the js for a while to give enough time to load data from API
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
      
      async function sleeping() {
        console.log('Start');
        // Sleep for 2 seconds (2000 milliseconds)
        await sleep(2000); 
        console.log('End');
      }
      
      sleeping();
    // matching with query letter and adding into variable matchingItems
    // based on this the items div will going to create and display  
    const matchingItems = Mealdata.filter(item =>
        item.strMeal.toLowerCase().includes(query)
    );
    // Display a message when no matching items are found
    if (matchingItems.length === 0) {
        const noResultsMessage = document.createElement('div');
        noResultsMessage.textContent = 'No results found.';
        resultsContainer.appendChild(noResultsMessage);
    } else {
        // Display the matching items
        // Maximum number of results to display
        const maxResults = 10; 
        const itemsToShow = matchingItems.slice(0, maxResults);

        itemsToShow.forEach(itemData => {
            const resultDiv = document.createElement('div');
            // Add class for styling
            resultDiv.classList.add('result-item'); 

            // Create and append the image div
            const imageDiv = document.createElement('div');
            imageDiv.classList.add('image-div');
            const imageLink = document.createElement('a');
            imageLink.target="_blank";
            imageLink.href = itemData.strSource;
            const image = document.createElement('img');
            image.src = itemData.strMealThumb;
            image.style.width = '100%'; 
            image.style.height = '100%';
            imageLink.appendChild(image); 
            imageDiv.appendChild(imageLink);
            resultDiv.appendChild(imageDiv);

            // Create a container div for the title and favorite icon
            const titleAndIconContainer = document.createElement('div');
            titleAndIconContainer.classList.add('title-and-icon-container');

            // Create and append the favorite icon
            const favoriteIcon = document.createElement('img');
            favoriteIcon.classList.add('favorite-icon');
            //const like = document.createElement('img');
            //favoriteIcon.textContent = '❤️'; 
            favoriteIcon.src="imgs/heart-linear.svg";
            //like.classList.add('favorite-icon');
            //favoriteIcon.appendChild(like);

            // Add click event to toggle favorite status
            let isFavorite = false;
            favoriteIcon.addEventListener('click', function () {
                if (isFavorite) {
                    favoriteIcon.classList.remove('active');
                    // Set the image source to the inactive icon
                    favoriteIcon.src = 'imgs/heart-linear.svg'; 
                    removeFromFavorites(itemData);
                } else {
                    favoriteIcon.classList.add('active');
                    // Set the image source to the active icon
                    favoriteIcon.src = 'imgs/heart-red.svg'; 
                    addToFavorites(itemData);
                }
                isFavorite = !isFavorite;
            });
            

            // Create and append the title element
            const title = document.createElement('h3');
            title.textContent = itemData.strMeal;
            titleAndIconContainer.appendChild(title);
            titleAndIconContainer.appendChild(favoriteIcon);
            // Create and append the text div with paragraph
            const textDiv = document.createElement('div');
            textDiv.classList.add('text-div');
            const paragraph = document.createElement('p');
            paragraph.textContent = itemData.strInstructions;
            textDiv.appendChild(paragraph);
            const resultLink = document.createElement('a');
            resultLink.href = itemData.strYoutube;
            resultLink.textContent = 'Watch on YouTube';
            resultLink.target = '_blank'; // Open the link in a new tab
            resultLink.classList.add('result-link');
            resultDiv.appendChild(resultLink);
            resultDiv.appendChild(titleAndIconContainer);
            resultDiv.appendChild(textDiv);
            resultsContainer.appendChild(resultDiv);
        });

        if (matchingItems.length > maxResults) {
            moreButton.style.display = 'block';
        }
    }
});


  
  // Usage of More Button to display more items 
  // Initialize an offset to keep track of the displayed items
  let offset = 0;

  moreButton.addEventListener('click', function () {
      const query = searchBox.value.trim().toLowerCase();
  
      // Clear previous results
      resultsContainer.innerHTML = '';
  
      const matchingItems = Mealdata.filter(item =>
          item.strMeal.toLowerCase().includes(query)
      );
  
      const maxResults = 10; 
      // Calculate the start and end indices for the next batch of items
      const startIndex = offset;
      const endIndex = offset + maxResults;
  
      const itemsToShow = matchingItems.slice(startIndex, endIndex);
  
      itemsToShow.forEach(itemData => {
          const resultDiv = document.createElement('div');
          resultDiv.classList.add('result-item'); // Add class for styling
            // Create and append the image div
            const imageDiv = document.createElement('div');
            imageDiv.classList.add('image-div');
            const imageLink = document.createElement('a');
            imageLink.target="_blank";
            imageLink.href = itemData.strSource;
            const image = document.createElement('img');
            image.src = itemData.strMealThumb;
            image.style.width = '100%'; 
            image.style.height = '100%';
            imageLink.appendChild(image); 
            imageDiv.appendChild(imageLink);
            resultDiv.appendChild(imageDiv);

            // Create a container div for the title and favorite icon
            const titleAndIconContainer = document.createElement('div');
            titleAndIconContainer.classList.add('title-and-icon-container');

            // Create and append the favorite icon
            const favoriteIcon = document.createElement('img');
            favoriteIcon.classList.add('favorite-icon');
            //const like = document.createElement('img');
            //favoriteIcon.textContent = '❤️'; 
            favoriteIcon.src="imgs/heart-linear.svg";
            //like.classList.add('favorite-icon');
            //favoriteIcon.appendChild(like);

            // Add click event to toggle favorite status
            let isFavorite = false;
            favoriteIcon.addEventListener('click', function () {
                if (isFavorite) {
                    favoriteIcon.classList.remove('active');
                    favoriteIcon.src = 'imgs/heart-linear.svg'; // Set the image source to the inactive icon
                    removeFromFavorites(itemData);
                } else {
                    favoriteIcon.classList.add('active');
                    favoriteIcon.src = 'imgs/heart-red.svg'; // Set the image source to the active icon
                    addToFavorites(itemData);
                }
                isFavorite = !isFavorite;
            });
            

            // Create and append the title element
            const title = document.createElement('h3');
            title.textContent = itemData.strMeal;
            titleAndIconContainer.appendChild(title);
            titleAndIconContainer.appendChild(favoriteIcon);
            // Create and append the text div with paragraph
            const textDiv = document.createElement('div');
            textDiv.classList.add('text-div');
            const paragraph = document.createElement('p');
            paragraph.textContent = itemData.strInstructions;
            textDiv.appendChild(paragraph);
            const resultLink = document.createElement('a');
            resultLink.href = itemData.strYoutube;
            resultLink.textContent = 'Watch on YouTube';
            resultLink.target = '_blank'; // Open the link in a new tab
            resultLink.classList.add('result-link');
            resultDiv.appendChild(resultLink);
            resultDiv.appendChild(titleAndIconContainer);
            resultDiv.appendChild(textDiv);
  
          resultsContainer.appendChild(resultDiv);
      });
  
      // Update the offset for the next "More" button click
      offset = endIndex;
  
      // If there are more items to show, display the "More" button
      if (offset < matchingItems.length) {
          moreButton.style.display = 'block';
      } else {
          moreButton.style.display = 'none'; // Hide the "More" button when all items are displayed
      }
  });
  
/////////////////////////////////////// More-End /////////////////////////
// everytime only less than 10 will going to show if we need to show other 10 items means we need to click on more button

resultsContainer.addEventListener('click', function (event) {
    const clickedElement = event.target;

    if (clickedElement.classList.contains('favorite-icon')) {
        const resultDiv = clickedElement.closest('.result-item');
        const idMeal = resultDiv.dataset.idMeal; // Get the unique identifier from a data attribute
        const itemData = Mealdata.find(item => item.idMeal === idMeal);

        if (itemData) {
            toggleFavorite(clickedElement, itemData);
        }
    }
});

function toggleFavorite(favoriteIcon, itemData) {
    favoriteIcon.classList.toggle('active');
    if (favoriteIcon.classList.contains('active')) {
        addToFavorites(itemData);
    } else {
        removeFromFavorites(itemData);
    }
}
// this is use for adding and removing item from favorites list
function toggleFavorite(favoriteIcon, itemData) {
    favoriteIcon.classList.toggle('favorite-icon');
    if (favoriteIcon.classList.contains('active')) {
        addToFavorites(itemData);
    } else {
        removeFromFavorites(itemData);
    }
}


updateFavoritesList();
