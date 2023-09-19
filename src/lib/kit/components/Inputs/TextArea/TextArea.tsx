import React from 'react';

import {TextArea as TextAreaBase} from '@gravity-ui/uikit';

import {StringInput} from '../../../../core';
import {GenerateRandomValueButton} from '../../GenerateRandomValueButton';

export const TextArea: StringInput = ({name, input, spec}) => {
    const {value, onBlur, onChange, onFocus} = input;

    const textArea = React.useMemo(
        () => (
            <TextAreaBase
                value={value}
                onBlur={onBlur}
                onFocus={onFocus}
                onUpdate={onChange}
                maxRows={20}
                minRows={8}
                hasClear
                disabled={spec.viewSpec.disabled}
                placeholder={spec.viewSpec.placeholder}
                qa={name}
            />
        ),
        [name, onBlur, onChange, onFocus, spec.viewSpec.disabled, spec.viewSpec.placeholder, value],
    );

    if (spec.viewSpec.generateRandomValue) {
        return (
            <GenerateRandomValueButton regex={spec.pattern} onChange={onChange}>
                {textArea}
            </GenerateRandomValueButton>
        );
    }

    return <React.Fragment>{textArea}</React.Fragment>;
};
