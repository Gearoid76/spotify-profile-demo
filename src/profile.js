export async function fetchProfile(accessToken) {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", 
        headers: { Authorization: `Bearer ${accessToken}` }
    });

    return await result.json();
}

export function populateUI(profile) {

    document.getElementById("displayName").textContent = profile.display_name;
    document.getElementById("id").textContent = profile.id;
    document.getElementById("email").textContent = profile.email;
    document.getElementById("uri").textContent = profile.uri;
    document.getElementById("uri").setAttribute("href", profile.external_urls.spotify);
    document.getElementById("url").textContent = profile.href;
    document.getElementById("url").setAttribute("href", profile.href);
    
    if (profile.images[0]) {
        const profileImage = document.createElement('img');
        profileImage.src = profile.images[0].url;
        profileImage.alt = 'Profile Image';
        document.getElementById("avatar").appendChild(profileImage);
        document.getElementById("imgUrl").innerText = profile.images[0].url;
    }
}