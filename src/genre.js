import { fetchArtists, displayArtistsList } from "./artists";

export async function fetchGenres(accessToken) {
    try {
        const response = await fetch(`https://api.spotify.com/v1/recommendations/available-genre-seeds`, {
            method:'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if(!response.ok) {
            throw new Error('Failed to get Genres');
        }
        const data = await response.json();
        return data.genres;
    }catch (error) {
        console.error('Error fetching genres', error.message);
        throw error;
    }
}
export function displayGenreList(genres, accessToken) {
    const genreList = document.getElementById('genreList');
    genreList.innerHTML = '';
    
    genres.forEach(genre => {
        const listItem = document.createElement('li');
        const genreName = document.createElement('span');
        genreName.textContent = genre;


        const showArtistsButton = document.createElement('button');
        showArtistsButton.textContent ='Show Artists';
        showArtistsButton.addEventListener('click', async () => {
            try {
            const artists = await fetchArtistsByGenre(accessToken, genre);
            displayArtistsList(artists);
            } catch (error) {
                console.error('Error fetching Artists', error.message);
            }
        });

        listItem.appendChild(genreName);
        listItem.appendChild(showArtistsButton);
        genreList.appendChild(listItem); 
});

}

async function fetchArtistsByGenre(accessToken, genre) {
    try {
        const response = await fetch(`https://api.spotify.com/v1/search?q=genre:"${encodeURIComponent(genre)}"&type=artist`, {
            method: `GET`,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to get artists');
        }
        const data = await response.json();
        return data.artists.items;
    }catch (error) {
        console.error('Error fetching artists', error.message);
        throw error;
    }
}
        