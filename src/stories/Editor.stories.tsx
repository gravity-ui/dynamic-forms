import React from 'react';

import {StoryFn} from '@storybook/react';

import {ArrayBase, ObjectSpec, SpecTypes} from '../lib';

import {Editor as EditorBase} from './components/Editor/Editor';

export default {
    title: 'Other/Editor',
    component: EditorBase,
};

const spec: ObjectSpec = {
    defaultValue: {
        id: 12345,
        name: 'Foo',
        description:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla quod error voluptatibus odio minima assumenda voluptatum harum quidem maxime iste exercitationem, quam numquam, necessitatibus saepe praesentium, commodi beatae. Vitae, odit. Assumenda nobis similique voluptatibus? Sint itaque qui laudantium iste? In doloribus nam vitae quasi suscipit dolores maiores culpa amet quo. Distinctio mollitia ad expedita tempore sit? Nemo odit quae impedit?',
        labels: ['foo', 'bar', 'rab', 'oof'],
        settings: true,
        autor: {
            external: {
                name: 'Bar',
                age: 12345,
                license: true,
                birthday: new Date('2020-01-01').toISOString(),
            },
        },
    },
    required: true,
    type: SpecTypes.Object,
    properties: {
        id: {
            type: SpecTypes.Number,
            viewSpec: {
                type: 'base',
                layout: 'row',
                layoutTitle: 'id',
                layoutDescription: 'uniq id',
                copy: true,
            },
        },
        name: {
            type: SpecTypes.String,
            viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Name', copy: true},
        },
        description: {
            type: SpecTypes.String,
            viewSpec: {type: 'textarea', layout: 'row', layoutTitle: 'Description', copy: true},
        },
        settings: {
            type: SpecTypes.Boolean,
            viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Settings'},
        },
        autor: {
            type: SpecTypes.Object,
            properties: {
                internal: {
                    required: true,
                    type: SpecTypes.String,
                    viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Person id'},
                },
                empty: {
                    required: true,
                    type: SpecTypes.Object,
                    viewSpec: {type: '', layoutTitle: 'Empty'},
                },
                external: {
                    required: true,
                    type: SpecTypes.Object,
                    properties: {
                        name: {
                            type: SpecTypes.String,
                            viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Name'},
                        },
                        age: {
                            type: SpecTypes.Number,
                            viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Age'},
                        },
                        non_working_days: {
                            type: SpecTypes.Array,
                            enum: [
                                'monday',
                                'tuesday',
                                'wednesday',
                                'thursday',
                                'friday',
                                'saturday',
                                'sunday',
                            ],
                            description: {
                                monday: 'Mon',
                                tuesday: 'Tue',
                                wednesday: 'Wed',
                                thursday: 'Thu',
                                friday: 'Fri',
                                saturday: 'Sat',
                                sunday: 'Sun',
                            },
                            viewSpec: {
                                type: 'checkbox_group',
                                layout: 'row',
                                layoutTitle: 'Non-working days',
                            },
                        },
                        working_hours: {
                            type: SpecTypes.Object,
                            properties: {
                                start: {
                                    type: SpecTypes.String,
                                    enum: [
                                        '00:00',
                                        '01:00',
                                        '02:00',
                                        '03:00',
                                        '04:00',
                                        '05:00',
                                        '06:00',
                                        '07:00',
                                        '08:00',
                                        '09:00',
                                        '10:00',
                                        '11:00',
                                        '12:00',
                                        '13:00',
                                        '14:00',
                                        '15:00',
                                        '16:00',
                                        '17:00',
                                        '18:00',
                                        '19:00',
                                        '20:00',
                                        '21:00',
                                        '22:00',
                                    ],
                                    viewSpec: {
                                        type: 'select',
                                        layout: 'row',
                                        layoutTitle: 'The begining of the work day',
                                    },
                                },
                                end: {
                                    type: SpecTypes.String,
                                    enum: [
                                        '01:00',
                                        '02:00',
                                        '03:00',
                                        '04:00',
                                        '05:00',
                                        '06:00',
                                        '07:00',
                                        '08:00',
                                        '09:00',
                                        '10:00',
                                        '11:00',
                                        '12:00',
                                        '13:00',
                                        '14:00',
                                        '15:00',
                                        '16:00',
                                        '17:00',
                                        '18:00',
                                        '19:00',
                                        '20:00',
                                        '21:00',
                                        '22:00',
                                        '23:00',
                                    ],
                                    viewSpec: {
                                        type: 'select',
                                        layout: 'row',
                                        layoutTitle: 'End of the working day',
                                    },
                                },
                            },
                            viewSpec: {
                                type: 'time_range_selector',
                                layoutTitle: 'Working hours',
                                layoutDescription: 'transparent',
                            },
                        },
                        birthday: {
                            type: SpecTypes.String,
                            viewSpec: {
                                type: 'date_input',
                                layout: 'row',
                                layoutTitle: 'Birthday',
                                dateInput: {
                                    outputFormat: 'timestamp',
                                },
                            },
                        },
                        license: {
                            type: SpecTypes.Boolean,
                            viewSpec: {type: 'base', layout: 'row', layoutTitle: 'License'},
                        },
                    },
                    viewSpec: {
                        type: 'base',
                        layoutTitle: 'Person data',
                    },
                },
            },
            description: {
                external: 'External autor',
                internal: 'Internal autor',
                empty: 'None',
            },
            viewSpec: {
                type: 'oneof',
                layout: 'row',
                layoutTitle: 'Autor',
                order: ['external', 'internal', 'empty'],
            },
        },
        labels: {
            type: SpecTypes.Array,
            items: {
                type: SpecTypes.String,
                viewSpec: {
                    type: 'base',
                    layout: 'row',
                    layoutTitle: 'Label',
                    copy: true,
                },
            },
            viewSpec: {
                type: 'base',
                layout: 'accordeon',
                layoutTitle: 'Labels',
                layoutDescription: 'List of tags',
                layoutOpen: true,
                itemLabel: 'Add element',
            },
        },
    },
    viewSpec: {
        type: 'base',
        layout: 'section',
        layoutTitle: 'Candidate',
    },
};

const template = () => {
    const Template: StoryFn<typeof ArrayBase> = (__, {viewMode}) => (
        <EditorBase spec={spec} viewMode={viewMode} />
    );

    return Template;
};

export const Editor = template();
