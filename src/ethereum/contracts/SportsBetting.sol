// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract SportsBetting {
    uint256[] public gameId;
    
    struct Game {
        string teamA;
        string teamB;
        bool activeStatus;
        bool winnerTeamA;
        bool winnerTeamB;
    }
    
    mapping(uint256 => Game) public gamesDict;

    uint256[] public roomId;
    
    struct Room {
        address roomOwner;
        uint256 gameId;
        uint256 entryFee;
        uint256 maxPlayers;
        address[] players;
        uint256[] playersSel;
        bool declaredResults;
        bool roomStatus;
        uint256 prizePool;
    }
    
    mapping(uint256 => Room) public roomDict;

    uint256 public managerFee = 2; // should be divided by 100 when calculating
    address public managerAddress;

    mapping(address => uint256) public playersDict; // fetch the players' balance and store with the address

    modifier onlyAdmin() {
        require(msg.sender == managerAddress, "Only the administrator can call this function");
        _;
    }

    constructor() {
        managerAddress = msg.sender;
    }

    function displayGameID() public view returns (uint256[] memory) {
        return gameId;
    }

    function displayRoomID() public view returns (uint256[] memory) {
        return roomId;
    }

    function displayRoomPlayers(uint256 i) public view returns (Room memory) {
        return roomDict[i];
    }

    function createGame(string memory teamA, string memory teamB) public onlyAdmin {
        uint256 gameCurrentId = gameId.length + 1;
        gameId.push(gameCurrentId);
        gamesDict[gameCurrentId] = Game(teamA, teamB, true, false, false);
    }

    function disableGame(uint256 gameIdDisable) public onlyAdmin {
        require(gamesDict[gameIdDisable].activeStatus, "Game is not active.");
        gamesDict[gameIdDisable].activeStatus = false;
        uint256 index = gameIdDisable - 1;
        gameId[index] = gameId[gameId.length - 1];
        gameId.pop();
        disableRoom(gameIdDisable);
    }

    function disableRoom(uint256 gameIdDisable) public onlyAdmin {
        uint256 index = gameIdDisable - 1;
        require(roomId[index] == gameIdDisable, "Invalid roomId for gameId.");
        roomDict[gameIdDisable].roomStatus = false;
        roomId[index] = roomId[roomId.length - 1];
        roomId.pop();
    }

    function createRoom(uint256 gameIdArg, uint256 entryFee, uint256 maxPlayers) public {
        require(gamesDict[gameIdArg].activeStatus, "Game is not active.");
        require(gameIdArg > 0 && gameIdArg <= gameId.length, "Invalid Game ID.");
        
        uint256 roomIdTemp = roomId.length + 1;
        roomId.push(roomIdTemp);
        address[] memory playersArray;
        uint256[] memory playersSelArray;

        roomDict[roomIdTemp] = Room({
            roomOwner: msg.sender,
            gameId: gameIdArg,
            entryFee: entryFee * 1 wei,
            maxPlayers: maxPlayers,
            players: playersArray,
            playersSel: playersSelArray,
            declaredResults: false,
            roomStatus: true,
            prizePool: 0
        });
    }

    function joinRoom(uint256 gameIdArg, uint256 roomIdArg, uint256 playerSel) public payable {
        Room storage room = roomDict[roomIdArg];
        require(room.roomStatus, "Room is not active.");
        require(room.players.length < room.maxPlayers, "Room is full.");
        require(msg.value == room.entryFee, "Incorrect entry fee.");
        require(gameIdArg == room.gameId, "Invalid gameId for roomId.");
        room.playersSel.push(playerSel);
        room.players.push(msg.sender);
        room.prizePool += msg.value;
    }

    function declareResults(uint256 gameIdArg, uint256 winner) public payable onlyAdmin {
        require(gamesDict[gameIdArg].activeStatus, "Game is not active.");
        require(winner == 0 || winner == 1, "Invalid winner parameter.");

        if (winner == 0) {
            gamesDict[gameIdArg].winnerTeamA = true;
        } else if (winner == 1) {
            gamesDict[gameIdArg].winnerTeamB = true;
        }

        for (uint256 i = 0; i < roomId.length; i++) {
            if (roomDict[roomId[i]].gameId == gameIdArg) {
                distributePrizePool(roomId[i], winner);
            }
        }
    }

    function distributePrizePool(uint256 roomIdArg, uint256 winner) public payable {
        Room storage room = roomDict[roomIdArg];
        require(room.roomStatus, "Room is not active.");

        uint256 tempPrizePool = room.prizePool;
        uint256 totalWinners = 0;

        for (uint256 j = 0; j < room.playersSel.length; j++) {
            if (room.playersSel[j] == winner) {
                totalWinners++;
            }
        }

        require(totalWinners > 0, "No winners in the room.");

        uint256 managerCut = (tempPrizePool * managerFee) / 100;
        tempPrizePool -= managerCut;

        // Pay manager
        payable(managerAddress).transfer(managerCut);

        // Pay room owner
        uint256 roomOwnerCut = (tempPrizePool * managerFee) / 100;
        tempPrizePool -= roomOwnerCut;
        payable(room.roomOwner).transfer(roomOwnerCut);

        // Distribute the rest among winners
        for (uint256 i = 0; i < room.players.length; i++) {
            if (room.playersSel[i] == winner) {
                uint256 playerShare = (tempPrizePool / totalWinners);
                payable(room.players[i]).transfer(playerShare);
            }
        }
    }
}
