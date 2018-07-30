import * as React from 'react'
import checkDecoratorArguments from './utils/checkDecoratorArguments'
import { DragDropManager, Unsubscribe } from '@~sunsimiao/cj-dnd-core'
import { DragLayerCollector, DndOptions, DndComponentClass } from './interfaces'
import { manager } from './DragDropContext'
// import {IResizeMonitor} from '../resize/interfaces';
// import {IRotateMonitor} from '../rotate/interfaces';
// import createDragMonitor from './createSourceMonitor';
// import createResizeMonitor from '../resize/createSourceMonitor'
// import createRotateMonitor from '../rotate/createSourceMonitor'
import {SourceMonitor as DragMonitor} from './createSourceMonitor'
import {ResizeMonitor} from '../resize/createSourceMonitor'
import {RotateMonitor} from '../rotate/createSourceMonitor'
import {extend} from './utils/extend'
const hoistStatics = require('hoist-non-react-statics')
const isPlainObject = require('lodash/isPlainObject')
const invariant = require('invariant')
const shallowEqual = require('shallowequal')
const isClassComponent = require('recompose/isClassComponent').default

// export default function layerFactory (createSourceMonitor: any) {
// 	return 	
// }

const MixMonitor: any = extend(DragMonitor, ResizeMonitor, RotateMonitor);
const mixMonitor = new MixMonitor(manager);

export default function DragLayer<Props, CollectedProps = {}>(
	collect: DragLayerCollector<Props, CollectedProps>,
	options: DndOptions<Props> = {},
) {
	checkDecoratorArguments('DragLayer', 'collect[, options]', collect, options)
	invariant(
		typeof collect === 'function',
		'Expected "collect" provided as the first argument to DragLayer to be a function that collects props to inject into the component. ',
		'Instead, received %s. Read more: http://react-dnd.github.io/react-dnd/docs-drag-layer.html',
		collect,
	)
	invariant(
		isPlainObject(options),
		'Expected "options" provided as the second argument to DragLayer to be a plain object when specified. ' +
			'Instead, received %s. Read more: http://react-dnd.github.io/react-dnd/docs-drag-layer.html',
		options,
	)

	return function decorateLayer<
		TargetClass extends
			| React.ComponentClass<Props>
			| React.StatelessComponent<Props>
	>(DecoratedComponent: TargetClass): TargetClass & DndComponentClass<Props> {
		const Decorated = DecoratedComponent as any
		const { arePropsEqual = shallowEqual } = options
		const displayName = Decorated.displayName || Decorated.name || 'Component'

		class DragLayerContainer extends React.Component<Props> {
			public static displayName = `DragLayer(${displayName})`

			public get DecoratedComponent() {
				return DecoratedComponent
			}

			// private manager: DragDropManager<any> | undefined
			private monitor: any
			private isCurrentlyMounted: boolean = false
			private unsubscribeFromOffsetChange: Unsubscribe | undefined
			private unsubscribeFromStateChange: Unsubscribe | undefined
			private ref: React.RefObject<any> = React.createRef()

			constructor(props: Props) {
				super(props)

				// const monitor = [createDragMonitor(manager), createResizeMonitor(manager), createRotateMonitor(manager)];
				this.receiveDragDropManager(mixMonitor);
				// this.handleChange = this.handleChange.bind(this)
			}

			public getDecoratedComponentInstance() {
				invariant(
					this.ref.current,
					'In order to access an instance of the decorated component it can not be a stateless component.',
				)
				return this.ref.current
			}

			public shouldComponentUpdate(nextProps: any, nextState: any) {
				return (
					!arePropsEqual(nextProps, this.props) ||
					!shallowEqual(nextState, this.state)
				)
			}

			public componentDidMount() {
				this.isCurrentlyMounted = true
				this.handleChange()
			}

			public componentWillUnmount() {
				this.isCurrentlyMounted = false
				if (this.unsubscribeFromOffsetChange) {
					this.unsubscribeFromOffsetChange()
					this.unsubscribeFromOffsetChange = undefined
				}
				if (this.unsubscribeFromStateChange) {
					this.unsubscribeFromStateChange()
					this.unsubscribeFromStateChange = undefined
				}
			}

			public render() {
				// if (!this.isCurrentlyMounted) {
				// 		return null
				// 	}
				return (
					<Decorated
						{...this.props}
						{...this.state}
						ref={isClassComponent(Decorated) ? this.ref : undefined}
					/>
				)
			}

			private receiveDragDropManager(monitor: any) {
				if (this.monitor !== undefined) {
					return
				}
				this.monitor = monitor;
				// invariant(
				// 	typeof dragDropManager === 'object',
				// 	'Could not find the drag and drop manager in the context of %s. ' +
				// 		'Make sure to wrap the top-level component of your app with DragDropContext. ' +
				// 		'Read more: http://react-dnd.github.io/react-dnd/docs-troubleshooting.html#could-not-find-the-drag-and-drop-manager-in-the-context',
				// 	displayName,
				// 	displayName,
				// )

				// const monitor = this.manager.getMonitor()
				// const [dragMonitor] = monitor;
				this.unsubscribeFromOffsetChange = monitor.subscribeToOffsetChange(
					this.handleChange,
				)
				this.unsubscribeFromStateChange = monitor.subscribeToStateChange(
					this.handleChange,
				)
			}

			private handleChange = () => {
				if (!this.isCurrentlyMounted) {
					return
				}

				const nextState = this.getCurrentState()
				if (!shallowEqual(nextState, this.state)) {
					this.setState(nextState)
				}
			}

			private getCurrentState() {
				if (!this.monitor) {
					return {}
				}

				// const [dragMonitor, resizeMonitor, rotateMonitor ] = this.monitor;

				// let monitor = dragMonitor;
				// if (resizeMonitor.isResizing()) monitor = resizeMonitor;
				// if (rotateMonitor.isRotating()) monitor = rotateMonitor;

				// const monitor = this.manager.getMonitor()
				return collect(this.monitor, this.props);
			}
		}

		return hoistStatics(DragLayerContainer, DecoratedComponent) as TargetClass &
			DndComponentClass<Props>
	}
}
