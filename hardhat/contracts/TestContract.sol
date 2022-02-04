//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract TestContract {
    string private greeting;
    event ValueChangedEvent(uint256 value);
    event DiceRolled(bytes32 indexed requestId, address indexed roller);

    mapping(address => uint256) private _onboard_already;
    mapping(address => In_Process) private _onboarding_process;

    struct In_Process {
        uint number;
        string text;
        uint256  timestamp;
    }

    constructor(string memory _greeting) {
        console.log("Deploying a Greeter with greeting:", _greeting);
        greeting = _greeting;
    }

    /** 
     * @notice Requests Onboarding
     * @dev Warning: if the VRF response is delayed, avoid calling requestRandomness repeatedly
     * as that would give miners/VRF operators latitude about which VRF response arrives first.
     * @dev You must review your implementation details with extreme care.
     *
     * @param phone address of the roller
     */
    function onboarding(uint phone) public returns (string memory) {
        console.log(phone);
        _onboarding_process[msg.sender] = 
        In_Process({number:1234,text:'mi teext',timestamp:block.timestamp});
        return _onboarding_process[msg.sender].text;
       
    }

    function isCancelled(uint timestamp) public view returns (bool) {
        bool _cancelOnboarding = true;
        console.log(_onboarding_process[msg.sender].timestamp + 20 );
        console.log(block.timestamp);
        if (_onboarding_process[msg.sender].timestamp + 20 > timestamp) {
            _cancelOnboarding = false;
        }
        return _cancelOnboarding;
    }



    receive() external payable {
    emit ValueChangedEvent(msg.value);
}
}
