type Dictionary<T> = Record<string, T>;

type KeysOf<T> = T extends Dictionary<unknown> ? `${Exclude<keyof T, symbol>}` : never;

export function objectKeys<T extends Dictionary<unknown>>(obj: T) {
    return Object.keys(obj) as Array<KeysOf<T>>;
}
