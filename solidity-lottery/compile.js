const path = require('path');
const fs = require('fs');
const solc = require('solc');



const helloPath = path.resolve(__dirname, 'contracts', 'Lottery.sol');
const source = fs.readFileSync(helloPath, 'UTF-8');

var input = {
  language: 'Solidity',
  sources: {
    'Lottery.sol': {
      content: source
    }
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*']
      }
    }
  }
};
const compiled = solc.compile(JSON.stringify(input))
const parsed = JSON.parse(compiled)
// console.log(parsed.contracts["Lottery.sol"])
fs.writeFileSync('compiled.json', JSON.stringify(parsed.contracts["Lottery.sol"].Lottery, null, 2), 'utf-8')
module.exports = parsed.contracts["Lottery.sol"].Lottery