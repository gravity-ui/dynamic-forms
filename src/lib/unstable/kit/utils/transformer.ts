import get from 'lodash/get';
import isObject from 'lodash/isObject';
import set from 'lodash/set';

import {type Spec, SpecTypes} from '../../../core';
import {type ErrorMessages, type JsonSchema, JsonSchemaType, NodeType} from '../../core';

type Rules = Record<
    string,
    (
        spec: Spec,
        mutableSchema: JsonSchema,
        rules: {specRules: Rules; viewSpecRules: Rules},
        errorMessages: ErrorMessages,
    ) => void
>;

const viewSpecRules: Rules = {
    disabled: (spec, mutableSchema) => {
        if (spec.viewSpec.disabled) {
            set(mutableSchema, 'nodeParameters.flags.disabled', true);
        }
    },
    layout: (spec, mutableSchema) => {
        const layout = spec.viewSpec.layout;

        if (!layout) {
            return;
        }

        if (layout === 'row_verbose') {
            set(mutableSchema, 'nodeParameters.layout', 'row');
            set(mutableSchema, 'nodeParameters.layoutProps.descriptionType', 'bottom');
        } else if (layout === 'accordeon') {
            set(mutableSchema, 'nodeParameters.layout', 'accordeon');
            set(mutableSchema, 'nodeParameters.layoutProps.togglerProps.view', 'clear');
            set(mutableSchema, 'nodeParameters.layoutProps.withIndent', true);
        } else if (layout === 'section') {
            set(mutableSchema, 'nodeParameters.layout', 'section');
            set(mutableSchema, 'nodeParameters.layoutProps.variant', 'subheader-2');
        } else if (layout === 'section2') {
            set(mutableSchema, 'nodeParameters.layout', 'section');
        } else if (layout === 'group') {
            set(mutableSchema, 'nodeParameters.layout', 'section');
            set(mutableSchema, 'nodeParameters.layoutProps.variant', 'subheader-2');
            set(mutableSchema, 'nodeParameters.layoutProps.withIndent', true);
        } else if (layout === 'group2') {
            set(mutableSchema, 'nodeParameters.layout', 'section');
            set(mutableSchema, 'nodeParameters.layoutProps.withIndent', true);
        } else if (layout === 'table_item') {
            set(mutableSchema, 'nodeParameters.layout', 'cell');
        } else if (layout === 'card_accordeon' || layout === 'accordeon_card') {
            set(mutableSchema, 'nodeParameters.layout', 'card');
            set(mutableSchema, 'nodeParameters.layoutProps.likeAccordeon', true);
        } else if (layout === 'card_section') {
            set(mutableSchema, 'nodeParameters.layout', 'card');
            set(mutableSchema, 'nodeParameters.layoutProps.likeAccordeon', false);
        } else {
            set(mutableSchema, 'nodeParameters.layout', layout);
        }
    },
    layoutTitle: (spec, mutableSchema) => {
        if (spec.viewSpec.layoutTitle) {
            set(mutableSchema, 'title', spec.viewSpec.layoutTitle);
        }
    },
    layoutDescription: (spec, mutableSchema) => {
        if (spec.viewSpec.layoutDescription) {
            set(mutableSchema, 'description', spec.viewSpec.layoutDescription);
        }
    },
    layoutOpen: (spec, mutableSchema) => {
        if (spec.viewSpec.layoutOpen !== undefined) {
            set(mutableSchema, 'nodeParameters.flags.open', spec.viewSpec.layoutOpen);
        }
    },
    itemLabel: (spec, mutableSchema) => {
        if ('itemLabel' in spec.viewSpec && spec.viewSpec.itemLabel) {
            set(mutableSchema, 'nodeParameters.entityProps.addButtonText', spec.viewSpec.itemLabel);
        }
    },
    itemPrefix: (spec, mutableSchema) => {
        if ('itemPrefix' in spec.viewSpec && spec.viewSpec.itemPrefix) {
            set(mutableSchema, 'nodeParameters.entityProps.itemPrefix', spec.viewSpec.itemPrefix);
        }
    },
    table: (spec, mutableSchema) => {
        if (
            spec.type === SpecTypes.Array &&
            spec.viewSpec.table &&
            spec.items?.type === SpecTypes.Object
        ) {
            const order: string[] = [];

            spec.viewSpec.table.forEach(({description, label, property}) => {
                order.push(property);

                if (label) {
                    set(mutableSchema, ['items', 'properties', property, 'title'], label);
                }

                if (description) {
                    set(
                        mutableSchema,
                        ['items', 'properties', property, 'description'],
                        description,
                    );
                }
            });

            set(mutableSchema, 'nodeParameters.entityProps.order', order);
        }
    },
    link: (spec, mutableSchema) => {
        if (spec.viewSpec.link) {
            set(mutableSchema, 'nodeParameters.entityProps.link', spec.viewSpec.link);
        }
    },
    placeholder: (spec, mutableSchema) => {
        if ('placeholder' in spec.viewSpec && spec.viewSpec.placeholder) {
            if (spec.type === SpecTypes.String) {
                set(mutableSchema, 'examples', [spec.viewSpec.placeholder]);
            } else if (spec.type === SpecTypes.Array) {
                set(mutableSchema, 'examples', [[spec.viewSpec.placeholder]]);
            }
        }
    },
    addButtonPosition: (spec, mutableSchema) => {
        if ('addButtonPosition' in spec.viewSpec && spec.viewSpec.addButtonPosition) {
            set(
                mutableSchema,
                'nodeParameters.entityProps.addButtonPosition',
                spec.viewSpec.addButtonPosition,
            );
        }
    },
    hidden: (spec, mutableSchema) => {
        if (spec.viewSpec.hidden) {
            set(mutableSchema, 'nodeParameters.flags.hidden', true);
        }
    },
    selectParams: (spec, mutableSchema) => {
        if ('selectParams' in spec.viewSpec && spec.viewSpec.selectParams) {
            if (spec.viewSpec.selectParams.filterPlaceholder) {
                set(
                    mutableSchema,
                    'nodeParameters.entityProps.filterPlaceholder',
                    spec.viewSpec.selectParams.filterPlaceholder,
                );
            }

            if (spec.viewSpec.selectParams.meta) {
                set(
                    mutableSchema,
                    'nodeParameters.entityProps.optionsMeta',
                    spec.viewSpec.selectParams.meta,
                );
            }
        }
    },
    checkboxGroupParams: (spec, mutableSchema) => {
        if (spec.type === SpecTypes.Array && spec.viewSpec.checkboxGroupParams) {
            if (spec.viewSpec.checkboxGroupParams.placement) {
                set(
                    mutableSchema,
                    'nodeParameters.entityProps.direction',
                    spec.viewSpec.checkboxGroupParams.placement === 'vertical' ? 'column' : 'row',
                );
            }

            if (spec.viewSpec.checkboxGroupParams.disabled) {
                set(
                    mutableSchema,
                    'nodeParameters.entityProps.optionsDisabled',
                    spec.viewSpec.checkboxGroupParams.disabled,
                );
            }
        }
    },
    viewColor: (spec, mutableSchema) => {
        if (spec.type === SpecTypes.Boolean && spec.viewSpec.viewColor) {
            set(
                mutableSchema,
                'nodeParameters.overviewEntityProps.viewColor',
                spec.viewSpec.viewColor,
            );
        }
    },
    copy: (spec, mutableSchema) => {
        if ('copy' in spec.viewSpec && spec.viewSpec.copy) {
            set(mutableSchema, 'nodeParameters.flags.copy', true);
        }
    },
    order: (spec, mutableSchema) => {
        if (spec.type === SpecTypes.Object && spec.viewSpec.order) {
            set(mutableSchema, 'nodeParameters.entityProps.order', spec.viewSpec.order);
        }
    },
    delimiter: (spec, mutableSchema) => {
        if (spec.type === SpecTypes.Object && spec.viewSpec.delimiter) {
            set(mutableSchema, 'nodeParameters.entityProps.delimiter', spec.viewSpec.delimiter);
        }
    },
    sizeParams: (spec, mutableSchema) => {
        if (spec.type === SpecTypes.String && spec.viewSpec.sizeParams) {
            if (spec.viewSpec.sizeParams.defaultType) {
                set(
                    mutableSchema,
                    'nodeParameters.entityProps.defaultType',
                    spec.viewSpec.sizeParams.defaultType,
                );
            }

            if (spec.viewSpec.sizeParams.scale) {
                set(
                    mutableSchema,
                    'nodeParameters.entityProps.scale',
                    spec.viewSpec.sizeParams.scale,
                );
            }

            if (spec.viewSpec.sizeParams.viewType) {
                set(
                    mutableSchema,
                    'nodeParameters.entityProps.viewType',
                    spec.viewSpec.sizeParams.viewType,
                );
            }
        }
    },
    monacoParams: (spec, mutableSchema) => {
        if (spec.type === SpecTypes.String && spec.viewSpec.monacoParams) {
            if (spec.viewSpec.monacoParams.language) {
                set(
                    mutableSchema,
                    'nodeParameters.entityProps.language',
                    spec.viewSpec.monacoParams.language,
                );
            }

            if (spec.viewSpec.monacoParams.fontSize) {
                set(
                    mutableSchema,
                    'nodeParameters.entityProps.options.fontSize',
                    spec.viewSpec.monacoParams.fontSize,
                );
            }
        }
    },
    hideValues: (spec, mutableSchema) => {
        if (spec.type === SpecTypes.String && spec.viewSpec.hideValues) {
            set(mutableSchema, 'nodeParameters.entityProps.hideValues', spec.viewSpec.hideValues);
        }
    },
    textContentParams: (spec, mutableSchema) => {
        if (spec.type !== SpecTypes.String || !spec.viewSpec.textContentParams) {
            return;
        }

        const textContentParams = spec.viewSpec.textContentParams;

        if (textContentParams.themeAlert) {
            set(mutableSchema, 'nodeParameters.entityProps.theme', textContentParams.themeAlert);

            if (textContentParams.text) {
                set(mutableSchema, 'nodeParameters.entityProps.message', textContentParams.text);
            }

            if (textContentParams.titleAlert) {
                set(
                    mutableSchema,
                    'nodeParameters.entityProps.title',
                    textContentParams.titleAlert,
                );
            }

            if (textContentParams.viewAlert) {
                set(mutableSchema, 'nodeParameters.entityProps.view', textContentParams.viewAlert);
            }
        } else if (textContentParams.themeLabel) {
            set(mutableSchema, 'nodeParameters.entityProps.theme', textContentParams.themeLabel);

            if (textContentParams.text) {
                set(mutableSchema, 'nodeParameters.entityProps.title', textContentParams.text);
            }
        } else if (textContentParams.text) {
            set(mutableSchema, 'nodeParameters.entityProps.title', textContentParams.text);
        }

        if (textContentParams.icon) {
            set(mutableSchema, 'nodeParameters.entityProps.iconName', textContentParams.icon);
        }

        if (textContentParams.iconColor) {
            set(
                mutableSchema,
                'nodeParameters.entityProps.iconProps.color',
                textContentParams.iconColor,
            );
        }
    },
    fileInput: (spec, mutableSchema) => {
        if (spec.type === SpecTypes.String && spec.viewSpec.fileInput) {
            if (spec.viewSpec.fileInput.accept) {
                set(mutableSchema, 'nodeParameters.entityProps.accept', [
                    spec.viewSpec.fileInput.accept,
                ]);
            }

            if (spec.viewSpec.fileInput.readAsMethod) {
                set(
                    mutableSchema,
                    'nodeParameters.entityProps.readAsMethod',
                    spec.viewSpec.fileInput.readAsMethod,
                );
            }
        }
    },
    dateInput: (spec, mutableSchema) => {
        if (spec.type === SpecTypes.String && spec.viewSpec.dateInput) {
            if (spec.viewSpec.dateInput.outputFormat) {
                set(
                    mutableSchema,
                    'nodeParameters.entityProps.outputFormat',
                    spec.viewSpec.dateInput.outputFormat,
                );
            }

            if (spec.viewSpec.dateInput.printFormat) {
                set(
                    mutableSchema,
                    'nodeParameters.entityProps.format',
                    spec.viewSpec.dateInput.printFormat,
                );
            }

            if (spec.viewSpec.dateInput.timeZone) {
                set(
                    mutableSchema,
                    'nodeParameters.entityProps.timeZone',
                    spec.viewSpec.dateInput.timeZone,
                );
            }
        }
    },
    radioGroupParams: (spec, mutableSchema) => {
        if (spec.type === SpecTypes.String && spec.viewSpec.radioGroupParams) {
            if (spec.viewSpec.radioGroupParams.direction) {
                set(
                    mutableSchema,
                    'nodeParameters.entityProps.direction',
                    spec.viewSpec.radioGroupParams.direction,
                );
            }

            if (spec.viewSpec.radioGroupParams.disabled) {
                set(
                    mutableSchema,
                    'nodeParameters.entityProps.optionsDisabled',
                    spec.viewSpec.radioGroupParams.disabled,
                );
            }
        }
    },
    generateRandomValueButton: (spec, mutableSchema) => {
        if (spec.type === SpecTypes.String && spec.viewSpec.generateRandomValueButton) {
            set(mutableSchema, 'nodeParameters.entityProps.generateRandomValueButton', true);
        }
    },
    inputProps: (spec, mutableSchema) => {
        if (spec.viewSpec.inputProps) {
            Object.entries(spec.viewSpec.inputProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.entityProps.${key}`, value);
            });
        }
    },
    layoutProps: (spec, mutableSchema) => {
        if (spec.viewSpec.layoutProps) {
            Object.entries(spec.viewSpec.layoutProps).forEach(([key, value]) => {
                set(mutableSchema, `nodeParameters.layoutProps.${key}`, value);
            });
        }
    },
    // eslint-disable-next-line complexity -- old viewSpec.type mapping, isolated per viewType
    type: (spec, mutableSchema) => {
        if (spec.viewSpec.type === 'oneof') {
            set(mutableSchema, 'nodeParameters.entity', 'one_of_nested');

            if (spec.type === SpecTypes.Object) {
                const {toggler, booleanMap} = spec.viewSpec.oneOfParams || {};

                set(mutableSchema, 'nodeParameters.entityProps.withIndent', true);
                set(mutableSchema, 'nodeParameters.layout', 'transparent');

                Object.keys(spec.properties || {}).forEach((key) => {
                    if (!get(mutableSchema, ['properties', key, 'nodeParameters', 'layout'])) {
                        set(
                            mutableSchema,
                            ['properties', key, 'nodeParameters', 'layout'],
                            'transparent',
                        );
                    }
                });

                set(
                    mutableSchema,
                    'nodeParameters.entityProps.toggler.nodeParameters.layout',
                    'row',
                );

                if (spec.viewSpec.layoutTitle) {
                    set(
                        mutableSchema,
                        'nodeParameters.entityProps.toggler.title',
                        spec.viewSpec.layoutTitle,
                    );
                }

                if (spec.viewSpec.layoutDescription) {
                    set(
                        mutableSchema,
                        'nodeParameters.entityProps.toggler.description',
                        spec.viewSpec.layoutDescription,
                    );
                }

                if (spec.viewSpec.placeholder) {
                    set(
                        mutableSchema,
                        'nodeParameters.entityProps.toggler.nodeParameters.entityProps.placeholder',
                        spec.viewSpec.placeholder,
                    );
                }

                if (spec.description && Object.keys(spec.description).length) {
                    set(
                        mutableSchema,
                        'nodeParameters.entityProps.toggler.nodeParameters.entityProps.enumDescriptions',
                        spec.description,
                    );
                } else if (spec.properties) {
                    set(
                        mutableSchema,
                        'nodeParameters.entityProps.toggler.nodeParameters.entityProps.enumDescriptions',
                        Object.fromEntries(
                            Object.entries(spec.properties).map(([key, childSpec]) => [
                                key,
                                childSpec.viewSpec.layoutTitle || key,
                            ]),
                        ),
                    );
                }

                if (booleanMap) {
                    set(mutableSchema, 'nodeParameters.entityProps.booleanToKey', booleanMap);
                }

                if (toggler === 'checkbox' || toggler === 'switch') {
                    set(
                        mutableSchema,
                        'nodeParameters.entityProps.toggler.type',
                        JsonSchemaType.Boolean,
                    );
                    set(
                        mutableSchema,
                        'nodeParameters.entityProps.toggler.nodeParameters.type',
                        NodeType.Boolean,
                    );
                    set(
                        mutableSchema,
                        'nodeParameters.entityProps.toggler.nodeParameters.entity',
                        toggler === 'switch' ? 'switch' : 'base',
                    );
                } else {
                    set(
                        mutableSchema,
                        'nodeParameters.entityProps.toggler.type',
                        JsonSchemaType.String,
                    );
                    set(
                        mutableSchema,
                        'nodeParameters.entityProps.toggler.nodeParameters.type',
                        NodeType.String,
                    );
                    set(
                        mutableSchema,
                        'nodeParameters.entityProps.toggler.nodeParameters.entity',
                        toggler === 'radio' ? 'radio_group' : 'segmented_radio_group',
                    );
                    set(
                        mutableSchema,
                        'nodeParameters.entityProps.toggler.enum',
                        spec.viewSpec.order || Object.keys(spec.properties || {}),
                    );
                }
            }
        } else if (spec.viewSpec.type === 'oneof_flat') {
            set(mutableSchema, 'nodeParameters.entity', 'one_of_nested');

            if (spec.type === SpecTypes.Object) {
                const {toggler, booleanMap} = spec.viewSpec.oneOfParams || {};

                set(mutableSchema, 'nodeParameters.layout', 'transparent');
                Object.keys(spec.properties || {}).forEach((key) => {
                    if (!get(mutableSchema, ['properties', key, 'nodeParameters', 'layout'])) {
                        set(
                            mutableSchema,
                            ['properties', key, 'nodeParameters', 'layout'],
                            'transparent',
                        );
                    }
                });

                set(
                    mutableSchema,
                    'nodeParameters.entityProps.toggler.nodeParameters.layout',
                    'row',
                );

                if (spec.viewSpec.layoutTitle) {
                    set(
                        mutableSchema,
                        'nodeParameters.entityProps.toggler.title',
                        spec.viewSpec.layoutTitle,
                    );
                }

                if (spec.viewSpec.layoutDescription) {
                    set(
                        mutableSchema,
                        'nodeParameters.entityProps.toggler.description',
                        spec.viewSpec.layoutDescription,
                    );
                }

                if (spec.viewSpec.placeholder) {
                    set(
                        mutableSchema,
                        'nodeParameters.entityProps.toggler.nodeParameters.entityProps.placeholder',
                        spec.viewSpec.placeholder,
                    );
                }

                if (spec.description && Object.keys(spec.description).length) {
                    set(
                        mutableSchema,
                        'nodeParameters.entityProps.toggler.nodeParameters.entityProps.enumDescriptions',
                        spec.description,
                    );
                } else if (spec.properties) {
                    set(
                        mutableSchema,
                        'nodeParameters.entityProps.toggler.nodeParameters.entityProps.enumDescriptions',
                        Object.fromEntries(
                            Object.entries(spec.properties).map(([key, childSpec]) => [
                                key,
                                childSpec.viewSpec.layoutTitle || key,
                            ]),
                        ),
                    );
                }

                if (booleanMap) {
                    set(mutableSchema, 'nodeParameters.entityProps.booleanToKey', booleanMap);
                }

                if (toggler === 'checkbox' || toggler === 'switch') {
                    set(
                        mutableSchema,
                        'nodeParameters.entityProps.toggler.type',
                        JsonSchemaType.Boolean,
                    );
                    set(
                        mutableSchema,
                        'nodeParameters.entityProps.toggler.nodeParameters.type',
                        NodeType.Boolean,
                    );
                    set(
                        mutableSchema,
                        'nodeParameters.entityProps.toggler.nodeParameters.entity',
                        toggler === 'switch' ? 'switch' : 'base',
                    );
                } else {
                    set(
                        mutableSchema,
                        'nodeParameters.entityProps.toggler.type',
                        JsonSchemaType.String,
                    );
                    set(
                        mutableSchema,
                        'nodeParameters.entityProps.toggler.nodeParameters.type',
                        NodeType.String,
                    );
                    set(
                        mutableSchema,
                        'nodeParameters.entityProps.toggler.nodeParameters.entity',
                        toggler === 'radio' ? 'radio_group' : 'segmented_radio_group',
                    );
                    set(
                        mutableSchema,
                        'nodeParameters.entityProps.toggler.enum',
                        spec.viewSpec.order || Object.keys(spec.properties || {}),
                    );
                }
            }
        } else if (spec.viewSpec.type === 'card_oneof') {
            set(mutableSchema, 'nodeParameters.entity', 'one_of_nested');

            if (spec.type === SpecTypes.Object) {
                const {toggler, booleanMap} = spec.viewSpec.oneOfParams || {};

                set(mutableSchema, 'nodeParameters.layout', 'card');
                Object.keys(spec.properties || {}).forEach((key) => {
                    if (!get(mutableSchema, ['properties', key, 'nodeParameters', 'layout'])) {
                        set(
                            mutableSchema,
                            ['properties', key, 'nodeParameters', 'layout'],
                            'transparent',
                        );
                    }
                });

                set(
                    mutableSchema,
                    'nodeParameters.entityProps.toggler.nodeParameters.layout',
                    'row',
                );

                if (spec.viewSpec.layoutTitle) {
                    set(
                        mutableSchema,
                        'nodeParameters.entityProps.toggler.title',
                        spec.viewSpec.layoutTitle,
                    );
                }

                if (spec.viewSpec.layoutDescription) {
                    set(
                        mutableSchema,
                        'nodeParameters.entityProps.toggler.description',
                        spec.viewSpec.layoutDescription,
                    );
                }

                if (spec.viewSpec.placeholder) {
                    set(
                        mutableSchema,
                        'nodeParameters.entityProps.toggler.nodeParameters.entityProps.placeholder',
                        spec.viewSpec.placeholder,
                    );
                }

                if (spec.description && Object.keys(spec.description).length) {
                    set(
                        mutableSchema,
                        'nodeParameters.entityProps.toggler.nodeParameters.entityProps.enumDescriptions',
                        spec.description,
                    );
                } else if (spec.properties) {
                    set(
                        mutableSchema,
                        'nodeParameters.entityProps.toggler.nodeParameters.entityProps.enumDescriptions',
                        Object.fromEntries(
                            Object.entries(spec.properties).map(([key, childSpec]) => [
                                key,
                                childSpec.viewSpec.layoutTitle || key,
                            ]),
                        ),
                    );
                }

                if (booleanMap) {
                    set(mutableSchema, 'nodeParameters.entityProps.booleanToKey', booleanMap);
                }

                if (toggler === 'checkbox' || toggler === 'switch') {
                    set(
                        mutableSchema,
                        'nodeParameters.entityProps.toggler.type',
                        JsonSchemaType.Boolean,
                    );
                    set(
                        mutableSchema,
                        'nodeParameters.entityProps.toggler.nodeParameters.type',
                        NodeType.Boolean,
                    );
                    set(
                        mutableSchema,
                        'nodeParameters.entityProps.toggler.nodeParameters.entity',
                        toggler === 'switch' ? 'switch' : 'base',
                    );
                } else {
                    set(
                        mutableSchema,
                        'nodeParameters.entityProps.toggler.type',
                        JsonSchemaType.String,
                    );
                    set(
                        mutableSchema,
                        'nodeParameters.entityProps.toggler.nodeParameters.type',
                        NodeType.String,
                    );
                    set(
                        mutableSchema,
                        'nodeParameters.entityProps.toggler.nodeParameters.entity',
                        toggler === 'select' ? 'select' : 'segmented_radio_group',
                    );
                    set(
                        mutableSchema,
                        'nodeParameters.entityProps.toggler.enum',
                        spec.viewSpec.order || Object.keys(spec.properties || {}),
                    );
                }
            }
        } else if (spec.viewSpec.type === 'multi_oneof') {
            set(mutableSchema, 'nodeParameters.entity', 'few_of_nested');

            if (spec.type === SpecTypes.Object) {
                const {toggler} = spec.viewSpec.oneOfParams || {};

                set(mutableSchema, 'nodeParameters.entityProps.withIndent', true);
                set(mutableSchema, 'nodeParameters.layout', 'transparent');
                Object.keys(spec.properties || {}).forEach((key) => {
                    if (!get(mutableSchema, ['properties', key, 'nodeParameters', 'layout'])) {
                        set(
                            mutableSchema,
                            ['properties', key, 'nodeParameters', 'layout'],
                            'transparent',
                        );
                    }
                });

                set(
                    mutableSchema,
                    'nodeParameters.entityProps.toggler.nodeParameters.layout',
                    'row',
                );

                if (spec.viewSpec.layoutTitle) {
                    set(
                        mutableSchema,
                        'nodeParameters.entityProps.toggler.title',
                        spec.viewSpec.layoutTitle,
                    );
                }

                if (spec.viewSpec.layoutDescription) {
                    set(
                        mutableSchema,
                        'nodeParameters.entityProps.toggler.description',
                        spec.viewSpec.layoutDescription,
                    );
                }

                if (spec.viewSpec.placeholder) {
                    set(
                        mutableSchema,
                        'nodeParameters.entityProps.toggler.nodeParameters.entityProps.placeholder',
                        spec.viewSpec.placeholder,
                    );
                }

                if (spec.description && Object.keys(spec.description).length) {
                    set(
                        mutableSchema,
                        'nodeParameters.entityProps.toggler.nodeParameters.entityProps.enumDescriptions',
                        spec.description,
                    );
                } else if (spec.properties) {
                    set(
                        mutableSchema,
                        'nodeParameters.entityProps.toggler.nodeParameters.entityProps.enumDescriptions',
                        Object.fromEntries(
                            Object.entries(spec.properties).map(([key, childSpec]) => [
                                key,
                                childSpec.viewSpec.layoutTitle || key,
                            ]),
                        ),
                    );
                }
                set(mutableSchema, 'nodeParameters.entityProps.toggler.type', JsonSchemaType.Array);
                set(
                    mutableSchema,
                    'nodeParameters.entityProps.toggler.nodeParameters.type',
                    NodeType.Array,
                );
                set(
                    mutableSchema,
                    'nodeParameters.entityProps.toggler.nodeParameters.entity',
                    toggler === 'checkbox' ? 'checkbox_group' : 'select',
                );
                set(
                    mutableSchema,
                    'nodeParameters.entityProps.toggler.items.enum',
                    spec.viewSpec.order || Object.keys(spec.properties || {}),
                );
            }
        } else if (spec.viewSpec.type === 'multi_oneof_flat') {
            set(mutableSchema, 'nodeParameters.entity', 'few_of_nested');

            if (spec.type === SpecTypes.Object) {
                const {toggler} = spec.viewSpec.oneOfParams || {};

                set(mutableSchema, 'nodeParameters.layout', 'transparent');
                Object.keys(spec.properties || {}).forEach((key) => {
                    if (!get(mutableSchema, ['properties', key, 'nodeParameters', 'layout'])) {
                        set(
                            mutableSchema,
                            ['properties', key, 'nodeParameters', 'layout'],
                            'transparent',
                        );
                    }
                });

                set(
                    mutableSchema,
                    'nodeParameters.entityProps.toggler.nodeParameters.layout',
                    'row',
                );

                if (spec.viewSpec.layoutTitle) {
                    set(
                        mutableSchema,
                        'nodeParameters.entityProps.toggler.title',
                        spec.viewSpec.layoutTitle,
                    );
                }

                if (spec.viewSpec.layoutDescription) {
                    set(
                        mutableSchema,
                        'nodeParameters.entityProps.toggler.description',
                        spec.viewSpec.layoutDescription,
                    );
                }

                if (spec.viewSpec.placeholder) {
                    set(
                        mutableSchema,
                        'nodeParameters.entityProps.toggler.nodeParameters.entityProps.placeholder',
                        spec.viewSpec.placeholder,
                    );
                }

                if (spec.description && Object.keys(spec.description).length) {
                    set(
                        mutableSchema,
                        'nodeParameters.entityProps.toggler.nodeParameters.entityProps.enumDescriptions',
                        spec.description,
                    );
                } else if (spec.properties) {
                    set(
                        mutableSchema,
                        'nodeParameters.entityProps.toggler.nodeParameters.entityProps.enumDescriptions',
                        Object.fromEntries(
                            Object.entries(spec.properties).map(([key, childSpec]) => [
                                key,
                                childSpec.viewSpec.layoutTitle || key,
                            ]),
                        ),
                    );
                }
                set(mutableSchema, 'nodeParameters.entityProps.toggler.type', JsonSchemaType.Array);
                set(
                    mutableSchema,
                    'nodeParameters.entityProps.toggler.nodeParameters.type',
                    NodeType.Array,
                );
                set(
                    mutableSchema,
                    'nodeParameters.entityProps.toggler.nodeParameters.entity',
                    toggler === 'checkbox' ? 'checkbox_group' : 'select',
                );
                set(
                    mutableSchema,
                    'nodeParameters.entityProps.toggler.items.enum',
                    spec.viewSpec.order || Object.keys(spec.properties || {}),
                );
            }
        } else if (spec.viewSpec.type === 'object_value') {
            set(mutableSchema, 'nodeParameters.entity', 'dot_value');
        } else if (spec.viewSpec.type === 'text_content') {
            const textContentParams =
                spec.type === SpecTypes.String ? spec.viewSpec.textContentParams : undefined;

            if (textContentParams?.themeAlert) {
                set(mutableSchema, 'nodeParameters.entity', 'alert');
            } else if (textContentParams?.themeLabel) {
                set(mutableSchema, 'nodeParameters.entity', 'label');
            } else {
                set(mutableSchema, 'nodeParameters.entity', 'text_content');
            }
        } else if (spec.viewSpec.type === 'date_input') {
            set(mutableSchema, 'type', undefined);
            set(mutableSchema, 'nodeParameters.entity', 'date');
            set(mutableSchema, 'nodeParameters.type', NodeType.Any);
        } else if (spec.viewSpec.type === 'file_input') {
            set(mutableSchema, 'nodeParameters.entity', 'file');
        } else if (spec.viewSpec.type === 'monaco_input') {
            set(mutableSchema, 'nodeParameters.entity', 'monaco');
        } else if (spec.viewSpec.type === 'number_with_scale') {
            set(mutableSchema, 'nodeParameters.entity', 'string_number_with_scale');
        } else if (spec.viewSpec.type === 'range_input_picker') {
            set(
                mutableSchema,
                'nodeParameters.entity',
                spec.type === SpecTypes.Number ? 'slider' : 'range_input',
            );
        } else {
            set(mutableSchema, 'nodeParameters.entity', spec.viewSpec.type);
        }
    },
};

const specRules: Rules = {
    defaultValue: (spec, mutableSchema) => {
        if (spec.defaultValue !== undefined) {
            set(mutableSchema, 'default', spec.defaultValue);
        }
    },
    type: (spec, mutableSchema) => {
        const specTypeToJsonSchemaType = {
            [SpecTypes.Array]: JsonSchemaType.Array,
            [SpecTypes.Boolean]: JsonSchemaType.Boolean,
            [SpecTypes.Number]: JsonSchemaType.Number,
            [SpecTypes.Object]: JsonSchemaType.Object,
            [SpecTypes.String]: JsonSchemaType.String,
        };
        const specTypeToNodeType = {
            [SpecTypes.Array]: NodeType.Array,
            [SpecTypes.Boolean]: NodeType.Boolean,
            [SpecTypes.Number]: NodeType.Number,
            [SpecTypes.Object]: NodeType.Object,
            [SpecTypes.String]: NodeType.String,
        };

        if (spec.type) {
            set(mutableSchema, 'type', specTypeToJsonSchemaType[spec.type]);
            set(mutableSchema, 'nodeParameters.type', specTypeToNodeType[spec.type]);
        }
    },
    required: (spec, mutableSchema, _rules, errorMessages) => {
        if (spec.required) {
            set(mutableSchema, 'allOf', [
                ...(mutableSchema.allOf || []),
                {
                    not: {
                        enum: [null, undefined, '', false],
                        nodeParameters: {errorMessages: {not: errorMessages.required}},
                    },
                },
            ]);
            set(mutableSchema, 'nodeParameters.flags.required', true);
        }
    },
    maxLength: (spec, mutableSchema) => {
        if (spec.type === SpecTypes.Array && spec.maxLength !== undefined) {
            const maxItems = Number(spec.maxLength);

            if (!Number.isNaN(maxItems)) {
                set(mutableSchema, 'maxItems', maxItems);
            }
        }

        if (spec.type === SpecTypes.String && spec.maxLength !== undefined) {
            const maxLength = Number(spec.maxLength);

            if (!Number.isNaN(maxLength)) {
                set(mutableSchema, 'maxLength', maxLength);
            }
        }
    },
    minLength: (spec, mutableSchema) => {
        if (spec.type === SpecTypes.Array && spec.minLength !== undefined) {
            const minItems = Number(spec.minLength);

            if (!Number.isNaN(minItems)) {
                set(mutableSchema, 'minItems', minItems);
            }
        }

        if (spec.type === SpecTypes.String && spec.minLength !== undefined) {
            const minLength = Number(spec.minLength);

            if (!Number.isNaN(minLength)) {
                set(mutableSchema, 'minLength', minLength);
            }
        }
    },
    items: (spec, mutableSchema, rules, errorMessages) => {
        if (spec.type === SpecTypes.Array && spec.items) {
            const childSchema: JsonSchema = specToJsonSchema(
                spec.items,
                'items' in mutableSchema &&
                    mutableSchema.items &&
                    !Array.isArray(mutableSchema.items)
                    ? {...mutableSchema.items}
                    : {},
                rules,
                errorMessages,
            );

            set(mutableSchema, 'items', childSchema);
        }
    },
    enum: (spec, mutableSchema) => {
        if (
            spec.type === SpecTypes.Array &&
            spec.enum?.length &&
            (spec.items?.type === SpecTypes.String || !spec.items?.type)
        ) {
            set(mutableSchema, 'items.enum', spec.enum);
        }

        if (spec.type === SpecTypes.String && spec.enum?.length) {
            set(mutableSchema, 'enum', spec.enum);
        }
    },
    description: (spec, mutableSchema) => {
        if ('description' in spec && isObject(spec.description)) {
            set(mutableSchema, 'nodeParameters.entityProps.enumDescriptions', spec.description);
        }
    },
    validator: (spec, mutableSchema) => {
        if (spec.validator && spec.validator !== 'base') {
            set(mutableSchema, 'nodeParameters.validator', spec.validator);
        }
    },
    maximum: (spec, mutableSchema) => {
        if (spec.type === SpecTypes.Number && spec.maximum !== undefined) {
            const maximum = Number(spec.maximum);

            if (!Number.isNaN(maximum)) {
                set(mutableSchema, 'maximum', maximum);
            }
        }

        if (spec.type === SpecTypes.String && 'maximum' in spec && spec.maximum !== undefined) {
            const maximum = Number(spec.maximum);

            if (!Number.isNaN(maximum)) {
                set(mutableSchema, 'stringNumber.maximum', `${spec.maximum}`);
            }
        }
    },
    minimum: (spec, mutableSchema) => {
        if (spec.type === SpecTypes.Number && spec.minimum !== undefined) {
            const minimum = Number(spec.minimum);

            if (!Number.isNaN(minimum)) {
                set(mutableSchema, 'minimum', minimum);
            }
        }

        if (spec.type === SpecTypes.String && 'minimum' in spec && spec.minimum !== undefined) {
            const minimum = Number(spec.minimum);

            if (!Number.isNaN(minimum)) {
                set(mutableSchema, 'stringNumber.minimum', `${spec.minimum}`);
            }
        }
    },
    format: (spec, mutableSchema) => {
        if (spec.type === SpecTypes.Number && spec.format === 'int64') {
            set(mutableSchema, 'type', JsonSchemaType.Integer);
        }
    },
    properties: (spec, mutableSchema, rules, errorMessages) => {
        if (spec.type === SpecTypes.Object && spec.properties) {
            Object.entries(spec.properties).forEach(([key, childSpec]) => {
                const childSchema: JsonSchema = specToJsonSchema(
                    childSpec,
                    {...(get(mutableSchema, ['properties', key]) || {})},
                    rules,
                    errorMessages,
                );

                set(mutableSchema, ['properties', key], childSchema);

                if (
                    childSpec.required &&
                    !(
                        spec.viewSpec.type === 'oneof' ||
                        spec.viewSpec.type === 'oneof_flat' ||
                        spec.viewSpec.type === 'card_oneof' ||
                        spec.viewSpec.type === 'multi_oneof' ||
                        spec.viewSpec.type === 'multi_oneof_flat'
                    )
                ) {
                    set(
                        mutableSchema,
                        ['required'],
                        [...(get(mutableSchema, 'required') || []), key],
                    );
                    set(
                        mutableSchema,
                        'nodeParameters.errorMessages.required',
                        errorMessages.required,
                    );
                }
            });
        }
    },
    pattern: (spec, mutableSchema) => {
        if (spec.type === SpecTypes.String && spec.pattern) {
            set(mutableSchema, 'pattern', spec.pattern);
        }
    },
    patternError: (spec, mutableSchema) => {
        if (spec.type === SpecTypes.String && spec.patternError) {
            set(mutableSchema, 'nodeParameters.errorMessages.pattern', spec.patternError);
        }
    },
    viewSpec: (spec, mutableSchema, rules, errorMessages) => {
        Object.values(rules.viewSpecRules).forEach((rule) =>
            rule(spec, mutableSchema, rules, errorMessages),
        );
    },
};

export function specToJsonSchema(
    spec: Spec,
    mutableSchema: JsonSchema = {},
    rules?: {specRules: Rules; viewSpecRules: Rules},
    errorMessages: ErrorMessages = {},
) {
    const mergedSpecRules = {
        ...specRules,
        ...rules?.specRules,
    };
    const mergedViewSpecRules = {
        ...viewSpecRules,
        ...rules?.viewSpecRules,
    };

    Object.values(mergedSpecRules).forEach((rule) =>
        rule(
            spec,
            mutableSchema,
            {specRules: mergedSpecRules, viewSpecRules: mergedViewSpecRules},
            errorMessages,
        ),
    );

    return mutableSchema;
}
