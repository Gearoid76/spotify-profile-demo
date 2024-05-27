export async function fetchSongsByArtist(accessToken, artistId) {
    try {
        const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to get songs');
        }

        const data = await response.json();
        return data.tracks;
    } catch (error) {
        console.error('Error fetching songs', error.message);
        throw error;
    }
}

export function displaySongsList(songs) {
    const songsList = document.getElementById('songsList');
    songsList.innerHTML = '';

    songs.forEach(song => {
        const listItem = document.createElement('li');
        listItem.textContent = song.name;
        songsList.appendChild(listItem);
    });
}
