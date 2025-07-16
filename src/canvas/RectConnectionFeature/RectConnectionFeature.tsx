import styles from "./RectConnectionFeature.module.scss";

import { useCallback, useEffect, useRef, useState } from "react";
import RectConnectionFeatureCanvas from "./RectConnectionFeatureCanvas";
import { Rect } from "./types/Rect.type";
import { ConnectionPoint } from "./types/ConnectionPoint.type";
import useRectangularDrag from "@/canvas/RectConnectionFeature/hooks/useRectangularDrag";
import {
	ConnectionPointPositionChangeParams,
	RectangularPositionChangeParams,
} from "@/app/page";

const RectConnectionFeature = ({
	initialRectangulars,
	rectangulars,
	initialConnectionPoints,
	connectionPoints,
	handleRectangularPositionChange,
	handleConnectionPointPositionChange,
}: {
	initialRectangulars: [Rect, Rect];
	rectangulars: [Rect, Rect];
	initialConnectionPoints: [ConnectionPoint, ConnectionPoint];
	connectionPoints: [ConnectionPoint, ConnectionPoint];
	handleRectangularPositionChange: ({
		index,
		newPosition,
	}: RectangularPositionChangeParams) => void;
	handleConnectionPointPositionChange: ({
		index,
		newPosition,
	}: ConnectionPointPositionChangeParams) => void;
}) => {
	const featureId: string = "rect-connection-feature";

	const wrapper = useRef<HTMLDivElement | null>(null);
	const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
	const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
	const [canvasFeature, setCanvasFeature] =
		useState<RectConnectionFeatureCanvas | null>(null);

	// initializing canvas and ctx once if wrapper changed
	useEffect(() => {
		const canvasElement = document.getElementById(
			featureId
		) as HTMLCanvasElement | null;

		if (canvasElement && wrapper.current) {
			canvasElement.width = wrapper.current.clientWidth;
			canvasElement.height = wrapper.current.clientHeight;

			setCanvas(canvasElement);
			setCtx(canvasElement.getContext("2d"));
		}
	}, [wrapper]);

	// creating feature if canvas and ctx exists
	useEffect(() => {
		if (canvas && ctx) {
			const rectConnectionFeature = new RectConnectionFeatureCanvas({
				canvas,
				ctx,
				rectangulars: initialRectangulars,
				connectionPoints: initialConnectionPoints,
				connectionPath: null,
			});
			setCanvasFeature(rectConnectionFeature);
		}
	}, [canvas, ctx, initialConnectionPoints, initialRectangulars]);

	// updating rectangulars
	useEffect(() => {
		canvasFeature?.updateRectangulars({ newRectangulars: rectangulars });

		canvasFeature?.updateConnectionPath();
	}, [canvasFeature, rectangulars]);

	// updating connectionPoints
	useEffect(() => {
		canvasFeature?.updateConnectionPoints({
			newConnectionPoints: connectionPoints,
		});

		canvasFeature?.updateConnectionPath();
	}, [canvasFeature, connectionPoints]);

	// resize callback
	const redrawFeature = useCallback(() => {
		if (canvas && ctx && wrapper.current) {
			canvas.width = wrapper.current.clientWidth;
			canvas.height = wrapper.current.clientHeight;

			canvasFeature?.resizeCanvas(canvas);
		}
	}, [canvas, ctx, canvasFeature, wrapper]);

	// resize handler
	useEffect(() => {
		window.addEventListener("resize", redrawFeature);
		return () => window.removeEventListener("resize", redrawFeature);
	}, [redrawFeature]);

	// dragger
	const { handleMouseDown, handleMouseUp, handleMouseMove } =
		useRectangularDrag({
			canvas,
			canvasFeature,
			handleRectangularPositionChange,
			handleConnectionPointPositionChange,
		});

	return (
		<div ref={wrapper} className={styles["rect-connection-feature-wrapper"]}>
			<canvas
				id={featureId}
				className={styles["rect-connection-feature"]}
				onMouseDown={handleMouseDown}
				onMouseUp={handleMouseUp}
				onMouseMove={handleMouseMove}
			/>
		</div>
	);
};

export default RectConnectionFeature;
