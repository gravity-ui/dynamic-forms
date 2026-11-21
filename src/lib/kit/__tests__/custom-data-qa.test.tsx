// `nodeParameters.qa` (#462): one representative case per qa-building mechanism,
// rendered through the real SchemaRenderer.
import React from 'react';

import {ThemeProvider} from '@gravity-ui/uikit';
import {act, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import noop from 'lodash/noop';
import {Form} from 'react-final-form';

import {
    type JsonSchema,
    JsonSchemaType,
    NodeType,
    SchemaRenderer,
    SchemaRendererMode,
} from '../../core';
import {config, errorMessages} from '../constants';

const str = (qa?: string, layout = 'row'): JsonSchema => ({
    type: JsonSchemaType.String,
    nodeParameters: {type: NodeType.String, entity: 'base', layout, qa},
});

const arr = (items: JsonSchema, qa?: string, entity = 'base'): JsonSchema => ({
    type: JsonSchemaType.Array,
    items,
    nodeParameters: {type: NodeType.Array, entity, layout: 'row', qa},
});

const table = (qa?: string, itemQa?: string, cellQa?: string) =>
    arr(
        {
            type: JsonSchemaType.Object,
            properties: {n: str(cellQa, 'cell')},
            nodeParameters: {type: NodeType.Object, entity: 'base', qa: itemQa},
        },
        qa,
        'table',
    );

const renderSchema = (
    properties: Record<string, JsonSchema>,
    initialValues: Record<string, unknown>,
    mode = SchemaRendererMode.Form,
) => {
    const schema: JsonSchema = {
        type: JsonSchemaType.Object,
        properties,
        nodeParameters: {type: NodeType.Object, entity: 'base'},
    };

    return render(
        <ThemeProvider>
            <Form initialValues={initialValues} onSubmit={noop}>
                {({values}) => (
                    <React.Fragment>
                        <SchemaRenderer
                            name=""
                            schema={schema}
                            mode={mode}
                            config={config}
                            errorMessages={errorMessages}
                            validateOnBlur={false}
                        />
                        <output data-testid="form-value">{JSON.stringify(values)}</output>
                    </React.Fragment>
                )}
            </Form>
        </ThemeProvider>,
    );
};

// All rendered data-qa attributes in DOM order, as `TAG:value`.
const getQa = () =>
    Array.from(document.body.querySelectorAll('[data-qa]')).map(
        (el) => `${el.tagName}:${el.getAttribute('data-qa')}`,
    );

beforeAll(() => {
    // jsdom lacks these browser APIs; uikit components need them.
    window.matchMedia = (() => ({
        matches: false,
        addListener: noop,
        removeListener: noop,
        addEventListener: noop,
        removeEventListener: noop,
    })) as unknown as typeof window.matchMedia;
    class ObserverStub {
        observe = noop;
        unobserve = noop;
        disconnect = noop;
        takeRecords = () => [];
    }
    window.IntersectionObserver = ObserverStub as unknown as typeof IntersectionObserver;
    window.ResizeObserver = ObserverStub as unknown as typeof ResizeObserver;
});

describe.each([
    [SchemaRendererMode.Form, 'SPAN'],
    [SchemaRendererMode.Overview, 'DIV'],
])('%s mode', (mode, tag) => {
    test.each([
        ['no qa', undefined, 'field'],
        ["qa ''", '', 'field'],
        ['qa set', 'custom', 'custom'],
    ])('field, %s', (_, qa, expected) => {
        renderSchema({field: str(qa)}, {field: 'a'}, mode);

        expect(getQa()).toEqual([`${tag}:${expected}`]);
    });
});

describe('form mode', () => {
    test.each([
        [
            'no qa',
            arr(str()),
            ['arr[0]', 'arr[0]-remove-button', 'arr[1]', 'arr[1]-remove-button', 'arr-add-button'],
        ],
        [
            'array and item qa',
            arr(str('tag'), 'tags'),
            ['tag-0', 'tag-0-remove-button', 'tag-1', 'tag-1-remove-button', 'tags-add-button'],
        ],
    ])('array items, %s', (_, schema, expected) => {
        renderSchema({arr: schema}, {arr: ['x', 'y']});

        expect(getQa().map((qa) => qa.split(':')[1])).toEqual(expected);
    });

    test.each([
        ['no qa', table(), ['tbl[0].n', 'tbl[0]-remove-button', 'tbl-add-button']],
        [
            'table, row and cell qa',
            table('t', 'row', 'cell'),
            ['cell', 'row-0-remove-button', 't-add-button'],
        ],
    ])('table array, %s', (_, schema, expected) => {
        renderSchema({tbl: schema}, {tbl: [{n: '1'}]});

        expect(getQa().map((qa) => qa.split(':')[1])).toEqual(expected);
    });

    test('typed value is stored under the original name', async () => {
        renderSchema({field: str('custom')}, {});

        const input = document.querySelector('[data-qa="custom"] input') as HTMLInputElement;
        await act(() => userEvent.type(input, 'ok'));

        expect(screen.getByTestId('form-value').textContent).toBe('{"field":"ok"}');
    });
});

describe('overview mode', () => {
    test.each([
        ['row, one value uses the array qa', 'row', 'p', ['whole']],
        ['column, no item qa', 'column', undefined, ['prim[0]', 'prim[1]']],
        ['column, item qa', 'column', 'p', ['p-0', 'p-1']],
    ])('primitive array, %s', (_, direction, itemQa, expected) => {
        const schema = arr(
            {type: JsonSchemaType.String, nodeParameters: {qa: itemQa}},
            'whole',
            'select',
        );
        schema.nodeParameters = {...schema.nodeParameters, entityProps: {direction}};
        renderSchema({prim: schema}, {prim: ['q', 'w']}, SchemaRendererMode.Overview);

        expect(getQa().map((qa) => qa.split(':')[1])).toEqual(expected);
    });
});
