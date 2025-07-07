// import { Exception } from "@/lib/dataConverter";
// import { useState } from "react";

// interface ErrorCatchWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
// 	children?: React.ReactNode;
// }

// const ErrorCatchWrapper: React.FC<ErrorCatchWrapperProps> = ({
// 	children,
// 	...rest
// }) => {
// 	const [errors, setErrors] = useState<Exception[]>([]);

// 	const addError = (newError: Exception) => {
// 		setErrors([...errors, newError]);
// 	};

// 	return <div {...rest}>{children}</div>;
// };

// export default ErrorCatchWrapper;
