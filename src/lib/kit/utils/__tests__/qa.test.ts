import {type JsonSchema, JsonSchemaType, NodeType} from '../../../core';
import {getQaBase} from '../qa';

const makeSchema = (qa?: string): JsonSchema => ({
    type: JsonSchemaType.String,
    nodeParameters: qa === undefined ? {type: NodeType.String} : {type: NodeType.String, qa},
});

describe('kit/utils/qa', () => {
    test.each([
        // unset or empty qa: the node name
        ['field', undefined, 'field'],
        ['field', makeSchema(), 'field'],
        ['field', makeSchema(''), 'field'],
        ['arr[0]', makeSchema(''), 'arr[0]'],
        ['field', makeSchema(1 as unknown as string), 'field'],
        // custom qa: verbatim, or with the index for array items
        ['field', makeSchema('x'), 'x'],
        ['obj.field', makeSchema('x'), 'x'],
        ['arr[0]', makeSchema('x'), 'x-0'],
        ['arr[12]', makeSchema('x'), 'x-12'],
        ['arr[0].name', makeSchema('x'), 'x'],
        ['outer[1].inner[2]', makeSchema('x'), 'x-2'],
    ])('getQaBase(%j, %j) -> %j', (name, schema, expected) => {
        expect(getQaBase(name, schema)).toBe(expected);
    });
});
