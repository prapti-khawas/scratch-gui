import PropTypes from 'prop-types';
import React from 'react';
import ReactModal from 'react-modal';
import Box from '../box/box.jsx';
import {defineMessages, injectIntl, intlShape, FormattedMessage} from 'react-intl';
import classNames from 'classnames';

import CloseButton from '../close-button/close-button.jsx';

import styles from './presurvey-modal.css';

const messages = defineMessages({
    title: {
        id: 'gui.loginInfo.title',
        defaultMessage: 'Login/Sign Up',
        description: 'Login/Sign Up'
    }
});

const PresurveyModal = ({intl, ...props}) => (
    <ReactModal
        isOpen
        className={styles.modalContent}
        contentLabel={intl.formatMessage({...messages.title})}
        overlayClassName={styles.modalOverlay}
        onRequestClose={props.onCancel}
    >
       <iframe src={"https://virginiatech.qualtrics.com/jfe/form/SV_ekvj095pZ4Dsnat?username="+window.userID} height="600px" width="800px"></iframe>
       {/*
       <Box className={styles.body}>
            <Box className={styles.buttonRow}>
                <button
                    className={styles.doneButton}
                    onClick={props.onSkip}
                >
                    <FormattedMessage
                        defaultMessage="Skip"
                        description="Label for button to skip survey"
                        id="gui.presurveyModal.skip"
                    />
                </button>    
            </Box>
        </Box>
        */}
    </ReactModal>
);

PresurveyModal.propTypes = {

};

export default injectIntl(PresurveyModal);
