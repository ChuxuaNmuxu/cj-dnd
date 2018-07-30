import {DragDropMonitor} from '@~sunsimiao/cj-dnd-core';
import * as dndInterfaces from '../interfaces'

export interface IRotateMonitor extends DragDropMonitor  {
    isRotating(): boolean;
    // isRotatingSource(sourceId: string): boolean;
}

export interface RotateSourceMonitor extends dndInterfaces.DragSourceMonitor {
	canRotate(): boolean
	isRotating(): boolean
}

export interface RotateSourceSpec<Props, RotateObject> {
    beginRotate (props: Props, monitor: RotateSourceMonitor, component: any): RotateObject
    rotate? (props: Props, monitor: RotateSourceMonitor, component: any): void
    endRotate? (props: Props, monitor: RotateSourceMonitor, component: any): void
    canRotate? (props: Props, monitor: RotateSourceMonitor): boolean
    isRotating? (props: Props, monitor: RotateSourceMonitor): boolean
}

export interface RotateSource {
    beginRotate(monitor: IRotateMonitor, targetId: string): void;
    endRotate?(monitor: IRotateMonitor, targetId: string): void;
    canRotate?(monitor: IRotateMonitor, targetId: string): boolean;
    isRotating?(monitor: IRotateMonitor, targetId: string): boolean;
}

export interface RotateSourceConnector {
	RotateSource(): dndInterfaces.ConnectDragSource
	RotatePreview(): dndInterfaces.ConnectDragPreview
}

export type RotateSourceCollector<CollectedProps> = (
	connect: RotateSourceConnector,
	monitor: RotateSourceMonitor,
) => CollectedProps
