// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract SportsBetting {
    uint256[] gameId;
    struct gameStruct {
        string teamA;
        string teamB;
        bool activeStatus;
        bool winnerTeamA;
        bool winnerTeamB;
    }
    mapping(uint256 => gameStruct) public gamesDict;

    uint256[] roomId;
    struct roomStruct {
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
    mapping(uint256 => roomStruct) public roomDict;

    uint256 managerFee = 2; //should be divided by 100 when calculating
    address public managerAddress;
    
    mapping(address => uint) public playersDict; //fetch the players balance and store with address

    uint256[] lenWinners;

    modifier onlyAdmin() {
        require(msg.sender == managerAddress, "Only the administrator can call this function");
        _;
    }

    constructor() {
        managerAddress = msg.sender;
    }

    function displayGameID() public view returns(uint256[] memory){
        return gameId;
    }

    function displayRoomID() public view returns(uint256[] memory){
        return roomId;
    }

    function displayRoomPlayers(uint256 i) public view returns(roomStruct memory){
        roomStruct storage room = roomDict[i];
        return room;
    }   

    function createGame(string memory teamA, string memory teamB) public onlyAdmin {
        uint256 gameCurrentId = gameId.length+1;
        gameId.push(gameCurrentId);
        gamesDict[gameCurrentId] = gameStruct(teamA, teamB, true, false, false);
    }

    function disableGame(uint256 gameIdDisable) public onlyAdmin {
        require(msg.sender == managerAddress, "Only manager can disable rooms.");
        require(gamesDict[gameIdDisable].activeStatus, "Game is not active.");
        gamesDict[gameIdDisable].activeStatus = false;
        for (uint i = 0; i < gameId.length; i++) {
            if (gameId[i] == gameIdDisable) {
                gameId[i] = gameId[gameId.length - 1];
                gameId.pop();
                break;
            }
        }
        disableRoom(gameIdDisable);
    }

    function disableRoom(uint256 gameIdDisable) public {
        require(msg.sender == managerAddress, "Only manager can disable rooms.");
        for (uint i = 0; i<roomId.length; i++){
            if (roomId[i] == gameIdDisable){
                roomDict[gameIdDisable].roomStatus = false;
                roomId[i] = roomId[roomId.length - 1];
                roomId.pop();
            }
        }
    }

    function createRoom(uint256 gameIdArg, uint256 entryFee, uint256 maxPlayers) public {
        require(gamesDict[gameIdArg].activeStatus, "Game is not available.");
        uint roomIdTemp = roomId.length + 1;
        roomId.push(roomIdTemp);
        address[] memory playersArray;
        uint256[] memory playersSelArray;

        roomDict[roomIdTemp] = roomStruct({
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

    function joinRoom(uint gameIdArg, uint256 roomIdArg, uint256 PlayerSel) public payable {
        roomStruct storage room = roomDict[roomIdArg];
        require(room.roomStatus, "Room is not active.");
        require(room.players.length < room.maxPlayers, "Room is full.");
        require(msg.value == room.entryFee, "Incorrect entry fee.");
        for(uint256 i=0; i<room.players.length; i++){
            require(room.players[i] != msg.sender, "You already joined the room.");
        }
        room.gameId = gameIdArg;
        room.playersSel.push(PlayerSel);
        room.players.push(msg.sender);
        room.prizePool += msg.value;
    }

    function declaredResults(uint gameIdArg, uint winner) public payable  onlyAdmin {
        require(gamesDict[gameIdArg].activeStatus, "Game is not active.");
        require(winner == 0 || winner == 1, "Invalid winner parameter.");
        if (winner == 0) {
            gamesDict[gameIdArg].winnerTeamA = true;
        } else if(winner == 1) {
            gamesDict[gameIdArg].winnerTeamB = true;
        }

        for (uint i = 0; i < roomId.length; i++) {
            if (roomDict[roomId[i]].gameId == gameIdArg) {
                distributePrizePool(roomId[i], winner);
            }
        }

        disableGame(gameIdArg);
    }

    function distributePrizePool(uint roomIdArg, uint winner) public payable  {
        roomStruct storage room = roomDict[roomIdArg];
        uint tempPrizePool = address(this).balance - (address(this).balance-room.prizePool);
        payable(managerAddress).transfer((tempPrizePool*2)/100);
        tempPrizePool = tempPrizePool - ((tempPrizePool*2)/100);
        for (uint256 j = 0; j<room.playersSel.length; j++){
            if(room.playersSel[j] == winner){
                lenWinners.push();
            }
        }

        for (uint i = 0; i < room.players.length; i++) {
            
            if (room.playersSel[i] == winner){
                if (room.roomOwner == room.players[i]){
                    payable(room.roomOwner).transfer((tempPrizePool*2)/100);
                    tempPrizePool = tempPrizePool - ((tempPrizePool*2)/100);
                }
                payable(room.players[i]).transfer(tempPrizePool/lenWinners.length);
            }
    }
    }
}