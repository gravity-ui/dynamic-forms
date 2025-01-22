import {SpecTypes, StringSpec} from '../../../../../core';

export const TEXT_CONTENT_SPEC: Record<string, StringSpec> = {
    defaultText: {
        type: SpecTypes.String,
        viewSpec: {
            type: 'text_content',
            textContentParams: {
                text: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit',
                icon: 'TriangleExclamation',
                iconColor: 'warning',
            },
        },
    },
    textLayoutRow: {
        type: SpecTypes.String,
        viewSpec: {
            type: 'text_content',
            textContentParams: {
                text: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit',
                icon: 'TriangleExclamation',
                iconColor: 'warning',
            },
            layout: 'row',
            layoutTitle: 'Text Content',
            layoutDescription: 'Description',
        },
    },
    textLayoutRowVerbose: {
        type: SpecTypes.String,
        viewSpec: {
            type: 'text_content',
            textContentParams: {
                text: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit',
                icon: 'TriangleExclamation',
                iconColor: 'warning',
            },
            layout: 'row_verbose',
            layoutTitle: 'Text Content',
            layoutDescription: 'Description',
        },
    },
    textLayoutTransparent: {
        type: SpecTypes.String,
        viewSpec: {
            type: 'text_content',
            textContentParams: {
                text: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit',
                icon: 'TriangleExclamation',
                iconColor: 'warning',
            },
            layout: 'transparent',
            layoutTitle: 'Text Content',
            layoutDescription: 'Description',
        },
    },
    defaultLabel: {
        type: SpecTypes.String,
        viewSpec: {
            type: 'text_content',
            textContentParams: {
                text: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit',
                themeLabel: 'info',
                icon: 'CircleInfo',
            },
        },
    },
    labelLayoutRow: {
        type: SpecTypes.String,
        viewSpec: {
            type: 'text_content',
            textContentParams: {
                text: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit',
                icon: 'TriangleExclamation',
                themeLabel: 'info',
            },
            layout: 'row',
            layoutTitle: 'Text Content',
            layoutDescription: 'Description',
        },
    },
    labelLayoutRowVerbose: {
        type: SpecTypes.String,
        viewSpec: {
            type: 'text_content',
            textContentParams: {
                text: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit',
                icon: 'TriangleExclamation',
                themeLabel: 'info',
            },
            layout: 'row_verbose',
            layoutTitle: 'Text Content',
            layoutDescription: 'Description',
        },
    },
    labelLayoutTransparent: {
        type: SpecTypes.String,
        viewSpec: {
            type: 'text_content',
            textContentParams: {
                text: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit',
                icon: 'TriangleExclamation',
                themeLabel: 'info',
            },
            layout: 'transparent',
            layoutTitle: 'Text Content',
            layoutDescription: 'Description',
        },
    },
    labelNoIcon: {
        type: SpecTypes.String,
        viewSpec: {
            type: 'text_content',
            textContentParams: {
                text: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit',
                themeLabel: 'info',
            },
            layout: 'transparent',
            layoutTitle: 'Text Content',
            layoutDescription: 'Description',
        },
    },
    labelDefaultValue: {
        defaultValue: 'default value',
        type: SpecTypes.String,
        viewSpec: {
            type: 'text_content',
            textContentParams: {
                text: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit',
                themeLabel: 'info',
                icon: 'CircleInfo',
            },
        },
    },
    defaultAlert: {
        type: SpecTypes.String,
        viewSpec: {
            type: 'text_content',
            textContentParams: {
                text: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit',
                themeAlert: 'info',
                titleAlert: 'Title Alert',
            },
        },
    },
    alertLayoutRow: {
        type: SpecTypes.String,
        viewSpec: {
            type: 'text_content',
            textContentParams: {
                text: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit',
                themeAlert: 'info',
                titleAlert: 'Title Alert',
            },
            layout: 'row',
            layoutTitle: 'Text Content',
            layoutDescription: 'Description',
        },
    },
    alertLayoutRowVerbose: {
        type: SpecTypes.String,
        viewSpec: {
            type: 'text_content',
            textContentParams: {
                text: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit',
                themeAlert: 'info',
                titleAlert: 'Title Alert',
            },
            layout: 'row_verbose',
            layoutTitle: 'Text Content',
            layoutDescription: 'Description',
        },
    },
    alertLayoutTransparent: {
        type: SpecTypes.String,
        viewSpec: {
            type: 'text_content',
            textContentParams: {
                text: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit',
                themeAlert: 'info',
                titleAlert: 'Title Alert',
            },
            layout: 'transparent',
            layoutTitle: 'Text Content',
            layoutDescription: 'Description',
        },
    },
    alertWithoutTitle: {
        type: SpecTypes.String,
        viewSpec: {
            type: 'text_content',
            textContentParams: {
                text: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit',
                themeAlert: 'info',
            },
        },
    },
};
