declare module 'mongoose' {
  export interface Query<T> {
    mongooseCollection: any;
  }
}
