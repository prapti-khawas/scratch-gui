import PropTypes from 'prop-types';
import React from 'react';
import ReactModal from 'react-modal';
import Box from '../box/box.jsx';
import {defineMessages, injectIntl, intlShape, FormattedMessage} from 'react-intl';
import classNames from 'classnames';

import CloseButton from '../close-button/close-button.jsx';

import styles from './tutorial-modal.css';

import tutorialVideo from './tutorial-final.mp4';

const messages = defineMessages({
    title: {
        id: 'gui.loginInfo.title',
        defaultMessage: 'Login/Sign Up',
        description: 'Login/Sign Up'
    }
});

const TutorialModal = ({intl, ...props}) => (
    <ReactModal
        isOpen
        className={styles.modalContent}
        contentLabel={intl.formatMessage({...messages.title})}
        overlayClassName={styles.modalOverlay}
        onRequestClose={props.onCancel}
    >
        <video width="700px" height="380px" controls>
            <source src={tutorialVideo} type="video/mp4"/>
            Your browser does not support the video tag.
        </video>
       {/*
       <iframe src={"https://virginiatech.qualtrics.com/jfe/form/SV_9NdpHzFV5AvBCgR?username="+window.userID} height="400px" width="700px"></iframe>
        */}
       <Box className={styles.body}>
            <Box className={styles.buttonRow}>
                <button
                    className={styles.doneButton}
                    onClick={props.onSkip}
                >
                    <FormattedMessage
                        defaultMessage="Close"
                        description="Label for button to close"
                        id="gui.tutorialModal.skip"
                    />
                </button>    
            </Box>
        </Box>
    </ReactModal>
);

TutorialModal.propTypes = {

};

export default injectIntl(TutorialModal);
