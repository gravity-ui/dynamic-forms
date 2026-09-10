import {getStrictModeChecker} from '../strict-mode';

describe('getStrictModeChecker', () => {
    test('returns an independent checker instance', () => {
        const first = getStrictModeChecker();
        const second = getStrictModeChecker();

        expect(first).not.toBe(second);
        expect(first.checkDiff({a: 1})).toBe(true);
        expect(second.checkDiff({a: 1})).toBe(true);
        expect(first.checkDiff({a: 1})).toBe(false);
        expect(second.checkDiff({a: 1})).toBe(false);
    });

    test('checkDiff returns true on the first call', () => {
        const checker = getStrictModeChecker();

        expect(checker.checkDiff({})).toBe(true);
        expect(checker.checkDiff({form: {}, name: 'field'})).toBe(true);
    });

    test('checkDiff returns false when values are unchanged', () => {
        const checker = getStrictModeChecker();
        const form = {};
        const values = {form, name: 'field'};

        expect(checker.checkDiff(values)).toBe(true);
        expect(checker.checkDiff(values)).toBe(false);
        expect(checker.checkDiff({form, name: 'field'})).toBe(false);
    });

    test('checkDiff returns true when a value changes by reference', () => {
        const checker = getStrictModeChecker();
        const formA = {};
        const formB = {};

        expect(checker.checkDiff({form: formA})).toBe(true);
        expect(checker.checkDiff({form: formA})).toBe(false);
        expect(checker.checkDiff({form: formB})).toBe(true);
        expect(checker.checkDiff({form: formB})).toBe(false);
    });

    test('checkDiff returns true when a key is added or removed', () => {
        const checker = getStrictModeChecker();

        expect(checker.checkDiff({a: 1})).toBe(true);
        expect(checker.checkDiff({a: 1, b: 2})).toBe(true);
        expect(checker.checkDiff({a: 1})).toBe(true);
        expect(checker.checkDiff({a: 1})).toBe(false);
    });

    test('checkDiff does not mutate the given values object', () => {
        const checker = getStrictModeChecker();
        const values = {a: 1};

        checker.checkDiff(values);
        values.a = 2;

        expect(checker.checkDiff({a: 1})).toBe(false);
        expect(checker.checkDiff(values)).toBe(true);
    });

    test('isStrict returns undefined before the first diff', () => {
        const checker = getStrictModeChecker();

        expect(checker.isStrict()).toBeUndefined();
    });

    test('isStrict returns false after a diff and then resets', () => {
        const checker = getStrictModeChecker();

        checker.checkDiff({a: 1});

        expect(checker.isStrict()).toBe(false);
        expect(checker.isStrict()).toBeUndefined();
    });

    test('isStrict returns true after unchanged checks and then resets', () => {
        const checker = getStrictModeChecker();

        expect(checker.checkDiff({a: 1})).toBe(true);
        expect(checker.checkDiff({a: 1})).toBe(false);
        expect(checker.isStrict()).toBe(true);
        expect(checker.isStrict()).toBeUndefined();
    });

    test('isStrict returns true when checkDiff sees no diff after a reset', () => {
        const checker = getStrictModeChecker();

        checker.checkDiff({a: 1});
        expect(checker.isStrict()).toBe(false);

        expect(checker.checkDiff({a: 1})).toBe(false);
        expect(checker.isStrict()).toBe(true);
        expect(checker.isStrict()).toBeUndefined();
    });

    test('a later diff sets isStrict back to false', () => {
        const checker = getStrictModeChecker();

        checker.checkDiff({a: 1});
        expect(checker.isStrict()).toBe(false);

        expect(checker.checkDiff({a: 2})).toBe(true);
        expect(checker.isStrict()).toBe(false);
    });
});
