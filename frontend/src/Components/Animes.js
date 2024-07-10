import { useState } from "react";
import Anime from "./Anime";
import { useEffect } from "react";
import axios from "axios";
import '../App.css'

function Animes() {
  //fetch all animes from the backend and render them as a list using the Anime component. Make sure to style the animes to look like the screenshot from the README. Feel free to use axios to grab data
const [animes, setAnimes] = useState({})
const [loading, setLoading] = useState(true)

useEffect(() => {
  const fetchAnimes = async () => {
    try {
      const res = await axios.get('http://localhost:3001/animes');
      setAnimes(res.data);
    } catch (error) {
      console.error("Error fetching animes:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchAnimes();
}, []);

  return (
    <section className="anime-index" id="anime-list">
    {loading ? (
        <p>Loading...</p>
      ) : animes.length > 0 ? (
        animes.map(anime => (
          <Anime key={anime.id} name={anime.name} description={anime.description} />
        ))
      ) : (
        <p>No animes to display</p>
      )}
    </section>
  );
}

export default Animes;
