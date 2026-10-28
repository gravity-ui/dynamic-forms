import {JsonSchemaType, NodeType} from '../../../../core/constants';
import type {JsonSchemaString} from '../../../../core/types';

const settings: Partial<JsonSchemaString> = {
    enum: ['private', 'team', 'public'],
    nodeParameters: {
        entityProps: {
            enumDescriptions: {private: 'Private', team: 'Team', public: 'Public'},
            optionsDisabled: {public: true},
        },
    },
};

export const schema: JsonSchemaString = {
    type: JsonSchemaType.String,
    title: 'SegmentedRadioGroupInput',
    description: 'Description for SegmentedRadioGroupInput',
    ...settings,
    nodeParameters: {
        type: NodeType.String,
        entity: 'segmented_radio_group',
        layout: 'row',
        ...settings.nodeParameters,
        flags: {open: true},
    },
};
export const value = 'private';
