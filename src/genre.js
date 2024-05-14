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
export function displayGenreList(genres) {
    const genreList = document.getElementById('genreList');
    genreList.innerHTML = '';
    
    genres.forEach(genre => {
        const listItem = document.createElement('li');
        const genreName = document.createElement('span');
        genreName.textContent = genre;

        listItem.appendChild(genreName);
        genreList.appendChild(listItem); 
});

}
