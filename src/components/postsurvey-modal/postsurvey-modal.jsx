import PropTypes from 'prop-types';
import React from 'react';
import ReactModal from 'react-modal';
import Box from '../box/box.jsx';
import {defineMessages, injectIntl, intlShape, FormattedMessage} from 'react-intl';
import classNames from 'classnames';

import CloseButton from '../close-button/close-button.jsx';

import styles from './postsurvey-modal.css';

const messages = defineMessages({
    title: {
        id: 'gui.loginInfo.title',
        defaultMessage: 'Login/Sign Up',
        description: 'Login/Sign Up'
    }
});

const PostsurveyModal = ({intl, ...props}) => (
    <ReactModal
        isOpen
        className={styles.modalContent}
        contentLabel={intl.formatMessage({...messages.title})}
        overlayClassName={styles.modalOverlay}
        onRequestClose={props.onCancel}
    >
        <iframe src={"https://virginiatech.qualtrics.com/jfe/form/SV_4OUH8McsbIG4b3f?username="+window.userID} height="500px" width="800px"></iframe>
       {/*
       <iframe src="https://virginiatech.qualtrics.com/jfe/form/SV_4OUH8McsbIG4b3f" height="600px" width="800px"></iframe>
       <Box className={styles.body}>
            <Box className={styles.buttonRow}>
                <button
                    className={styles.doneButton}
                    onClick={props.onSkip}
                >
                    <FormattedMessage
                        defaultMessage="Skip"
                        description="Label for button to skip survey"
                        id="gui.postsurveyModal.skip"
                    />
                </button>    
            </Box>
        </Box>
        */}
    </ReactModal>
);

PostsurveyModal.propTypes = {

};

export default injectIntl(PostsurveyModal);
