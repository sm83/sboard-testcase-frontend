import type { Metadata } from "next";
import "../globals.scss";

export const metadata: Metadata = {
	title: "sBoard Testcase",
	description: "Typescript canvas testcase.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ru">
			<body>{children}</body>
		</html>
	);
}
