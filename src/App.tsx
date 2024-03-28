import { Avatar, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import './App.css'
import List from '@mui/material/List';
import { useEffect, useState } from 'react';
import { generateRandomString, getListItemsResponse } from './util/utils';
import { JSX } from 'react/jsx-runtime';

// These should probably be stored somewhere else
const headerTitle = 'Spotify Project';
const redirectUri = 'http://localhost:5173';
const baseUrl = 'https://api.spotify.com/v1/';
const clientId = '0e5c1689841544a2b738c11417c969e7';

const App = () => {
  const [user, setUser] = useState('');
  const [playlists, setPlaylists] = useState<JSX.Element[]>();
  const [playlistItems, setPlaylistItems] = useState<JSX.Element[]>();
  const [playlistId, setPLaylistId] = useState<String>('');
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    let token = localStorage.getItem('access_token');
    if (!token || token === "undefined") {
      token = window.location.hash.substring(1).split('&')[0].split('=')[1];
    }
    setAccessToken(token);
    localStorage.setItem('access_token', token);
    window.history.replaceState({}, document.title, window.location.pathname);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        if (accessToken) {
          const userId = await getLoggedInUserId(accessToken);
          let userPlaylists: any[] = [];
          if (userId) {
            userPlaylists = await getUserPlaylists(userId);
          }
          setUser(userId);
          setPlaylists(userPlaylists)
        }
      } catch (error) {
        console.error(error);
      }
    })()
  }, [accessToken]);

  const authenticate = () => {
    const state = generateRandomString(16);
    let authEndpoint = 'https://accounts.spotify.com/authorize';

    authEndpoint += '?response_type=token';
    authEndpoint += '&client_id=' + encodeURIComponent(clientId);
    authEndpoint += '&scope=' + encodeURIComponent('playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public');
    authEndpoint += '&redirect_uri=' + encodeURIComponent(redirectUri);
    authEndpoint += '&state=' + encodeURIComponent(state);

    window.location.href = authEndpoint;
  }

  const getUserPlaylists = async (userId: string) => {
    let listItems: JSX.Element[] = [];
    // Look into infinite scrolling solution to avoid pagination/limit`
    const response = await getListItemsResponse(new URL(`${baseUrl}me/playlists?limit=50`), accessToken);
    response?.items.forEach((p: Playlist) => {
      listItems.push(
        <List key={`${p.id}`}>
          <ListItemButton onClick={() => getPlaylistItems(accessToken, p.id)}>
            <ListItemAvatar>
              <Avatar variant="square" src={`${p.images ? p.images[0]?.url : <FolderIcon />}`}>
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={`${p.name ? p.name : `playlist - ${userId}`}`} />
          </ListItemButton>
        </List>
      );
    });
    return listItems;
  }

  const getLoggedInUserId = async (accessToken: String) => {
    try {
      const response = await fetch(`${baseUrl}me`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        localStorage.removeItem('access_token');
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const json = await response.json();
      console.log('user response', json);
      return json.id;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  const getPlaylistItems = async (accessToken: String, playlistId: String) => {
    let listItems: JSX.Element[] = [];
    if (playlistId) {
      setPLaylistId(playlistId);
      try {
        await getListItemsResponse(new URL(`${baseUrl}playlists/${playlistId}`), accessToken)
        .then((r: any) => {
          console.log('response', r);
          if (!r.error) {
            r?.tracks.items.forEach((i: any) => {
              listItems.push(
                <List key={`${i.track.id}`} sx={{background: '#4d4d4d', overflow: 'auto'}}>
                  <ListItemButton>
                    <ListItemAvatar>
                      <Avatar variant="square" src={`${i.track.album.images ? i.track.album.images[0].url : <FolderIcon />}`}>
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={`${i.track.artists[0].name} - ${i.track.name}`} />
                  </ListItemButton>
                </List>
              )
            })
          }
        });
        setPlaylistItems(listItems);
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <>
      <div className="app-container">
        <header className="header">
          <h1>{headerTitle}</h1>
          <button onClick={() => authenticate()}>Auth</button>
        </header>
        <div className="main-container">
          <nav className="left-navbar">{playlists}</nav>
          <div className="main-body">
          <div>{playlistItems}</div>
          </div>
        </div>
      </div>
      {/* {modalOpen && <AuthModal modalOpen={modalOpen} onClose={() => setIsModalOpen(false)} />} */}
    </>
  );
};

export default App;
