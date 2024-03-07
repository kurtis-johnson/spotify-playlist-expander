import { Box, Modal, TextField } from "@mui/material"

interface AuthModalProps {
    modalOpen: boolean;
    onClose: any;
}

const boxStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const inputStyle = {
    width: '100%',
};

function AuthModal({ modalOpen, onClose }: AuthModalProps) {
    console.log(modalOpen);
    return (
        <>
            <div id='modal'>
                <Modal
                    open={modalOpen}
                    onClose={() => onClose()}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={boxStyle}>
                        <div style={{ padding: '.5rem'}}>
                            <TextField required id="client-id-input" label="Client ID" sx={inputStyle}/>
                        </div>
                        <div style={{ padding: '.5rem'}}>
                            <TextField required id="client-secret-input" label="Client Secret" sx={inputStyle}/>
                        </div>
                    </Box>
                </Modal>
            </div>
        </>
    );
}

export default AuthModal;
