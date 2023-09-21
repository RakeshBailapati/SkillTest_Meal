// this function will perform the change image to video at same place when we click on play video button
// for this it will loop each elements and find which ele is clicked and it will change for that div only
document.addEventListener("DOMContentLoaded", function () {
    const playButtons = document.querySelectorAll(".youtube-playbutton");
    // looping throught reach play button
    playButtons.forEach((playButton) => {
        playButton.addEventListener("click", function () {
            const container = this.closest(".fav-item-container");
            const iframe = container.querySelector(".img_video iframe");
            const image = container.querySelector(".img_video img");

            iframe.style.display = "block"; 
            image.style.display = "none"; 
        });
    });
});
// getting favortites list from localstorage 
let fav_List = JSON.parse(localStorage.getItem('favorites')) || [];
// this method is using to save data to favorites list in localstorage
function saveFavoritesToLocalStorage() {
    let uniqueArrayFav = favorites.filter((value, index, self) => self.indexOf(value) === index);
    fav_List=uniqueArrayFav;
    localStorage.setItem('favorites', JSON.stringify(fav_List));
}

var dynamicData = [
    // {
    //     strYoutube: "https://www.youtube.com/embed/WYt_kcRdzFE?si=o57uG9F4sMjehcdZ",
    //     strMealThumb: "../imgs/Meal-BG.png",
    //     strCategory: "italian",
    //     strMeal: "fhfghfghfghf",
    //     strSource: "https://www.youtube.com/",
    //     strInstructions:"ioetrhoreijoerijoeijteroirjerijterjeorjiejiteoijer" // Specify the URL for this item
    // },
    // Add more data objects as needed
];

dynamicData=[...fav_List];
console.log(dynamicData);

// Sever side scripting to add child divs according the favorites list 
// it will return a container
function createFavItem(data) {
    const container = document.createElement("div");
    container.classList.add("fav-item-container");
    let embbedLink=convertToEmbeddedLink(data.strYoutube);
    container.innerHTML = `
        <div class="item-sub1">
            <div class="img_video">
                <iframe width="300" height="300" src="${embbedLink}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                <img src="${data.strMealThumb}" alt="">
            </div>
            <div class="video_More_div">
                <button class="youtube-playbutton">Play Video</button>
                <h5>${data.strCategory}</h5>
                <button class="more" data-url="${data.strSource}">More</button>
            </div>
        </div>
        <div class="item-sub2">
            <div class="title-Like-div">
                <h3>${data.strMeal}</h3>
                <button type="submit" name="like" value="">Liked</button>
            </div>
            <div class="information">
                <p>${data.strInstructions}</p>
            </div>
        </div>
    `;

    return container;
}

//  If we click on more button then it will naviagte to new page if the source link present in object
function handleMoreButtonClick(event) {
    const moreButton = event.target;
    const url = moreButton.getAttribute("data-url");

    if (url) {
        // Redirect the user to the specified URL
        //window.location.href = url;
        window.open(url, "_blank");
    }else{
        window.alert("there is no source link for this item.");
    }
}

// Get the parent element where you want to append the dynamic items
const parentElement = document.getElementById("fav-items");

// Looping through the dynamic data and create and append element
dynamicData.forEach((data) => {
    const favItem = createFavItem(data);
    parentElement.appendChild(favItem);
    const moreButton = favItem.querySelector(".more");
    moreButton.addEventListener("click", handleMoreButtonClick);
});

////////////////////////////////////////// Like Button ////////////////////////////////////////////

// Get all "Liked" buttons
const likeButtons = document.querySelectorAll('.title-Like-div button[name="like"]');

// Loop through each "Liked" button and add a click event listener
likeButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const parentContainer = button.closest('.fav-item-container');
        // Check if a parent container was found
        if (parentContainer) {
            const h3Element = parentContainer.querySelector('.title-Like-div h3');
            if (h3Element) {
                const titleText = h3Element.textContent;
                console.log(`Clicked on "${titleText}"`);
                removeItemAndUpdateLocalStorage(titleText);
            }

            parentContainer.remove();
        }
    });
});


// Loop through each "Liked" button and add hover event listener
likeButtons.forEach((button) => {
    button.addEventListener('mouseover', () => {
        // Change the button text to "Unlike" when hovering
        button.textContent = "Unlike";
    });

    button.addEventListener('mouseout', () => {
        // Change the button text back to "Liked" when not hovering
        button.textContent = "Liked";
    });
});



// converting youtube link to embbed link to display on screen
function convertToEmbeddedLink(youtubeUrl) {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/watch\?v=([^&]+)(.*)$/;
    const match = youtubeUrl.match(youtubeRegex);
    
    // Check if there's a match and the match has at least 5 elements (full match and four groups)
    if (match && match.length >= 5) {
        // Extract the video ID from the match
        const videoId = match[4];
        
        //embedded YouTube URL
        const embeddedUrl = `https://www.youtube.com/embed/${videoId}`;
        
        return embeddedUrl;
    } else {
        return null;
    }
}


// removing data from favorties list if we unlike the item in favorites page
function removeItemAndUpdateLocalStorage(strMeal) {
    console.log(strMeal);
    const indexToRemove = dynamicData.findIndex((item) => item.strMeal.toString().trim().toLowerCase() === strMeal.toString().trim().toLowerCase());
    if (indexToRemove !== -1) {
        dynamicData.splice(indexToRemove,1);
        localStorage.setItem('favorites', JSON.stringify(dynamicData));
    } else {
        console.log(`"${strMeal}" not found in dynamic data.`);
    }
}

