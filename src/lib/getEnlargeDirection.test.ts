import getEnlargeDirection from "./getEnlargeDirection";
import { RelativeOrientation } from "./getRelativeOrientation";

describe("getEnlargeDirection", () => {
	describe("x axis", () => {
		it('should return 0 for "incedent" orientation', () => {
			expect(
				getEnlargeDirection({ relativeOrientation: "incedent", axis: "x" })
			).toBe(0);
		});

		it('should return 0 for "bottom" orientation', () => {
			expect(
				getEnlargeDirection({ relativeOrientation: "bottom", axis: "x" })
			).toBe(0);
		});

		it('should return 0 for "top" orientation', () => {
			expect(
				getEnlargeDirection({ relativeOrientation: "top", axis: "x" })
			).toBe(0);
		});

		it('should return 1 for "right" orientation', () => {
			expect(
				getEnlargeDirection({ relativeOrientation: "right", axis: "x" })
			).toBe(1);
		});

		it('should return -1 for "left" orientation', () => {
			expect(
				getEnlargeDirection({ relativeOrientation: "left", axis: "x" })
			).toBe(-1);
		});
	});

	describe("y axis", () => {
		it('should return 0 for "incedent" orientation', () => {
			expect(
				getEnlargeDirection({ relativeOrientation: "incedent", axis: "y" })
			).toBe(0);
		});

		it('should return 1 for "bottom" orientation', () => {
			expect(
				getEnlargeDirection({ relativeOrientation: "bottom", axis: "y" })
			).toBe(1);
		});

		it('should return -1 for "top" orientation', () => {
			expect(
				getEnlargeDirection({ relativeOrientation: "top", axis: "y" })
			).toBe(-1);
		});

		it('should return 0 for "right" orientation', () => {
			expect(
				getEnlargeDirection({ relativeOrientation: "right", axis: "y" })
			).toBe(0);
		});

		it('should return 0 for "left" orientation', () => {
			expect(
				getEnlargeDirection({ relativeOrientation: "left", axis: "y" })
			).toBe(0);
		});
	});

	// Дополнительные проверки типов
	it("should always return -1, 0 or 1", () => {
		const orientations: RelativeOrientation[] = [
			"incedent",
			"bottom",
			"top",
			"right",
			"left",
		];
		const axes: Array<"x" | "y"> = ["x", "y"];

		orientations.forEach((orientation) => {
			axes.forEach((axis) => {
				const result = getEnlargeDirection({
					relativeOrientation: orientation,
					axis,
				});
				expect([-1, 0, 1]).toContain(result);
			});
		});
	});
});
