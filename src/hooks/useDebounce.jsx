import { useEffect, useState, useRef } from 'react';

export function useDebounce(value, delay = 600) {
	const [debouncedValue, setDebouncedValue] = useState(value);
	const timeoutRef = useRef(null);

	useEffect(() => {
		clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => clearTimeout(timeoutRef.current);
	}, [value, delay]);

	return debouncedValue;
}
