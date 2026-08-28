import {type Spec, SpecTypes} from '../../../../core';
import {type JsonSchemaArray, type JsonSchemaObject, JsonSchemaType, NodeType} from '../../../core';
import {specToJsonSchema} from '../transformer';

describe('specToJsonSchema', () => {
    test('maps a string spec to json schema keywords and node parameters', () => {
        const schema = specToJsonSchema({
            defaultValue: 'Ada',
            type: SpecTypes.String,
            maxLength: BigInt(10),
            minLength: BigInt(2),
            pattern: '^[A-Z]',
            patternError: 'Must start with a capital',
            validator: 'base',
            viewSpec: {
                type: 'base',
                layout: 'row',
                layoutTitle: 'Name',
                layoutDescription: 'First name',
                placeholder: 'Ada',
                disabled: true,
                copy: true,
            },
        });

        expect(schema).toEqual({
            type: JsonSchemaType.String,
            default: 'Ada',
            maxLength: 10,
            minLength: 2,
            pattern: '^[A-Z]',
            title: 'Name',
            description: 'First name',
            nodeParameters: {
                type: NodeType.String,
                entity: 'base',
                layout: 'row',
                entityProps: {disabled: true, placeholder: 'Ada'},
                layoutProps: {copy: true},
                errorMessages: {pattern: 'Must start with a capital'},
            },
        });
    });

    test('does not keep undefined layout flags on layoutProps', () => {
        const schema = specToJsonSchema({
            type: SpecTypes.String,
            viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Name'},
        });

        expect(schema.nodeParameters?.layoutProps).toBeUndefined();
        expect(schema.nodeParameters?.entityProps).toBeUndefined();
    });

    test('recurses into object properties and marks required children on layoutProps', () => {
        const schema = specToJsonSchema({
            type: SpecTypes.Object,
            properties: {
                name: {
                    type: SpecTypes.String,
                    required: true,
                    viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Name'},
                },
                age: {
                    type: SpecTypes.Number,
                    format: 'int64',
                    minimum: 0,
                    viewSpec: {type: 'base', layout: 'column', layoutTitle: 'Age'},
                },
            },
            viewSpec: {
                type: 'base',
                layout: 'section',
                layoutTitle: 'Person',
                order: ['age', 'name'],
            },
        });

        expect(schema.type).toBe(JsonSchemaType.Object);
        expect(schema.nodeParameters).toMatchObject({
            type: NodeType.Object,
            entity: 'base',
            layout: 'section',
            entityProps: {order: ['age', 'name']},
            layoutProps: {variant: 'subheader-2'},
        });
        expect((schema as JsonSchemaObject).properties?.name).toMatchObject({
            type: JsonSchemaType.String,
            title: 'Name',
            nodeParameters: {
                type: NodeType.String,
                entity: 'base',
                layout: 'row',
                layoutProps: {required: true},
            },
        });
        expect((schema as JsonSchemaObject).properties?.age).toMatchObject({
            type: JsonSchemaType.Integer,
            minimum: 0,
            title: 'Age',
            nodeParameters: {type: NodeType.Number, entity: 'base', layout: 'column'},
        });
    });

    test('moves array enum onto items and maps table columns to order', () => {
        const schema = specToJsonSchema({
            type: SpecTypes.Array,
            enum: ['red', 'blue'],
            items: {
                type: SpecTypes.Object,
                properties: {
                    name: {
                        type: SpecTypes.String,
                        viewSpec: {type: 'base', layout: 'table_item', layoutTitle: 'Ignored'},
                    },
                },
                viewSpec: {type: 'base'},
            },
            viewSpec: {
                type: 'table',
                layout: 'accordeon',
                itemLabel: 'Add row',
                table: [{label: 'Title', property: 'name', description: 'Column hint'}],
            },
        });

        expect(schema.type).toBe(JsonSchemaType.Array);
        expect(schema.nodeParameters).toMatchObject({
            entity: 'table',
            layout: 'accordeon',
            entityProps: {addButtonText: 'Add row', order: ['name']},
            layoutProps: {withIndent: true, togglerProps: {view: 'clear'}},
        });
        expect((schema as JsonSchemaArray).items).toMatchObject({
            properties: {
                name: {
                    title: 'Title',
                    description: 'Column hint',
                    nodeParameters: {layout: 'cell'},
                },
            },
        });
        expect((schema as JsonSchemaArray).items).not.toHaveProperty('enum');
    });

    test('maps date_input bag into entityProps and uses NodeType.Any', () => {
        const schema = specToJsonSchema({
            type: SpecTypes.String,
            viewSpec: {
                type: 'date_input',
                layout: 'row',
                layoutTitle: 'Date',
                placeholder: 'Pick a date',
                dateInput: {
                    printFormat: 'DD.MM.YYYY',
                    outputFormat: 'date',
                    timeZone: 'Europe/Moscow',
                },
                inputProps: {hasClear: false, format: 'YYYY-MM-DD'} as any,
            },
        });

        expect(schema.type).toBeUndefined();
        expect(schema.nodeParameters).toEqual({
            type: NodeType.Any,
            entity: 'date',
            layout: 'row',
            entityProps: {
                placeholder: 'Pick a date',
                format: 'YYYY-MM-DD',
                outputFormat: 'date',
                timeZone: 'Europe/Moscow',
                hasClear: false,
            },
        });
    });

    test('maps layout aliases and row_verbose description placement', () => {
        const schema = specToJsonSchema({
            type: SpecTypes.String,
            required: true,
            viewSpec: {type: 'textarea', layout: 'row_verbose', layoutTitle: 'Bio'},
        });

        expect(schema.nodeParameters).toMatchObject({
            entity: 'textarea',
            layout: 'row',
            layoutProps: {descriptionType: 'bottom', required: true},
        });
    });

    test('maps selectParams and enum descriptions into entityProps', () => {
        const schema = specToJsonSchema({
            type: SpecTypes.String,
            enum: ['a', 'b'],
            description: {a: 'Alpha', b: 'Beta'},
            viewSpec: {
                type: 'select',
                layout: 'row',
                selectParams: {filterPlaceholder: 'Search', meta: {a: 'hint'}},
            },
        });

        expect(schema.enum).toEqual(['a', 'b']);
        expect(schema.nodeParameters?.entityProps).toEqual({
            enumDescriptions: {a: 'Alpha', b: 'Beta'},
            filterPlaceholder: 'Search',
            optionsMeta: {a: 'hint'},
        });
    });

    test('maps checkbox_group placement to direction', () => {
        const schema = specToJsonSchema({
            type: SpecTypes.Array,
            enum: ['x', 'y'],
            viewSpec: {
                type: 'checkbox_group',
                checkboxGroupParams: {placement: 'vertical', disabled: {x: true}},
            },
        });

        expect((schema as JsonSchemaArray).items).toMatchObject({enum: ['x', 'y']});
        expect((schema as JsonSchemaArray).items).not.toHaveProperty('type');
        expect(schema.nodeParameters?.entityProps).toEqual({
            direction: 'column',
            optionsDisabled: {x: true},
        });
    });

    test('maps text_content with themeAlert to alert entityProps', () => {
        const schema = specToJsonSchema({
            type: SpecTypes.String,
            viewSpec: {
                type: 'text_content',
                textContentParams: {
                    text: 'Hello',
                    themeAlert: 'info',
                    titleAlert: 'Note',
                    icon: 'CircleExclamationFill',
                },
            },
        });

        expect(schema.nodeParameters).toMatchObject({
            entity: 'alert',
            entityProps: {
                message: 'Hello',
                theme: 'info',
                title: 'Note',
                iconName: 'CircleExclamationFill',
            },
        });
    });

    test('maps number_with_scale sizeParams and stringNumber bounds', () => {
        const schema = specToJsonSchema({
            type: SpecTypes.String,
            minimum: 10,
            maximum: 100,
            format: 'float',
            viewSpec: {
                type: 'number_with_scale',
                sizeParams: {
                    defaultType: 'kb',
                    scale: {kb: {factor: '1024', title: 'KB'}},
                    viewType: 'kb',
                },
            },
        } as Spec);

        expect(schema.nodeParameters).toMatchObject({
            entity: 'string_number_with_scale',
            entityProps: {
                defaultType: 'kb',
                viewType: 'kb',
                scale: {kb: {factor: '1024', title: 'KB'}},
            },
        });
        expect(schema).toMatchObject({
            type: JsonSchemaType.String,
            stringNumber: {
                minimum: '10',
                maximum: '100',
            },
        });
    });

    test('maps oneof to one_of_nested and oneOfParams onto entityProps', () => {
        const schema = specToJsonSchema({
            type: SpecTypes.Object,
            description: {foo: 'Foo option'},
            properties: {
                foo: {type: SpecTypes.String, viewSpec: {type: 'base', layoutTitle: 'Foo'}},
                bar: {type: SpecTypes.String, viewSpec: {type: 'base', layoutTitle: 'Bar'}},
            },
            viewSpec: {
                type: 'oneof',
                oneOfParams: {toggler: 'switch', booleanMap: {true: 'foo', false: 'bar'}},
            },
        });

        expect(schema.nodeParameters).toMatchObject({
            entity: 'one_of_nested',
            layout: 'transparent',
            entityProps: {
                booleanToKey: {true: 'foo', false: 'bar'},
                toggler: {
                    nodeParameters: {entity: 'switch'},
                },
            },
        });
    });

    test('maps range_input_picker to slider for numbers and range_input otherwise', () => {
        const numberSchema = specToJsonSchema({
            type: SpecTypes.Number,
            viewSpec: {type: 'range_input_picker'},
        });
        const objectSchema = specToJsonSchema({
            type: SpecTypes.Object,
            viewSpec: {type: 'range_input_picker'},
        });

        expect(numberSchema.nodeParameters?.entity).toBe('slider');
        expect(objectSchema.nodeParameters?.entity).toBe('range_input');
    });

    test('maps layout aliases onto the new kit layouts and layoutProps', () => {
        const cardSection = specToJsonSchema({
            type: SpecTypes.Object,
            viewSpec: {type: 'base', layout: 'card_section'},
        });
        const cardAccordeon = specToJsonSchema({
            type: SpecTypes.Object,
            viewSpec: {type: 'base', layout: 'card_accordeon'},
        });
        const group = specToJsonSchema({
            type: SpecTypes.Object,
            viewSpec: {type: 'base', layout: 'group'},
        });
        const group2 = specToJsonSchema({
            type: SpecTypes.Object,
            viewSpec: {type: 'base', layout: 'group2'},
        });
        const section2 = specToJsonSchema({
            type: SpecTypes.Object,
            viewSpec: {type: 'base', layout: 'section2'},
        });
        const accordeonCard = specToJsonSchema({
            type: SpecTypes.Object,
            viewSpec: {type: 'base', layout: 'accordeon_card'},
        });

        expect(cardSection.nodeParameters).toMatchObject({
            layout: 'card',
            layoutProps: {likeAccordeon: false},
        });
        expect(cardAccordeon.nodeParameters).toMatchObject({
            layout: 'card',
            layoutProps: {likeAccordeon: true},
        });
        expect(accordeonCard.nodeParameters).toMatchObject({
            layout: 'card',
            layoutProps: {likeAccordeon: true},
        });
        expect(group.nodeParameters).toMatchObject({
            layout: 'section',
            layoutProps: {variant: 'subheader-2', withIndent: true},
        });
        expect(group2.nodeParameters).toMatchObject({
            layout: 'section',
            layoutProps: {withIndent: true},
        });
        expect(section2.nodeParameters).toMatchObject({layout: 'section'});
        expect(section2.nodeParameters?.layoutProps).toBeUndefined();
    });
});
