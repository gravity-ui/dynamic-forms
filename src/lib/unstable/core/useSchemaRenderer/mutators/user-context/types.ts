import type {MutableState, Tools} from 'final-form';
import type {MonacoEditorProps} from 'react-monaco-editor/lib/types';

export type UserContextState<Context extends Record<string, unknown> = Record<string, unknown>> =
    Context & {headName: string; MonacoEditor?: React.ComponentType<MonacoEditorProps>};

export interface SetUserContextParams<
    Context extends Record<string, unknown> = Record<string, unknown>,
> {
    name: string;
    userContext:
        | Partial<Omit<UserContextState<Context>, 'headName'>>
        | ((
              userContext: Omit<UserContextState<Context>, 'headName'>,
          ) => Partial<Omit<UserContextState<Context>, 'headName'>>);
}

export type SetUserContextFunction<FormValues = object, InitialFormValues = Partial<FormValues>> = (
    args: [SetUserContextParams],
    state: MutableState<FormValues, InitialFormValues>,
    tools: Tools<FormValues, InitialFormValues>,
) => void;

export type SetUserContextMutator<
    Context extends Record<string, unknown> = Record<string, unknown>,
> = (params: SetUserContextParams<Context>) => void;
