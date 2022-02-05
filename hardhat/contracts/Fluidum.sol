//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Fluidum {
    uint256 private constant pendingRegistrationValidityPeriod = 5 minutes;
    mapping(bytes32 => address) private _usersByPhoneNumber;
    mapping(address => bytes32) private _phoneNumbersByUser;
    mapping(bytes32 => PendingRegistration)
        private _pendingRegistrationsByPhoneNumber;

    struct PendingRegistration {
        address newUserAddress;
        bytes32 codeHash;
        uint256 timestamp;
    }

    constructor() {}

    /**
     * @notice Starts verification process
     *
     * @param newUserAddress address to register
     * @param codeHash keccak256 of the verification code sent via SMS
     * @param phoneNumberHash hash of the phone number
     */
    function startVerification(
        address newUserAddress,
        bytes32 codeHash,
        bytes32 phoneNumberHash
    ) public {
        require(newUserAddress == address(newUserAddress), "Invalid address");
        //TODO verify that newUserAddress is indeed owned by someone by checking signature
        require(
            _usersByPhoneNumber[phoneNumberHash] != newUserAddress,
            "The address has already been registered for this phone number"
        );
        require(
            _pendingRegistrationsByPhoneNumber[phoneNumberHash]
                .newUserAddress != newUserAddress,
            "The registration is pending"
        );
        _pendingRegistrationsByPhoneNumber[
            phoneNumberHash
        ] = PendingRegistration({
            codeHash: codeHash,
            newUserAddress: newUserAddress,
            timestamp: block.timestamp
        });
    }

    /**
     * @notice Finishes verification process
     *
     * @param code plaintext verification code sent via SMS
     * @param phoneNumberHash hash of the phone number
     */
    function finishVerification(string memory code, bytes32 phoneNumberHash)
        public
    {
        //TODO verify sender's or meta-transaction sender's signature
        //TODO replace msg.sender with address recovered from meta-transaction
        require(
            _usersByPhoneNumber[phoneNumberHash] != msg.sender,
            "The address has already been registered for this phone number"
        );
        require(
            _pendingRegistrationsByPhoneNumber[phoneNumberHash]
                .newUserAddress == msg.sender,
            "The registration is not pending"
        );
        require(
            block.timestamp -
                _pendingRegistrationsByPhoneNumber[phoneNumberHash].timestamp <=
                pendingRegistrationValidityPeriod,
            "Registration timed out"
        );
        //Convenient online keccak256 - https://profitplane.com/keccak256
        require(
            keccak256(abi.encodePacked(code)) ==
                _pendingRegistrationsByPhoneNumber[phoneNumberHash].codeHash,
            "The provided code is incorrect"
        );
        //TODO either msg.sender or the address recovered from signature
        _usersByPhoneNumber[phoneNumberHash] = msg.sender;
        _phoneNumbersByUser[msg.sender] = phoneNumberHash;
        delete _pendingRegistrationsByPhoneNumber[phoneNumberHash];
    }

    /**
     * @notice Checks if phone number is registered
     *
     * @param addressToCheck address to check
     */
    function checkRegistered(address addressToCheck)
        public
        view
        returns (bool)
    {
        return _phoneNumbersByUser[addressToCheck] != bytes32(0);
    }
}
