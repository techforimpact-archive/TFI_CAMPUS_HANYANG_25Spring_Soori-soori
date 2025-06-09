export interface UseCase<T, V> {
  call(value: V): T
}
