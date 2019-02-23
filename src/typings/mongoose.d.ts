declare module 'mongoose' {
  export interface Query<T> {
    mongooseCollection: any;
    model: any;
    cache: (options?: any) => any;
    useCache: boolean;
    hashKey: string;
  }
  export interface DocumentQuery<T, DocType extends import('mongoose').Document, QueryHelpers = {}> {
    cache: (options?: any) => any;
  }
}
