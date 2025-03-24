import { useState, useEffect } from 'react';
import { LuEye, LuEyeOff } from 'react-icons/lu';

function AddEditForm({ submitData, user }) {
	const [formData, setFormData] = useState({
		first_name: '',
		last_name: '',
		email: '',
		password: '',
		birthday: '',
		image_url: '',
	});

	const [showPassword, setShowPassword] = useState(false);

	useEffect(() => {
		if (user) {
			setFormData({
				first_name: user.first_name,
				last_name: user.last_name,
				email: user.email,
				birthday: user.birthday.split('T')[0],
				password: '', // La contraseña no se prellena por seguridad
				image_url: user.image_url || '',
			});
		}
	}, [user]);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		submitData(formData); // Envía los datos del formulario
	};

	const toggleShowPassword = () => {
		setShowPassword(!showPassword);
	};

	return (
		<form onSubmit={handleSubmit} className="form-container">
			<label htmlFor="first_name">First Name:</label>
			<input
				type="text"
				id="first_name"
				name="first_name"
				value={formData.first_name}
				onChange={handleChange}
				required
			/>

			<label htmlFor="last_name">Last Name:</label>
			<input
				type="text"
				id="last_name"
				name="last_name"
				value={formData.last_name}
				onChange={handleChange}
				required
			/>

			<label htmlFor="email">Email:</label>
			<input
				type="email"
				id="email"
				name="email"
				value={formData.email}
				onChange={handleChange}
				required
			/>

			<label htmlFor="password">Password:</label>
			<div className="password-input-container">
				<input
					type={showPassword ? 'text' : 'password'}
					id="password"
					name="password"
					value={formData.password}
					onChange={handleChange}
					required
				/>
				<button
					type="button" // Importante: type="button" para evitar que envíe el formulario
					className="password-toggle-button"
					onClick={toggleShowPassword}
					aria-label={showPassword ? 'Hide password' : 'Show password'}
				>
					{showPassword ? <LuEyeOff /> : <LuEye />}
				</button>
			</div>

			<label htmlFor="birthday">Birthday:</label>
			<input
				type="date"
				id="birthday"
				name="birthday"
				value={formData.birthday}
				onChange={handleChange}
				required
			/>

			<label htmlFor="image_url">Image URL:</label>
			<input
				type="url"
				id="image_url"
				name="image_url"
				value={formData.image_url}
				onChange={handleChange}
			/>

			<button type="submit">Submit</button>
		</form>
	);
}

export default AddEditForm;
