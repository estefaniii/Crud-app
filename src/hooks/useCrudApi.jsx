import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export function useCrudApi(baseUrl) {
	const [list, setList] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);

	// Memoizar fetchData usando useCallback
	const fetchData = useCallback(
		async (query = '', signal) => {
			setLoading(true);
			setError(null);
			try {
				const response = await axios.get(`${baseUrl}${query}`, { signal });
				setList(response.data.results || response.data);
				setTotalPages(response.data.total_pages || 1);
			} catch (err) {
				if (!axios.isCancel(err)) {
					setError(err);
					console.error('Error fetching data:', err);
				}
			} finally {
				setLoading(false);
			}
		},
		[baseUrl],
	); // Dependencia: baseUrl

	useEffect(() => {
		const controller = new AbortController();
		const signal = controller.signal;

		fetchData('', signal);

		return () => controller.abort(); // Limpiar la solicitud al desmontar
	}, [fetchData]); // Dependencia: fetchData (memoizada)

	const create = async (newItem) => {
		try {
			const response = await axios.post(baseUrl, newItem);
			setList((prevList) => [...prevList, response.data]);
			return response.data;
		} catch (err) {
			setError(err);
			console.error('Error creating item:', err);
			throw err;
		}
	};

	const update = async (id, updatedItem) => {
		try {
			const response = await axios.put(`${baseUrl}${id}/`, updatedItem);
			setList((prevList) =>
				prevList.map((item) => (item.id === id ? response.data : item)),
			);
			return response.data;
		} catch (err) {
			setError(err);
			console.error('Error updating item:', err);
			throw err;
		}
	};

	const remove = async (id) => {
		try {
			await axios.delete(`${baseUrl}${id}/`);
			setList((prevList) => prevList.filter((item) => item.id !== id));
		} catch (err) {
			setError(err);
			console.error('Error deleting item:', err);
			throw err;
		}
	};

	return {
		list,
		create,
		update,
		remove,
		loading,
		error,
		fetchData,
		currentPage,
		totalPages,
		setCurrentPage,
	};
}
