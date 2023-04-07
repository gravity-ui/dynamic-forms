import {dynamicViewConfig} from '../../../../kit';
import {isCorrectViewConfig} from '../helpers';

describe('View/helpers', () => {
    test('isCorrectViewConfig', () => {
        expect(isCorrectViewConfig(true)).toBe(false);
        expect(isCorrectViewConfig({})).toBe(false);
        expect(isCorrectViewConfig([])).toBe(false);
        expect(
            isCorrectViewConfig({
                string: {
                    view: {},
                    layouts: {},
                },
            }),
        ).toBe(false);
        expect(isCorrectViewConfig(dynamicViewConfig)).toBe(true);
    });
});
