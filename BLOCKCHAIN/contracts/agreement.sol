// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Agreement {
    struct ContractAgreement {
        uint256 id;
        address client;
        address freelancer;
        string details;
        bool completed;
    }

    uint256 public agreementCount = 0;
    mapping(uint256 => ContractAgreement) public agreements;

    event AgreementCreated(uint256 id, address client, address freelancer, string details, bytes32 blockchainHash);
    event AgreementCompleted(uint256 id);

    function createAgreement(address _freelancer, string memory _details) public {
        agreementCount++;

        // Generate a unique hash for blockchain verification
        bytes32 hash = keccak256(abi.encodePacked(agreementCount, msg.sender, _freelancer, _details));

        agreements[agreementCount] = ContractAgreement(agreementCount, msg.sender, _freelancer, _details, false);

        emit AgreementCreated(agreementCount, msg.sender, _freelancer, _details, hash);
    }

    function completeAgreement(uint256 _id) public {
        require(agreements[_id].client == msg.sender, "Only the client can complete the agreement");
        agreements[_id].completed = true;

        emit AgreementCompleted(_id);
    }
}
