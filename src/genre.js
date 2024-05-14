export async function fetchGenre(accessToken) {
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
        return data.items;
    }catch (error) {
        console.error('Error fetching genres', error.message);
        throw error;
    }
}
export async function showGenres(accessToken) {
    try {
        const genre = await fetchGenre(accessToken);
        return genre;
    } catch (error) {
        console.error('Error showing Genres', error.message);
        throw error;
    }
}