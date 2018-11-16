import PropTypes from 'prop-types';
import React from 'react';
import ReactModal from 'react-modal';
import Box from '../box/box.jsx';
import {defineMessages, injectIntl, intlShape, FormattedMessage} from 'react-intl';

import styles from './preview-modal.css';
import catIcon from './happy-cat.png';

const messages = defineMessages({
    label: {
        id: 'gui.customPreviewInfo.label',
        defaultMessage: 'Try Scratch 3.0',
        description: 'Scratch 3.0 modal label - for accessibility'
    }
});

const PreviewModal = ({intl, ...props}) => (
    <ReactModal
        isOpen
        className={styles.modalContent}
        contentLabel={intl.formatMessage({...messages.label})}
        overlayClassName={styles.modalOverlay}
        onRequestClose={props.onTryIt}
    >
        <Box className={styles.illustration} />

        <div dir={props.isRtl ? 'rtl' : 'ltr'} >
            <Box className={styles.body}>
                <h2>
                    <FormattedMessage
                        defaultMessage="Welcome to Quality4Blocks!"
                        description="Header for Preview Info Modal"
                        id="gui.customPreviewInfo.welcome"
                    />
                </h2>
                {/*
                <p>
                    <FormattedMessage
                        defaultMessage="We're working on the next generation of Scratch with support for program software quality. We're excited you decided to try it!"
                        description="Invitation to try Improvable preview"
                        id="gui.customPreviewInfo.invitation"
                    />
                </p>
                */}
                <p>
                    <FormattedMessage
                        defaultMessage="This experimental version of Scratch is developed by researchers at Virginia Tech. Besides the latest visual interface, this version provides helpful tips and feedback on how you can improve your code quality."
                        description="Invitation to try Improvable preview"
                        id="gui.loginInfo.invitation1"
                    />
                </p>
                <p>
                    <FormattedMessage
                        defaultMessage="At the end of using this tool, you will be asked to take a short survey about your experiences with Scratch."
                        description="Invitation to try Improvable preview"
                        id="gui.loginInfo.invitation2"
                    />
                </p>
                <p>
                    <FormattedMessage
                        defaultMessage="At this time, you would not be able to save your projects created with this tool to the online Scratch community. However, you can always save your projects locally to your computer’s hard drive."
                        description="Invitation to try Improvable preview"
                        id="gui.loginInfo.invitation3"
                    />
                </p> 

                <Box className={styles.buttonRow}>
                    <button
                        className={styles.noButton}
                        onClick={props.onCancel}
                    >
                        <FormattedMessage
                            defaultMessage="Try a sample project"
                            description="Label for button to try a preloaded Scratch 3.0 preview"
                            id="gui.customPreviewInfo.notnow"
                        />
                    </button>
                    <button
                        className={styles.okButton}
                        title="tryit"
                        onClick={props.onTryIt}
                    >
                        <FormattedMessage
                            defaultMessage="Try It! {caticon}"
                            description="Label for button to try Scratch 3.0 preview"
                            id="gui.previewModal.tryit"
                            values={{
                                caticon: (
                                    <img
                                        className={styles.catIcon}
                                        src={catIcon}
                                    />
                                )
                            }}
                        />
                    </button>
                    <button
                        className={styles.viewProjectButton}
                        title="viewproject"
                        onClick={props.onViewProject}
                    >
                        <FormattedMessage
                            defaultMessage="Try a 2.0 Project"
                            description="Label for button to import a 2.0 project"
                            id="gui.previewModal.viewproject"
                        />
                    </button>
                </Box>
                <Box className={styles.faqLinkText}>
                    <FormattedMessage
                        defaultMessage="By proceeding to use the tool, you agree to provide {previewFaqLink}."
                        description="Consent information"
                        id="gui.loginInfo.informConsent"
                        values={{
                            previewFaqLink: (
                                <a
                                    className={styles.faqLink}
                                    href="http://www.q4blocks.org/static/consent-form.html" 
                                    target="_blank"
                                >
                                    <FormattedMessage
                                        defaultMessage="consent"
                                        description="link to consent terms"
                                        id="gui.loginInfo.consentLink"
                                    />
                                </a>
                            )
                        }}
                    />
                </Box>
            </Box>
        </div>
    </ReactModal>
);

PreviewModal.propTypes = {
    intl: intlShape.isRequired,
    isRtl: PropTypes.bool,
    onCancel: PropTypes.func.isRequired,
    onTryIt: PropTypes.func.isRequired,
    onViewProject: PropTypes.func.isRequired
};

export default injectIntl(PreviewModal);
