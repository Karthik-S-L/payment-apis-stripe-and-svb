export function cancelSubscriptionValidation(cancelSubscriptionDto) {
  let subscriptionId = cancelSubscriptionDto.subscriptionId;
  let host = process.env.YML_PAYMENT_GATEWAY_HOST;
  let success_url = process.env.YML_PAYMENT_GATEWAY_SUCCESS_URL;
  let cancel_url = process.env.YML_PAYMENT_GATEWAY_CANCEL_URL;
  if (!subscriptionId) {
    return "subscription Id is not present";
  }  else if (!host) {
    return "Host url is not provided";
  } else if (!success_url) {
    return "Success url is not present";
  } else if (!cancel_url) {
    return "Cancel  url is not present";
  }
}

