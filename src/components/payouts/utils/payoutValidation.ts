
export const validateAmount = (amount: number, availableAmount: number) => {
  if (amount < 10 || amount > 500) {
    return "Amount must be between ₹10 and ₹500";
  }
  if (amount > availableAmount) {
    return "Amount cannot exceed your available earnings";
  }
  return null;
};
