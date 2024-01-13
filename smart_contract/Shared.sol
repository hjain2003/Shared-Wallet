// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

contract Shared {

    struct SharedWallet {
        uint256 walletId;
        address admin;
        uint256 goalAmount;
        uint256 borrowLimit;
        address[] participants;
        address[] participantRequests;
    }

    SharedWallet[] public sharedWallets;
    mapping(uint256 => bool) public walletIdExists;
    mapping(uint256 => uint256) public sharedWalletBalances;

    event SharedWalletCreated(uint256 indexed walletId, address indexed admin, uint256 goalAmount, uint256 borrowLimit, address[] participants);
    event ParticipantRequest(uint256 indexed walletId, address indexed participant);
    event ParticipantAccepted(uint256 indexed walletId, address indexed participant);
    event ParticipantRejected(uint256 indexed walletId, address indexed participant);
    event ParticipantRemoved(uint256 indexed walletId, address indexed participant);

    function generateUniqueRandomId() internal view returns (uint256) {
        uint256 randomId = uint256(keccak256(abi.encodePacked(block.difficulty, block.timestamp, blockhash(block.number - 1))));
        randomId = randomId % 9000 + 1000;

        while (walletIdExists[randomId]) {
            randomId = (randomId + 1) % 9000 + 1000;
        }

        return randomId;
    }

    function isRequestPending(uint256 _walletId, address _participant) internal view returns (bool) {
        for (uint256 i = 0; i < sharedWallets[_walletId].participantRequests.length; i++) {
            if (sharedWallets[_walletId].participantRequests[i] == _participant) {
                return true;
            }
        }
        return false;
    }

    function removeFromRequests(uint256 _walletId, address _participant) internal  {
        for (uint256 i = 0; i < sharedWallets[_walletId].participantRequests.length; i++) {
            if (sharedWallets[_walletId].participantRequests[i] == _participant) {
                for (uint256 j = i; j < sharedWallets[_walletId].participantRequests.length - 1; j++) {
                    sharedWallets[_walletId].participantRequests[j] = sharedWallets[_walletId].participantRequests[j + 1];
                }
                sharedWallets[_walletId].participantRequests.pop();
                break;
            }
        }
    }

    function isParticipant(uint256 _walletId, address _participant) internal view returns (bool) {
        for (uint256 i = 0; i < sharedWallets[_walletId].participants.length; i++) {
            if (sharedWallets[_walletId].participants[i] == _participant) {
                return true;
            }
        }
        return false;
    }

     function removeFromParticipants(uint256 _walletId, address _participant) internal {
        for (uint256 i = 0; i < sharedWallets[_walletId].participants.length; i++) {
            if (sharedWallets[_walletId].participants[i] == _participant) {
                for (uint256 j = i; j < sharedWallets[_walletId].participants.length - 1; j++) {
                    sharedWallets[_walletId].participants[j] = sharedWallets[_walletId].participants[j + 1];
                }
                sharedWallets[_walletId].participants.pop();
                break;
            }
        }
    }


    function createSharedWallet(uint256 _goalAmount, uint256 _borrowLimit) public {
        require(_goalAmount > 0, "Goal amount must be greater than 0");
        require(_borrowLimit >= 0, "Borrow limit must be non-negative");

        uint256 walletId = generateUniqueRandomId();
        address[] memory initialParticipants = new address[](1);
        initialParticipants[0] = msg.sender;

        SharedWallet memory newWallet = SharedWallet({
            walletId: walletId,
            admin: msg.sender,
            goalAmount: _goalAmount,
            borrowLimit: _borrowLimit,
            participants: initialParticipants,
            participantRequests: new address[](0)
        });

        sharedWallets.push(newWallet);
        walletIdExists[walletId] = true;

        emit SharedWalletCreated(walletId, msg.sender, _goalAmount, _borrowLimit, initialParticipants);
    }

    function getAllSharedWallets() public view returns (SharedWallet[] memory) {
        return sharedWallets;
    }

    function requestToJoin(uint256 _walletId) public{
        require(walletIdExists[_walletId], "Wallet with given ID does not exist");
        require(!isParticipant(_walletId, msg.sender), "Already a participant");
        require(!isRequestPending(_walletId, msg.sender), "Request already submitted");

        uint256 walletIndex;
        for (uint256 i = 0; i < sharedWallets.length; i++) {
            if (sharedWallets[i].walletId == _walletId) {
                walletIndex = i;
                break;
            }
        }
        sharedWallets[walletIndex].participantRequests.push(msg.sender);

        emit ParticipantRequest(_walletId, msg.sender);
    }


    function acceptParticipant(uint256 _walletId, address _participant) public {
        require(msg.sender == sharedWallets[_walletId].admin, "Only admin can accept participants");
        require(isRequestPending(_walletId, _participant), "Participant request not found");

        sharedWallets[_walletId].participants.push(_participant);
        removeFromRequests(_walletId, _participant);

        emit ParticipantAccepted(_walletId, _participant);
    }

    function rejectParticipant(uint256 _walletId, address _participant) public {
        require(msg.sender == sharedWallets[_walletId].admin, "Only admin can reject participants");
        require(isRequestPending(_walletId, _participant), "Participant request not found");

        removeFromRequests(_walletId, _participant);

        emit ParticipantRejected(_walletId, _participant);
    }

    function removeParticipant(uint256 _walletId, address _participant) public {
        require(msg.sender == sharedWallets[_walletId].admin, "Only admin can remove participants");
        require(isParticipant(_walletId, _participant), "Participant not found");

        removeFromParticipants(_walletId, _participant);

        emit ParticipantRemoved(_walletId, _participant);
    }
}
