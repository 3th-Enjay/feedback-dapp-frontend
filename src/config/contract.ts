// Contract address on Sepolia testnet
export const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";

// ABI for the contract
export const CONTRACT_ABI = [
  "function submitFeedback(string memory _message) public",
  "function getAllFeedback() public view returns (tuple(address user, string message, uint256 timestamp)[] memory)",
  "function getFeedbackCount() public view returns (uint256)",
  "event NewFeedback(address indexed user, string message, uint256 timestamp)"
];