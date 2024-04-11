document.addEventListener("DOMContentLoaded", function(){
    const fetchAPI = "https://lennywandeto.github.io/Phase1WholeProject/db.json"
    const artworkID = 1
    
    fetch("https://lennywandeto.github.io/Phase1WholeProject/db.json",{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    })
    .then(res => res.json())
    .then(data => {
        console.log(data)
        renderArtworks(data);
    });

    function renderArtworks(data) {
        const artworkContainer = document.getElementById("artwork-container");
        artworkContainer.innerHTML = ""; // Clear previous content
        data.data.forEach(artwork => {
            renderArtwork(artwork);
        });
    }

    function renderArtwork(data){
        let Price = data.price.toLocaleString();
        let card = document.createElement("div");
        card.className = 'card';
        card.innerHTML = `
        <div class="card-container">
            <div class="card-body">
                <img class="art-properties" src="${data.image_url}">
                <div class="card-content">
                    <h2>${data.title}</h2>
                    <p class="art-data"><em>${data.artist}</em></p>
                    <p class="art-data">${data.description}</p>
                    <p class="art-data" id="artPrice"><b>Price: $${Price}</b></p>
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

        // Buy button click handler
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

        // Delete button click event handler
        let deleteBtn = card.querySelector(".delete-button");
        deleteBtn.addEventListener('click', () => {
            let artworkId = deleteBtn.getAttribute('data-artwork-id');
            deleteArtwork(artworkId);
            card.remove(); 
        });
    }

    function buyArtwork(artwork){
        fetch(`${fetchAPI}/${artwork.id}`,{
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(artwork)
        })
        .then(res => res.text())
        .then(data =>{
            console.log(data);
        })
    }

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

    function deleteArtwork(artworkId){
        fetch(`${fetchAPI}/${artworkId}`,{
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        })
        .then(res => res.text())
        .then(data =>{
            console.log(data);
        })
    }

    // Framework for filter dropdown
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
});
