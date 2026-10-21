import React from 'react';

import {Button} from '@gravity-ui/uikit';

import {SchemaForm, type SchemaFormProps} from '~playwright/core/SchemaForm';

type ContentRendererProps = SchemaFormProps & {
    updatedSettings: Pick<SchemaFormProps, 'size' | 'view' | 'userContext'>;
};

// Browser state updates props without remounting the form or its providers.
export const SchemaFormWithContentRenderer = ({
    updatedSettings,
    ...props
}: ContentRendererProps) => {
    const [updated, setUpdated] = React.useState(false);
    const settings = updated ? updatedSettings : props;
    const RenderHTMLOrMD = React.useCallback(
        ({content}: {content: string}) => (
            <strong data-qa="custom-description">{`${settings.userContext.prefix}${content}`}</strong>
        ),
        [settings.userContext.prefix],
    );

    return (
        <>
            <SchemaForm
                {...props}
                size={settings.size}
                view={settings.view}
                userContext={{...settings.userContext, RenderHTMLOrMD}}
            />
            <Button onClick={() => setUpdated(true)}>Update renderer settings</Button>
        </>
    );
};
