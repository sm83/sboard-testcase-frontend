import { AlignmentNormal } from "./AlignmentNormal.type";
import { Point } from "./Point.type";
import NodePoint from "./NodePoint.type";

type RectEdge = {
	vertices: [Point, Point];
	extrudedVertices: [Point, Point];
	nodePoints: [NodePoint, NodePoint];
	normal: AlignmentNormal;
	id: symbol;
};

export default RectEdge;
