import { Point } from "../types/Point.type";
import { AlignmentNormal } from "../types/AlignmentNormal.type";

class Edge {
	#vertice1: Point;
	#vertice2: Point;
	#alignmentNormal: AlignmentNormal;
	#id: symbol;

	constructor(constructBody: {
		vertice1: Point;
		vertice2: Point;
		alignmentNormal: AlignmentNormal;
		id: symbol;
	}) {
		this.#vertice1 = constructBody.vertice1;
		this.#vertice2 = constructBody.vertice2;
		this.#alignmentNormal = constructBody.alignmentNormal;
		this.#id = constructBody.id;
	}

	getId(): symbol {
		return this.#id;
	}

	getVertices() {
		return [this.#vertice1, this.#vertice2];
	}

	getAlignmentNormal() {
		return this.#alignmentNormal;
	}

	updateVertices(vertice1: Point, vertice2: Point) {
		this.#vertice1 = vertice1;
		this.#vertice2 = vertice2;
	}
}

export default Edge;
