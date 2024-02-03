// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

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

    struct Charity{
        uint walletId;
        string description;
        uint totalMoneyRaised;
    }

    mapping(uint256 => bool) public walletIdExists;
    mapping(uint256 => uint256) public sharedWalletBalances;
    mapping(address => string) public username;
    mapping(address => string) public name;

    string[] public existingUsernames;


    event SharedWalletCreated(uint256 indexed walletId, address indexed admin, uint256 goalAmount, uint256 borrowLimit, address[] participants);
    event ParticipantRequest(uint256 indexed walletId, address indexed participant);
    event ParticipantAccepted(uint256 indexed walletId, address indexed participant);
    event ParticipantRejected(uint256 indexed walletId, address indexed participant);
    event ParticipantRemoved(uint256 indexed walletId, address indexed participant);
    event FundsAddedToSharedWallet(uint256 indexed walletId, address indexed participant, uint256 amount);
    event FundsWithdrawnFromSharedWallet(uint256 indexed walletId, address indexed participant, uint256 amount);

    function generateUniqueRandomId() internal view returns (uint256) {
    uint256 randomId = uint256(keccak256(abi.encodePacked(block.prevrandao, block.timestamp, blockhash(block.number - 1))));
    randomId = randomId % 9000 + 1000;

    while (walletIdExists[randomId]) {
        randomId = (randomId + 1) % 9000 + 1000;
    }

    return randomId;
}


    function findWalletIndex(uint256 _walletId) internal view returns (uint256) {
        for (uint256 i = 0; i < sharedWallets.length; i++) {
            if (sharedWallets[i].walletId == _walletId) {
                return i;
            }
        }
        revert("Wallet not found");
    }

    function removeFromArray(address[] storage array, address element) internal {
        for (uint256 i = 0; i < array.length; i++) {
            if (array[i] == element) {
                if (i < array.length - 1) {
                    array[i] = array[array.length - 1];
                }
                array.pop();
                return;
            }
        }
        revert("Element not found in array");
    }

    function isRequestPending(uint256 _walletId, address _participant) internal view returns (bool) {
        uint walletIndex = findWalletIndex(_walletId);
        for(uint256 i=0;i<sharedWallets[walletIndex].participantRequests.length;i++){
            if(sharedWallets[walletIndex].participantRequests[i]==_participant){
                return true;
            }
        } 
        return false;
    }

    function isParticipant(uint256 _walletId, address _participant) internal view returns (bool) {
        uint walletIndex = findWalletIndex(_walletId);
        for(uint256 i=0;i<sharedWallets[walletIndex].participants.length;i++){
            if(sharedWallets[walletIndex].participants[i]==_participant){
                return true;
            }
        } 
        return false;
    }

    function setName(string memory _name) public{
        name[msg.sender] = _name;
    }

    function checkUsernameExists(string memory _username) internal view returns (bool) {
    for (uint i = 0; i < existingUsernames.length; i++) {
        if (keccak256(bytes(existingUsernames[i])) == keccak256(bytes(_username))) {
            return true; 
        }
    }
    return false; 
}

    function setUsername(string memory _username) public {
    require(bytes(username[msg.sender]).length == 0, "Username already exists!!");
    require(!checkUsernameExists(_username), "Username is already taken by another user!");

    existingUsernames.push(_username);
    username[msg.sender] = _username;
}

    function getName()  public view returns(string memory){
        return name[msg.sender];
    }

    function getUsername()  public view returns(string memory){
        return username[msg.sender];
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
            goalAmount: _goalAmount * 1 ether,
            borrowLimit: _borrowLimit * 1 ether,
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

        uint256 walletIndex = findWalletIndex(_walletId);
        sharedWallets[walletIndex].participantRequests.push(msg.sender);

        emit ParticipantRequest(_walletId, msg.sender);
    }


    function acceptParticipant(uint256 _walletId, address _participant) public {
        uint256 walletIndex = findWalletIndex(_walletId);
        require(msg.sender == sharedWallets[walletIndex].admin, "Only admin can accept participants");
        require(isRequestPending(_walletId, _participant), "Participant request not found");

        sharedWallets[walletIndex].participants.push(_participant);
        removeFromArray(sharedWallets[walletIndex].participantRequests, _participant);

        emit ParticipantAccepted(_walletId, _participant);
    }

    function rejectParticipant(uint256 _walletId, address _participant) public {
        require(msg.sender == sharedWallets[_walletId].admin, "Only admin can reject participants");
        require(isRequestPending(_walletId, _participant), "Participant request not found");

        uint256 walletIndex = findWalletIndex(_walletId);
        removeFromArray(sharedWallets[walletIndex].participantRequests, _participant);

        emit ParticipantRejected(_walletId, _participant);
    }

    function removeParticipant(uint256 _walletId, address _participant) public {
        uint256 walletIndex=findWalletIndex(_walletId);
        require(msg.sender == sharedWallets[walletIndex].admin, "Only admin can remove participants");
        require(isParticipant(_walletId, _participant), "Participant not found");

        removeFromArray(sharedWallets[walletIndex].participants, _participant);
        emit ParticipantRemoved(_walletId, _participant);
    }

    function addFundsToSharedWallet(uint256 _walletId) public payable {
        uint256 walletIndex=findWalletIndex(_walletId);
        require(walletIdExists[_walletId], "Wallet with given ID does not exist");
        require(isParticipant(_walletId, msg.sender), "Only participants can add funds");
        require(msg.value > 0 ether,"Insufficient funds");
        // require(sharedWallets[walletIndex].goalAmount >= msg.value, "Insufficient goalAmount");

        sharedWalletBalances[_walletId] += msg.value;
        if(sharedWallets[walletIndex].goalAmount > msg.value){
            sharedWallets[walletIndex].goalAmount -= msg.value;
        }
        else{
            sharedWallets[walletIndex].goalAmount = 0 * 1 ether;
        }

        emit FundsAddedToSharedWallet(_walletId, msg.sender, msg.value);
    }

    function getBalance(uint256 _walletId) public view returns(uint256){
        require(isParticipant(_walletId, msg.sender),"You are not a particpant of the specified wallet id");
        
        return sharedWalletBalances[_walletId] / 1 ether;
        
    }

    function withdrawFundsFromSharedWallet(uint256 _walletId, uint256 _amount) public {
        uint walletIndex=findWalletIndex(_walletId);
        require(walletIdExists[_walletId], "Wallet with given ID does not exist");
        require(isParticipant(_walletId, msg.sender), "Only participants can withdraw funds");
        require(_amount <= sharedWalletBalances[_walletId], "Insufficient funds in the shared wallet");
        require(_amount <= sharedWallets[walletIndex].borrowLimit, "Withdrawal amount exceeds the borrow limit");

        uint amountInEther = _amount * 1 ether;
        sharedWalletBalances[_walletId] -= amountInEther;
        sharedWallets[walletIndex].goalAmount += amountInEther;
        payable(msg.sender).transfer(amountInEther);

        emit FundsWithdrawnFromSharedWallet(_walletId, msg.sender, amountInEther);
    }
}


    