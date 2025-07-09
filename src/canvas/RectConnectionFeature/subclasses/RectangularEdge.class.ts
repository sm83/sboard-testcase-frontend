import { Point } from "../types/Point.type";
import { AlignmentNormal } from "../types/AlignmentNormal.type";
import { Edge } from "../types/Edge.type";

class RectangularEdgeItem {
	#vertice1: Point;
	#vertice2: Point;
	#alignmentNormal: AlignmentNormal;

	constructor(constructBody: {
		vertice1: Point;
		vertice2: Point;
		alignmentNormal: AlignmentNormal;
	}) {
		this.#vertice1 = constructBody.vertice1;
		this.#vertice2 = constructBody.vertice2;
		this.#alignmentNormal = constructBody.alignmentNormal;
	}

	getState(): Edge {
		return {
			vertice1: this.#vertice1,
			vertice2: this.#vertice2,
			alignmentNormal: this.#alignmentNormal,
		};
	}
}

export default RectangularEdgeItem;
