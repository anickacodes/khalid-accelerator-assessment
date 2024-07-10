const express = require("express");
const animes = express.Router();
const {
  getAllAnimes,
  getOneAnime,
  createOneAnime,
  updateOneAnime,
  deleteOneAnime,
} = require("../queries/animes");




/* Instructions: Use the following prompts to write the corresponding routes. **Each** route should be able to catch server-side and user input errors(should they apply). Consult the test files to see how the routes and errors should work.*/
//Write a GET route that retrieves all animes from the database and sends them to the client with a 200 status code
animes.get('/', async (req,res) => {
  try {
    const animes = await getAllAnimes();
    res.status(200).json(animes);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
})

animes.get('/:id', async (req,res) => {
  try {
    const {id} = req.params
    const singleAnime = await getOneAnime(id);
    res.status(200).json(singleAnime);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
})

//Write a POST route that takes user provided data from the request body and creates a new anime in the database. The route should respond with a 201 status code and the new anime.
//if the request body does not contain a name and description, or if the body's name or description have no length, respond with an error

animes.post('/', async (req,res) => {
  const { name, description } = req.body;

  // validation
  if (!name || !description || name.trim().length === 0 || description.trim().length === 0) {
    return res.status(400).json({ error: 'Name and description are required and cannot be empty' });
  }

  try {
    const createdAnime = await createOneAnime( name, description );
    res.status(201).json(createdAnime);
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while creating the anime' });
  }
})

//Write a PUT route that takes user provided data from the request body and updates an existing anime in the database. The route should respond with a 200 and the updated anime. The route should be able to handle a non-existent anime id.
//if the request body does not contain a name and description, or if the body's name or description have no length, respond with an error

animes.put('/:id', async (req,res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  // validation
    if (!name || !description || name.trim().length === 0 || description.trim().length === 0) {
      return res.status(400).json({ error: 'Name and description are required and cannot be empty' });
    }

  try {
    const anime = await getOneAnime(id);
// check for valid id
    if (!anime) {
      return res.status(404).json({ error: 'Anime ID not found' });
    }
// update params via query 
    const updatedAnime = await updateOneAnime(id, { name, description });
    res.status(200).json(updatedAnime);
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while updating the anime' });
  }
})

//Write a DELETE route that deletes a single anime by id (provided by the client as a request param) from the database and responds with a 200 and the deleted anime data. The route should be able to handle a non-existent anime id.
animes.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const anime = await getOneAnime(id);

    if (!anime) {
      return res.status(404).json({ error: 'Anime not found' });
    }

    await deleteOneAnime(id);
    res.status(200).json({ message: 'Anime deleted successfully', deletedAnime: anime });
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while deleting the anime' });
  }
})

module.exports = animes;


