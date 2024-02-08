import React, { useState } from 'react';
import web3 from "../OtherJS/web3";
import sportsBetting from "../OtherJS/sportsBetting";

class DeclareResultsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameIdInput: '',
      winningTeamInput: '',
      message: '',
      resultsDeclared: false,
    };
  }

  declareResults = async () => {
    const { gameIdInput, winningTeamInput } = this.state;
    const accounts = await web3.eth.getAccounts();
    


    try {
      await sportsBetting.methods.declareResults(gameIdInput, winningTeamInput).send({
        from: accounts[0],
      });

      await sportsBetting.methods.disableGame(gameIdInput).send({
        from: accounts[0],
      });

      this.setState({ message: 'Results declared successfully! Game is now inactive.', resultsDeclared: true });
    } catch (error) {
      console.error('Error using function:', error.message);
      this.setState({ message: 'Only Manager can use this!' });
    }
  };

  render() {
    const { gameIdInput, winningTeamInput, message, resultsDeclared } = this.state;

    return (
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded shadow">
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"></link>
        <h2>Declare Results</h2>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Enter Game ID:</label>
          <input
            type="text"
            value={gameIdInput}
            onChange={(e) => this.setState({ gameIdInput: e.target.value })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div>
          <label>Winning Team (0 for Team A, 1 for Team B):</label>
          <input
            type="text"
            value={winningTeamInput}
            onChange={(e) => this.setState({ winningTeamInput: e.target.value })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <br></br><br></br>
        <button onClick={this.declareResults}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >Declare Results</button>
        <p style={{ color: 'red' }}>{message}</p>

        {resultsDeclared && (
          <div>
            <p>Results Declared: YES</p>
          </div>
        )}

      </div>
    );
  }
}

export default DeclareResultsPage;
