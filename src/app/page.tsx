"use client";

import RectConnectionFeature, {
	RectConnectionFeatureRef,
} from "@/canvas/RectConnectionFeature/RectConnectionFeature";
import styles from "./page.module.scss";
import { useCallback, useRef, useState } from "react";
import { Rect } from "@/canvas/RectConnectionFeature/types/Rect.type";
import { ConnectionPoint } from "@/canvas/RectConnectionFeature/types/ConnectionPoint.type";
import Sidebar from "@/components/Sidebar/Sidebar";
import ValueInputGroup from "@/components/ValueInputGroup/ValueInputGroup";
import ValueInput from "@/components/ValueInput/ValueInput";
import InputBlock from "@/components/InputBlock/InputBlock";
import Button from "@/components/Button/Button";
import { dataConverter } from "@/canvas/RectConnectionFeature/utils/dataConverter";
import useRectConnectionFeature from "@/canvas/RectConnectionFeature/hooks/useRectConnectionFeature";
import { GitHubLinkIcon } from "@/components/GithubLinkIcon/GithubLinkIcon";

const initialRectangulars: [Rect, Rect] = [
	{ position: { x: 0, y: 0 }, size: { height: 100, width: 200 } },
	{ position: { x: 100, y: 150 }, size: { height: 100, width: 200 } },
];

const initialConnectionPoints: [ConnectionPoint, ConnectionPoint] = [
	{ point: { x: 50, y: -50 }, angle: 180 },
	{ point: { x: 100, y: 200 }, angle: 0 },
];

export default function Home() {
	const [rectangulars, setRectangulars] =
		useState<[Rect, Rect]>(initialRectangulars);

	const [connectionPoints, setConnectionPoints] = useState<
		[ConnectionPoint, ConnectionPoint]
	>(initialConnectionPoints);

	const rectConnectionFeatureRef = useRef<RectConnectionFeatureRef | null>(
		null
	);

	// feel free to take performance measurements here.
	const buildPath = useCallback(() => {
		// ATTENTION!
		// set useDebug to false to avoid perfomance violation by console.
		const useDebug = true;

		const iterations = 1;

		for (let i = 0; i < iterations; i++) {
			dataConverter(
				rectangulars[0],
				rectangulars[1],
				connectionPoints[0],
				connectionPoints[1],
				useDebug
			);
		}
	}, [connectionPoints, rectangulars]);

	// ready to use methods, which controls <RectConnectionFeature>

	// warning: uses ImperativeHandle methods from rectConnectionFeatureRef.
	// code of this hook might be non-obvious because useImperativeHandle
	// breaks React patterns, but in a controlled way.
	const {
		handleRectangularPositionChange,
		handleRectangularSizeChange,
		handleConnectionPointPositionChange,
		handleConnectionPointAngleChange,
	} = useRectConnectionFeature({
		rectangulars,
		connectionPoints,
		rectConnectionFeatureRef,
	});

	return (
		<main className={styles["page"]}>
			<div className={styles["page__github-btn-wrapper"]}>
				<button
					className={styles["page__github-btn"]}
					onClick={() => {
						window.open(
							"https://github.com/sm83/sboard-testcase-frontend",
							"_blank",
							"noopener noreferrer"
						);
					}}
					aria-label="Открыть исходный код на Github в новой вкладке"
				>
					<GitHubLinkIcon sizeInRem={5} />
				</button>
			</div>
			<RectConnectionFeature
				ref={rectConnectionFeatureRef}
				initialRectangulars={initialRectangulars}
				rectangulars={rectangulars}
				setRectangulars={setRectangulars}
				initialConnectionPoints={initialConnectionPoints}
				connectionPoints={connectionPoints}
				setConnectionPoints={setConnectionPoints}
			/>
			<Sidebar position="right">
				<InputBlock title="Rectangular 1">
					<ValueInputGroup>
						<ValueInput
							name={"X:"}
							value={rectangulars[0].position.x}
							onChange={(e) => {
								handleRectangularPositionChange({ e, field: "x", index: 0 });
							}}
						/>
						<ValueInput
							name={"Y:"}
							value={rectangulars[0].position.y}
							onChange={(e) => {
								handleRectangularPositionChange({ e, field: "y", index: 0 });
							}}
						/>
					</ValueInputGroup>
					<ValueInputGroup>
						<ValueInput
							name={"W:"}
							value={rectangulars[0].size.width}
							onChange={(e) => {
								handleRectangularSizeChange({ e, field: "width", index: 0 });
							}}
						/>
						<ValueInput
							name={"H:"}
							value={rectangulars[0].size.height}
							onChange={(e) => {
								handleRectangularSizeChange({ e, field: "height", index: 0 });
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
									e,
									field: "x",
									index: 0,
								});
							}}
						/>
						<ValueInput
							name={"Y:"}
							value={connectionPoints[0].point.y}
							onChange={(e) => {
								handleConnectionPointPositionChange({
									e,
									field: "y",
									index: 0,
								});
							}}
						/>
						<ValueInput
							name={"Angle:"}
							value={connectionPoints[0].angle}
							onChange={(e) => {
								handleConnectionPointAngleChange({ e, index: 0 });
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
								handleRectangularPositionChange({ e, field: "x", index: 1 });
							}}
						/>
						<ValueInput
							name={"Y:"}
							value={rectangulars[1].position.y}
							onChange={(e) => {
								handleRectangularPositionChange({ e, field: "y", index: 1 });
							}}
						/>
					</ValueInputGroup>
					<ValueInputGroup>
						<ValueInput
							name={"W:"}
							value={rectangulars[1].size.width}
							onChange={(e) => {
								handleRectangularSizeChange({ e, field: "width", index: 1 });
							}}
						/>
						<ValueInput
							name={"H:"}
							value={rectangulars[1].size.height}
							onChange={(e) => {
								handleRectangularSizeChange({ e, field: "height", index: 1 });
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
									e,
									field: "x",
									index: 1,
								});
							}}
						/>
						<ValueInput
							name={"Y:"}
							value={connectionPoints[1].point.y}
							onChange={(e) => {
								handleConnectionPointPositionChange({
									e,
									field: "y",
									index: 1,
								});
							}}
						/>
						<ValueInput
							name={"Angle:"}
							value={connectionPoints[1].angle}
							onChange={(e) => {
								handleConnectionPointAngleChange({ e, index: 1 });
							}}
						/>
					</ValueInputGroup>
				</InputBlock>
				<Button text="Run 'dataConverter'" onClick={buildPath} />
			</Sidebar>
		</main>
	);
}
