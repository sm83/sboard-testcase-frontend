import { getRectangularsOffsettedEdges } from "./getRectangularsOffsettedEdges";
import * as PathNodeModule from "../subclassesUtils/PathNode.class";
import { Rect } from "../types/Rect.type";
import { ConnectionPoint } from "../types/ConnectionPoint.type";
import { dataConverter } from "./dataConverter";
import { Point } from "../types/Point.type";

jest.mock("./getRectangularsOffsettedEdges");
jest.mock("../subclassesUtils/PathNode.class", () => ({
	__esModule: true,
	default: jest.fn().mockImplementation(() => ({
		currentBestSolution: {
			pointNodes: [
				{ position: { x: 110, y: 50 } },
				{ position: { x: 190, y: 50 } },
			],
			distance: 80,
		},
	})),
}));

describe("dataConverter", () => {
	const rect1: Rect = {
		position: { x: 0, y: 0 },
		size: { width: 100, height: 100 },
	};

	const rect2: Rect = {
		position: { x: 200, y: 0 },
		size: { width: 100, height: 100 },
	};

	const cPoint1: ConnectionPoint = {
		point: { x: 100, y: 50 },
		angle: 90,
	};

	const cPoint2: ConnectionPoint = {
		point: { x: 200, y: 50 },
		angle: 270,
	};

	const offsetDistance = 10;

	beforeEach(() => {
		jest.clearAllMocks();
		(getRectangularsOffsettedEdges as jest.Mock).mockReturnValue([]);
	});

	it("should call getRectangularsOffsettedEdges correct", () => {
		dataConverter(rect1, rect2, cPoint1, cPoint2);

		expect(getRectangularsOffsettedEdges).toHaveBeenCalledWith({
			rectangulars: [rect1, rect2],
			offset: offsetDistance,
		});
	});

	it("should log node tree with logNodeTree=true", () => {
		const consoleSpy = jest.spyOn(console, "log").mockImplementation();

		dataConverter(rect1, rect2, cPoint1, cPoint2, true);

		expect(consoleSpy).toHaveBeenCalled();
		expect(PathNodeModule.default).toHaveBeenCalled();
		consoleSpy.mockRestore();
	});

	it("should return shortest path on build", () => {
		const result = dataConverter(rect1, rect2, cPoint1, cPoint2) as Point[];

		expect(result).toEqual([
			cPoint2.point,
			{ x: 110, y: 50 },
			{ x: 190, y: 50 },
			cPoint1.point,
		]);
	});

	it("should work with empty path correct", () => {
		(PathNodeModule.default as jest.Mock).mockImplementationOnce(() => ({
			currentBestSolution: {
				pointNodes: [],
				distance: null,
			},
		}));

		const result = dataConverter(rect1, rect2, cPoint1, cPoint2);
		expect(result).toEqual([]);
	});

	it("should add point to path", () => {
		(PathNodeModule.default as jest.Mock).mockImplementationOnce(() => ({
			currentBestSolution: {
				pointNodes: [
					{ position: { x: 10, y: 10 } },
					{ position: { x: 20, y: 20 } },
				],
				distance: 100,
			},
		}));

		const result = dataConverter(rect1, rect2, cPoint1, cPoint2) as Point[];

		expect(result).toEqual([
			cPoint2.point, // Начальная точка
			{ x: 10, y: 10 }, // Промежуточная точка
			{ x: 20, y: 20 }, // Промежуточная точка
			cPoint1.point, // Конечная точка
		]);
	});

	it("should create PathNode with correct arguments", () => {
		dataConverter(rect1, rect2, cPoint1, cPoint2);

		expect(PathNodeModule.default).toHaveBeenCalledWith(
			expect.objectContaining({
				currentBestSolution: { distance: null, pointNodes: [] },
				allEdges: [],
				parent: null,
				finalTarget: expect.any(Object),
				pointNode: expect.any(Object),
			})
		);
	});
});
