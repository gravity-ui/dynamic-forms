/**
 * Contract tests for custom data-qa via `viewSpec.qa` (gravity-ui/dynamic-forms#462).
 *
 * Black-box: specs are rendered through `DynamicField` (form mode) and `DynamicView` (overview
 * mode) with the real `dynamicConfig` / `dynamicViewConfig`. Only the rendered `data-qa`
 * attributes (with the tag of the element carrying them) and the form value are observed.
 * One representative case per qa-building mechanism; per-component coverage lives next to the
 * components. Test titles carry the acceptance criteria ids (AC-n) they cover.
 */
import React from 'react';

import {ThemeProvider} from '@gravity-ui/uikit';
import {act, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import noop from 'lodash/noop';
import {Form} from 'react-final-form';

import type {ArraySpec, FormValue, ObjectSpec, Spec, StringSpec} from '../../core';
import {DynamicField, DynamicView, SpecTypes} from '../../core';
import {dynamicConfig, dynamicViewConfig} from '../constants';

const FIELD = 'field';
const CUSTOM = 'custom-qa';
const ITEM_QA = 'tag';

// External collaborator (react-monaco-editor); the library's own Monaco wrappers are real.
const MonacoStub: React.FC = () => <div />;

const withQa = <S extends Spec>(spec: S, qa: string | undefined): S =>
    qa === undefined ? spec : ({...spec, viewSpec: {...spec.viewSpec, qa}} as S);

const withItemQa = (spec: ArraySpec, qa: string | undefined): ArraySpec => ({
    ...spec,
    items: withQa(spec.items as Spec, qa),
});

// All rendered data-qa attributes in DOM order, as `TAG:value`.
const getQa = () =>
    Array.from(document.body.querySelectorAll('[data-qa]')).map(
        (el) => `${el.tagName}:${el.getAttribute('data-qa')}`,
    );

const qaEl = (qa: string) => document.body.querySelector(`[data-qa="${qa}"]`) as HTMLElement;

const str = (viewSpec: Partial<StringSpec['viewSpec']> = {}): StringSpec => ({
    type: SpecTypes.String,
    viewSpec: {type: 'base', layout: 'row', ...viewSpec},
});

const obj = (layout: string, properties: ObjectSpec['properties'] = {name: str()}): ObjectSpec => ({
    type: SpecTypes.Object,
    properties,
    viewSpec: {type: 'base', layout},
});

const arrayOf = (items: Spec): ArraySpec => ({
    type: SpecTypes.Array,
    items,
    viewSpec: {type: 'base', layout: 'row'},
});

const tableArray = (qa?: string): ArraySpec => ({
    type: SpecTypes.Array,
    items: obj('', {name: str({layout: 'table_item'})}),
    viewSpec: {type: 'table', layout: 'row', table: [{label: 'Name', property: 'name'}], qa},
});

const twoObjects = [{name: 'a'}, {name: 'b'}];

const renderForm = (
    spec: Spec,
    value: unknown,
    props: Partial<React.ComponentProps<typeof DynamicField>> = {},
) =>
    render(
        <ThemeProvider>
            <Form initialValues={{[FIELD]: value}} onSubmit={noop}>
                {({values}) => (
                    <React.Fragment>
                        <DynamicField
                            name={FIELD}
                            spec={spec}
                            config={dynamicConfig}
                            Monaco={MonacoStub}
                            withoutInsertFFDebounce
                            {...props}
                        />
                        <output data-testid="form-value">{JSON.stringify(values)}</output>
                    </React.Fragment>
                )}
            </Form>
        </ThemeProvider>,
    );

const renderOverview = (spec: Spec, value: unknown) =>
    render(
        <ThemeProvider>
            <DynamicView
                value={{[FIELD]: value} as FormValue}
                spec={obj('', {[FIELD]: spec})}
                config={dynamicViewConfig}
                Monaco={MonacoStub}
            />
        </ThemeProvider>,
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

// No qa and `qa: ''` keep the Field Name as QA base; a non-empty qa replaces it.
const FIELD_QA: [string, string | undefined, string][] = [
    ['AC-1 no qa', undefined, FIELD],
    ["AC-3 qa ''", '', FIELD],
    ['AC-8/AC-9/AC-14 qa set', CUSTOM, CUSTOM],
];

// `expected(base)`: every data-qa the field renders with QA base `base`. Children keep FIELD.
const FORM_CASES: {title: string; spec: Spec; value: unknown; expected: (b: string) => string[]}[] =
    [
        {title: 'Text', spec: str(), value: 'a', expected: (b) => [`SPAN:${b}`]},
        {
            title: 'NumberWithScale (-scale)',
            spec: str({
                type: 'number_with_scale',
                sizeParams: {
                    defaultType: 'b',
                    scale: {b: {factor: '1', title: 'B'}, kb: {factor: '1024', title: 'KB'}},
                },
            }),
            value: '1',
            expected: (b) => [`SPAN:${b}`, `BUTTON:${b}-scale`],
        },
        {
            title: 'ArrayBase (-add-item)',
            spec: arrayOf(str()),
            value: ['a'],
            expected: (b) => [
                `SPAN:${FIELD}.<0>`,
                `BUTTON:${FIELD}.<0>-remove-item`,
                `BUTTON:${b}-add-item`,
            ],
        },
        {
            title: 'TableArrayInput (-item-remove-<key>, -add-item)',
            spec: tableArray(),
            value: twoObjects,
            expected: (b) => [
                `SPAN:${FIELD}.<0>.name`,
                `BUTTON:${b}-item-remove-0`,
                `SPAN:${FIELD}.<1>.name`,
                `BUTTON:${b}-item-remove-1`,
                `BUTTON:${b}-add-item`,
            ],
        },
        {
            title: 'CardAccordeon layout (-drop-item, -accordeon-toggler)',
            spec: obj('card_accordeon'),
            value: {name: 'a'},
            expected: (b) => [
                `BUTTON:${b}-drop-item`,
                `BUTTON:${b}-accordeon-toggler`,
                `SPAN:${FIELD}.name`,
            ],
        },
        {
            title: 'MonacoInput (-open-dialog)',
            spec: str({type: 'monaco_input'}),
            value: 'code',
            expected: (b) => [`DIV:${b}`, `BUTTON:${b}-open-dialog`],
        },
    ];

describe('Field with viewSpec.qa, form mode', () => {
    test.each(FORM_CASES.flatMap((c) => FIELD_QA.map(([ac, qa, base]) => ({...c, ac, qa, base}))))(
        '$ac: $title',
        ({spec, value, expected, qa, base}) => {
            renderForm(withQa(spec, qa), value);
            expect(getQa()).toEqual(expected(base));
        },
    );

    test.each(FIELD_QA)('%s: MonacoInput dialog (-dialog)', async (_, qa, base) => {
        renderForm(withQa(str({type: 'monaco_input'}), qa), 'code');
        await userEvent.click(qaEl(`${base}-open-dialog`));
        expect(getQa()).toContain(`DIV:${base}-dialog`);
    });

    test('AC-11/AC-12/AC-13 children keep their Field Name or use their own qa verbatim', () => {
        const spec = obj('card_accordeon', {a: withQa(str(), 'a-qa'), b: str()});

        renderForm(withQa(spec, CUSTOM), {a: '1', b: '2'});
        expect(getQa()).toEqual([
            `BUTTON:${CUSTOM}-drop-item`,
            `BUTTON:${CUSTOM}-accordeon-toggler`,
            'SPAN:a-qa',
            `SPAN:${FIELD}.b`,
        ]);
    });

    test('AC-15 qa survives value change and collapse/expand', async () => {
        renderForm(withQa(obj('accordeon'), CUSTOM), {name: 'a'});

        const before = getQa();

        expect(before).toContain(`BUTTON:${CUSTOM}-accordeon-toggler`);
        await userEvent.type(screen.getByRole('textbox'), 'bc');
        await userEvent.click(qaEl(`${CUSTOM}-accordeon-toggler`));
        await userEvent.click(qaEl(`${CUSTOM}-accordeon-toggler`));
        expect(getQa()).toEqual(before);
    });

    test.each([
        ['without qa', undefined],
        ['with qa', CUSTOM],
    ])('AC-6 typed value is stored under the original Field Name (%s)', async (_, qa) => {
        renderForm(withQa(str(), qa), undefined);
        await userEvent.type(screen.getByRole('textbox'), 'abc');
        await act(async () => {});
        expect(JSON.parse(screen.getByTestId('form-value').textContent || '{}')).toEqual({
            [FIELD]: 'abc',
        });
    });

    test.each([
        ['without qa', obj('row')],
        [
            'with qa on the field and its child',
            withQa(obj('row', {name: withQa(str(), 'n')}), CUSTOM),
        ],
    ])('AC-4/AC-5 delegated rendering (withSchemaRenderer) is untouched %s', (_, spec) => {
        renderForm(spec, {name: 'a'}, {withSchemaRenderer: true});
        expect(getQa()).toEqual([`SPAN:${FIELD}.name`]);
    });
});

describe('Array item spec with viewSpec.qa, form mode', () => {
    // Item QA base: `<array>.<key>` by default, `<qa>-<key>` with a non-empty item qa.
    const ITEM_QA_CASES: [string, string | undefined, (key: number) => string][] = [
        ['AC-1 no item qa', undefined, (k) => `${FIELD}.<${k}>`],
        ["AC-3 item qa ''", '', (k) => `${FIELD}.<${k}>`],
        ['AC-16/AC-17 item qa set', ITEM_QA, (k) => `${ITEM_QA}-${k}`],
    ];

    test.each(ITEM_QA_CASES)(
        '%s: Row layout, keys stable across remove/add (AC-18)',
        async (_, qa, item) => {
            const expected = (keys: number[]) => [
                ...keys.flatMap((k) => [`SPAN:${item(k)}`, `BUTTON:${item(k)}-remove-item`]),
                `BUTTON:${FIELD}-add-item`,
            ];

            renderForm(withItemQa(arrayOf(str()), qa), ['a', 'b', 'c']);
            expect(getQa()).toEqual(expected([0, 1, 2]));

            await userEvent.click(qaEl(`${item(1)}-remove-item`));
            await userEvent.click(qaEl(`${FIELD}-add-item`));
            expect(getQa()).toEqual(expected([0, 2, 3]));
            expect(new Set(getQa()).size).toBe(getQa().length);
        },
    );

    test.each([
        ['array without qa', withItemQa(arrayOf(str()), ITEM_QA), ['tag-0', 'tag-1'], FIELD],
        [
            'array with qa',
            withQa(withItemQa(arrayOf(str()), ITEM_QA), 'arr'),
            ['tag-0', 'tag-1'],
            'arr',
        ],
    ])('AC-19 %s, items with qa: array keeps its own QA base', (_, spec, items, arrayBase) => {
        renderForm(spec, ['a', 'b']);
        expect(getQa()).toEqual([
            ...items.flatMap((i) => [`SPAN:${i}`, `BUTTON:${i}-remove-item`]),
            `BUTTON:${arrayBase}-add-item`,
        ]);
    });

    test('AC-19 table array with qa and item qa: no item-level data-qa, cells unaffected', () => {
        renderForm(withItemQa(tableArray('orders'), ITEM_QA), twoObjects);
        expect(getQa()).toEqual([
            `SPAN:${FIELD}.<0>.name`,
            'BUTTON:orders-item-remove-0',
            `SPAN:${FIELD}.<1>.name`,
            'BUTTON:orders-item-remove-1',
            'BUTTON:orders-add-item',
        ]);
    });

    test('AC-12a qa on a descendant of an array item repeats verbatim in every item', () => {
        renderForm(arrayOf(obj('transparent', {name: withQa(str(), 'name-qa')})), twoObjects);
        expect(getQa()).toEqual([
            'SPAN:name-qa',
            `BUTTON:${FIELD}.<0>-remove-item`,
            'SPAN:name-qa',
            `BUTTON:${FIELD}.<1>-remove-item`,
            `BUTTON:${FIELD}-add-item`,
        ]);
    });
});

describe('viewSpec.qa, overview mode', () => {
    test.each([
        ['AC-2 no qa', undefined, FIELD],
        ["AC-3 qa ''", '', FIELD],
        ['AC-10/AC-11 qa set', CUSTOM, CUSTOM],
    ])('%s: ViewCardAccordeon with a Monaco child', (_, qa, base) => {
        renderOverview(withQa(obj('card_accordeon', {code: str({type: 'monaco_input'})}), qa), {
            code: 'x',
        });
        expect(getQa()).toEqual([
            `BUTTON:${base}-accordeon-toggler`,
            `DIV:${FIELD}.code`,
            `BUTTON:${FIELD}.code-open-dialog`,
        ]);
    });

    test.each([
        ['AC-2 no item qa', undefined, `${FIELD}[0]`, `${FIELD}[1]`],
        ['AC-10/AC-16 item qa set', ITEM_QA, `${ITEM_QA}-0`, `${ITEM_QA}-1`],
    ])('%s: array items use their index', (_, qa, first, second) => {
        renderOverview(withItemQa(arrayOf(obj('card_accordeon')), qa), twoObjects);
        expect(getQa()).toEqual([
            `BUTTON:${first}-accordeon-toggler`,
            `BUTTON:${second}-accordeon-toggler`,
        ]);
    });
});

describe('AC-22..AC-25 duplicate forms on one page', () => {
    test.each([
        ['AC-22 same name, different qa', [FIELD, 'first'], [FIELD, 'second'], ['first', 'second']],
        ['AC-23 different names, no qa', ['a', undefined], ['b', undefined], ['a', 'b']],
        ['AC-24 same name, no qa', [FIELD, undefined], [FIELD, undefined], [FIELD, FIELD]],
        ['AC-25 only the first has qa', [FIELD, 'first'], [FIELD, undefined], ['first', FIELD]],
    ] as [string, [string, string?], [string, string?], string[]][])(
        '%s',
        (_, first, second, expected) => {
            render(
                <ThemeProvider>
                    {[first, second].map(([name, qa], idx) => (
                        <Form key={idx} initialValues={{[name]: 'v'}} onSubmit={noop}>
                            {() => (
                                <DynamicField
                                    name={name}
                                    spec={withQa(str(), qa)}
                                    config={dynamicConfig}
                                />
                            )}
                        </Form>
                    ))}
                </ThemeProvider>,
            );
            expect(getQa()).toEqual(expected.map((qa) => `SPAN:${qa}`));
        },
    );
});
