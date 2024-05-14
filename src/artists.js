import { fetchGenres, displayGenreList } from './genre.js';

export async function fetchArtists(accessToken){
    try {
        const response = await fetch (`https://api.spotify.com/v1/artists`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to get Artists');
        }
        const data = await response.json();
        return data.artists;
    }catch (error) {
        console.error('Error fetching artists', error.message);
        throw error;
    }
}
export function displayArtistsList(artists) {
    const artistsList = document.getElementById('artistList');
    artistsList.innerHTML = '';

    artists.forEach(artist => {
        const listitem = document.createElement('li');
        const artistName = document.createElement('span');
        artistName.textContent = artist.name;
        listitem.appendChild(artistName);
        artistsList.appendChild(listitem);
    });
}