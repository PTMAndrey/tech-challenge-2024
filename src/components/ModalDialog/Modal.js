import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    minWidth: 100,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};

export default function NestedModal({ open, handleClose, title, content, handleActionYes, textActionYes, handleActionNo, textActionNo}) {

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                {/* <Box sx={{ ...style, width: 400 }}> */}
                <Box sx={{ ...style, width: 250, '& h2': { fontWeight: 'bold' } }}>
                    <h2 id="parent-modal-title">{title}</h2>
                    <br/>
                    <div id="parent-modal-description">
                        {content}
                    </div>
                    <br/>
                    <Button onClick={handleActionYes}>{textActionYes}</Button>
                    <Button onClick={handleActionNo}>{textActionNo}</Button>
                </Box>
            </Modal>
        </div>
    );
}