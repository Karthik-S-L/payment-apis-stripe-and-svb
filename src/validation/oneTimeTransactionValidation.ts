export function oneTimeTransactionValidation(transactionDto) {
  let customerId = transactionDto.customerId;
  let host = process.env.YML_PAYMENT_GATEWAY_HOST;
  let success_url = process.env.YML_PAYMENT_GATEWAY_SUCCESS_URL;
  let cancel_url = process.env.YML_PAYMENT_GATEWAY_CANCEL_URL;
  if (!customerId) {
    return "customer Id is not present";
  } else if (!transactionDto.priceCode) {
    return "priceCode is not present";
  } else if (!transactionDto.quantity) {
    return "quantity is not specified";
  } else if (!host) {
    return "Host url is not provided";
  } else if (!success_url) {
    return "Success url is not present";
  } else if (!cancel_url) {
    return "Cancel  url is not present";
  }
}
