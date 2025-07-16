import isPointOnSegment from "@/lib/isPointOnSegment";
import { AnyException } from "../types/AnyException.type";
import { ConnectionPoint } from "../types/ConnectionPoint.type";
import { Point } from "../types/Point.type";
import { RuntimeException } from "../subclassesUtils/RuntimeException.class";
import { showConstructionLogs } from "@/config";
import Edge from "../subclassesUtils/Edge.class";

type AngleStatus = "perpendicular" | "non perpendicular";

class ConnectionPointCanvasItem {
	#index: number;
	#ctx: CanvasRenderingContext2D;
	#pushError: (newError: AnyException) => void;

	// data
	#position: Point;
	#angle: number;

	// drawing
	#pointRadius: number;
	#anlgePointer: Point;

	// memory
	#relativePosition: Point;
	#edge: Edge | null;

	// status
	#angleStatus: AngleStatus;

	// note: initial construction can appear only once
	// and if there are no InitException in parrent class (Edge)
	constructor(constructBody: {
		index: number;
		ctx: CanvasRenderingContext2D;
		pushError: (newError: AnyException) => void;

		connectionPoint: ConnectionPoint;

		pointRadius: number;
		rectangularPosition: Point;
		edge: Edge;
	}) {
		if (showConstructionLogs) {
			console.log(
				"CONSTRUCTION: ConnectionPointCanvasItem, index:",
				constructBody.index
			);
		}

		this.#index = constructBody.index;
		this.#ctx = constructBody.ctx;
		this.#pushError = constructBody.pushError;

		this.#position = constructBody.connectionPoint.point;
		this.#angle = constructBody.connectionPoint.angle;

		this.#pointRadius = constructBody.pointRadius;
		this.#anlgePointer = this.#calculateAnglePointer();

		this.#relativePosition = {
			x:
				constructBody.connectionPoint.point.x -
				constructBody.rectangularPosition.x,
			y:
				constructBody.connectionPoint.point.y -
				constructBody.rectangularPosition.y,
		};

		this.#edge = constructBody.edge;
		this.#angleStatus = "perpendicular";
	}

	// getters code area
	getAngle() {
		return this.#angle;
	}

	getPosition() {
		return this.#position;
	}

	getRelativePosition() {
		return this.#relativePosition;
	}

	getState(): ConnectionPoint {
		return { point: this.#position, angle: this.#angle };
	}

	getEdge() {
		return this.#edge;
	}

	disconectEdge() {
		this.#edge = null;
	}

	connectEdge(newEdge: Edge) {
		this.#edge = newEdge;
		this.#checkAngle();
	}

	setNormalStatus(newStatus: AngleStatus) {
		this.#angleStatus = newStatus;
	}

	setRelativePosition(updatedRelativePosition: Point) {
		if (this.#relativePosition !== updatedRelativePosition) {
			this.#relativePosition = updatedRelativePosition;
		}
	}

	// inner status checks code area
	#checkAngle(): void {
		if (this.#edge) {
			if (this.#angle === this.#edge.getAlignmentNormal()) {
				this.#angleStatus = "perpendicular";
			} else {
				this.#angleStatus = "non perpendicular";

				const exception = new RuntimeException(
					`Connection Point index: ${
						this.#index
					} is not perpendicular to its edge.`
				);
				this.#pushError(exception);
			}
		} else {
			const exception = new RuntimeException(
				`Connection Point index: ${this.#index} has no edge.`
			);
			this.#pushError(exception);

			this.#angleStatus = "non perpendicular";
		}
	}

	checkConnection(): void {
		if (this.#edge) {
			const isConnected = isPointOnSegment({
				vertice1: this.#edge.getVertices()[0],
				vertice2: this.#edge.getVertices()[1],
				targetVertice: this.#position,
			});

			if (!isConnected) {
				this.disconectEdge();
			}
		} else {
			const exception = new RuntimeException(
				`Connection Point index: ${this.#index} has no edge.`
			);
			this.#pushError(exception);
		}
	}

	// utils code area
	#calculateAnglePointer(): Point {
		return {
			x: this.#position.x + 30 * Math.sin((this.#angle * Math.PI) / 180),
			y: this.#position.y + 30 * Math.cos((this.#angle * Math.PI) / 180),
		};
	}

	// essentials
	move({ newPosition }: { newPosition: Point }) {
		this.#position = newPosition;

		this.#anlgePointer = this.#calculateAnglePointer();
	}

	rotate({ newAngle }: { newAngle: number }) {
		this.#angle = newAngle;
		this.#anlgePointer = this.#calculateAnglePointer();

		this.#checkAngle();
	}

	// render
	draw() {
		this.#drawPointCircle();
		this.#drawAngleDirection();
	}

	#drawPointCircle() {
		this.#ctx.save();
		this.#ctx.lineWidth = 1;

		if (this.#edge) {
			this.#ctx.strokeStyle = `lightgreen`;
		} else {
			this.#ctx.strokeStyle = `red`;
		}

		this.#ctx.beginPath();
		this.#ctx.arc(
			this.#position.x,
			this.#position.y,
			this.#pointRadius,
			0,
			360,
			false
		);

		this.#ctx.stroke();

		this.#ctx.restore();
	}

	#drawAngleDirection() {
		this.#ctx.save();
		this.#ctx.lineWidth = 2;

		if (this.#angleStatus === "perpendicular") {
			this.#ctx.strokeStyle = "lightgreen";
		} else {
			this.#ctx.strokeStyle = "red";
		}

		this.#ctx.beginPath();
		this.#ctx.moveTo(this.#position.x, this.#position.y);
		this.#ctx.lineTo(this.#anlgePointer.x, this.#anlgePointer.y);

		this.#ctx.stroke();

		this.#ctx.restore();
	}
}

export default ConnectionPointCanvasItem;
