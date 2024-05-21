export async function fetchUserPlaylist(accessToken) {
    try {
        const response = await fetch(`https://api.spotify.com/v1/me/playlists`,{
            method:'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if(!response.ok) {
            throw new Error('Failed to fetch user playlists');
        }
        const data = await response.json();
        return data.items;
    }catch (error) { 
     console.error ('Error fetching usr playlists', error.message);
    throw error;
    }
} 
 export async function showUserPlaylist(accessToken) {
    try {
        const playlists = await fetchUserPlaylist(accessToken);
        return playlists;
        } catch (error) {
            console.error('Error showing user playlists', error.message);
            throw error;
        }
}
export function displayPlaylists(accessToken, playlists) {
    const playList = document.getElementById('playList');
    playList.innerHTML = '';

    playlists.forEach(playlist => {
        const listItem = document.createElement('li');
        const playlistName = document.createElement('span');
        playlistName.textContent = playlist.name;

        const showTracksButton = document.createElement('button');
        showTracksButton.textContent = 'Show Tracks';        
        showTracksButton.addEventListener('click', async () => {
    try {
        const tracks = await fetchUserPlaylistTracks(accessToken, playlist.id);
        displayTracks(accessToken, tracks);
    } catch (error) {
        console.error('Error fetching tracks:', error.message);
    }
});

        listItem.appendChild(playlistName);
        listItem.appendChild(showTracksButton);
        playList.appendChild(listItem); 
});
}
export async function fetchUserPlaylistTracks(accessToken, playlist_id) {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`, {
        method:  'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch playlist tracks');
    }

    const data = await response.json();
    const tracks = data.items.map(item => item.track);
    return tracks;
}
export async function displayTracks(accessToken,playlist_id, tracks) {
    const trackList = document.getElementById('tracksList');
    trackList.innerHTML = '';

    tracks.forEach(track => {
        const listItem = document.createElement('li');
        const trackName = document.createElement('span');
        trackName.textContent = track.name;
        
        const deleteTracksButton = document.createElement('button');
        deleteTracksButton.textContent = 'Delete track';
        deleteTracksButton.setAttribute('data-track-id', track.uri); // track.uri was track.id
        
        deleteTracksButton.addEventListener('click', async (event) => {
        try {
            const trackIdToDelete = [event.target.getAttribute('data-track-id')]; //now array
            await deleteUserPlaylistTracks(accessToken,playlist_id, trackIdToDelete); 
            listItem.remove();
        } catch (error) {
            console.error('Error deleting tracks', error.message);
        }   
    });

        listItem.appendChild(trackName); 
        listItem.appendChild(deleteTracksButton);
        trackList.appendChild(listItem); 
       });
} 
export async function deleteUserPlaylistTracks(accessToken, playlist_id, trackIdToDelete) {
    try {
        const playlistResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlist_id}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!playlistResponse.ok) {
            throw new Error('Failed to fetch playlist details.');
           
        }
        const playlistData = await playlistResponse.json();
        const snapshot_id = playlistData.snapshot_id;
        console.log('snapshot_id', snapshot_id);
        console.log('playlist_id', playlist_id);
        console.log('trackIdToDelete', trackIdToDelete);
        

        const response = await fetch(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`, { 
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tracks: trackIdToDelete.map(uri => ({ uri })),
                    snapshot_id: snapshot_id
                })
            });

            if (!response.ok) {
                throw new Error('Failed to delete tracks. Sorry :(');
            }
    
    const data = await response.json();
    if (data.items && Array.isArray(data.items)) {
        // Log deleted track information
        data.items.forEach(item => {
            console.log('Deleted Track Name:', item.track.name);
            console.log('Deleted Track ID:', item.track.id);
        });
    } else {
        console.log('No items found in the response to delete.');
    }

} catch (error) {
    console.error('Error deleting tracks:', error.message);
}
}