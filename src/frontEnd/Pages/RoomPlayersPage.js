import React from 'react';
import web3 from "../OtherJS/web3";
import sportsBetting from "../OtherJS/sportsBetting";

class RoomPlayersPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomIdInput: '',
      playersList: [],
      roomDetails: null,
      message: '',
    };
  }

  fetchRoomDetails = async () => {
    const roomId = this.state.roomIdInput;

    try {
      const roomDetails = await sportsBetting.methods.displayRoomPlayers(roomId).call();
      this.setState({ roomDetails, playersList: roomDetails.players, message: '' });
    } catch (error) {
      console.error('Error fetching room details:', error.message);
    }
  };

  componentDidMount() {
    this.fetchRoomDetails();
  }

  render() {
    const { roomIdInput, roomDetails, playersList, message } = this.state;

    return (
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded shadow">
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"></link>
        <h2 className="mb-4">Players in Room</h2>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Enter Room ID:</label>
          <input
            type="text"
            value={roomIdInput}
            onChange={(e) => this.setState({ roomIdInput: e.target.value })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <br></br><br></br>
          <button onClick={this.fetchRoomDetails}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >View Room</button>
          <br></br>
          <br></br>
        </div>

        {roomDetails && (
          <div>
            <h4>Room Details:</h4>
            <p>
              <strong>Game ID:</strong> {roomDetails.gameId.toString()} |
              <strong> Entry Fee:</strong> {web3.utils.fromWei(roomDetails.entryFee, "ether")} ETH |
              <strong> Max Players:</strong> {roomDetails.maxPlayers.toString()} |
              <strong> Declared Results:</strong> {roomDetails.declaredResults ? 'Yes' : 'No'} |
              <strong> Room Status:</strong> {roomDetails.roomStatus ? 'Active' : 'Inactive'} |
              <strong> Prize Pool:</strong> {web3.utils.fromWei(roomDetails.prizePool, "ether")} ETH
            </p>
          </div>
        )}

        <h4>Players in Room:</h4>
        <ul>
          {playersList.map((player, index) => (
            <li key={index}>
              <strong>{player}</strong> - Selected Team: {roomDetails.playersSel[index].toString()}
            </li>
          ))}
        </ul>

        <p>{message}</p>
      </div>
    );
  }
}

export default RoomPlayersPage;
