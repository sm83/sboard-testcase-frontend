import { useCallback, useState } from "react";
import { Exception } from "./dataConverter";

const useErrorCatch = () => {
	const [errors, setErrors] = useState<Exception[]>([]);

	const addError = useCallback(
		(newError: Exception) => {
			setErrors([...errors, newError]);
		},
		[errors]
	);

	const clearErrors = () => {
		setErrors([]);
	};

	return { errors, addError, clearErrors };
};

export default useErrorCatch;
