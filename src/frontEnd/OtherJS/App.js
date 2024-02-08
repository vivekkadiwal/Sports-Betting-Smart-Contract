import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import web3 from 'web3';
import sportsBetting from './sportsBetting';
import HomePage from '../Pages/HomePage';
import CreateGamePage from '../Pages/CreateGamePage';
import CreateRoomPage from '../Pages/CreateRoomPage';
import AllRoomsPage from '../Pages/AllRoomsPage';
import ViewRoomPage from '../Pages/ViewRoomPage';
import JoinRoomPage from '../Pages/joinRoomPage';
import RoomPlayersPage from '../Pages/RoomPlayersPage';
import DeclareResultsPage from '../Pages/DeclareResultsPage';



class App extends React.Component {
  state = {
    manager: "",
    teamA: "",
    teamB: "",
    gameId: "",
    gameDetails: {},
    allGameDetails: [],
    entryFee: "",
    maxPlayers: "",
    roomDetails: [],
    filteredRoomId: "",
    message: "",
    test: [],
    selectedRoomDetails: null,
  };

  async componentDidMount() {
    const manager = await sportsBetting.methods.managerAddress().call();
    const test1 = await sportsBetting.methods.roomDict(1).call();
    this.setState({ test: test1 });
    this.setState({ manager });

    this.fetchAllGameDetails();
    this.fetchAllRooms();
  }

  fetchAllGameDetails = async () => {
    const allGameIds = await sportsBetting.methods.displayGameID().call();
    const allDetails = [];

    for (const gameId of allGameIds) {
      const details = await sportsBetting.methods.gamesDict(gameId).call();
      allDetails.push(details);
    }

    this.setState({ allGameDetails: allDetails });
  };

  onViewRoom = async (roomId) => {
    try {
      const roomDetails = await sportsBetting.methods.roomDict(roomId).call();
      this.setState({ selectedRoomDetails: roomDetails });
    } catch (error) {
      console.error("Error fetching room details:", error.message);
      this.setState({ message: `Error: ${error.message}` });
    }
  };

  fetchAllRooms = async () => {
    const allRoomIds = await sportsBetting.methods.displayRoomID().call();
    const allRoomDetails = [];

    for (const roomId of allRoomIds) {
      const details = await sportsBetting.methods.roomDict(roomId).call();
      allRoomDetails.push(details);
    }

    this.setState({ roomDetails: allRoomDetails });
  };

  onSubmit = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    this.setState({ message: "Waiting on creating the game..." });

    try {
      await sportsBetting.methods.createGame(this.state.teamA, this.state.teamB).send({
        from: accounts[0],
      });

      this.setState({ message: "You have been entered!" });
      this.fetchAllGameDetails();
    } catch (error) {
      console.error("Error creating game:", error.message);
      this.setState({ message: `Error: ${error.message}` });
    }
  };

  onCreateRoom = async () => {
    const { gameId, entryFee, maxPlayers } = this.state;
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Waiting on creating the room..." });

    const entryFeeWei = web3.utils.toWei(entryFee.toString(), "ether");

    await sportsBetting.methods.createRoom(gameId, entryFeeWei, maxPlayers).send({
      from: accounts[0],
      value: entryFeeWei,
    });

    this.setState({ message: "Room created successfully!" });
    this.fetchAllRooms();
  };

  onJoinRoom = async (roomId) => {
    const accounts = await web3.eth.getAccounts();

    try {
      await sportsBetting.methods.joinRoom(roomId, 1).send({
        from: accounts[0],
        value: this.state.entryFee,
      });

      this.setState({ message: "You have joined the room!" });
      this.fetchAllRooms();
    } catch (error) {
      console.error("Error joining room:", error.message);
      this.setState({ message: `Error: ${error.message}` });
    }
  };

  onViewRoomById = async () => {
    const { filteredRoomId } = this.state;

    try {
      const roomDetails = await sportsBetting.methods.roomDict(filteredRoomId).call();
      this.setState({ selectedRoomDetails: roomDetails });
    } catch (error) {
      console.error("Error fetching room details:", error.message);
      this.setState({ message: `Error: ${error.message}` });
    }
  };

  render() {
    return (
      <Router>
        <div>
        <Link to="/">
            <h4 className="bg-blue-500 text-white p-4 text-2xl font-bold p-5">
              <b className="flex justify-center">Welcome to Sports Betting</b>
            </h4>
          </Link>
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
          <div class="text-3xl">
            <br></br>
            <p class="flex justify-center">This contract is managed by: ‎ <br></br><b>{this.state.manager}.</b><br /></p>
            <br></br>
          </div>
          <Routes>
            <Route path="/create-game" element={<CreateGamePage />} />
            <Route path="/create-room" element={<CreateRoomPage />} />
            <Route path="/all-rooms" element={<AllRoomsPage />} />
            <Route path="/view-room" element={<ViewRoomPage />} />
            <Route path="/join-room" element={<JoinRoomPage />} />
            <Route path="/players-in-room" element={<RoomPlayersPage />} />
            <Route path="/declare-results-page" element={<DeclareResultsPage />} />



          </Routes>
          <div class="flex justify-center">
            <p class="text-xl">
            <br></br>
            <br></br>

              This is a Dapp for betting on Sports. Use the navigation buttons to explore our different features.
            </p>
          </div>
          {/* Navigation buttons */}
          <div className="flex space-x-4 mt-4, max-w-max mx-auto mt-8 p-6 bg-white rounded shadow">
            <Link to="/create-game">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Create Game
              </button>
            </Link>
            <Link to="/create-room">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Create Room
              </button>
            </Link>
            <Link to="/all-rooms">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                All Rooms
              </button>
            </Link>
            <Link to="/view-room">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                View Room
              </button>
            </Link>
            <Link to="/join-room">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Join Room
              </button>
            </Link>
            <Link to="/players-in-room">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                View Players
              </button>
            </Link>
            <Link to="/declare-results-page">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Declare Results
              </button>
            </Link>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
