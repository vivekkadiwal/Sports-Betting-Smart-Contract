import web3 from "./web3";

const address = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
const abi =[
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "teamA",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "teamB",
				"type": "string"
			}
		],
		"name": "createGame",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "gameIdArg",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "entryFee",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "maxPlayers",
				"type": "uint256"
			}
		],
		"name": "createRoom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "gameIdArg",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "winner",
				"type": "uint256"
			}
		],
		"name": "declareResults",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "gameIdDisable",
				"type": "uint256"
			}
		],
		"name": "disableGame",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "gameIdDisable",
				"type": "uint256"
			}
		],
		"name": "disableRoom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "displayGameID",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "displayRoomID",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "i",
				"type": "uint256"
			}
		],
		"name": "displayRoomPlayers",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "roomOwner",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "gameId",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "entryFee",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "maxPlayers",
						"type": "uint256"
					},
					{
						"internalType": "address[]",
						"name": "players",
						"type": "address[]"
					},
					{
						"internalType": "uint256[]",
						"name": "playersSel",
						"type": "uint256[]"
					},
					{
						"internalType": "bool",
						"name": "declaredResults",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "roomStatus",
						"type": "bool"
					},
					{
						"internalType": "uint256",
						"name": "prizePool",
						"type": "uint256"
					}
				],
				"internalType": "struct SportsBetting.Room",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "roomIdArg",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "winner",
				"type": "uint256"
			}
		],
		"name": "distributePrizePool",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "gameId",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "gamesDict",
		"outputs": [
			{
				"internalType": "string",
				"name": "teamA",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "teamB",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "activeStatus",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "winnerTeamA",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "winnerTeamB",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "gameIdArg",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "roomIdArg",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "playerSel",
				"type": "uint256"
			}
		],
		"name": "joinRoom",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "managerAddress",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "managerFee",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "playersDict",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "roomDict",
		"outputs": [
			{
				"internalType": "address",
				"name": "roomOwner",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "gameId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "entryFee",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "maxPlayers",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "declaredResults",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "roomStatus",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "prizePool",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "roomId",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

export default new web3.eth.Contract(abi, address);
