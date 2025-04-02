export { type OptionallyPromise };

type OptionallyPromise<T> = T | Promise<T>;
