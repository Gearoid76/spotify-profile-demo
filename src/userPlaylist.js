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
    console.log('playlist_id', playlist_id);

    if (!response.ok) {
        throw new Error('Failed to fetch playlist tracks');
    }

    const data = await response.json();
    const tracks = data.items.map(item => item.track);
    return tracks;
}
export async function displayTracks(accessToken, tracks) {
    const trackList = document.getElementById('tracksList');
    trackList.innerHTML = '';

    tracks.forEach(track => {
        const listItem = document.createElement('li');
        const trackName = document.createElement('span');
        trackName.textContent = track.name;
        
        const deleteTracksButton = document.createElement('button');
        deleteTracksButton.textContent = 'Delete track';
        deleteTracksButton.setAttribute('data-track-id', track.id); 

        deleteTracksButton.addEventListener('click', async (event) => {
        try {
            const trackIdToDelete = event.target.getAttribute('data-track-id');
            await deleteUserPlaylistTracks(accessToken, trackIdToDelete); 
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

export async function deleteUserPlaylistTracks(accessToken, playlist_id) {
    try {
        //const response = await fetch(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`, {  this is delete playlist
        const response = await fetch(`https://api.spotify.com/v1/me/tracks`, { 
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
        
    if (!response.ok) {
        throw new Error('Failed to delete  ln 111 track sorry :(');
    }   
        console.log('showing track name, and  track ID ln113',  track. name, track.id);


    const data = await response.json()
    const deletedTrackIds = data.items ? data.items.map(item => item.track.id) : [];

     // Log track name and ID before deletion
     data.items.forEach(item => {
        console.log('Deleted Track Name:', item.track.name);
        console.log('Deleted Track ID:', item.track.id);
    });



    return { success: true, deletedTrackIds };
} catch (error) {
    console.error('Error deleting track:', error.message);
    throw error;
    }
}