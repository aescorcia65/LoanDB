import React from 'react';
import Modal from 'react-modal'


const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};
function ClosePaymentModal({ isOpen, onConfirm, onCancel }) {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onCancel}
            style={customStyles}
            contentLabel="Confirmation Modal"
        >
            <h2>Close Payment </h2>
            <h5>Next Payment Amount </h5>
            <input
                                    type="number"
                                    id="NextInterestPayment"
                                    placeholder=""
                                    name="NextInterestPayment"
                                    // value={formData.NextInterestPayment}
                                    // onChange={handleChange}
                                    // required
                                />


<div class="button-container">
    <button onClick={onConfirm}>Confirm</button>
    <button onClick={onCancel}>Cancel</button>
</div>
        </Modal>
    );
}
export default ClosePaymentModal;