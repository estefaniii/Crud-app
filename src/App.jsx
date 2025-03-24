import { useEffect, useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useCrudApi } from './hooks/useCrudApi';
import { useModal } from './hooks/useModal';
import { useDebounce } from './hooks/useDebounce';
import Modal from './components/Modal';
import AddEditForm from './components/AddEditForm';
import UsersList from './components/UsersList';
import Pagination from './components/Pagination';
import { LuPlus, LuSearch } from 'react-icons/lu';
import './index.css';
import axios from 'axios';

const baseUrl =
	'https://users-crud-api-production-9c59.up.railway.app/api/v1/users/';

function App() {
	const [searchTerm, setSearchTerm] = useState('');
	const [suggestions, setSuggestions] = useState([]);
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [showNotFound, setShowNotFound] = useState(false);
	const debouncedSearchTerm = useDebounce(searchTerm, 1000); // Debounce de 1 segundo
	const [currentPage, setCurrentPage] = useState(1);
	const usersPerPage = 6; // Límite de 6 tarjetas por página

	// Referencia para el contenedor de búsqueda
	const searchContainerRef = useRef(null);

	const {
		list: users,
		create,
		update,
		remove,
		loading,
		error,
		fetchData,
		totalPages,
	} = useCrudApi(baseUrl);
	const modal = useModal();

	// Memoiza fetchUsers usando useCallback
	const fetchUsers = useCallback(
		async (signal) => {
			try {
				if (debouncedSearchTerm.trim() !== '') {
					await fetchData(
						`?page=${currentPage}&search=${debouncedSearchTerm}`,
						signal,
					);
				} else {
					await fetchData(`?page=${currentPage}`, signal);
				}
			} catch (err) {
				if (!axios.isCancel(err)) {
					console.error('Error fetching data:', err);
				}
			}
		},
		[debouncedSearchTerm, currentPage, fetchData],
	);

	// useEffect para buscar usuarios cuando cambia el término de búsqueda o la página
	useEffect(() => {
		const controller = new AbortController();
		const signal = controller.signal;

		fetchUsers(signal);

		return () => controller.abort(); // Limpiar la solicitud al desmontar
	}, [fetchUsers]);

	// useEffect para mostrar sugerencias después de 1 segundo
	useEffect(() => {
		if (debouncedSearchTerm.trim() !== '') {
			const filteredSuggestions = users
				.filter((user) =>
					`${user.first_name} ${user.last_name}`
						.toLowerCase()
						.includes(debouncedSearchTerm.toLowerCase()),
				)
				.map((user) => `${user.first_name} ${user.last_name}`);
			setSuggestions(filteredSuggestions);
		} else {
			setSuggestions([]);
		}
	}, [debouncedSearchTerm, users]);

	// Función para manejar clics fuera del área de búsqueda
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				searchContainerRef.current &&
				!searchContainerRef.current.contains(event.target)
			) {
				setSuggestions([]); // Ocultar sugerencias
			}
		};

		// Agregar el manejador de eventos
		document.addEventListener('mousedown', handleClickOutside);

		// Limpiar el manejador de eventos al desmontar
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	// Función para manejar cambios en el campo de búsqueda
	const handleSearchChange = (e) => {
		const value = e.target.value;
		setSearchTerm(value);
		setShowNotFound(false); // Reiniciar el estado de "User not found"
	};

	// Función para filtrar usuarios al hacer clic en el botón de búsqueda
	const handleSearchClick = () => {
		if (searchTerm.trim() !== '') {
			const filtered = users.filter((user) =>
				`${user.first_name} ${user.last_name}`
					.toLowerCase()
					.includes(searchTerm.toLowerCase()),
			);
			if (filtered.length > 0) {
				setFilteredUsers(filtered);
				setShowNotFound(false);
				setCurrentPage(1); // Restablecer a la página 1 después de la búsqueda
			} else {
				setFilteredUsers([]);
				setShowNotFound(true); // Mostrar "User not found"
			}
		} else {
			setFilteredUsers(users);
			setShowNotFound(false);
		}
	};

	// Función para seleccionar una sugerencia
	const handleSuggestionClick = (suggestion) => {
		setSearchTerm(suggestion);
		setSuggestions([]); // Ocultar sugerencias al seleccionar una

		// Encontrar el usuario correspondiente a la sugerencia
		const selectedUser = users.find(
			(user) => `${user.first_name} ${user.last_name}` === suggestion,
		);

		if (selectedUser) {
			// Redirigir a la tarjeta correspondiente
			const userIndex = users.indexOf(selectedUser);
			const page = Math.floor(userIndex / usersPerPage) + 1;
			setCurrentPage(page);
		}
	};

	// Función para crear un nuevo usuario
	const createUser = async (newUser) => {
		try {
			await create(newUser);
			modal.closeModal();
		} catch (error) {
			console.error('Error creating user:', error);
		}
	};

	// Función para mostrar el modal de agregar usuario
	const showAddModal = () => {
		modal.showModal(<AddEditForm submitData={createUser} />, 'Add User');
	};

	// Función para actualizar un usuario existente
	const updateUser = async (id, updatedUser) => {
		try {
			await update(id, updatedUser);
			modal.closeModal();
		} catch (error) {
			console.error('Error updating user:', error);
		}
	};

	// Función para mostrar el modal de editar usuario
	const showEditModal = (user) => {
		modal.showModal(
			<AddEditForm
				submitData={(data) => updateUser(user.id, data)}
				user={user}
			/>,
			'Edit User',
		);
	};

	// Función para confirmar la eliminación de un usuario
	const confirmDelete = async (id) => {
		try {
			await remove(id);
			modal.closeModal();
		} catch (error) {
			console.error('Error deleting user:', error);
		}
	};

	// Función para rechazar la eliminación de un usuario
	const rejectDelete = () => {
		modal.closeModal();
	};

	// Función para mostrar el modal de confirmación de eliminación
	const showDeleteConfirmation = (user) => {
		modal.showModal(
			<div>
				<p>Are you sure you want to delete {user.first_name}?</p>
				<div className="modal-confirmation-buttons">
					<button onClick={() => confirmDelete(user.id)}>Yes</button>
					<button onClick={rejectDelete}>No</button>
				</div>
			</div>,
			'Delete User',
		);
	};

	// Función para cambiar de página
	const handlePageChange = (newPage) => {
		setCurrentPage(newPage);
	};

	// Calcular los usuarios a mostrar en la página actual
	const indexOfLastUser = currentPage * usersPerPage;
	const indexOfFirstUser = indexOfLastUser - usersPerPage;
	const usersToDisplay = filteredUsers.length > 0 ? filteredUsers : users;
	const currentUsers = usersToDisplay.slice(indexOfFirstUser, indexOfLastUser);

	// Mostrar un mensaje de error si ocurre un problema
	if (error) {
		return <p>Error: {error.message}</p>;
	}

	// Renderizar la interfaz de usuario
	return (
		<div className="container">
			<h1
				className="main-title"
				onClick={() => {
					setCurrentPage(1); // Restablecer a la página 1
					setSearchTerm(''); // Limpiar el término de búsqueda
					setFilteredUsers([]); // Limpiar los usuarios filtrados
					setShowNotFound(false); // Ocultar el mensaje "User not found"
				}}
			>
				Users
			</h1>
			<button className="add-user-button" onClick={showAddModal}>
				<LuPlus /> Add new user
			</button>
			<div className="search-container" ref={searchContainerRef}>
				<div className="search-input-container">
					<input
						type="text"
						placeholder="Search users..."
						value={searchTerm}
						onChange={handleSearchChange}
					/>
					<button className="search-button" onClick={handleSearchClick}>
						<LuSearch />
					</button>
				</div>
				{suggestions.length > 0 && (
					<ul className="suggestions-list">
						{suggestions.map((suggestion, index) => (
							<li key={index} onClick={() => handleSuggestionClick(suggestion)}>
								{suggestion}
							</li>
						))}
					</ul>
				)}
				{showNotFound && <p className="not-found-message">User not found</p>}
			</div>
			<UsersList
				users={currentUsers}
				showEditModal={showEditModal}
				showDeleteConfirmation={showDeleteConfirmation}
			/>
			<Pagination
				currentPage={currentPage}
				totalPages={Math.ceil(usersToDisplay.length / usersPerPage)}
				onPageChange={handlePageChange}
			/>
			{createPortal(
				<Modal
					openModal={modal.isOpen}
					closeModal={modal.closeModal}
					title={modal.title}
				>
					{modal.child}
				</Modal>,
				document.body,
			)}
		</div>
	);
}

export default App;
