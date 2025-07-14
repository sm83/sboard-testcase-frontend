"use client";

import RectConnectionFeature from "@/canvas/RectConnectionFeature/RectConnectionFeature";
import styles from "./page.module.scss";
import { useCallback, useState } from "react";
import { Rect } from "@/canvas/RectConnectionFeature/types/Rect.type";
import { ConnectionPoint } from "@/canvas/RectConnectionFeature/types/ConnectionPoint.type";
import { Point } from "@/canvas/RectConnectionFeature/types/Point.type";
import Sidebar from "@/components/Sidebar/Sidebar";
import ValueInputGroup from "@/components/ValueInputGroup/ValueInputGroup";
import ValueInput from "@/components/ValueInput/ValueInput";
import InputBlock from "@/components/InputBlock/InputBlock";
import { Size } from "@/canvas/RectConnectionFeature/types/Size.type";
import { dataConverter } from "@/lib/dataConverter";
import { RuntimeException } from "@/canvas/RectConnectionFeature/subclasses/RuntimeException.class";
import Button from "@/components/Button/Button";

export interface RectangularPositionChangeParams {
	index: number;
	newPosition: Point;
}

export interface RectangularSizeChangeParams {
	index: number;
	newSize: Size;
}

export interface ConnectionPointPositionChangeParams {
	index: number;
	newPosition: Point;
}

export interface ConnectionPointAngleChangeParams {
	index: number;
	newAngle: number;
}

const initialRectangulars: [Rect, Rect] = [
	{ position: { x: 0, y: 0 }, size: { height: 100, width: 200 } },
	{ position: { x: 100, y: 150 }, size: { height: 100, width: 200 } },
];

const initialConnectionPoints: [ConnectionPoint, ConnectionPoint] = [
	{ point: { x: 50, y: -50 }, angle: 180 },
	{ point: { x: 170, y: 200 }, angle: 0 },
];

export default function Home() {
	const [rectangulars, setRectangulars] =
		useState<[Rect, Rect]>(initialRectangulars);

	const handleRectangularPositionChange = useCallback(
		({ index, newPosition }: RectangularPositionChangeParams): void => {
			setRectangulars((prev) => {
				const newRectangulars = [...prev] as [Rect, Rect];

				newRectangulars[index].position = newPosition;

				return newRectangulars;
			});
		},
		[]
	);

	const handleRectangularSizeChange = useCallback(
		({ index, newSize }: RectangularSizeChangeParams): void => {
			setRectangulars((prev) => {
				const newRectangulars = [...prev] as [Rect, Rect];

				newRectangulars[index].size = newSize;

				return newRectangulars;
			});
		},
		[]
	);

	const [connectionPoints, setConnectionPoints] = useState<
		[ConnectionPoint, ConnectionPoint]
	>(initialConnectionPoints);

	const handleConnectionPointPositionChange = useCallback(
		({ index, newPosition }: ConnectionPointPositionChangeParams): void => {
			setConnectionPoints((prev) => {
				const connectionPoints = [...prev] as [
					ConnectionPoint,
					ConnectionPoint
				];

				connectionPoints[index].point = newPosition;

				return connectionPoints;
			});
		},
		[]
	);

	const handleConnectionPointAngleChange = useCallback(
		({ index, newAngle }: ConnectionPointAngleChangeParams): void => {
			setConnectionPoints((prev) => {
				const connectionPoints = [...prev] as [
					ConnectionPoint,
					ConnectionPoint
				];

				connectionPoints[index].angle = newAngle;

				return connectionPoints;
			});
		},
		[]
	);

	const [connectionPath, setConnectionPath] = useState<Point[] | null>(null);

	const buildPath = useCallback(() => {
		console.log("Building path.");

		const newPath = dataConverter(
			rectangulars[0],
			rectangulars[1],
			connectionPoints[0],
			connectionPoints[1]
		);

		if (!(newPath instanceof RuntimeException)) {
			setConnectionPath(newPath);
		}
	}, [connectionPoints, rectangulars]);

	return (
		<main className={styles["page-wrapper"]}>
			<RectConnectionFeature
				initialRectangulars={initialRectangulars}
				rectangulars={rectangulars}
				initialConnectionPoints={initialConnectionPoints}
				connectionPoints={connectionPoints}
				connectionPath={connectionPath}
				handleRectangularPositionChange={handleRectangularPositionChange}
				handleConnectionPointPositionChange={
					handleConnectionPointPositionChange
				}
			/>
			<Sidebar position="right">
				<InputBlock title="Rectangular 1">
					<ValueInputGroup>
						<ValueInput
							name={"X:"}
							value={rectangulars[0].position.x}
							onChange={(e) => {
								handleRectangularPositionChange({
									index: 0,
									newPosition: {
										...rectangulars[0].position,
										x: +e.target.value,
									},
								});
							}}
						/>
						<ValueInput
							name={"Y:"}
							value={rectangulars[0].position.y}
							onChange={(e) => {
								handleRectangularPositionChange({
									index: 0,
									newPosition: {
										...rectangulars[0].position,
										y: +e.target.value,
									},
								});
							}}
						/>
					</ValueInputGroup>
					<ValueInputGroup>
						<ValueInput
							name={"W:"}
							value={rectangulars[0].size.width}
							onChange={(e) => {
								handleRectangularSizeChange({
									index: 0,
									newSize: {
										...rectangulars[0].size,
										width: +e.target.value,
									},
								});
							}}
						/>
						<ValueInput
							name={"H:"}
							value={rectangulars[0].size.height}
							onChange={(e) => {
								handleRectangularSizeChange({
									index: 0,
									newSize: {
										...rectangulars[0].size,
										height: +e.target.value,
									},
								});
							}}
						/>
					</ValueInputGroup>
				</InputBlock>
				<InputBlock title="Connection Point 1">
					<ValueInputGroup>
						<ValueInput
							name={"X:"}
							value={connectionPoints[0].point.x}
							onChange={(e) => {
								handleConnectionPointPositionChange({
									index: 0,
									newPosition: {
										...connectionPoints[0].point,
										x: +e.target.value,
									},
								});
							}}
						/>
						<ValueInput
							name={"Y:"}
							value={connectionPoints[0].point.y}
							onChange={(e) => {
								handleConnectionPointPositionChange({
									index: 0,
									newPosition: {
										...connectionPoints[0].point,
										y: +e.target.value,
									},
								});
							}}
						/>
						<ValueInput
							name={"Angle:"}
							value={connectionPoints[0].angle}
							onChange={(e) => {
								handleConnectionPointAngleChange({
									index: 0,
									newAngle: +e.target.value,
								});
							}}
						/>
					</ValueInputGroup>
				</InputBlock>

				<InputBlock title="Rectangular 2">
					<ValueInputGroup>
						<ValueInput
							name={"X:"}
							value={rectangulars[1].position.x}
							onChange={(e) => {
								handleRectangularPositionChange({
									index: 1,
									newPosition: {
										...rectangulars[1].position,
										x: +e.target.value,
									},
								});
							}}
						/>
						<ValueInput
							name={"Y:"}
							value={rectangulars[1].position.y}
							onChange={(e) => {
								handleRectangularPositionChange({
									index: 1,
									newPosition: {
										...rectangulars[1].position,
										y: +e.target.value,
									},
								});
							}}
						/>
					</ValueInputGroup>
					<ValueInputGroup>
						<ValueInput
							name={"W:"}
							value={rectangulars[1].size.width}
							onChange={(e) => {
								handleRectangularSizeChange({
									index: 1,
									newSize: {
										...rectangulars[1].size,
										width: +e.target.value,
									},
								});
							}}
						/>
						<ValueInput
							name={"H:"}
							value={rectangulars[1].size.height}
							onChange={(e) => {
								handleRectangularSizeChange({
									index: 1,
									newSize: {
										...rectangulars[1].size,
										height: +e.target.value,
									},
								});
							}}
						/>
					</ValueInputGroup>
				</InputBlock>
				<InputBlock title="Connection Point 2">
					<ValueInputGroup>
						<ValueInput
							name={"X:"}
							value={connectionPoints[1].point.x}
							onChange={(e) => {
								handleConnectionPointPositionChange({
									index: 1,
									newPosition: {
										...connectionPoints[1].point,
										x: +e.target.value,
									},
								});
							}}
						/>
						<ValueInput
							name={"Y:"}
							value={connectionPoints[1].point.y}
							onChange={(e) => {
								handleConnectionPointPositionChange({
									index: 1,
									newPosition: {
										...connectionPoints[1].point,
										y: +e.target.value,
									},
								});
							}}
						/>
						<ValueInput
							name={"Angle:"}
							value={connectionPoints[1].angle}
							onChange={(e) => {
								handleConnectionPointAngleChange({
									index: 1,
									newAngle: +e.target.value,
								});
							}}
						/>
					</ValueInputGroup>
				</InputBlock>
				<Button text="Build path" onClick={buildPath} />
			</Sidebar>
		</main>
	);
}
