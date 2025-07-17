import PathNode from "./PathNode.class";
import PointNode from "./PointNode.class";
import {
	raycastDistanceMeasure,
	raycastIsIntersectingByAnyEdge,
} from "../utils/raycast";
import { getAvailablePointNodes } from "../utils/getAvailablePointNodes";
import RectEdge from "../types/RectEdge.type";
import PathSolution from "../types/PathSolution.type";

// Моки для зависимостей
jest.mock("../utils/raycast", () => ({
	raycastDistanceMeasure: jest.fn().mockImplementation((a, b) => {
		return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
	}),
	raycastIsIntersectingByAnyEdge: jest.fn().mockReturnValue(false),
}));

jest.mock("../utils/getAvailablePointNodes", () => ({
	getAvailablePointNodes: jest.fn().mockReturnValue([]),
}));

const offsetDistance = 10;

describe("PathNode", () => {
	const mockEdges: RectEdge[] = [];
	const mockPoint1 = new PointNode({
		vertice: { x: 0, y: 0 },
		alignment: "bottom-right",
		offsetDistance,
		otherRectangular: {
			position: { x: 1000, y: 1000 },
			size: { width: 10, height: 10 },
		},
	});
	const mockPoint2 = new PointNode({
		vertice: { x: 1, y: 1 },
		alignment: "bottom-right",
		offsetDistance,
		otherRectangular: {
			position: { x: 1000, y: 1000 },
			size: { width: 10, height: 10 },
		},
	});
	const mockFinalTarget = new PointNode({
		vertice: { x: 2, y: 2 },
		alignment: "bottom-right",
		offsetDistance,
		otherRectangular: {
			position: { x: 1000, y: 1000 },
			size: { width: 10, height: 10 },
		},
	});

	const initialSolution: PathSolution = {
		pointNodes: [],
		distance: null,
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("constructor", () => {
		it("should initialize with correct default values when no parent", () => {
			const node = new PathNode({
				currentBestSolution: initialSolution,
				allEdges: mockEdges,
				pointNode: mockPoint1,
				parent: null,
				finalTarget: mockFinalTarget,
			});

			expect(node.pointNode).toBe(mockPoint1);
			expect(node.parent).toBeNull();
			expect(node.segmentLength).toBe(0);
			expect(node.children).toEqual([]);
			expect(node.processing).toBe("ongoing");
		});

		it("should calculate segmentLength correctly when has parent", () => {
			const parentNode = new PathNode({
				currentBestSolution: initialSolution,
				allEdges: mockEdges,
				pointNode: mockPoint1,
				parent: null,
				finalTarget: mockFinalTarget,
			});

			const childNode = new PathNode({
				currentBestSolution: initialSolution,
				allEdges: mockEdges,
				pointNode: mockPoint2,
				parent: parentNode,
				finalTarget: mockFinalTarget,
			});

			expect(childNode.segmentLength).toBeGreaterThan(0);
			expect(childNode.parent).toBe(parentNode);
		});

		it('should set processing to "aborted" if current path is longer than best solution', () => {
			const bestSolution: PathSolution = {
				pointNodes: [],
				distance: 1, // очень маленькое расстояние
			};

			const node = new PathNode({
				currentBestSolution: bestSolution,
				allEdges: mockEdges,
				pointNode: mockPoint1,
				parent: null,
				finalTarget: mockFinalTarget,
			});

			expect(node.processing).toBe("aborted");
		});
	});

	describe("path collection methods", () => {
		let rootNode: PathNode;
		let childNode: PathNode;
		let grandChildNode: PathNode;

		beforeEach(() => {
			rootNode = new PathNode({
				currentBestSolution: initialSolution,
				allEdges: mockEdges,
				pointNode: mockPoint1,
				parent: null,
				finalTarget: mockFinalTarget,
			});

			childNode = new PathNode({
				currentBestSolution: initialSolution,
				allEdges: mockEdges,
				pointNode: mockPoint2,
				parent: rootNode,
				finalTarget: mockFinalTarget,
			});

			grandChildNode = new PathNode({
				currentBestSolution: initialSolution,
				allEdges: mockEdges,
				pointNode: new PointNode({
					vertice: { x: 2, y: 1 },
					alignment: "bottom-right",
					offsetDistance,
					otherRectangular: {
						position: { x: 1000, y: 1000 },
						size: { width: 10, height: 10 },
					},
				}),
				parent: childNode,
				finalTarget: mockFinalTarget,
			});
		});

		it("collectPathFromParentRecursive should collect all parent nodes", () => {
			const path: PointNode[] = [];
			grandChildNode.collectPathFromParentRecursive(path);

			expect(path).toHaveLength(2);
			expect(path[0]).toBe(childNode.pointNode);
			expect(path[1]).toBe(rootNode.pointNode);
		});

		it("collectSegmentsLength should collect all segment lengths", () => {
			const segments: number[] = [];
			grandChildNode.collectSegmentsLength(segments);

			expect(segments).toHaveLength(3);
			expect(segments[0]).toBe(grandChildNode.segmentLength);
			expect(segments[1]).toBe(childNode.segmentLength);
			expect(segments[2]).toBe(rootNode.segmentLength);
		});

		it("collectUsedPointNodes should collect all used point nodes", () => {
			const points: PointNode[] = [];
			grandChildNode.collectUsedPointNodes(points);

			expect(points).toHaveLength(2);
			expect(points[0]).toBe(childNode.pointNode);
			expect(points[1]).toBe(rootNode.pointNode);
		});
	});

	describe("updateBestResultToTheRoot", () => {
		it("should update best solution for all nodes in hierarchy", () => {
			const rootNode = new PathNode({
				currentBestSolution: initialSolution,
				allEdges: mockEdges,
				pointNode: mockPoint1,
				parent: null,
				finalTarget: mockFinalTarget,
			});

			const childNode = new PathNode({
				currentBestSolution: initialSolution,
				allEdges: mockEdges,
				pointNode: mockPoint2,
				parent: rootNode,
				finalTarget: mockFinalTarget,
			});

			const newSolution: PathSolution = {
				pointNodes: [mockPoint1, mockPoint2],
				distance: 10,
			};

			childNode.updateBestResultToTheRoot(newSolution);

			expect(rootNode.currentBestSolution).toBe(newSolution);
			expect(childNode.currentBestSolution).toBe(newSolution);
		});
	});

	describe("target visibility", () => {
		it("should update best solution if target is visible", () => {
			// Мокаем что цель видна
			(raycastIsIntersectingByAnyEdge as jest.Mock).mockReturnValue(false);

			const node = new PathNode({
				currentBestSolution: initialSolution,
				allEdges: mockEdges,
				pointNode: mockPoint1,
				parent: null,
				finalTarget: mockFinalTarget,
			});

			expect(node.currentBestSolution.distance).not.toBeNull();
			expect(node.currentBestSolution.pointNodes).toContain(mockPoint1);
			expect(node.currentBestSolution.pointNodes).toContain(mockFinalTarget);
		});

		it("should update best solution when new shorter path is found", () => {
			// Создаем начальное решение с большей дистанцией
			const initialSolution: PathSolution = {
				pointNodes: [
					mockPoint1,
					new PointNode({
						vertice: { x: 0, y: 0 },
						alignment: "bottom-right",
						offsetDistance,
						otherRectangular: {
							position: { x: 1000, y: 1000 },
							size: { width: 10, height: 10 },
						},
					}),
					mockFinalTarget,
				],
				distance: 100, // Большая дистанция
			};

			// Мокаем что цель видна напрямую
			(raycastIsIntersectingByAnyEdge as jest.Mock).mockReturnValue(false);

			// Мокаем расчет расстояния
			(raycastDistanceMeasure as jest.Mock)
				.mockImplementationOnce(() => 2) // Расстояние от point1 до finalTarget
				.mockImplementationOnce(() => 1); // Расстояние в collectSegmentsLength

			const node = new PathNode({
				currentBestSolution: initialSolution,
				allEdges: mockEdges,
				pointNode: mockPoint1,
				parent: null,
				finalTarget: mockFinalTarget,
			});

			// Проверяем что решение обновилось
			expect(node.currentBestSolution.distance).toBeLessThan(100);
			expect(node.currentBestSolution.pointNodes).toEqual([
				mockFinalTarget,
				mockPoint1, // Порядок важен, так как path собирается рекурсивно
			]);
		});

		it("should reconstruct children if target is not visible", () => {
			// Мокаем что цель не видна
			(raycastIsIntersectingByAnyEdge as jest.Mock)
				.mockImplementationOnce(() => true) // Для проверки видимости цели
				.mockImplementation(() => false); // Для других проверок

			// Мокаем доступные точки
			const availablePoint = new PointNode({
				vertice: { x: 0, y: 0 },
				alignment: "bottom-right",
				offsetDistance,
				otherRectangular: {
					position: { x: 1000, y: 1000 },
					size: { width: 10, height: 10 },
				},
			});
			(getAvailablePointNodes as jest.Mock).mockReturnValue([availablePoint]);

			const node = new PathNode({
				currentBestSolution: initialSolution,
				allEdges: mockEdges,
				pointNode: mockPoint1,
				parent: null,
				finalTarget: mockFinalTarget,
			});

			// Проверяем что дети созданы
			expect(node.children).toHaveLength(1);
			expect(node.children[0].pointNode).toBe(availablePoint);

			// Проверяем что у ребёнка правильный родитель
			expect(node.children[0].parent).toBe(node);

			// Проверяем что не было циклических ссылок
			expect(node.children[0].children).toHaveLength(0);
		});
	});
});
