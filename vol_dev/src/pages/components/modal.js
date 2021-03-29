import { useEffect } from "react";
import "./styles/modal.css";

const Modal = ({ open, setOpen, title, children }) => {
	useEffect(() => {
		console.log(open);
	}, [open]);

	if (open) {
		return (
			<div
				className="modal__component"
				id="modal__component"
				onClick={(e) => {
					// close when clicking away from children
					if (e.target.id == "modal__component") {
						setOpen(false);
					}
				}}
			>
				<div className="modal__container">
					<div className="modal__top">
						<h3 className="modal__title">{title}</h3>
						<p className="modal__close-btn" onClick={(e) => setOpen(false)}>
							&times;
						</p>
					</div>
					{children}
				</div>
			</div>
		);
	} else return <div className="empty"></div>;
};

export default Modal;
