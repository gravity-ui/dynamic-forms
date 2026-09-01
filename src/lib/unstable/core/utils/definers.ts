import type {NodeType} from '../constants';
import type {
    DefaultNodeEntityProps,
    DefaultNodeLayoutProps,
    ErrorMessages,
    NodeEntity,
    NodeLayout,
    NodesConfig,
    Validator,
} from '../types';
import type {
    EntityKind,
    ExtractNodeEntityProps,
    ExtractNodeLayoutProps,
    LayoutKind,
    NodeComponentProps,
    NodeTypeConfigKey,
    SchemaOfNodeType,
} from '../types/helpers';

export const defineNodeEntityConfig = <Component extends NodeEntity<any>>(nodeEntityConfig: {
    Component: Component;
    independent?: boolean;
    defaultProps?: ExtractNodeEntityProps<Component>;
}) => nodeEntityConfig;

export const defineNodeLayoutConfig = <Component extends NodeLayout<any>>(nodeLayoutConfig: {
    Component: Component;
    defaultProps?: ExtractNodeLayoutProps<Component>;
}) => nodeLayoutConfig;

export const createNodeParametersDefiner =
    <Config extends NodesConfig>(_config: Config) =>
    <
        Type extends NodeType,
        const Entity extends
            | NodeTypeConfigKey<Config, Type, 'formEntities'>
            | NodeTypeConfigKey<Config, Type, 'overviewEntities'>
            | NodeEntity<SchemaOfNodeType<Type>>
            | undefined = undefined,
        const FormEntity extends
            | NodeTypeConfigKey<Config, Type, 'formEntities'>
            | NodeEntity<SchemaOfNodeType<Type>>
            | undefined = undefined,
        const OverviewEntity extends
            | NodeTypeConfigKey<Config, Type, 'overviewEntities'>
            | NodeEntity<SchemaOfNodeType<Type>>
            | undefined = undefined,
        const Layout extends
            | NodeTypeConfigKey<Config, Type, 'formLayouts'>
            | NodeTypeConfigKey<Config, Type, 'overviewLayouts'>
            | NodeLayout<SchemaOfNodeType<Type>>
            | undefined = undefined,
        const FormLayout extends
            | NodeTypeConfigKey<Config, Type, 'formLayouts'>
            | NodeLayout<SchemaOfNodeType<Type>>
            | undefined = undefined,
        const OverviewLayout extends
            | NodeTypeConfigKey<Config, Type, 'overviewLayouts'>
            | NodeLayout<SchemaOfNodeType<Type>>
            | undefined = undefined,
        const ValidatorRef extends
            | NodeTypeConfigKey<Config, Type, 'validators'>
            | Validator<SchemaOfNodeType<Type>>
            | undefined = undefined,
    >(nodeParameters: {
        type: Type;
        entity?:
            | NoInfer<NodeTypeConfigKey<Config, Type, 'formEntities'>>
            | NoInfer<NodeTypeConfigKey<Config, Type, 'overviewEntities'>>
            | NodeEntity<SchemaOfNodeType<Type>>
            | Entity;
        entityProps?: DefaultNodeEntityProps & NodeComponentProps<Config, Type, EntityKind, Entity>;
        formEntity?:
            | NoInfer<NodeTypeConfigKey<Config, Type, 'formEntities'>>
            | NodeEntity<SchemaOfNodeType<Type>>
            | FormEntity;
        formEntityProps?: DefaultNodeEntityProps &
            NodeComponentProps<Config, Type, 'formEntities', FormEntity>;
        overviewEntity?:
            | NoInfer<NodeTypeConfigKey<Config, Type, 'overviewEntities'>>
            | NodeEntity<SchemaOfNodeType<Type>>
            | OverviewEntity;
        overviewEntityProps?: DefaultNodeEntityProps &
            NodeComponentProps<Config, Type, 'overviewEntities', OverviewEntity>;
        layout?:
            | NoInfer<NodeTypeConfigKey<Config, Type, 'formLayouts'>>
            | NoInfer<NodeTypeConfigKey<Config, Type, 'overviewLayouts'>>
            | NodeLayout<SchemaOfNodeType<Type>>
            | Layout;
        layoutProps?: DefaultNodeLayoutProps & NodeComponentProps<Config, Type, LayoutKind, Layout>;
        formLayout?:
            | NoInfer<NodeTypeConfigKey<Config, Type, 'formLayouts'>>
            | NodeLayout<SchemaOfNodeType<Type>>
            | FormLayout;
        formLayoutProps?: DefaultNodeLayoutProps &
            NodeComponentProps<Config, Type, 'formLayouts', FormLayout>;
        overviewLayout?:
            | NoInfer<NodeTypeConfigKey<Config, Type, 'overviewLayouts'>>
            | NodeLayout<SchemaOfNodeType<Type>>
            | OverviewLayout;
        overviewLayoutProps?: DefaultNodeLayoutProps &
            NodeComponentProps<Config, Type, 'overviewLayouts', OverviewLayout>;
        errorMessages?: Omit<ErrorMessages, 'dependencies' | 'required'> & {
            dependencies?:
                | ErrorMessages['dependencies']
                | Record<string, ErrorMessages['dependencies']>;
            required?: ErrorMessages['required'] | Record<string, ErrorMessages['required']>;
        };
        validator?:
            | NoInfer<NodeTypeConfigKey<Config, Type, 'validators'>>
            | Validator<SchemaOfNodeType<Type>>
            | ValidatorRef;
    }) =>
        nodeParameters;
