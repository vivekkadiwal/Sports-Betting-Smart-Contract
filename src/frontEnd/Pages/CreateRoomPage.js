import React from 'react';
import web3 from "../OtherJS/web3";
import sportsBetting from "../OtherJS/sportsBetting";

class CreateRoomPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameId: '',
      entryFee: '',
      maxPlayers: '',
      message: ''
    };
  }

  onSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const { gameId, entryFee, maxPlayers } = this.state;
      const accounts = await web3.eth.getAccounts();
  
      console.log('Creating room with the following parameters:');
      console.log('Game ID:', gameId);
      console.log('Entry Fee:', entryFee);
      console.log('Max Players:', maxPlayers);
  
      const transaction = await sportsBetting.methods.createRoom(gameId, entryFee, maxPlayers).send({
        from: accounts[0],
      });
  
      console.log('Transaction Hash:', transaction.transactionHash);
  
      this.setState({
        message: 'Room created successfully!',
        gameId: '',
        entryFee: '',
        maxPlayers: '',
        errorMessage: '',
      });
  
    
    } catch (error) {
      console.error('Error creating room:', error.message);
      this.setState({ errorMessage: `Error: ${error.message}` });
    }
  };
  

  render() {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded shadow">
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"></link>
        <h2 className="mb-6 flex items-center justify-between">Create Room</h2>
        <form onSubmit={this.onSubmit} className="mb-6">
          <div>
            <label>Game ID:</label>
            <input
              type="text"
              value={this.state.gameId}
              onChange={(event) => this.setState({ gameId: event.target.value })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label>Entry Fee (Wei):</label>
            <input
              type="text"
              value={this.state.entryFee}
              onChange={(event) => this.setState({ entryFee: event.target.value })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label>Max Players:</label>
            <input
              type="text"
              value={this.state.maxPlayers}
              onChange={(event) => this.setState({ maxPlayers: event.target.value })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <br></br>
          <button type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >Create Room</button>
        </form>
        <p>{this.state.message}</p>
      </div>
    );
  }
}

export default CreateRoomPage;
