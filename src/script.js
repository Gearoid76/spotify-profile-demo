import { fetchProfile, populateUI } from './profile.js';
import { redirectToAuthCodeFlow, getAccessToken } from './authentication.js';
import { fetchUserPlaylist, displayPlaylists, showUserPlaylist, fetchUserPlaylistTracks, deleteUserPlaylistTracks, displayTracks } from './userPlaylist.js';

const clientId = import.meta.env.VITE_CLIENT_ID;
const params = new URLSearchParams(window.location.search);
const code = params.get("code");  

 
if (!code) {
    redirectToAuthCodeFlow(clientId);
} else {
    (async () => { 
        try {
            const accessToken = await getAccessToken(clientId, code);
            const profile = await fetchProfile(accessToken);
            populateUI(profile);
            const playlists = await fetchUserPlaylist(accessToken);
            displayPlaylists(accessToken, playlists);
            const userPlaylists = await showUserPlaylist(accessToken);
            const playlist_id = userPlaylists[0].id;
            const userPlaylistTracks = await fetchUserPlaylistTracks(accessToken, playlist_id); 
            const trackIdToDelete = [`spodify:track:${userPlaylistTracks[0].id}`] 
            const deletedUserPlaylistTracks = await deleteUserPlaylistTracks(accessToken, playlist_id, trackIdToDelete);
            displayTracks(accessToken, userPlaylistTracks, trackIdToDelete);
            

 
            // Creating a dropdown menu

            const dropdownContainer = document.createElement('div');
            dropdownContainer.classList.add('dropdown');

            const dropdownButton = document.createElement('button');
            dropdownButton.classList.add('dropbtn');
            dropdownButton.textContent = 'Dropdown';

            const dropdownContent = document.createElement('div');
            dropdownContent.classList.add('dropdown-content');

            const options = [
                { label: 'Option 1', value: 'option1'},
                { label: 'Option 2', value: 'option2'},
            ];

            options.forEach(option => {
                const optionElement = document.createElement('a');
                optionElement.textContent = option.label;
                optionElement.href = '#';
                dropdownContent.appendChild(optionElement);
            });
            dropdownContainer.appendChild(dropdownButton);
            dropdownContainer.appendChild(dropdownContent);

            document.body.appendChild(dropdownContainer);

            //} https://www.youtube.com/watch?v=fVcz-1rVQcs video to check out

        } catch (error) {
            console.error('Error:', error.message);
        }
    })();
}