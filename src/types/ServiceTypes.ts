/**
 * Represents the response from a service
 * @template T - The type of the response data. Defaults to `undefined` if not specified.
 */
export interface ServiceRes<T = undefined> {
  /** Whether the request was successful */
  success: boolean,

  /** HTTP status code */
  status: number,

  /** Optional data returned by the service */
  data?: T,
}