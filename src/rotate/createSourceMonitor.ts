import {SourceMonitor} from '../createSourceMonitor';
import {IRotateMonitor} from './interfaces'
import {DragDropManager} from '@~sunsimiao/cj-dnd-core'
const invariant = require('invariant')

let isCallingIsDragging = false

export class RotateMonitor extends SourceMonitor {
    public canRotate() {
        this.canDrag()
	}

	public isRotating() {
		const item = this.internalMonitor.getItem()
		return this.internalMonitor.isDragging() && (item && item._actType === 'rotate')
    }
    
    // public isRotatingSource () {
    //     return false;
    // }
}

export default function createSourceMonitor<Context>(
	manager: DragDropManager<Context>,
): IRotateMonitor {
	return new RotateMonitor(manager) as IRotateMonitor
}

