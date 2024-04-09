document.addEventListener("DOMContentLoaded", function(){
    const fetchAPI = "http://localhost:3000/artwork"
    const artworkID = 1
    
    fetch( "http://localhost:3000/artwork/1",{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    
    })
    .then(res => res.json())
    .then(data => {
        console.log(data.image_url)
        let artTitle = data.title
        let artist = data.artist
        let imgUrl = data.image_url
        let artDescription = data.description
        let artPrice = data.price
        let copies =  data.copies_left
        let imgDiv = document.querySelector(".artwork")
        document.getElementById("art-title").innerHTML = artTitle
        document.getElementById("artist").innerHTML = artist
        document.getElementById("art-description").innerHTML = artDescription
        document.getElementById("art-price").innerHTML = `Price: ${artPrice}`
        document.getElementById("copies-left").innerHTML = `Copies: ${copies}`
        let img = document.createElement("img")
         img.src = imgUrl
         imgDiv.appendChild(img)
     })

});