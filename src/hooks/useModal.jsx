import { useState } from 'react';

export function useModal() {
	const [isOpen, setIsOpen] = useState(false);
	const [child, setChild] = useState(null);
	const [title, setTitle] = useState('');

	const showModal = (child, title = '') => {
		setIsOpen(true);
		setChild(child);
		setTitle(title);
	};

	const closeModal = () => {
		setIsOpen(false);
		setChild(null);
		setTitle('');
	};

	return { isOpen, showModal, closeModal, child, title };
}
