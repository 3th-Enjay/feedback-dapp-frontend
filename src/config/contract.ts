// Contract address on Sepolia testnet
export const CONTRACT_ADDRESS = "0x5d415f103F35387FD0Edfc3eD299eD65548De388";

// ABI for the contract
export const CONTRACT_ABI = [
  "function submitFeedback(string memory _message) public",
  "function getAllFeedback() public view returns (tuple(address user, string message, uint256 timestamp)[] memory)",
  "function getFeedbackCount() public view returns (uint256)",
  "event NewFeedback(address indexed user, string message, uint256 timestamp)",
  "function getFeedbackByIndex(uint256 index) public view returns (address user, string message, uint256 timestamp)"
];