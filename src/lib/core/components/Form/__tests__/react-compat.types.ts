import type React from 'react';

import type {Spec} from '../../../types';
import type {IndependentViewType, ViewLayoutType, ViewType} from '../../View/types';
import type {IndependentInputType, InputType, LayoutType} from '../types';

export function checkReactComponentTypes(
    Input: InputType<string>,
    IndependentInput: IndependentInputType<string>,
    Layout: LayoutType<string>,
    View: ViewType<string, Spec>,
    IndependentView: IndependentViewType<string, Spec>,
    ViewLayout: ViewLayoutType<string, Spec>,
) {
    const input: React.ComponentType<Parameters<typeof Input>[0]> = Input;
    const independentInput: React.ComponentType<Parameters<typeof IndependentInput>[0]> =
        IndependentInput;
    const layout: React.ComponentType<Parameters<typeof Layout>[0]> = Layout;
    const view: React.ComponentType<Parameters<typeof View>[0]> = View;
    const independentView: React.ComponentType<Parameters<typeof IndependentView>[0]> =
        IndependentView;
    const viewLayout: React.ComponentType<Parameters<typeof ViewLayout>[0]> = ViewLayout;
    return {input, independentInput, layout, view, independentView, viewLayout};
}
