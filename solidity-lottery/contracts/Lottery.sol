// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

contract Lottery {
    address public manager;
    address payable[] players;

    constructor() {
        manager = msg.sender;
    }

    function enter() public payable {
        require(
            msg.value > 0.01 ether,
            "at least 0.1 ether should be sent to participate"
        );
        players.push(payable(msg.sender));
    }

    function random() private view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(block.difficulty, block.number, players)
                )
            );
    }

    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }

    function pickWinner() public onlyManager {
        address self = address(this);
        uint256 index = random() % players.length;
        players[index].transfer(self.balance);
        players = new address payable[](0);
    }

    modifier onlyManager() {
        require(msg.sender == manager, "Only manager can call this function ");
        _;
    }
}
