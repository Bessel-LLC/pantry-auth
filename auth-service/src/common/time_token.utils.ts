/**
 * Returns a future Date object based on the current time plus the given number of minutes.
 * VAlidate OTP CODE
 *
 * @param minutes - Number of minutes until expiration (optional)
 * @returns A Date object representing the expiration time
 */
export function getExpiryDate(minutes): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}

/**
 * Checks if a given date has already expired.
 * VAlidate OTP CODE
 *
 * @param expiryDate - The Date object to check
 * @returns true if the date is in the past, false otherwise
 */
export function isExpired(expiryDate: Date): boolean {
  return Date.now() >= expiryDate.getTime();
}

/**
 * Returns the token expiration set to 1 hour
 * @returns 
 */
export function getTokenExpirationDate(): Date {
  return new Date(Date.now() + 60 * 60 * 1000); // 1 hour
}
