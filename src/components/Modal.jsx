import { LuX } from 'react-icons/lu';
import './Modal.css';

function Modal({ openModal, closeModal, title = 'Modal', children }) {
	if (!openModal) return null;

	const handleContentClick = (e) => {
		e.stopPropagation();
	};

	return (
		<div className={`modal show-modal`} role="dialog" aria-modal="true">
			<div className="modal-overlay" onClick={closeModal}></div>
			<div className="modal-content" onClick={handleContentClick}>
				<div className="modal-header">
					<h2 className="modal-title">{title}</h2>
					<button className="modal-close-button" onClick={closeModal}>
						<LuX />
					</button>
				</div>
				<div className="modal-body">{children}</div>
			</div>
		</div>
	);
}

export default Modal;
