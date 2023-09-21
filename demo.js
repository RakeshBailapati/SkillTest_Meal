const dataJson = require('./MealApiJson.json');
console.log(typeof dataJson);
// console.log(dataJson);
var Mealdata=[];
var fil=new Set();
dataJson.meals.forEach((item)=>{
    fil.add(item.strCategory)
});
//console.log(fil);
async function fetchData() {
    var query = "a";
    const apiUrl = 'https://www.themealdb.com/api/json/v1/1/search.php?f=' + query;
    //var Mealdata = []; // Initialize the array
  
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      Mealdata.push(...data.meals);
      
      // Now you can work with Mealdata here
      //console.log(Mealdata);
  
      // Perform other synchronous tasks here
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  fetchData();
  

  function fetchDataFromAPI(apiUrl) {
    return fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        return data;
      })
      .catch(error => {
        throw error;
      });
  }

  console.log(Mealdata);