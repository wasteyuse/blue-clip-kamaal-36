
export const validateAmount = (amount: number, availableAmount: number) => {
  if (isNaN(amount) || amount <= 0) {
    return "Please enter a valid amount";
  }
  
  if (amount < 10) {
    return "Minimum payout amount is ₹10";
  }
  
  if (amount > 500) {
    return "Maximum payout amount is ₹500";
  }
  
  if (amount > availableAmount) {
    return "Amount cannot exceed your available earnings (₹" + availableAmount.toFixed(2) + ")";
  }
  
  return null;
};

export const getPayoutStatusMessage = (status: string) => {
  switch(status) {
    case 'pending':
      return "Your payout request is pending review";
    case 'approved':
      return "Your payout has been approved and is being processed";
    case 'rejected':
      return "Your payout request was rejected";
    case 'completed':
      return "Your payout has been processed successfully";
    default:
      return "Unknown status";
  }
};
