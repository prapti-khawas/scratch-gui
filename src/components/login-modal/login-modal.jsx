import PropTypes from 'prop-types';
import React from 'react';
import ReactModal from 'react-modal';
import Box from '../box/box.jsx';
import {defineMessages, injectIntl, intlShape, FormattedMessage} from 'react-intl';
import classNames from 'classnames';

import CloseButton from '../close-button/close-button.jsx';

import styles from './login-modal.css';

const messages = defineMessages({
    title: {
        id: 'gui.loginInfo.title',
        defaultMessage: 'Login/Sign Up',
        description: 'Login/Sign Up'
    },
    invalidUsername: {
        id: 'gui.signinInfo.invalidUsername',
        defaultMessage: 'Uh oh, You haven\'t provided a username.',
        description: 'Invalid username'
    },
    duplicateUsername: {
        id: 'gui.signinInfo.duplicateUsername',
        defaultMessage: 'Uh oh, The username that you have provided is already taken.',
        description: 'Duplicate username'
    },
    invalidPassword: {
        defaultMessage:
            'Uh oh, You haven\'t provided a password.',
        description: 'Invalid password',
        id: 'gui.signinInfo.invalidPassword'
    },
    invalidConfirmPassword: {
        defaultMessage: 'Uh oh, The passwords don\'t match.',
        description: 'Invalid confirm password',
        id: 'gui.signinInfo.invalidConfirmPassword'
    },
    invalidEmail: {
        id: 'gui.signinInfo.invalidEmail',
        defaultMessage: 'Uh oh, The email id you provided doesn\'t look quite right.',
        description: 'Invalid email'
    }
});

const LoginModal = ({intl, ...props}) => (
    <ReactModal
        isOpen
        className={styles.modalContent}
        contentLabel={intl.formatMessage({...messages.title})}
        overlayClassName={styles.modalOverlay}
        onRequestClose={props.onCancel}
    >
        <Box className={styles.illustration} />

        <div dir={props.isRtl ? 'rtl' : 'ltr'} >
            <Box className={styles.body}>
                <h2>
                    <FormattedMessage
                        defaultMessage="Welcome to Quality4Blocks!"
                        description="Header for Login Info Modal"
                        id="gui.loginInfo.welcome"
                    />
                </h2>
                <p>
                    <FormattedMessage
                        defaultMessage="This experimental version of Scratch is developed by researchers at Virginia Tech. Besides the latest visual interface, this version provides helpful tips and feedback on how you can improve your code quality."
                        description="Invitation to try Improvable preview"
                        id="gui.loginInfo.invitation1"
                    />
                </p>
                <p>
                    <FormattedMessage
                        defaultMessage="To enjoy using this tool, you will need to sign up with your scratch username and take a short survey about your experiences with Scratch."
                        description="Invitation to try Improvable preview"
                        id="gui.loginInfo.invitation2"
                    />
                </p>
                {props.displaySignUp ? null :
                <p>
                    <FormattedMessage
                        defaultMessage="At this time, you would not be able to save your projects created with this tool to the online Scratch community. However, you can always save your projects locally to your computer’s hard drive."
                        description="Invitation to try Improvable preview"
                        id="gui.loginInfo.invitation3"
                    />
                </p> 
                }
                <Box
                    className={classNames(styles.inputRow,(props.usernameValid ? null : styles.badInputContainer))}
                >
                    <input
                        name="inputUsername"
                        placeholder={props.placeholderUsername}
                        value={props.inputUsername}
                        onChange={props.onChange}
                    />
                </Box>
                <Box
                    className={classNames(styles.inputRow,(props.passwordValid ? null : styles.badInputContainer))}
                >
                    <input
                        type="password"
                        name="inputPassword"
                        placeholder={props.placeholderPassword}
                        value={props.inputPassword}
                        onChange={props.onChange}
                    />
                </Box>
                {props.displaySignUp ?
                <Box>
                    <Box
                        className={classNames(styles.inputRow,(props.confirmPasswordValid ? null : styles.badInputContainer))}
                    >
                        <input
                            type="password"
                            name="inputConfirmPassword"
                            placeholder={props.placeholderConfirmPassword}
                            value={props.inputConfirmPassword}
                            onChange={props.onChange}
                        />
                    </Box>
                    <Box
                        className={classNames(styles.inputRow,(props.emailValid ? null : styles.badInputContainer))}
                    >
                        <input
                            type="email"
                            name="inputEmail"
                            placeholder={props.placeholderEmail}
                            value={props.inputEmail}
                            onChange={props.onChange}
                        />
                    </Box>
                </Box> : null
                }
                
                {props.hasValidationError ?
                    <Box className={styles.errorRow}>
                        <p>
                            <FormattedMessage
                                id= "gui.loginModal.invalidLoginError"
                                defaultMessage= "Uh oh, Either the username or password isn't right."
                                description= "Invalid login credentials"
                            />
                        </p>
                    </Box> : null
                }
                {props.hasSigninValidationError ?
                    <Box className={styles.errorRow}>
                        <p>
                            <FormattedMessage
                                {...messages[`${props.errorMessage}`]}
                            />
                        </p>
                    </Box> : null
                }
                {props.displaySignUp ? 
                    <Box className={styles.buttonRow}>
                        <button
                            className={styles.signupButton}
                            onClick={props.onSignUp}
                            type="submit"
                        >
                        <FormattedMessage
                            defaultMessage="Sign Up"
                            description="Label for button to sign up"
                            id="gui.loginModal.signUpButton"
                        />
                        </button>    
                    </Box> : 
                    <Box className={styles.buttonRow}>
                        <button
                            className={styles.loginButton}
                            onClick={props.onLogin}
                        >
                        <FormattedMessage
                            defaultMessage="Login"
                            description="Label for button to login"
                            id="gui.loginModal.login"
                        />
                        </button>    
                    </Box>
                }
                {props.displaySignUp ? null : 
                    <Box className={styles.faqLinkText}>
                        <FormattedMessage
                            defaultMessage="Don't have an account? {signUpLink}."
                            description="Invitation to sign up"
                            id="gui.loginModal.signUp"
                            values={{
                                signUpLink: (
                                    <a
                                        className={styles.faqLink}
                                        href="#"
                                        onClick={props.onDisplaySignUp}
                                    >
                                        <FormattedMessage
                                            defaultMessage="Sign Up"
                                            description="link to sign up"
                                            id="gui.loginModal.signUpLink"
                                        />
                                    </a>
                                )
                            }}
                        />
                    </Box>
                }
                <Box className={styles.faqLinkText}>
                    <FormattedMessage
                        defaultMessage="By signing up, you agree to provide {previewFaqLink}."
                        description="Invitation to try 3.0 preview"
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

LoginModal.propTypes = {
    errorMessage: PropTypes.string.isRequired,
    hasValidationError: PropTypes.bool.isRequired,
    displaySignUp: PropTypes.bool.isRequired,
    inputUsername: PropTypes.string.isRequired,
    inputPassword: PropTypes.string.isRequired,
    inputEmail: PropTypes.string.isRequired,
    intl: intlShape.isRequired,
    onCancel: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onGoBack: PropTypes.func.isRequired,
    onLogin: PropTypes.func.isRequired,
    onSignUp: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    isRtl: PropTypes.bool
};

export default injectIntl(LoginModal);
