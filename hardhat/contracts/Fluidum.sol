//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import {ISuperfluid, ISuperAgreement, ISuperToken, ISuperApp, SuperAppDefinitions} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import {IConstantFlowAgreementV1} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IConstantFlowAgreementV1.sol";
import {SuperAppBase} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperAppBase.sol";

contract Fluidum is SuperAppBase {
    uint256 private constant pendingRegistrationValidityPeriod = 1 minutes;
    mapping(bytes32 => address) private _usersByPhoneNumber;
    mapping(address => bytes32) private _phoneNumbersByUser;
    mapping(bytes32 => PendingRegistration)
        private _pendingRegistrationsByPhoneNumber;

    ISuperfluid private _host; // host
    IConstantFlowAgreementV1 private _cfa; // the stored constant flow agreement class address

    ISuperToken public _acceptedToken; // accepted token

    event RegistrationTimedOutEvent(bytes32 indexed phoneNumberHash);
    event RegistrationSuccessEvent(bytes32 indexed phoneNumberHash);

    struct PendingRegistration {
        address newUserAddress;
        bytes32 codeHash;
        uint256 timestamp;
    }

    constructor(
        ISuperfluid host,
        IConstantFlowAgreementV1 cfa,
        ISuperToken acceptedToken
    ) {
        require(address(host) != address(0), "host is zero address");
        require(address(cfa) != address(0), "cfa is zero address");
        require(
            address(acceptedToken) != address(0),
            "acceptedToken is zero address"
        );
        //require(address(receiver) != address(0), "receiver is zero address");
        //require(!host.isApp(ISuperApp(receiver)), "receiver is an app");
        _host = host;
        _cfa = cfa;
        _acceptedToken = acceptedToken;

        uint256 configWord = SuperAppDefinitions.APP_LEVEL_FINAL |
            SuperAppDefinitions.BEFORE_AGREEMENT_CREATED_NOOP |
            SuperAppDefinitions.BEFORE_AGREEMENT_UPDATED_NOOP |
            SuperAppDefinitions.BEFORE_AGREEMENT_TERMINATED_NOOP;

        _host.registerApp(configWord);
    }

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

    //TODO for testing only, delete
    function mockRegistration(address newUserAddress, bytes32 phoneNumberHash)
        public
    {
        _usersByPhoneNumber[phoneNumberHash] = newUserAddress;
        _phoneNumbersByUser[newUserAddress] = phoneNumberHash;
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
        if (
            block.timestamp -
                _pendingRegistrationsByPhoneNumber[phoneNumberHash].timestamp <=
            pendingRegistrationValidityPeriod
        ) {
            //Convenient online keccak256 - https://profitplane.com/keccak256
            require(
                keccak256(abi.encodePacked(code)) ==
                    _pendingRegistrationsByPhoneNumber[phoneNumberHash]
                        .codeHash,
                "The provided code is incorrect"
            );
            //TODO either msg.sender or the address recovered from signature
            _usersByPhoneNumber[phoneNumberHash] = msg.sender;
            _phoneNumbersByUser[msg.sender] = phoneNumberHash;
            emit RegistrationSuccessEvent(phoneNumberHash);
        } else {
            emit RegistrationTimedOutEvent(phoneNumberHash);
        }
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

    /**************************************************************************
     * SuperApp callbacks
     *************************************************************************/

    function afterAgreementCreated(
        ISuperToken _superToken,
        address _agreementClass,
        bytes32, // _agreementId,
        bytes calldata, /*_agreementData*/
        bytes calldata, // _cbdata,
        bytes calldata _ctx
    )
        external
        override
        onlyExpected(_superToken, _agreementClass)
        onlyHost
        returns (bytes memory newCtx)
    {
        return _updateOutflow(_ctx);
    }

    function afterAgreementUpdated(
        ISuperToken _superToken,
        address _agreementClass,
        bytes32, //_agreementId,
        bytes calldata, //agreementData,
        bytes calldata, //_cbdata,
        bytes calldata _ctx
    )
        external
        override
        onlyExpected(_superToken, _agreementClass)
        onlyHost
        returns (bytes memory newCtx)
    {
        return _updateOutflow(_ctx);
    }

    function parseUserData(bytes memory data)
        public
        pure
        returns (address, string memory)
    {
        (address recipientAddress, string memory message) = abi.decode(
            data,
            (address, string)
        );
        return (recipientAddress, message);
    }

    /// @dev If a new stream is opened, or an existing one is opened
    function _updateOutflow(bytes calldata ctx)
        private
        returns (bytes memory newCtx)
    {
        newCtx = ctx; //update the context with the same logic...

        ISuperfluid.Context memory decodedContext = _host.decodeCtx(ctx);
        //uData = decodedContext;
        address recipient;
        string memory textMessage;
        (recipient, textMessage) = parseUserData(decodedContext.userData);

        // address recipient = address(0x2c7536E3605D9C16a7a3D7b1898e529396a65c23); //_decodeAddress(ctx);
        // @dev This will give us the new flowRate, as it is called in after callbacks
        int96 netFlowRate = _cfa.getNetFlow(_acceptedToken, address(this));
        (, int96 outFlowRate, , ) = _cfa.getFlow(
            _acceptedToken,
            address(this),
            recipient
        ); // CHECK: unclear what happens if flow doesn't exist.
        int96 inFlowRate = netFlowRate + outFlowRate;

        // @dev If inFlowRate === 0, then delete existing flow.
        if (inFlowRate == int96(0)) {
            // @dev if inFlowRate is zero, delete outflow.
            (newCtx, ) = _host.callAgreementWithContext(
                _cfa,
                abi.encodeWithSelector(
                    _cfa.deleteFlow.selector,
                    _acceptedToken,
                    address(this),
                    recipient,
                    new bytes(0) // placeholder
                ),
                "0x",
                newCtx
            );
        } else if (outFlowRate != int96(0)) {
            (newCtx, ) = _host.callAgreementWithContext(
                _cfa,
                abi.encodeWithSelector(
                    _cfa.updateFlow.selector,
                    _acceptedToken,
                    recipient,
                    inFlowRate,
                    new bytes(0) // placeholder
                ),
                "0x",
                newCtx
            );
        } else {
            // @dev If there is no existing outflow, then create new flow to equal inflow
            (newCtx, ) = _host.callAgreementWithContext(
                _cfa,
                abi.encodeWithSelector(
                    _cfa.createFlow.selector,
                    _acceptedToken,
                    recipient,
                    inFlowRate,
                    new bytes(0) // placeholder
                ),
                "0x",
                newCtx
            );
        }
    }

    function _isSameToken(ISuperToken superToken) private view returns (bool) {
        return address(superToken) == address(_acceptedToken);
    }

    function _isCFAv1(address agreementClass) private view returns (bool) {
        return
            ISuperAgreement(agreementClass).agreementType() ==
            keccak256(
                "org.superfluid-finance.agreements.ConstantFlowAgreement.v1"
            );
    }

    modifier onlyExpected(ISuperToken superToken, address agreementClass) {
        require(_isSameToken(superToken), "RedirectAll: not accepted token");
        require(_isCFAv1(agreementClass), "RedirectAll: only CFAv1 supported");
        _;
    }

    modifier onlyHost() {
        require(
            msg.sender == address(_host),
            "RedirectAll: support only one host"
        );
        _;
    }
}
