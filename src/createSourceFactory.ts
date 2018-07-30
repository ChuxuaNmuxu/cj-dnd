import { createRef } from 'react'
import { DragSource, DragDropMonitor } from '@~sunsimiao/cj-dnd-core'
import { DragSourceSpec } from './interfaces'
const invariant = require('invariant')
const isPlainObject = require('lodash/isPlainObject')

const ALLOWED_SPEC_METHODS = ['canDrag', 'beginDrag', 'isDragging', 'endDrag', 'drag']
const REQUIRED_SPEC_METHODS = ['beginDrag']

export interface Source extends DragSource {
	receiveProps(props: any): void
}

export default function createSourceFactory<Props, DragObject = {}>(
	spec: DragSourceSpec<Props, DragObject>,
	dragStartItem: object | undefined = {_actType: 'drag'}
) {
	Object.keys(spec).forEach(key => {
		invariant(
			ALLOWED_SPEC_METHODS.indexOf(key) > -1,
			'Expected the drag source specification to only have ' +
				'some of the following keys: %s. ' +
				'Instead received a specification with an unexpected "%s" key. ' +
				'Read more: http://react-dnd.github.io/react-dnd/docs-drag-source.html',
			ALLOWED_SPEC_METHODS.join(', '),
			key,
		)
		invariant(
			typeof (spec as any)[key] === 'function',
			'Expected %s in the drag source specification to be a function. ' +
				'Instead received a specification with %s: %s. ' +
				'Read more: http://react-dnd.github.io/react-dnd/docs-drag-source.html',
			key,
			key,
			(spec as any)[key],
		)
	})
	REQUIRED_SPEC_METHODS.forEach(key => {
		invariant(
			typeof (spec as any)[key] === 'function',
			'Expected %s in the drag source specification to be a function. ' +
				'Instead received a specification with %s: %s. ' +
				'Read more: http://react-dnd.github.io/react-dnd/docs-drag-source.html',
			key,
			key,
			(spec as any)[key],
		)
	})

	class SourceImpl implements Source {
		private props: Props | null = null
		private ref: React.RefObject<any> = createRef()

		constructor(private monitor: any) {
			this.beginDrag = this.beginDrag.bind(this)
		}

		public receiveProps(props: any) {
			this.props = props
		}

		public canDrag() {
			if (!this.props) {
				return false
			}
			if (!spec.canDrag) {
				return true
			}

			return spec.canDrag(this.props, this.monitor)
		}

		public isDragging(globalMonitor: DragDropMonitor, sourceId: string) {
			if (!this.props) {
				return false
			}
			if (!spec.isDragging) {
				return sourceId === globalMonitor.getSourceId()
			}

			return spec.isDragging(this.props, this.monitor)
		}

		public beginDrag() {
			if (!this.props) {
				return
			}

			// 在beginDrag时便可以区分是什么动作drag, resize, rotate
			const item: any = spec.beginDrag(this.props, this.monitor, this.ref.current)
			if (process.env.NODE_ENV !== 'production') {
				invariant(
					isPlainObject(item),
					'beginDrag() must return a plain object that represents the dragged item. ' +
						'Instead received %s. ' +
						'Read more: http://react-dnd.github.io/react-dnd/docs-drag-source.html',
					item,
				)
			}
			return {...dragStartItem, ...item}
		}

		public drag () {
			if (!this.props) {
				return
			}
			if (!spec.drag) {
				return
			}

			spec.drag(this.props, this.monitor, this.ref.current)
		}

		public endDrag() {
			if (!this.props) {
				return
			}
			if (!spec.endDrag) {
				return
			}

			spec.endDrag(this.props, this.monitor, this.ref.current)
		}
	}

	return function createSource(monitor: any) {
		return new SourceImpl(monitor) as Source
	}
}
