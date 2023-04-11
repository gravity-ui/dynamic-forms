import {ReadAsMethod} from '../../../../core';

export function readFile(
    file: Blob,
    readAsMethod: ReadAsMethod = 'readAsBinaryString',
): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        if (typeof reader[readAsMethod] !== 'function') {
            reject(new Error(`Unknown parameter: ${readAsMethod}`));
            return;
        }

        reader.addEventListener('load', () => resolve(reader.result));
        reader.addEventListener('error', () => reject(reader.error));

        reader[readAsMethod](file);
    });
}
