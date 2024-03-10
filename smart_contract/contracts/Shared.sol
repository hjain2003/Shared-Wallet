// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Shared {

    struct SharedWallet {
        uint256 walletId;
        string walletName;
        uint256 walletBalance;
        address admin;
        uint256 goalAmount;
        uint256 borrowLimit;
        address[] participants;
        address[] participantRequests;
        uint256[] transactionIndices;
    }
    SharedWallet[] public sharedWallets;

    struct Transaction {
        string sender;
        string receiver;
        uint256 amount;
        string description;
        uint256 timestamp;
    }
    Transaction[] public allTransactions;

    struct Charity{
        address walletId;
        string charityName;
        string description;
    }
    Charity[] public charities;
     
    mapping(uint256 => bool) public walletIdExists;
    mapping(address => string) public username;
    mapping(address => string) public name;
    mapping(uint=>uint) public charityId;
    mapping(address => bool) public hasCreatedCharity;

    string[] public existingUsernames;


    event SharedWalletCreated(uint256 indexed walletId, address indexed admin, uint256 goalAmount, uint256 borrowLimit, address[] participants);
    event ParticipantRequest(uint256 indexed walletId, address indexed participant);
    event ParticipantAccepted(uint256 indexed walletId, address indexed participant);
    event ParticipantRejected(uint256 indexed walletId, address indexed participant);
    event ParticipantRemoved(uint256 indexed walletId, address indexed participant);
    event FundsWithdrawnFromSharedWallet(uint256 indexed walletId, string indexed participant, uint256 amount);
    event FundsAddedToSharedWallet(uint256 indexed walletId, string indexed participant, uint256 amount);
    event CharityCreated(address indexed walletId, string charityName, string description);

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

    function isParticipant(uint256 _walletId, address _participant) public view returns (bool) {
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

    function createSharedWallet(uint256 _goalAmount, uint256 _borrowLimit, string memory _walname) public {
        require(_goalAmount > 0, "Goal amount must be greater than 0");
        require(_borrowLimit >= 0, "Borrow limit must be non-negative");

        uint256 walletId = generateUniqueRandomId();
        address[] memory initialParticipants = new address[](1);
        initialParticipants[0] = msg.sender;

        SharedWallet memory newWallet = SharedWallet({
            walletId: walletId,
            walletName : _walname,
            walletBalance: 0,
            admin: msg.sender,
            goalAmount: _goalAmount * 1 ether,
            borrowLimit: _borrowLimit * 1 ether,
            participants: initialParticipants,
            participantRequests: new address[](0),
            transactionIndices: new uint256[](0)
        });

        sharedWallets.push(newWallet);
        walletIdExists[walletId] = true;

        emit SharedWalletCreated(walletId, msg.sender, _goalAmount, _borrowLimit, initialParticipants);
    }

    function getWalName(uint256 _walletId)  public view returns(string memory){
        uint256 walletIndex = findWalletIndex(_walletId);
        return sharedWallets[walletIndex].walletName;
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


        sharedWallets[walletIndex].walletBalance += msg.value;
        if(sharedWallets[walletIndex].goalAmount > msg.value){
            sharedWallets[walletIndex].goalAmount -= msg.value;
        }
        else{
            sharedWallets[walletIndex].goalAmount = 0 * 1 ether;
        }

        uint256 transactionIndex = allTransactions.length;
        allTransactions.push(Transaction({
            sender: username[msg.sender],
            receiver: "shared wallet",
            amount: msg.value,
            description: "Funds added to shared wallet",
            timestamp: block.timestamp
        }));

        sharedWallets[walletIndex].transactionIndices.push(transactionIndex);

        emit FundsAddedToSharedWallet(_walletId, username[msg.sender], msg.value);

    }

    function getBalance(uint256 _walletId) public view returns(uint256){
        uint walletIndex=findWalletIndex(_walletId);
        require(isParticipant(_walletId, msg.sender),"You are not a particpant of the specified wallet id");
        
        return sharedWallets[walletIndex].walletBalance/1 ether;
        
    }

    function withdrawFundsFromSharedWallet(uint256 _walletId, uint256 _amount, string memory _description) public {
        uint walletIndex=findWalletIndex(_walletId);
        require(walletIdExists[_walletId], "Wallet with given ID does not exist");
        require(isParticipant(_walletId, msg.sender), "Only participants can withdraw funds");
        require(_amount * 1 ether <= sharedWallets[walletIndex].borrowLimit, "Withdrawal amount exceeds the borrow limit");
        require(_amount * 1 ether<= sharedWallets[walletIndex].walletBalance, "Insufficient funds in the shared wallet");
        

        uint amountInEther = _amount * 1 ether;
        sharedWallets[walletIndex].walletBalance -= amountInEther;
        sharedWallets[walletIndex].goalAmount += amountInEther;
        payable(msg.sender).transfer(amountInEther);

        uint256 transactionIndex = allTransactions.length;
        allTransactions.push(Transaction({
            sender: "shared wallet",
            receiver: username[msg.sender],
            amount: amountInEther,
            description: _description,
            timestamp: block.timestamp
        }));

        sharedWallets[walletIndex].transactionIndices.push(transactionIndex);

        emit FundsWithdrawnFromSharedWallet(_walletId, username[msg.sender], amountInEther);
    }
    
    function getWalletTransactions(uint256 _walletId) public view returns (Transaction[] memory) {
        require(walletIdExists[_walletId], "Wallet with given ID does not exist");

        uint256 walletIndex = findWalletIndex(_walletId);
        uint256[] memory transactionIndices = sharedWallets[walletIndex].transactionIndices;
        uint256 transactionsCount = transactionIndices.length;

        Transaction[] memory walletTransactions = new Transaction[](transactionsCount);

        for (uint256 i = 0; i < transactionsCount; i++) {
            walletTransactions[i] = allTransactions[transactionIndices[i]];
        }

        return walletTransactions;
}

    function createOrgCharity(string memory _name, string memory _description) public{
        require(!hasCreatedCharity[msg.sender], "charity already created");

        Charity memory newCharity = Charity({
            walletId : msg.sender,
            charityName : _name,
            description : _description
        });

        charities.push(newCharity);
        hasCreatedCharity[msg.sender]=true;

        emit CharityCreated(msg.sender, _name, _description);
    }

    function getAllCharities() public view returns(Charity[] memory){
        return charities;
    }

}
