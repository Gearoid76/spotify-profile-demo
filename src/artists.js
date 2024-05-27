export async function fetchAllArtistsByGenre(accessToken, genre) {
    const artistIds = [];
    let offset = 0;
    const limit = 30;
    let hasMore = true;

    try {
        while (hasMore) {
            const response = await fetch(`https://api.spotify.com/v1/search?q=genre:${encodeURIComponent(genre)}&type=artist&limit=${limit}&offset=${offset}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to get artists');
            }

            const data = await response.json();
            const artists = data.artists.items;

            artistIds.push(...artists.map(artist => ({ id: artist.id, name: artist.name })));

            if (artists.length < limit) {
                hasMore = false;
            } else {
                offset += limit;
            }
        }

        return artistIds;
    } catch (error) {
        console.error('Error fetching artists', error.message);
        throw error;
    }
}

export function displayArtistsList(artists, accessToken) {
    const artistsList = document.getElementById('artistsList');
    artistsList.innerHTML = '';

    artists.forEach(artist => {
        const listItem = document.createElement('li');
        const artistButton = document.createElement('button');
        artistButton.textContent = artist.name;

        artistButton.addEventListener('click', async () => {
            try {
                const songs = await fetchSongsByArtist(accessToken, artist.id);
                displaySongsList(songs);
            } catch (error) {
                console.error('Error fetching songs', error.message);
            }
        });

        listItem.appendChild(artistButton);
        artistsList.appendChild(listItem);
    });
}
