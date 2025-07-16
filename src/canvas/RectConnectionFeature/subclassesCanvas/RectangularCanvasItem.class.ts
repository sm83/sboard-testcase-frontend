import { ConnectionPoint } from "../types/ConnectionPoint.type";
import { Point } from "../types/Point.type";
import { Rect } from "../types/Rect.type";
import { Size } from "../types/Size.type";
import { InitException } from "../subclassesUtils/InitException.class";
import isPointOnSegment from "@/lib/isPointOnSegment";
import { AnyException } from "../types/AnyException.type";
import { getRectBoundingAxes } from "@/lib/getRectBoundingAxes";
import ConnectionPointCanvasItem from "./ConnectionPointCanvasItem.class";
import { showConstructionLogs } from "@/config";
import Edge from "../subclassesUtils/Edge.class";
import { getRectangularVertices } from "../utils/getRectangularVertices";

class RectangularCanvasItem {
	#index: number;
	#canvas: HTMLCanvasElement;
	#ctx: CanvasRenderingContext2D;
	#pushError: (newError: AnyException) => void;

	// data
	#position: Point;
	#size: Size;

	// memory
	#vertices: Point[];

	// child instances
	#connectionPoint: ConnectionPointCanvasItem | InitException;
	#edges: Edge[];

	constructor(constructBody: {
		index: number;
		canvas: HTMLCanvasElement;
		ctx: CanvasRenderingContext2D;
		pushError: (newError: AnyException) => void;

		rectangular: Rect;
		connectionPoints: [ConnectionPoint, ConnectionPoint] | null;
	}) {
		if (showConstructionLogs) {
			console.log(
				"CONSTRUCTION: RectangularCanvasItem, index:",
				constructBody.index
			);
		}

		this.#index = constructBody.index;
		this.#canvas = constructBody.canvas;
		this.#ctx = constructBody.ctx;
		this.#pushError = constructBody.pushError;

		this.#position = constructBody.rectangular.position;
		this.#size = constructBody.rectangular.size;

		this.#vertices = this.#calculateVertices();
		this.#edges = this.#constructEdges();

		this.#connectionPoint = this.#constructConnectionPoint(
			constructBody.connectionPoints
		);
	}

	// construction methods code area

	// raw connection points data is provided in the constructor.
	// actual connections instances creates as field of current instance, after connection is found.
	#constructConnectionPoint(
		connectionPoints: [ConnectionPoint, ConnectionPoint] | null
	) {
		if (connectionPoints === null) {
			const exception = new InitException(
				"Connection points was not provided to Rectangular Item constructor."
			);

			this.#pushError(exception);
			return exception;
		}

		for (const connectionPoint of connectionPoints) {
			for (const edge of this.#edges) {
				const [vertice1, vertice2] = edge.getVertices();

				const isConnected = isPointOnSegment({
					vertice1,
					vertice2,
					targetVertice: connectionPoint.point,
				});

				if (isConnected) {
					return new ConnectionPointCanvasItem({
						index: this.#index,
						ctx: this.#ctx,
						pushError: this.#pushError,
						connectionPoint,
						pointRadius: 10,
						rectangularPosition: this.#position,
						edge: edge,
					});
				}
			}
		}

		const exception = new InitException(
			`Can not find connection point of the rectangular with index: ${
				this.#index
			}`
		);

		this.#pushError(exception);
		return exception;
	}

	// getters code area
	getPosition(): { x: number; y: number } {
		return { x: this.#position.x, y: this.#position.y };
	}

	getConnectionPoint() {
		return this.#connectionPoint;
	}

	getState(): Rect {
		return { position: this.#position, size: this.#size };
	}

	getBoundingAxes(): [number, number, number, number] {
		return getRectBoundingAxes({
			rect: { position: this.#position, size: this.#size },
			offset: 0,
		});
	}

	getEdges() {
		return this.#edges;
	}

	// utils code
	checkAndUpdateConnectionPointEdge() {
		if (!(this.#connectionPoint instanceof InitException)) {
			if (this.#connectionPoint.getEdge() === null) {
				for (const edge of this.#edges) {
					const [vertice1, vertice2] = edge.getVertices();
					const isConnected = isPointOnSegment({
						vertice1,
						vertice2,
						targetVertice: this.#connectionPoint.getPosition(),
					});

					if (isConnected) {
						this.#connectionPoint.connectEdge(edge);

						return;
					}
				}
			}
		}
	}

	#calculateVertices() {
		return getRectangularVertices({
			position: this.#position,
			size: this.#size,
		});
	}

	#constructEdges() {
		return [
			new Edge({
				vertice1: this.#vertices[0],
				vertice2: this.#vertices[1],
				alignmentNormal: 90,
				id: Symbol("Edge id"),
			}),
			new Edge({
				vertice1: this.#vertices[1],
				vertice2: this.#vertices[2],
				alignmentNormal: 180,
				id: Symbol("Edge id"),
			}),
			new Edge({
				vertice1: this.#vertices[2],
				vertice2: this.#vertices[3],
				alignmentNormal: 270,
				id: Symbol("Edge id"),
			}),
			new Edge({
				vertice1: this.#vertices[3],
				vertice2: this.#vertices[0],
				alignmentNormal: 0,
				id: Symbol("Edge id"),
			}),
		];
	}

	#updateEdges() {
		this.#edges[0].updateVertices(this.#vertices[0], this.#vertices[1]);
		this.#edges[1].updateVertices(this.#vertices[1], this.#vertices[2]);
		this.#edges[2].updateVertices(this.#vertices[2], this.#vertices[3]);
		this.#edges[3].updateVertices(this.#vertices[3], this.#vertices[0]);
	}

	// essentials
	move(x: number, y: number) {
		this.#position = { x, y };

		this.#vertices = this.#calculateVertices();
		this.#updateEdges();
	}

	resize(width: number, height: number) {
		const heightChange = height - this.#size.height;
		const widthChange = width - this.#size.width;

		this.#size = { width, height };

		if (!(this.#connectionPoint instanceof InitException)) {
			const angleNormal = this.#connectionPoint.getAngle();

			let xOffset = 0;
			let yOffset = 0;

			switch (angleNormal) {
				case 0:
					yOffset = heightChange / 2;
					break;
				case 180:
					yOffset = -heightChange / 2;
					break;
				case 270:
					xOffset = -widthChange / 2;
					break;
				case 90:
					xOffset = widthChange / 2;
					break;
			}

			const pointPosition = this.#connectionPoint.getPosition();

			this.#connectionPoint.move({
				newPosition: {
					x: pointPosition.x + xOffset,
					y: pointPosition.y + yOffset,
				},
			});
		}

		this.#vertices = this.#calculateVertices();
		this.#updateEdges();
	}

	// render
	draw() {
		this.#ctx.save();

		this.#ctx.fillStyle = "#A5A7A8";
		this.#ctx.fillRect(
			this.#vertices[2].x,
			this.#vertices[2].y,
			this.#size.width,
			this.#size.height
		);

		this.#ctx.strokeStyle = `hsla(0, 0.00%, 0.00%, 1)`;

		this.#ctx.lineWidth = 1;
		this.#ctx.beginPath();
		this.#ctx.moveTo(this.#vertices[3].x, this.#vertices[3].y);
		this.#vertices.forEach((verticeItem) => {
			this.#ctx.lineTo(verticeItem.x, verticeItem.y);
		});

		this.#ctx.stroke();

		this.#ctx.restore();
	}

	drawConnectionPoint() {
		this.#ctx.save();

		if (!(this.#connectionPoint instanceof InitException)) {
			this.#connectionPoint.draw();
		}

		this.#ctx.restore();
	}
}

export default RectangularCanvasItem;
