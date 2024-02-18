import {FormValue, Spec} from '../../../types';
import {
    DynamicFormConfig,
    DynamicFormMutatorsStore,
    DynamicFormsContext,
    FieldRenderProps,
    FieldValue,
    IndependentInputEntity,
    InputEntity,
    LayoutType,
    ValidateError,
} from '../types';

export interface GetSpecParams<SpecType extends Spec> {
    name: string;
    spec: SpecType;
    mutatorsStore: DynamicFormMutatorsStore;
}

export interface GetComponentsParams<SpecType extends Spec> {
    spec: SpecType;
    config: DynamicFormConfig;
}

export interface GetComponentsReturn<
    DirtyValue extends FieldValue,
    SpecType extends Spec<undefined, undefined, undefined>,
> {
    inputEntity?:
        | InputEntity<DirtyValue, undefined, undefined, SpecType>
        | IndependentInputEntity<DirtyValue, undefined, undefined, SpecType>;
    Layout?: LayoutType<DirtyValue, undefined, undefined, SpecType>;
}

export interface GetRenderParams<
    DirtyValue extends FieldValue,
    SpecType extends Spec<undefined, undefined, undefined>,
> {
    name: string;
    spec: SpecType;
    inputEntity?:
        | InputEntity<DirtyValue, undefined, undefined, SpecType>
        | IndependentInputEntity<DirtyValue, undefined, undefined, SpecType>;
    Layout?: LayoutType<DirtyValue, undefined, undefined, SpecType>;
}

export interface GetValidateParams<SpecType extends Spec> {
    spec: SpecType;
    config: DynamicFormConfig;
}

export interface GetFieldInitialsParams<
    DirtyValue extends FieldValue,
    Value extends FormValue,
    SpecType extends Spec,
> {
    name: string;
    spec: SpecType;
    valueFromParent: DirtyValue;
    initialValue: DirtyValue;
    validate: (value?: Value) => ValidateError;
    mutatorsStore: DynamicFormMutatorsStore;
}

export type FieldMethod<
    DirtyValue extends FieldValue,
    Value extends FormValue,
    SpecType extends Spec,
    Params extends any = undefined,
> = (
    store: ControllerStore<DirtyValue, Value, SpecType>,
    params: Params,
) => ControllerStore<DirtyValue, Value, SpecType>;

export interface GetFieldMethodsReturn<
    DirtyValue extends FieldValue,
    Value extends FormValue,
    SpecType extends Spec,
> {
    onChange: FieldMethod<
        DirtyValue,
        Value,
        SpecType,
        {
            valOrSetter: DirtyValue | ((currentValue: DirtyValue) => DirtyValue);
            childErrors?: Record<string, ValidateError>;
            errorMutator?: ValidateError;
        }
    >;
    onDrop: FieldMethod<DirtyValue, Value, SpecType>;
    onBlur: FieldMethod<DirtyValue, Value, SpecType>;
    onFocus: FieldMethod<DirtyValue, Value, SpecType>;
    parentOnUnmount: FieldMethod<DirtyValue, Value, SpecType, string>;
    onItemAdd: FieldMethod<DirtyValue, Value, SpecType, FieldValue>;
    onItemRemove: FieldMethod<DirtyValue, Value, SpecType, number | string>;
}

export interface InitializeStoreParams<DirtyValue extends FieldValue, SpecType extends Spec> {
    name: string;
    spec: SpecType;
    mutatorsStore: DynamicFormMutatorsStore;
    config: DynamicFormConfig;
    valueFromParent: DirtyValue;
    tools: DynamicFormsContext['tools'];
    parentOnChange:
        | ((
              childName: string,
              childValue: FieldValue,
              childErrors: Record<string, ValidateError>,
          ) => void)
        | null;
    parentOnUnmount: ((childName: string) => void) | null;
}

export interface ControllerStore<
    DirtyValue extends FieldValue,
    Value extends FormValue,
    SpecType extends Spec,
> {
    name: string;
    spec: SpecType;
    initialSpec: SpecType;
    config: DynamicFormConfig;
    tools: DynamicFormsContext['tools'];
    mutatorsStore: DynamicFormMutatorsStore;
    render: (props: FieldRenderProps<DirtyValue>) => JSX.Element | null;
    validate: (value?: Value) => ValidateError;
    parentOnChange:
        | ((
              childName: string,
              childValue: FieldValue,
              childErrors: Record<string, ValidateError>,
          ) => void)
        | null;
    parentOnUnmount: ((childName: string) => void) | null;
    state: {
        initialValue: DirtyValue;
        active: boolean;
        dirty: boolean;
        error: ValidateError;
        invalid: boolean;
        modified: boolean;
        pristine: boolean;
        touched: boolean;
        valid: boolean;
        value: DirtyValue;
        visited: boolean;
        childErrors: Record<string, ValidateError>;
    };
    afterStoreUpdateCB?: () => void;
}

export interface UpdateStoreParams<
    DirtyValue extends FieldValue,
    Value extends FormValue,
    SpecType extends Spec,
> {
    store: ControllerStore<DirtyValue, Value, SpecType>;
    setStore: (store: ControllerStore<DirtyValue, Value, SpecType>) => void;
    spec: SpecType;
    name: string;
    parentOnChange:
        | ((
              childName: string,
              childValue: FieldValue,
              childErrors: Record<string, ValidateError>,
          ) => void)
        | null;
    parentOnUnmount: ((childName: string) => void) | null;
    mutatorsStore: DynamicFormMutatorsStore;
    valueFromParent: DirtyValue;
    config: DynamicFormConfig;
    tools: DynamicFormsContext['tools'];
    methodOnChange: GetFieldMethodsReturn<DirtyValue, Value, SpecType>['onChange'];
}
