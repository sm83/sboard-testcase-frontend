import PointNode from "../subclassesUtils/PointNode.class";
import { AlignmentNormal } from "./AlignmentNormal.type";
import { Point } from "./Point.type";

type RectEdge = {
	vertices: [Point, Point];
	extrudedVertices: [Point, Point];
	pointNodes: [PointNode, PointNode];
	normal: AlignmentNormal;
	id: symbol;
};

export default RectEdge;
