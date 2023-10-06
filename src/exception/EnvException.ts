export default class EnvException extends Error {
  constructor(envName: string, envValue: string | undefined) {
    super(`Error parsing env with key ${envValue} : ${envName}`);
  }
}
