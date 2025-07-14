import isPointOnSegment from "@/lib/isPointOnSegment";
import { AnyException } from "../types/AnyException.type";
import { ConnectionPoint } from "../types/ConnectionPoint.type";
import { Edge } from "../types/Edge.type";
import { Point } from "../types/Point.type";
import { RuntimeException } from "./RuntimeException.class";

type ConnectionStatus = "connected" | "disconnected";
type AngleStatus = "perpendicular" | "non perpendicular";

type ConnectionPointItemState = {
	position: Point;
	angle: number;
};

class ConnectionPointItem {
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
	#connectionStatus: ConnectionStatus;
	#angleStatus: AngleStatus;

	// note: initial construction can appear only once
	// and if there are no InitException in parrent class (RectangularEdgeItem)
	constructor(constructBody: {
		index: number;
		ctx: CanvasRenderingContext2D;
		pushError: (newError: AnyException) => void;

		connectionPoint: ConnectionPoint;

		pointRadius: number;
		rectangularPosition: Point;
		edge: Edge;
	}) {
		console.log(
			"CONSTRUCTION: ConnectionPointItem, index:",
			constructBody.index
		);

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
		this.#connectionStatus = "connected";
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

	getState(): ConnectionPointItemState {
		return { position: this.#position, angle: this.#angle };
	}

	getEdge() {
		return this.#edge;
	}

	getConnectionStatus() {
		return this.#connectionStatus;
	}

	// setters code area
	setEdge(newEdge: Edge | null) {
		this.#edge = newEdge;
		this.#checkAngle();
	}

	setConnectionStatus(newStatus: ConnectionStatus) {
		this.#connectionStatus = newStatus;
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
			if (this.#angle === this.#edge.alignmentNormal) {
				this.#angleStatus = "perpendicular";
			} else {
				this.#angleStatus = "non perpendicular";

				const exception = new RuntimeException(
					"Connection Point is not perpendicular to its edge."
				);
				this.#pushError(exception);
			}
		} else {
			const exception = new RuntimeException("Connection Point has no edge.");
			this.#pushError(exception);

			this.#angleStatus = "non perpendicular";
		}
	}

	checkConnection(): void {
		if (this.#edge) {
			const isConnected = isPointOnSegment({
				vertice1: this.#edge.vertice1,
				vertice2: this.#edge.vertice2,
				targetVertice: this.#position,
			});

			if (!isConnected) {
				this.setEdge(null);
			}

			this.#connectionStatus = isConnected ? "connected" : "disconnected";
		} else {
			const exception = new RuntimeException("Connection Point has no edge.");
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

		if (this.#connectionStatus === "connected") {
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

export default ConnectionPointItem;
