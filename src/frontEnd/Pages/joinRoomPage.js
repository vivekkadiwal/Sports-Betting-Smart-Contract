import React from 'react';
import web3 from "../OtherJS/web3";
import sportsBetting from "../OtherJS/sportsBetting";

class JoinRoomPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameId: '',
      roomId: '',
      selectTeam: '',
      entryFee: '',  
      message: ''
    };
  }

  onSubmit = async (event) => {
    event.preventDefault();

    try {
      const { gameId, roomId, selectTeam, entryFee } = this.state; 
      const accounts = await web3.eth.getAccounts();

      await sportsBetting.methods.joinRoom(gameId, roomId, selectTeam).send({
        from: accounts[0],
        value: entryFee,
      });

      this.setState({ message: 'Joined room successfully!' });

    } catch (error) {
      console.error('Error joining room:', error.message);
      this.setState({ message: 'Room is full! Please join another room' });
    }
  }

  render() {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded shadow">
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"></link>
        <h2>Join Room</h2>
        <form onSubmit={this.onSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Game ID:</label>
            <input
              type="text"
              value={this.state.gameId}
              onChange={(event) => this.setState({ gameId: event.target.value })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <br></br>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Room ID:</label>
            <input
              type="text"
              value={this.state.roomId}
              onChange={(event) => this.setState({ roomId: event.target.value })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <br></br>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Entry Fee (Wei):</label>
            <input
              type="text"
              value={this.state.entryFee}
              onChange={(event) => this.setState({ entryFee: event.target.value })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <br></br>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Select Team (0 for Team A and 1 for Team B) :</label>
            <input
              type="text"
              value={this.state.selectTeam}
              onChange={(event) => this.setState({ selectTeam: event.target.value })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <br></br>
          <button type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >Join Room</button>
        </form>
        <p style={{ color: 'red' }}>{this.state.message}</p>
      </div>
    );
  }
}

export default JoinRoomPage;
