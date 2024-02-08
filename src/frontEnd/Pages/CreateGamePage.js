import React, { useState, useEffect } from 'react';
import sportsBetting from "../OtherJS/sportsBetting";

const CreateGamePage = () => {
  const [teamA, setTeamA] = useState('');
  const [teamB, setTeamB] = useState('');
  const [message, setMessage] = useState('');
  const [gamesList, setGamesList] = useState([]);

  useEffect(() => {
    fetchGamesList();
  }, []); 

  const fetchGamesList = async () => {
    try {
      const gameIds = await sportsBetting.methods.displayGameID().call();
      const games = await Promise.all(
        gameIds.map(async (gameId) => {
          const gameDetails = await sportsBetting.methods.gamesDict(gameId).call();
          return { id: gameId, teamA: gameDetails.teamA, teamB: gameDetails.teamB };
        })
      );
      setGamesList(games);
    } catch (error) {
      console.error('Error fetching games list');
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

      setMessage('Waiting on creating the game...');
      await sportsBetting.methods.createGame(teamA, teamB).send({
        from: accounts[0],
        gas: 200000,
      });

      setMessage('Game created successfully!');
      fetchGamesList();
    } catch (error) {
      console.error('Error creating game:', error);
      setMessage('Only manager can call this function!');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"></link>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Create Game</h2>
        <div className="space-x-4">
        </div>
      </div>

      <form onSubmit={onSubmit} className="mb-6">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Team A name:</label>
          <input
            type="text"
            value={teamA}
            onChange={(event) => setTeamA(event.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Team B name:</label>
          <input
            type="text"
            value={teamB}
            onChange={(event) => setTeamB(event.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Create Game
        </button>
      </form>
      <p style={{ color: 'red' }}>{message}</p> 

      <div>
        <h3 className="text-xl font-bold mb-4">All Games</h3>
        <ul>
          {gamesList.length > 0 ? (
            gamesList.map((game) => (
              <li key={game.id} className="mb-2">
                Game ID: {game.id.toString()} | Team A: {game.teamA} | Team B: {game.teamB}
              </li>
            ))
          ) : (
            <p>No games available.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CreateGamePage;
