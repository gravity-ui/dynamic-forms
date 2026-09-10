import {getStrictModeChecker} from '../strict-mode';

describe('getStrictModeChecker', () => {
    test('returns an independent checker instance', () => {
        const first = getStrictModeChecker();
        const second = getStrictModeChecker();

        expect(first).not.toBe(second);
        expect(first.check({a: 1})).toBe(true);
        expect(second.check({a: 1})).toBe(true);
        expect(first.check({a: 1})).toBe(false);
        expect(second.check({a: 1})).toBe(false);
    });

    test('check returns true on the first call', () => {
        const checker = getStrictModeChecker();

        expect(checker.check({})).toBe(true);
        expect(checker.check({form: {}, name: 'field'})).toBe(true);
    });

    test('check returns false when values are unchanged', () => {
        const checker = getStrictModeChecker();
        const form = {};
        const values = {form, name: 'field'};

        expect(checker.check(values)).toBe(true);
        expect(checker.check(values)).toBe(false);
        expect(checker.check({form, name: 'field'})).toBe(false);
    });

    test('check returns true when a value changes by reference', () => {
        const checker = getStrictModeChecker();
        const formA = {};
        const formB = {};

        expect(checker.check({form: formA})).toBe(true);
        expect(checker.check({form: formA})).toBe(false);
        expect(checker.check({form: formB})).toBe(true);
        expect(checker.check({form: formB})).toBe(false);
    });

    test('check returns true when a key is added or removed', () => {
        const checker = getStrictModeChecker();

        expect(checker.check({a: 1})).toBe(true);
        expect(checker.check({a: 1, b: 2})).toBe(true);
        expect(checker.check({a: 1})).toBe(true);
        expect(checker.check({a: 1})).toBe(false);
    });

    test('check does not mutate the given values object', () => {
        const checker = getStrictModeChecker();
        const values = {a: 1};

        checker.check(values);
        values.a = 2;

        expect(checker.check({a: 1})).toBe(false);
        expect(checker.check(values)).toBe(true);
    });

    test('isStrict returns undefined before the first diff', () => {
        const checker = getStrictModeChecker();

        expect(checker.isStrict()).toBeUndefined();
    });

    test('isStrict returns false after a diff and then resets', () => {
        const checker = getStrictModeChecker();

        checker.check({a: 1});

        expect(checker.isStrict()).toBe(false);
        expect(checker.isStrict()).toBeUndefined();
    });

    test('isStrict stays false after unchanged checks until it is consumed', () => {
        const checker = getStrictModeChecker();

        expect(checker.check({a: 1})).toBe(true);
        expect(checker.check({a: 1})).toBe(false);
        expect(checker.isStrict()).toBe(false);
        expect(checker.isStrict()).toBeUndefined();
    });

    test('isStrict returns undefined when check sees no diff after a reset', () => {
        const checker = getStrictModeChecker();

        checker.check({a: 1});
        expect(checker.isStrict()).toBe(false);

        expect(checker.check({a: 1})).toBe(false);
        expect(checker.isStrict()).toBeUndefined();
    });

    test('a later diff sets isStrict back to false', () => {
        const checker = getStrictModeChecker();

        checker.check({a: 1});
        expect(checker.isStrict()).toBe(false);

        expect(checker.check({a: 2})).toBe(true);
        expect(checker.isStrict()).toBe(false);
    });
});
