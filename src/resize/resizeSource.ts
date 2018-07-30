import * as React from 'react'
import { SourceType } from '@~sunsimiao/cj-dnd-core'
import {
	DragSourceSpec,
	// DragSourceCollector,
	DndOptions,
	DndComponentClass,
} from '../interfaces'
import {
	ResizeSourceSpec,
	ResizeSourceCollector,
} from './interfaces';
import checkDecoratorArguments from '../utils/checkDecoratorArguments'
import decorateHandler from '../decorateHandler'
import registerSource from '../registerSource'
import createSourceFactory from '../createSourceFactory'
import createSourceMonitor from './createSourceMonitor'
import createSourceConnector from './createSourceConnector'
import isValidType from '../utils/isValidType'
const invariant = require('invariant')
const isPlainObject = require('lodash/isPlainObject')

/**
 * Decorates a component as a dragsource
 * @param type The dragsource type
 * @param spec The drag source specification
 * @param collect The props collector function
 * @param options DnD optinos
 */
export default function ResizeSource<Props, CollectedProps = {}, ResizeObject = {}>(
	type: SourceType | ((props: Props) => SourceType),
	spec: ResizeSourceSpec<Props, ResizeObject>,
	collect: ResizeSourceCollector<CollectedProps>,
	options: DndOptions<Props> = {},
) {
	checkDecoratorArguments(
		'ResizeSource',
		'type, spec, collect[, options]',
		type,
		spec,
		collect,
		options,
	)
	let getType: ((props: Props) => SourceType) = type as ((
		props: Props,
	) => SourceType)
	if (typeof type !== 'function') {
		invariant(
			isValidType(type),
			'Expected "type" provided as the first argument to DragSource to be ' +
				'a string, or a function that returns a string given the current props. ' +
				'Instead, received %s. ' +
				'Read more: http://react-dnd.github.io/react-dnd/docs-drag-source.html',
			type,
		)
		getType = () => type
	}
	invariant(
		isPlainObject(spec),
		'Expected "spec" provided as the second argument to DragSource to be ' +
			'a plain object. Instead, received %s. ' +
			'Read more: http://react-dnd.github.io/react-dnd/docs-drag-source.html',
		spec,
	)
	
	let dragSpec: DragSourceSpec<Props, any>;
	dragSpec = {
		beginDrag (props, monitor, component) {
			return spec.beginResize(props, monitor, component)
		}
	}

	if (spec.resize) dragSpec.drag = (props, monitor, component) => {
		(spec as any).resize(props, monitor, component)
	}

	if (spec.canResize) dragSpec.canDrag = (props, monitor) => {
		return (spec as any).canResize(props, monitor)
	}

	if (spec.endResize) dragSpec.endDrag = (props, monitor) => {
		return (spec as any).endResize(props, monitor)
	}

	const createSource = createSourceFactory(dragSpec, {
		_actType: 'resize'
	})
	invariant(
		typeof collect === 'function',
		'Expected "collect" provided as the third argument to DragSource to be ' +
			'a function that returns a plain object of props to inject. ' +
			'Instead, received %s. ' +
			'Read more: http://react-dnd.github.io/react-dnd/docs-drag-source.html',
		collect,
	)
	invariant(
		isPlainObject(options),
		'Expected "options" provided as the fourth argument to DragSource to be ' +
			'a plain object when specified. ' +
			'Instead, received %s. ' +
			'Read more: http://react-dnd.github.io/react-dnd/docs-drag-source.html',
		collect,
	)

	return function decorateSource<
		TargetClass extends
			| React.ComponentClass<Props>
			| React.StatelessComponent<Props>
	>(DecoratedComponent: TargetClass): TargetClass & DndComponentClass<Props> {
		return decorateHandler<Props, TargetClass, SourceType>({
			containerDisplayName: 'ResizeSource',
			createHandler: createSource,
			registerHandler: registerSource,
			createMonitor: createSourceMonitor,
			createConnector: createSourceConnector,
			DecoratedComponent,
			getType,
			collect,
			options,
		})
	}
}
