import React from 'react';

import type {monaco} from 'react-monaco-editor';

export const useMonacoOptions = (fontSize: number | undefined, readOnly: boolean) => {
    const options: monaco.editor.IStandaloneEditorConstructionOptions = React.useMemo(
        () => ({
            fontSize: fontSize ?? 12,
            readOnly: readOnly,
            formatOnPaste: true,
            formatOnType: true,
            contextmenu: false,
            minimap: {enabled: false},
            autoClosingBrackets: 'languageDefined',
            automaticLayout: true,
        }),
        [fontSize, readOnly],
    );
    return options;
};
