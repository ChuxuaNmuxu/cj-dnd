import {DragDropMonitor} from '@~sunsimiao/cj-dnd-core';
import * as dndInterfaces from '../interfaces'

export interface IResizeMonitor extends DragDropMonitor  {
    getState(): any
    isResizing(): boolean;
    // isResizingSource(sourceId: string): boolean;
    getDirection(): string | null
}

export interface ResizeSourceMonitor extends dndInterfaces.DragSourceMonitor {
	canResize(): boolean
	isResizing(): boolean
}

export interface ResizeSourceSpec<Props, ResizeObject> {
    beginResize (props: Props, monitor: ResizeSourceMonitor, component: any): ResizeObject
    resize? (props: Props, monitor: ResizeSourceMonitor, component: any): void
    endResize? (props: Props, monitor: ResizeSourceMonitor, component: any): void
    canResize? (props: Props, monitor: ResizeSourceMonitor): boolean
    isResizing? (props: Props, monitor: ResizeSourceMonitor): boolean
}

export interface ResizeSource {
    beginResize(monitor: IResizeMonitor, targetId: string): void;
    endResize?(monitor: IResizeMonitor, targetId: string): void;
    canResize?(monitor: IResizeMonitor, targetId: string): boolean;
    isResizing?(monitor: IResizeMonitor, targetId: string): boolean;
}

export interface ResizeSourceConnector {
	ResizeSource(): dndInterfaces.ConnectDragSource
	ResizePreview(): dndInterfaces.ConnectDragPreview
}

export type ResizeSourceCollector<CollectedProps> = (
	connect: ResizeSourceConnector,
	monitor: ResizeSourceMonitor,
) => CollectedProps
