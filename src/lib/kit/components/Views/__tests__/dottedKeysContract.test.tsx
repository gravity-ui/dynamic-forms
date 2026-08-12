import React from 'react';

import {ThemeProvider} from '@gravity-ui/uikit';
import {fireEvent, render, screen} from '@testing-library/react';

import {DynamicView} from '../../../../core';
import {SpecTypes} from '../../../../core/constants';
import type {FormValue, ObjectSpec, Spec} from '../../../../core/types';
import {dynamicViewConfig} from '../../../constants/config';

const DOTTED_KEY = 'dotted.key';

interface ViewFixture {
    spec: Spec;
    value: FormValue;
    expectTexts: (string | RegExp)[];
    prepare?: () => void;
}

const baseStringSpec: Spec = {type: SpecTypes.String, viewSpec: {type: 'base', layout: ''}};

const fixtures: Record<string, Record<string, ViewFixture>> = {
    string: {
        base: {
            spec: baseStringSpec,
            value: 'string-base-value',
            expectTexts: ['string-base-value'],
        },
        select: {
            spec: baseStringSpec,
            value: 'string-select-value',
            expectTexts: ['string-select-value'],
        },
        radio_group: {
            spec: baseStringSpec,
            value: 'string-radio-value',
            expectTexts: ['string-radio-value'],
        },
        textarea: {spec: baseStringSpec, value: 'textarea-value', expectTexts: ['textarea-value']},
        date_input: {spec: baseStringSpec, value: '2024-05-10', expectTexts: ['10.05.2024 00:00']},
        color_picker: {spec: baseStringSpec, value: '#ff0000', expectTexts: ['#ff0000']},
        file_input: {
            spec: baseStringSpec,
            value: 'file-input-value',
            expectTexts: ['file-input-value'],
        },
        text_content: {
            spec: {
                type: SpecTypes.String,
                viewSpec: {
                    type: 'base',
                    layout: '',
                    textContentParams: {text: 'text-content-static'},
                },
            },
            value: 'text-content-value',
            expectTexts: ['text-content-static'],
        },
        number_with_scale: {
            spec: {
                type: SpecTypes.String,
                viewSpec: {
                    type: 'base',
                    layout: '',
                    sizeParams: {defaultType: 'b', scale: {b: {factor: '1', title: 'B'}}},
                },
            },
            value: '2048',
            expectTexts: ['2048', 'B'],
        },
        monaco_input: {
            spec: baseStringSpec,
            value: 'monaco-value',
            expectTexts: ['monaco-value'],
            prepare: () => fireEvent.click(screen.getByRole('button')),
        },
    },
    number: {
        base: {
            spec: {type: SpecTypes.Number, viewSpec: {type: 'base', layout: ''}},
            value: 42,
            expectTexts: ['42'],
        },
        range_input_picker: {
            spec: {type: SpecTypes.Number, viewSpec: {type: 'base', layout: ''}},
            value: 42,
            expectTexts: ['42'],
        },
    },
    boolean: {
        base: {
            spec: {type: SpecTypes.Boolean, viewSpec: {type: 'base', layout: ''}},
            value: true,
            expectTexts: ['true'],
        },
        switch: {
            spec: {type: SpecTypes.Boolean, viewSpec: {type: 'base', layout: ''}},
            value: true,
            expectTexts: ['true'],
        },
    },
    array: {
        base: {
            spec: {
                type: SpecTypes.Array,
                items: baseStringSpec,
                viewSpec: {type: 'base', layout: ''},
            },
            value: ['array-item-1', 'array-item-2'],
            expectTexts: ['array-item-1', 'array-item-2'],
        },
        select: {
            spec: {type: SpecTypes.Array, viewSpec: {type: 'base', layout: ''}},
            value: ['select-item-1', 'select-item-2'],
            expectTexts: ['select-item-1', 'select-item-2'],
        },
        checkbox_group: {
            spec: {type: SpecTypes.Array, viewSpec: {type: 'base', layout: ''}},
            value: ['checkbox-item-1', 'checkbox-item-2'],
            expectTexts: [/checkbox-item-1/, /checkbox-item-2/],
        },
        table: {
            spec: {
                type: SpecTypes.Array,
                items: {
                    type: SpecTypes.Object,
                    properties: {col: baseStringSpec},
                    viewSpec: {type: 'base', layout: ''},
                },
                viewSpec: {type: 'base', layout: '', table: [{property: 'col', label: 'Col'}]},
            },
            value: [{col: 'table-cell-1'}, {col: 'table-cell-2'}],
            expectTexts: ['table-cell-1', 'table-cell-2'],
        },
    },
    object: {
        base: {
            spec: {
                type: SpecTypes.Object,
                properties: {inner: baseStringSpec},
                viewSpec: {type: 'base', layout: ''},
            },
            value: {inner: 'object-inner-value'},
            expectTexts: ['object-inner-value'],
        },
        inline: {
            spec: {
                type: SpecTypes.Object,
                properties: {inner: baseStringSpec},
                viewSpec: {type: 'base', layout: ''},
            },
            value: {inner: 'inline-inner-value'},
            expectTexts: ['inline-inner-value'],
        },
        oneof: {
            spec: {
                type: SpecTypes.Object,
                properties: {branch: baseStringSpec},
                viewSpec: {type: 'base', layout: ''},
            },
            value: {branch: 'oneof-branch-value'},
            expectTexts: ['oneof-branch-value'],
        },
        oneof_flat: {
            spec: {
                type: SpecTypes.Object,
                properties: {branch: baseStringSpec},
                viewSpec: {type: 'base', layout: ''},
            },
            value: {branch: 'oneof-flat-value'},
            expectTexts: ['oneof-flat-value'],
        },
        card_oneof: {
            spec: {
                type: SpecTypes.Object,
                properties: {branch: baseStringSpec},
                viewSpec: {type: 'base', layout: ''},
            },
            value: {branch: 'card-oneof-value'},
            expectTexts: ['card-oneof-value'],
        },
        multi_oneof: {
            spec: {
                type: SpecTypes.Object,
                properties: {opt: baseStringSpec},
                viewSpec: {type: 'base', layout: ''},
            },
            value: {opt: 'multi-oneof-value'},
            expectTexts: ['multi-oneof-value'],
        },
        multi_oneof_flat: {
            spec: {
                type: SpecTypes.Object,
                properties: {opt: baseStringSpec},
                viewSpec: {type: 'base', layout: ''},
            },
            value: {opt: 'multi-oneof-flat-value'},
            expectTexts: ['multi-oneof-flat-value'],
        },
        object_value: {
            spec: {
                type: SpecTypes.Object,
                properties: {value: baseStringSpec},
                viewSpec: {type: 'base', layout: ''},
            },
            value: {value: 'object-value-inner'},
            expectTexts: ['object-value-inner'],
        },
        text_link: {
            spec: {
                type: SpecTypes.Object,
                properties: {text: baseStringSpec},
                viewSpec: {type: 'base', layout: ''},
            },
            value: {text: 'text-link-value', link: 'https://example.com'},
            expectTexts: ['text-link-value'],
        },
        time_range_selector: {
            spec: {
                type: SpecTypes.Object,
                properties: {start: baseStringSpec, end: baseStringSpec},
                viewSpec: {type: 'base', layout: ''},
            },
            value: {start: '10:15', end: '11:45'},
            expectTexts: ['10:15', '11:45'],
        },
        range_input_picker: {
            spec: {type: SpecTypes.Object, viewSpec: {type: 'base', layout: ''}},
            value: {from: 11, to: 55},
            expectTexts: [/11/, /55/],
        },
    },
};

const FakeMonaco: React.FC<{value?: string}> = ({value}) => <div>{value}</div>;

describe('Views/dotted keys contract', () => {
    (['array', 'boolean', 'number', 'object', 'string'] as const).forEach((specType) => {
        const views = dynamicViewConfig[specType].views as Record<string, unknown>;

        describe(specType, () => {
            test.each(Object.keys(views))('%s', (viewType) => {
                if (!views[viewType]) {
                    expect(fixtures[specType][viewType]).toBeUndefined();
                    return;
                }

                const fixture = fixtures[specType][viewType];

                expect(fixture).toBeDefined();

                const spec = {
                    ...fixture.spec,
                    viewSpec: {...fixture.spec.viewSpec, type: viewType},
                } as Spec;

                render(
                    <ThemeProvider theme="light">
                        <DynamicView
                            value={{[DOTTED_KEY]: fixture.value}}
                            spec={
                                {
                                    type: SpecTypes.Object,
                                    properties: {[DOTTED_KEY]: spec},
                                    viewSpec: {type: 'base', layout: ''},
                                } as ObjectSpec
                            }
                            config={dynamicViewConfig}
                            Monaco={FakeMonaco as never}
                        />
                    </ThemeProvider>,
                );

                fixture.prepare?.();

                fixture.expectTexts.forEach((text) => {
                    expect(screen.getAllByText(text).length).toBeGreaterThan(0);
                });
            });
        });
    });
});
