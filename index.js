// The start of code only when the DOM content is loaded.
document.addEventListener("DOMContentLoaded", function(){
    // Defining the API to be used later
    const fetchAPI = "http://localhost:3000/artwork"
    filteredData = [];
    
    // Async function for fetching data from API.
    async function mainFetcher(){
        const res = await fetch(fetchAPI, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });
        const data = await res.json();
        return data;
    }
    // First GET request to render all artwork.
    mainFetcher()
    .then(data => {
        renderArtworks(data);
    });
    
    //Main function for all artwork.
    function renderArtworks(data) {
        const artworkContainer = document.getElementById("artwork-container");
        artworkContainer.innerHTML = ""; // Clear previous content.
         data.map(artwork => {
            renderArtwork(artwork);
        });
    }

    // Function for each artwork to be rendered as a card.
    function renderArtwork(data){
        
        // This price constant is important for making sure that the price can be read as a number in the filter.
        const price = data.price.toLocaleString();

        let card = document.createElement("div");
        card.className = 'card';
        // Pure inner HTML for how each card is rendered.
        card.innerHTML = `
        <div class="card-container">
            <div class="card-body">
                <img class="art-properties" src="${data.image_url}">
                <div class="card-content">
                    <h2>${data.title}</h2>
                    <p class="art-data"><em>${data.artist}</em></p>
                    <p class="art-data">${data.description}</p>
                    <p class="art-data" id="artPrice"><b>Price: $${price}</b></p>
                    <p class="art-data" id="copiesLeft">Copies Left: ${data.copies_left}</p>
                    <div class="buttons">
                        <button class="buy-button" id="buy-button">Buy Art</button>
                        <button class="delete-button" data-artwork-id="${data.id}">X</button>
                    </div>
                </div>
            </div>
        </div>
        `;
        let artworkContainer = document.getElementById("artwork-container");
        artworkContainer.appendChild(card);

        // Buy button click handler.
        let buyBtn = card.querySelector(".buy-button");
        let copiesLeft = data.copies_left;
        if (copiesLeft === 0) {
            buyBtn.disabled = true;
            buyBtn.innerHTML = `SOLD OUT!`;
            buyBtn.classList.add("sold-out");
        }
        buyBtn.addEventListener('click', () => {
            if (copiesLeft > 0) {
                mainFetcher().then(() => {
                    data.copies_left -= 1;
                    card.querySelector("#copiesLeft").innerHTML = `Copies Left: ${data.copies_left}`;
                    if (data.copies_left === 0) {
                        buyBtn.disabled = true;
                        buyBtn.innerHTML = `SOLD OUT!`;
                        buyBtn.classList.add("sold-out");
                    }
                    buyArtwork(data);
                });
            }
        });

        // Delete button click event handler.
        let deleteBtn = card.querySelector(".delete-button");
        deleteBtn.addEventListener('click', () => {
            let artworkId = deleteBtn.getAttribute('data-artwork-id');
            deleteArtwork(artworkId);
            card.remove(); 
        });
    }
    
    // Buy Artwork Patch function.
    function buyArtwork(artwork){
        fetch(`${fetchAPI}/${artwork.id}`,{
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                
            },
            body: JSON.stringify(artwork)
        })
        .then(res => res.text())
        .then(data =>{
            console.log(data);
        })
    }
    
    // Function for deleting artwork when button is clicked.
    function deleteArtwork(artworkId){
        fetch(`${fetchAPI}/${artworkId}`,{
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                
            }
        })
        .then(res => res.text())
        .then(data =>{
            console.log(data);
        })
    }

    // Framework for filter dropdown.
    const filterDropdown = document.getElementById("filter");
    filterDropdown.addEventListener("change", function() {
        const selectedFilter = this.value;
        let sortedData = [];
        let artworks = mainFetcher()
        .then(artwork => {
             console.log(artwork);
             switch(selectedFilter) {
                 case 'name_asc':
                     sortedData = artwork.sort((a, b) => a.title.localeCompare(b.title));
                     break;
                 case 'name_desc':
                     sortedData = artwork.sort((a, b) => b.title.localeCompare(a.title));
                     break;
                 case 'price_asc':
                     sortedData = artwork.sort((a, b) => a.price - b.price);
                     break;
                 case 'price_desc':
                     sortedData = artwork.sort((a, b) => b.price - a.price);
                     break;
             }
             renderArtworks(sortedData);
         });


    });
    // Event listener for input event on search input.
    const searchInput = document.getElementById("search");
    searchInput.addEventListener("input", function() {
        const searchQuery = this.value.trim();
        handleSearch(searchQuery);
    });
  
    // Function to handle search
    function handleSearch(query) {
        mainFetcher().then(data => {
            const filteredData = data.filter(artwork => artwork.title.toLowerCase().includes(query.toLowerCase()) || artwork.artist.toLowerCase().includes(query.toLowerCase()));
            renderArtworks(filteredData);
            const artworkContainer = document.getElementById("artwork-container");
            const errStatement = document.getElementById("error-message");
            if (artworkContainer.innerHTML === "") {
                errStatement.style.display = "block";
            } else {
                errStatement.style.display = "none";
            }
        });
    }
});



