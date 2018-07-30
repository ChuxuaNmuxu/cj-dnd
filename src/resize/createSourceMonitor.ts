import {SourceMonitor} from '../createSourceMonitor';
import {IResizeMonitor} from './interfaces'
import {DragDropManager} from '@~sunsimiao/cj-dnd-core'
const invariant = require('invariant')

export class ResizeMonitor extends SourceMonitor {
	getState () {
		this.internalMonitor.getState()
	}

    public canResize() {
        this.canDrag()
	}

	public isResizing() {
		const item = this.internalMonitor.getItem()
		return this.internalMonitor.isDragging() && (item && item._actType === 'resize')
    }
    
    // public isResizingSource () {
    //     return false;
	// }
	
	getDirection () {
		const itemOption = this.internalMonitor.getState().dragOperation.itemOption;
		return itemOption && itemOption.options && itemOption.options.direction;
	}
}

export default function createSourceMonitor<Context>(
	manager: DragDropManager<Context>,
): IResizeMonitor {
	return new ResizeMonitor(manager) as IResizeMonitor
}
