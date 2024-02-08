import React from 'react';
import web3 from "../OtherJS/web3";
import sportsBetting from "../OtherJS/sportsBetting";

class ViewRoomPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredRoomId: '',
      selectedRoomDetails: null,
      message: '',
      redirectToJoinRoom: false,
    };
  }

  onViewRoomById = async () => {
    try {
      const { filteredRoomId } = this.state;
      const roomDetails = await sportsBetting.methods.roomDict(filteredRoomId).call();
      this.setState({ selectedRoomDetails: roomDetails, message: '' });
    } catch (error) {
      console.error('Error fetching room details:', error.message);
      this.setState({ message: `Error: ${error.message}`, selectedRoomDetails: null });
    }
  };

  onJoinRoom = async () => {
    const accounts = await web3.eth.getAccounts();

    try {
      await sportsBetting.methods.joinRoom(this.state.filteredRoomId, 1).send({
        from: accounts[0],
        value: this.state.selectedRoomDetails.entryFee,
      });

      await this.onViewRoomById();

      this.setState({ message: 'You have joined the room!', redirectToJoinRoom: true });
    } catch (error) {
      console.error('Error joining room:', error.message);
      this.setState({ message: `Error: ${error.message}` });
    }
  };

  render() {
    const { filteredRoomId, selectedRoomDetails, message, redirectToJoinRoom } = this.state;

    if (redirectToJoinRoom) {
      window.location.href = '/joinRoomPage'; 
      return null; 
    }

    return (
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded shadow">
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"></link>
        <h2 className="block text-gray-700 text-sm font-bold mb-2">View Room by ID</h2>
        <form onSubmit={(event) => { event.preventDefault(); this.onViewRoomById(); }} className="mb-6">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Room ID:</label>
            <input
              type="text"
              value={filteredRoomId}
              onChange={(event) => this.setState({ filteredRoomId: event.target.value })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <button type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >View Room</button>
        </form>

        {selectedRoomDetails && (
          <div>
            <h4>Selected Room Details:</h4>
            <p>
              <strong>Game ID:</strong> {selectedRoomDetails.gameId.toString()} |
              <strong> Entry Fee:</strong> {web3.utils.fromWei(selectedRoomDetails.entryFee, "ether")} ETH |
              <strong> Max Players:</strong> {selectedRoomDetails.maxPlayers.toString()} |
              <strong>Room Status:</strong> {selectedRoomDetails.roomStatus ? 'Active' : 'Inactive'}
            </p>
          </div>
        )}
        <p>{message}</p>
      </div>
    );
  }
}

export default ViewRoomPage;
