import React from 'react';
import sportsBetting from "../OtherJS/sportsBetting";

class AllRoomsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            roomDetails: [],
            message: '',
        };
    }

    fetchAllRooms = async () => {
        try {
            const allRoomIds = await sportsBetting.methods.displayRoomID().call();
            const allRoomDetails = [];

            for (const roomId of allRoomIds) {
                const details = await sportsBetting.methods.roomDict(roomId).call();
                const gameId = details.gameId;
                const gameDetails = await sportsBetting.methods.gamesDict(gameId).call();

                if (!gameDetails.activeStatus) {
                    continue;  
                }

                allRoomDetails.push(details);
            }

            this.setState({ roomDetails: allRoomDetails, message: '' });
        } catch (error) {
            console.error('Error fetching all rooms:', error.message);
            this.setState({ message: `Error: ${error.message}`, roomDetails: [] });
        }
    };

    componentDidMount() {
        this.fetchAllRooms();
    }

    render() {
        return (
            <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded shadow">
                <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"></link>
                <h2 class="text-3xl">All Rooms</h2>
                {this.state.roomDetails.length > 0 ? (
                    <ul>
                        {this.state.roomDetails.map((room, index) => (
                            <li key={index}>
                                <strong>Room ID:</strong> {index + 1} |
                                <strong> Game ID:</strong> {room.gameId.toString()} |
                                <strong> Entry Fee:</strong> {room.entryFee.toString()} Wei |
                                <strong> Max Players:</strong> {room.maxPlayers.toString()} |
                                {room.players ? (
                                    <>
                                        <strong> Number of Players:</strong> {room.players.length} |
                                    </>
                                ) : null}
                                <strong> Status:</strong> {room.roomStatus ? 'Active' : 'Inactive'}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p class="text-red-600"><br></br>No rooms available.</p>
                )}

                <p>{this.state.message}</p>
            </div>
        );
    }
}

export default AllRoomsPage;
