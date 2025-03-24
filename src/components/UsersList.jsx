import UserCard from './UserCard';

function UsersList({ users, showEditModal, showDeleteConfirmation }) {
	return (
		<div className="users-list">
			{users.map((user) => (
				<UserCard
					key={user.id}
					user={user}
					showEditModal={showEditModal}
					showDeleteConfirmation={showDeleteConfirmation}
				/>
			))}
			{users.length === 0 && <p>No users found</p>}
		</div>
	);
}

export default UsersList;
