/* eslint-disable semi */

export default interface IDbClient {

    createDb(): Promise<void>;

    dropDb(): Promise<void>;

    executeQuery(query: string): Promise<unknown>;

}
