import { LuTrash2, LuPencil, LuMail, LuGift } from 'react-icons/lu';

function UserCard({ user, showEditModal, showDeleteConfirmation }) {
	return (
		<div className="user-card">
			{user.imagePreview ? (
				<img src={user.imagePreview} alt={user.first_name} />
			) : (
				user.image_url && <img src={user.image_url} alt={user.first_name} />
			)}
			<h2>
				{user.first_name} {user.last_name}
			</h2>
			<p>
				<LuMail /> {user.email}
			</p>
			<p>
				<LuGift /> {user.birthday.split('T')[0]}
			</p>
			<div className="user-actions">
				<button onClick={() => showEditModal(user)} aria-label="Edit">
					<LuPencil />
				</button>
				<button
					onClick={() => showDeleteConfirmation(user)}
					aria-label="Delete"
				>
					<LuTrash2 />
				</button>
			</div>
		</div>
	);
}

export default UserCard;
