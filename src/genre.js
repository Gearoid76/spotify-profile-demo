export async function fetchGenres(accessToken) {
    try {
        const response = await fetch('https://api.spotify.com/v1/recommendations/available-genre-seeds', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to get genres');
        }

        const data = await response.json();
        return data.genres;
    } catch (error) {
        console.error('Error fetching genres', error.message);
        throw error;
    }
}

export function displayGenreList(genres, accessToken) {
    const genreList = document.getElementById('genreList');
    genreList.innerHTML = '';

    genres.forEach(genre => {
        const listItem = document.createElement('li');
        const genreButton = document.createElement('button');
        genreButton.textContent = genre;

        genreButton.addEventListener('click', async () => {
            try {
                const artists = await fetchAllArtistsByGenre(accessToken, genre);
                displayArtistsList(artists, accessToken); // Pass accessToken to fetch songs later
            } catch (error) {
                console.error('Error fetching artists', error.message);
            }
        });

        listItem.appendChild(genreButton);
        genreList.appendChild(listItem);
    });
}
