import {SpecTypes} from '../../../../constants';
import {StringSpec} from '../../../../types';
import {getDefaultSearchFunction, getParentName} from '../search';

const spec: StringSpec = {type: SpecTypes.String, viewSpec: {type: '', layoutTitle: 'user'}};

describe('Form/utils/search', () => {
    test('getParentName', () => {
        expect(getParentName('name')).toBe(undefined);
        expect(getParentName('name.key')).toBe('name');
        expect(getParentName('name.key.<1>')).toBe('name.key');
    });

    test('getDefaultSearchFunction', () => {
        const searchFunction = getDefaultSearchFunction();

        expect(searchFunction(spec)).toBe(true);

        const searchFunction1 = getDefaultSearchFunction('us');

        expect(searchFunction1(spec)).toBe(true);

        const searchFunction2 = getDefaultSearchFunction('username');

        expect(searchFunction2(spec)).toBe(false);
    });
});
