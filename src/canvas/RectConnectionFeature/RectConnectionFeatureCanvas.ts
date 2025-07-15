import ConnectionPathItem from "./subclasses/RectangularConnectionPath.class";
import ConnectionPointItem from "./subclasses/RectangularConnectionPoint.class";
import RectangularItem from "./subclasses/RectangularItem.class";
import { AnyException } from "./types/AnyException.type";
import { ConnectionPoint } from "./types/ConnectionPoint.type";
import { Point } from "./types/Point.type";
import { Rect } from "./types/Rect.type";
import { InitException } from "./subclasses/InitException.class";
import { AlignmentNormal } from "./types/AlignmentNormal.type";
import { RuntimeException } from "./subclasses/RuntimeException.class";

class RectConnectionFeatureCanvas {
	#canvas: HTMLCanvasElement;
	#ctx: CanvasRenderingContext2D;

	// children instances
	#rectangulars: [RectangularItem, RectangularItem];
	#connectionPath: ConnectionPathItem | null = null;

	#errors: AnyException[] = [];
	#pushError: (newError: AnyException) => void = (newError: AnyException) => {
		// TODO: place it to .env
		const debug = false;

		if (debug && newError instanceof RuntimeException) {
			this.#errors.push(newError);
			console.warn(newError);
		}

		if (newError instanceof InitException) {
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
		console.log("CONSTRUCTION: RectConnectionFeatureCanvas");

		this.#canvas = constructBody.canvas;
		this.#ctx = constructBody.ctx;

		this.#rectangulars = [
			new RectangularItem({
				canvas: constructBody.canvas,
				ctx: constructBody.ctx,
				index: 0,
				rectangular: { ...constructBody.rectangulars[0] },
				connectionPoints: constructBody.connectionPoints,
				pushError: this.#pushError,
			}),
			new RectangularItem({
				canvas: constructBody.canvas,
				ctx: constructBody.ctx,
				index: 1,
				rectangular: { ...constructBody.rectangulars[1] },
				connectionPoints: constructBody.connectionPoints,
				pushError: this.#pushError,
			}),
		];

		if (constructBody.connectionPath) {
			this.#connectionPath = new ConnectionPathItem({
				ctx: constructBody.ctx,
				connectionPath: constructBody.connectionPath,
			});
		}

		this.#drawAll();
	}

	getRectangulars() {
		return this.#rectangulars;
	}

	getConnectionPointsFromRectangulars(): ConnectionPointItem[] {
		const connectionPoints: ConnectionPointItem[] = [];

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

				// and after all transformations of connection point
				// we are updating relativePosition
				const currentRectPosition = this.#rectangulars[index].getPosition();
				const currentConnectionPointPosition = connectionPoint.getPosition();

				// updating relative position. if its a new value - connection point instance
				// will proceed checkConnection method.

				// if edge assigned - check if it still connected
				if (connectionPoint.getEdge() !== null) {
					connectionPoint.checkConnection();
					if (connectionPoint.getConnectionStatus() === "disconnected") {
						this.#rectangulars[index].updateConnectionPointEdge();
					}

					// else - check if it was attached to any rectangular edge during transform
				} else {
					this.#rectangulars[index].updateConnectionPointEdge();
				}

				connectionPoint.setRelativePosition({
					x: currentConnectionPointPosition.x - currentRectPosition.x,
					y: currentConnectionPointPosition.y - currentRectPosition.y,
				});
			}
		});

		this.#drawAll();
	}

	#calculateOffsetByEdgeNormal({
		scaleChange,
		edgeNormal,
	}: {
		scaleChange: Point;
		edgeNormal: AlignmentNormal;
	}): Point {
		switch (edgeNormal) {
			case 0:
				return { x: 0, y: scaleChange.y / 2 };
			case 90:
				return { x: scaleChange.x / 2, y: 0 };
			case 180:
				return { x: 0, y: -scaleChange.y / 2 };
			case 270:
				return { x: -scaleChange.x / 2, y: 0 };
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
