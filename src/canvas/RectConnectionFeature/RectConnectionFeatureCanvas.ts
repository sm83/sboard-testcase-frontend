import { AnyException } from "./types/AnyException.type";
import { ConnectionPoint } from "./types/ConnectionPoint.type";
import { Point } from "./types/Point.type";
import { InitException } from "./subclassesUtils/InitException.class";
import { RuntimeException } from "./subclassesUtils/RuntimeException.class";
import { dataConverter } from "@/canvas/RectConnectionFeature/utils/dataConverter";
import RectangularCanvasItem from "./subclassesCanvas/RectangularCanvasItem.class";
import ConnectionPointCanvasItem from "./subclassesCanvas/ConnectionPointCanvasItem.class";
import ConnectionPathCanvasItem from "./subclassesCanvas/ConnectionPathCanvasItem.class";
import {
	showConstructionLogs,
	showInitExceptions,
	showRuntimeExceptions,
} from "@/config";
import { Rect } from "./types/Rect.type";

class RectConnectionFeatureCanvas {
	#canvas: HTMLCanvasElement;
	#ctx: CanvasRenderingContext2D;

	// children instances
	#rectangulars: [RectangularCanvasItem, RectangularCanvasItem];
	#connectionPath: ConnectionPathCanvasItem | null = null;

	#errors: AnyException[] = [];
	#pushError: (newError: AnyException) => void = (newError: AnyException) => {
		// go see config.ts to manage it.
		if (showRuntimeExceptions && newError instanceof RuntimeException) {
			this.#errors.push(newError);
			console.warn(newError);
		}

		// go see config.ts to manage it.
		if (showInitExceptions && newError instanceof InitException) {
			this.#errors.push(newError);
			console.warn(newError);
		}
	};

	constructor(constructBody: {
		canvas: HTMLCanvasElement;
		ctx: CanvasRenderingContext2D;

		rectangulars: [Rect, Rect];

		connectionPoints: [ConnectionPoint, ConnectionPoint] | null;
		connectionPath: Point[] | null;
	}) {
		if (showConstructionLogs) {
			console.log("CONSTRUCTION: RectConnectionFeatureCanvas");
		}

		this.#canvas = constructBody.canvas;
		this.#ctx = constructBody.ctx;

		this.#rectangulars = [
			new RectangularCanvasItem({
				canvas: constructBody.canvas,
				ctx: constructBody.ctx,
				index: 0,
				rectangular: { ...constructBody.rectangulars[0] },
				connectionPoints: constructBody.connectionPoints,
				pushError: this.#pushError,
			}),
			new RectangularCanvasItem({
				canvas: constructBody.canvas,
				ctx: constructBody.ctx,
				index: 1,
				rectangular: { ...constructBody.rectangulars[1] },
				connectionPoints: constructBody.connectionPoints,
				pushError: this.#pushError,
			}),
		];

		if (constructBody.connectionPath) {
			this.#connectionPath = new ConnectionPathCanvasItem({
				ctx: constructBody.ctx,
				connectionPath: constructBody.connectionPath,
			});
		}

		this.#drawAll();
	}

	getRectangulars() {
		return this.#rectangulars;
	}

	getConnectionPointsFromRectangulars(): ConnectionPointCanvasItem[] {
		const connectionPoints: ConnectionPointCanvasItem[] = [];

		this.#rectangulars.forEach((rect) => {
			const connectionPoint = rect.getConnectionPoint();

			if (connectionPoint instanceof InitException) {
				this.#pushError(connectionPoint);
			} else {
				connectionPoints.push(connectionPoint);
			}
		});

		return connectionPoints;
	}

	// reactive adaptation
	updateRectangulars({ newRectangulars }: { newRectangulars: [Rect, Rect] }) {
		const current: [Rect, Rect] = this.#rectangulars.map((rect) =>
			rect.getState()
		) as [Rect, Rect];

		current.forEach((rect, index) => {
			// Position changed
			if (rect.position !== newRectangulars[index].position) {
				// moving rectangular
				this.#rectangulars[index].move(
					newRectangulars[index].position.x,
					newRectangulars[index].position.y
				);
			}
			// size changed
			if (rect.size !== newRectangulars[index].size) {
				// resizing rectangular
				this.#rectangulars[index].resize(
					newRectangulars[index].size.width,
					newRectangulars[index].size.height
				);
			}

			// checking connection point connection. вот так
			this.#rectangulars[index].checkAndUpdateConnectionPointEdge();
		});

		this.#drawAll();
	}

	// reactive adaptation
	updateConnectionPoints({
		newConnectionPoints,
	}: {
		newConnectionPoints: [ConnectionPoint, ConnectionPoint];
	}) {
		const current = this.#rectangulars.map((rect) => rect.getConnectionPoint());

		current.forEach((connectionPoint, index) => {
			// if connection point was constructed successfully
			if (!(connectionPoint instanceof InitException)) {
				// Position changed
				if (
					connectionPoint.getPosition() !== newConnectionPoints[index].point
				) {
					connectionPoint.move({
						newPosition: newConnectionPoints[index].point,
					});
				}

				// Angle changed
				if (connectionPoint.getAngle() !== newConnectionPoints[index].angle) {
					connectionPoint.rotate({
						newAngle: newConnectionPoints[index].angle,
					});
				}

				// checking connection point connection. вот так
				this.#rectangulars[index].checkAndUpdateConnectionPointEdge();

				// and after all transformations of connection point
				// we are updating relativePosition
				const currentRectPosition = this.#rectangulars[index].getPosition();
				const currentConnectionPointPosition = connectionPoint.getPosition();

				// updating relative position. if its a new value - connection point instance
				// will proceed checkConnection method.

				connectionPoint.setRelativePosition({
					x: currentConnectionPointPosition.x - currentRectPosition.x,
					y: currentConnectionPointPosition.y - currentRectPosition.y,
				});
			}
		});

		this.#drawAll();
	}

	updateConnectionPath() {
		const cPointItem1 = this.#rectangulars[0].getConnectionPoint();
		const cPointItem2 = this.#rectangulars[1].getConnectionPoint();

		if (
			!(cPointItem1 instanceof InitException) &&
			!(cPointItem2 instanceof InitException)
		) {
			if (cPointItem1.getEdge() && cPointItem2.getEdge()) {
				const rect1 = this.#rectangulars[0].getState();
				const rect2 = this.#rectangulars[1].getState();
				const cPoint1 = cPointItem1.getState();
				const cPoint2 = cPointItem2.getState();

				const newPath = dataConverter(rect1, rect2, cPoint1, cPoint2);

				if (!(newPath instanceof RuntimeException)) {
					if (this.#connectionPath === null) {
						this.#connectionPath = new ConnectionPathCanvasItem({
							ctx: this.#ctx,
							connectionPath: newPath,
						});
					} else {
						this.#connectionPath?.update(newPath);
					}

					this.#drawAll();
				}
			} else {
				this.#connectionPath?.update([]);
			}
		}
	}

	// drawing code area
	#drawAll() {
		this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

		this.#drawBackgroundGrid();

		this.#drawRects();

		const connectionPoints = this.getConnectionPointsFromRectangulars();

		if (connectionPoints) {
			this.#drawConnectionPoints();
		}

		if (this.#connectionPath) {
			this.#drawConnectionPath();
		}
	}

	#drawRects() {
		this.#ctx.save();
		this.#ctx.translate(this.#canvas.width / 2, this.#canvas.height / 2);

		this.#rectangulars.forEach((reclangularItem) => {
			reclangularItem.draw();
		});

		this.#ctx.restore();
	}

	#drawConnectionPoints() {
		this.#ctx.save();
		this.#ctx.translate(this.#canvas.width / 2, this.#canvas.height / 2);

		this.#rectangulars.forEach((rectangular) => {
			rectangular.drawConnectionPoint();
		});

		this.#ctx.restore();
	}

	#drawConnectionPath() {
		this.#ctx.save();
		this.#ctx.translate(this.#canvas.width / 2, this.#canvas.height / 2);

		if (this.#connectionPath) {
			this.#connectionPath.draw();
		}

		this.#ctx.restore();
	}

	#drawBackgroundGrid() {
		this.#ctx.save();

		this.#ctx.translate(this.#canvas.width / 2, this.#canvas.height / 2);

		this.#ctx.lineWidth = 1;

		// Y
		for (let x = 25; x < this.#canvas.width / 2; x += 25) {
			if (x % 100 === 0) {
				this.#ctx.strokeStyle = `#555555`;
			} else {
				this.#ctx.strokeStyle = `#4E4E4E`;
			}

			this.#ctx.beginPath();
			this.#ctx.moveTo(x, -this.#canvas.height / 2);
			this.#ctx.lineTo(x, this.#canvas.height / 2);
			this.#ctx.stroke();

			this.#ctx.beginPath();
			this.#ctx.moveTo(-x, -this.#canvas.height / 2);
			this.#ctx.lineTo(-x, this.#canvas.height / 2);
			this.#ctx.stroke();
		}

		// X
		for (let y = 25; y < this.#canvas.width / 2; y += 25) {
			if (y % 100 === 0) {
				this.#ctx.strokeStyle = `#555555`;
			} else {
				this.#ctx.strokeStyle = `#4E4E4E`;
			}

			this.#ctx.beginPath();
			this.#ctx.moveTo(-this.#canvas.width / 2, y);
			this.#ctx.lineTo(this.#canvas.width / 2, y);
			this.#ctx.stroke();

			this.#ctx.beginPath();
			this.#ctx.moveTo(-this.#canvas.width / 2, -y);
			this.#ctx.lineTo(this.#canvas.width / 2, -y);
			this.#ctx.stroke();
		}

		// Y 0
		this.#ctx.strokeStyle = `#658D25`;
		this.#ctx.beginPath();
		this.#ctx.moveTo(0, -this.#canvas.height / 2);
		this.#ctx.lineTo(0, this.#canvas.height / 2);
		this.#ctx.stroke();

		// X 0
		this.#ctx.strokeStyle = `#9E3C4A`;
		this.#ctx.beginPath();
		this.#ctx.moveTo(-this.#canvas.width / 2, 0);
		this.#ctx.lineTo(this.#canvas.width / 2, 0);
		this.#ctx.stroke();

		this.#ctx.restore();
	}

	// resize code area
	resizeCanvas(updatedCanvas: HTMLCanvasElement) {
		this.#canvas = updatedCanvas;

		this.#drawAll();
	}
}

export default RectConnectionFeatureCanvas;
