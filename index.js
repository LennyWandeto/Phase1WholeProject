document.addEventListener("DOMContentLoaded", function(){
    const fetchAPI = "http://localhost:3000/artwork"
    const artworkID = 1
    
    fetch("http://localhost:3000/artwork",{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    })
    .then(res => res.json())
    .then(data => {
        console.log(data)
        data.forEach(artwork => {
            renderArtwork(artwork)
        });
    })

    function renderArtwork(data){
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
                    <p class="art-data" id="artPrice"><b>Price: ${data.price}</b></p>
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

        // Add event listener to each buy button
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

        // Add event listener to each delete button
        let deleteBtn = card.querySelector(".delete-button");
        deleteBtn.addEventListener('click', () => {
            let artworkId = deleteBtn.getAttribute('data-artwork-id');
            deleteArtwork(artworkId);
            card.remove(); // Remove the card from the DOM
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

    function mainFetcher(){
        return fetch(fetchAPI,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        })
        .then(res => res.json())
        .then(data =>{
            return data;
        });
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
});
