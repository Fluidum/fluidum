//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import {ISuperfluid, ISuperAgreement, ISuperToken, ISuperApp, SuperAppDefinitions} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import {IConstantFlowAgreementV1} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IConstantFlowAgreementV1.sol";
import {SuperAppBase} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperAppBase.sol";

contract Fluidum is SuperAppBase {
    uint256 private constant pendingRegistrationValidityPeriod = 1 minutes;
    mapping(bytes32 => address) private _usersByPhoneNumber;
    mapping(address => bytes32) private _phoneNumbersByUser;

    struct Flow {
        address sender;
        address recipient;
        string message;
    }

    mapping(address => Flow[]) private _outgoingFlowsByUser;
    mapping(address => Flow[]) private _incomingFlowsByUser;
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

    /**
     * @notice Checks if phone number is registered
     *
     * @param phoneNumberHash phone number to check
     */
    function checkRegisteredByPhone(bytes32 phoneNumberHash)
        public
        view
        returns (bool)
    {
        return _usersByPhoneNumber[phoneNumberHash] != address(0);
    }

    /**************************************************************************
     * SuperApp callbacks
     *************************************************************************/

    function afterAgreementCreated(
        ISuperToken _superToken,
        address _agreementClass,
        bytes32, // _agreementId,
        bytes calldata _agreementData,
        bytes calldata, // _cbdata,
        bytes calldata _ctx
    )
        external
        override
        onlyExpected(_superToken, _agreementClass)
        onlyHost
        returns (bytes memory newCtx)
    {
        return _updateOutflow(_ctx, _agreementData);
    }

    function afterAgreementUpdated(
        ISuperToken _superToken,
        address _agreementClass,
        bytes32, // _agreementId,
        bytes calldata _agreementData,
        bytes calldata, //_cbdata,
        bytes calldata _ctx
    )
        external
        override
        onlyExpected(_superToken, _agreementClass)
        onlyHost
        returns (bytes memory newCtx)
    {
        return _updateOutflow(_ctx, _agreementData);
    }

    function parseUserData(bytes memory data)
        internal
        pure
        returns (bytes32 recipientPhoneNumberHash, string memory message)
    {
        (recipientPhoneNumberHash, message) = abi.decode(
            data,
            (bytes32, string)
        );
    }

    /// @dev If a new stream is opened, or an existing one is opened
    function _updateOutflow(bytes calldata ctx, bytes calldata _agreementData)
        private
        returns (bytes memory newCtx)
    {
        newCtx = ctx; //update the context with the same logic...
        ISuperfluid.Context memory decodedContext = _host.decodeCtx(ctx);
        (
            bytes32 recipientPhoneNumberHash,
            string memory textMessage
        ) = parseUserData(decodedContext.userData);

        (address sender, ) = abi.decode(_agreementData, (address, address));

        address recipient = _usersByPhoneNumber[recipientPhoneNumberHash];
        require(
            address(recipient) != address(0),
            "Recipient is not registered"
        );
        require(!_host.isApp(ISuperApp(recipient)), "Recipient is an app!");

        (, int96 inFlowRate, , ) = _cfa.getFlow(
            _acceptedToken,
            sender,
            address(this)
        ); // CHECK: unclear what happens if flow doesn't exist.

        (, int96 outFlowRate, , ) = _cfa.getFlow(
            _acceptedToken,
            address(this),
            recipient
        ); // CHECK: unclear what happens if flow doesn't exist.

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
            deleteFlow(sender, recipient);
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
            _outgoingFlowsByUser[sender].push(
                Flow(sender, recipient, textMessage)
            );
            _incomingFlowsByUser[recipient].push(
                Flow(sender, recipient, textMessage)
            );
        }
    }

    function deleteFlow(address sender, address recipient) internal {
        for (uint256 i = 0; i < _outgoingFlowsByUser[sender].length; i++) {
            if (_outgoingFlowsByUser[sender][i].recipient == recipient) {
                delete _outgoingFlowsByUser[sender][i];
                break;
            }
        }
        for (uint256 i = 0; i < _incomingFlowsByUser[recipient].length; i++) {
            if (_incomingFlowsByUser[recipient][i].sender == sender) {
                delete _incomingFlowsByUser[recipient][i];
                break;
            }
        }
    }

    function afterAgreementTerminated(
        ISuperToken, /*superToken*/
        address, /*agreementClass*/
        bytes32, // _agreementId,
        bytes calldata _agreementData,
        bytes calldata, /*cbdata*/
        bytes calldata _ctx
    ) external virtual override returns (bytes memory newCtx) {
        return _updateOutflow(_ctx, _agreementData);
    }

    /**
     * @notice Returns all flows related to the user (incoming and outgoing)
     *
     * @param user user address
     */
    function getUserFlows(address user)
        public
        view
        returns (Flow[] memory userFlows)
    {
        uint256 outgoingFlowsCount = _outgoingFlowsByUser[user].length;
        uint256 incomingFlowsCount = _incomingFlowsByUser[user].length;
        userFlows = new Flow[](outgoingFlowsCount + incomingFlowsCount);
        for (uint256 i = 0; i < outgoingFlowsCount; i++) {
            userFlows[i] = _outgoingFlowsByUser[user][i];
        }
        for (uint256 i = 0; i < incomingFlowsCount; i++) {
            userFlows[outgoingFlowsCount + i] = _incomingFlowsByUser[user][i];
        }
    }

    /**
     * @notice Returns flow details. You should always provide the sender of the originating flow that is incoming to the contract
     *
     * @param sender the flow sender
     */
    function getFlowDetails(address sender)
        public
        view
        returns (
            uint256 timestamp,
            int96 inFlowRate,
            uint256 deposit,
            uint256 owedDeposit
        )
    {
        (timestamp, inFlowRate, deposit, owedDeposit) = _cfa.getFlow(
            _acceptedToken,
            sender,
            address(this)
        );
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
