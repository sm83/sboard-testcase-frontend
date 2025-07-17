module.exports = {
	preset: "ts-jest",
	testEnvironment: "jest-environment-jsdom",
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/src/$1",
		"\\.(css|less|scss|sass)$": "identity-obj-proxy",
	},
	transform: {
		"^.+\\.(ts|tsx)$": "ts-jest",
		"^.+\\.(js|jsx)$": "babel-jest",
	},
	testPathIgnorePatterns: ["/node_modules/", "/dist/"],
	collectCoverage: true,
	coverageDirectory: "coverage",
	coverageReporters: ["text", "lcov"],
	globals: {
		"ts-jest": {
			tsconfig: "tsconfig.json",
		},
	},
};
