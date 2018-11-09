import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

import LoginModalComponent from '../components/login-modal/login-modal.jsx';

import {
    closeLoginInfo,
    openPreviewInfo,
    openPresurvey
} from '../reducers/modals';

const SERVER_URL = 'https://userdataservice.cfapps.io/'
//const SERVER_URL = 'http://localhost:8080/'

class LoginModal extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleCancel',
            'handleChange',
            'handleSignUp',
            'handleLogin',
            'handleDisplaySignUp',
            'handleGoBack',
            'generateRandomID'
        ]);

        this.state = {
            inputUsername: '',
            inputPassword: '',
            inputConfirmPassword: '',
            inputEmail: '',
            usernameValid: true,
            passwordValid: true,
            confirmPasswordValid: true,
            emailValid: true,
            displaySignUp: false,
            hasValidationError: false,
            hasSigninValidationError: false,
            isAuthenticated: false, 
            open: false,
            errorMessage: ''
        };

        this.handleSignUp = this.handleSignUp.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }
    componentWillMount () {
        mixpanel.track("Visited page");
    }
    handleDisplaySignUp () {
        mixpanel.track("Clicked to sign up");
        this.setState({displaySignUp: true});
    }
    handleSignUp (e) {
        if(this.state.inputUsername.length == 0){
            this.setState({usernameValid: false, hasSigninValidationError: true, errorMessage: `invalidUsername`});
            e.preventDefault();
        } else if(this.state.inputPassword.length == 0){
            this.setState({passwordValid: false, hasSigninValidationError: true, errorMessage: `invalidPassword`});
            e.preventDefault();
        } else if(this.state.inputConfirmPassword != this.state.inputPassword){
            this.setState({confirmPasswordValid: false, hasSigninValidationError: true, errorMessage: `invalidConfirmPassword`});
            e.preventDefault();
        } else if(this.state.inputEmail.length == 0){
            this.setState({emailValid: false, hasSigninValidationError: true, errorMessage: `invalidEmail`});
            e.preventDefault();
        } else { 
            const user = {username: this.state.inputUsername, password: this.state.inputPassword, role: 'user'};
            fetch(SERVER_URL + 'sign-up', {
                method: 'POST',
                headers: {'Accept': 'application/json', 'Content-Type':'application/json'},
                body: JSON.stringify(user)
            })
            .then(res => {
                if(res.status == 409){
                    this.setState({usernameValid: false, hasSigninValidationError: true, errorMessage: `duplicateUsername`});
                } else if(res.status == 200) {
                    this.setState({displaySignUp: false, hasValidationError: false, hasSigninValidationError: false, usernameValid: true, passwordValid: true, confirmPasswordValid: true, emailValid: true, errorMessage: ``});

                    //automatic login on signup
                    const user = {username: this.state.inputUsername, password: this.state.inputPassword};
                    fetch(SERVER_URL + 'login', {
                        method: 'POST',
                        body: JSON.stringify(user)
                    })
                    .then(res => {
                        if(res.status == 403){
                            this.setState({hasValidationError: true});
                        }
                        const jwtToken = res.headers.get('Authorization');
                        if (jwtToken !== null) {
                            sessionStorage.setItem("jwt", jwtToken);
                            this.setState({isAuthenticated: true});
                            document.getElementById("gui.menuBar.username").innerHTML = this.state.inputUsername;
                            window.scratch_username = this.state.inputUsername;
                            mixpanel.track("Signed up",{
                                "userID": window.scratch_username
                            });
                            this.props.onSuccessSignup();
                        }else{
                            this.setState({open: true});
                        }
                    })
                    .catch(err => {
                        console.error(err);
                    }) 
                }
            })
            .catch(err => {
                console.error(err);
            }) 
        }
    }
    handleChange (e) {
        this.setState({[e.target.name]: e.target.value, hasValidationError: false, hasSigninValidationError: false, usernameValid: true, passwordValid: true, confirmPasswordValid: true, emailValid: true, errorMessage: ''});
    }
    handleClose (event) {
        this.setState({open: false});
    }

    relogin () {
        const token = sessionStorage.getItem("jwt");
        //check some how if token is valid
        fetch(SERVER_URL + 'username', 
            { 
              method: 'GET',
              headers: {'Authorization': token}
            }
        ).then(res => res.json())
         .then(res => {
            console.log(res.username);
            this.setState({username: res.username, isAuthenticated: true});
         })
         .catch(err => {
            this.setState({open: true});
            console.error(err)
          })
    }
    handleLogin () {
        const user = {username: this.state.inputUsername, password: this.state.inputPassword};
        fetch(SERVER_URL + 'login', {
            method: 'POST',
            body: JSON.stringify(user)
        })
          .then(res => {
            if(res.status == 403){
                this.setState({hasValidationError: true});
            }
            const jwtToken = res.headers.get('Authorization');
            if (jwtToken !== null) {
              sessionStorage.setItem("jwt", jwtToken);
              sessionStorage.setItem("sessionID", this.generateRandomID());
              this.setState({isAuthenticated: true});
              document.getElementById("gui.menuBar.username").innerHTML = this.state.inputUsername;
              window.scratch_username = this.state.inputUsername;
              this.props.onSuccessLogin();
            }else{
                this.setState({open: true});
            }
          })
          .catch(err => {
            console.error(err);
          }) 
    }

    logout () {
        sessionStorage.removeItem("jwt");
        sessionStorage.removeItem("sessionID");
        this.setState({isAuthenticated: false});
    }

    retrieveProfileInfo () {
        const token = sessionStorage.getItem("jwt");
          fetch(SERVER_URL + 'profile/'+this.state.inputUsername, 
            { 
              method: 'GET',
              headers: {'Authorization': token}
            }
          )
          .then(res => {
            // this.setState({open: true, message: 'Car deleted'});
            // this.fetchCars();
          })
          .catch(err => {
            // this.setState({open: true, message: 'Error when deleting'});
            console.error(err)
          }) 
    }
    handleCancel () {
        this.props.onCancel();
    }
    handleGoBack () {
        this.props.onBack();
    }
    generateRandomID () {
        var s = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@%^*(:;{[,=.";
        return Array(20).join().split(',').map(function() { return s.charAt(Math.floor(Math.random() * s.length)); }).join('');
    }

    render () {
        return (
            <LoginModalComponent
                errorMessage={this.state.errorMessage}
                hasValidationError={this.state.hasValidationError}
                hasSigninValidationError={this.state.hasSigninValidationError}
                inputUsername={this.state.inputUsername}
                inputPassword={this.state.inputPassword}
                inputEmail={this.state.inputEmail}
                inputConfirmPassword={this.state.inputConfirmPassword}
                usernameValid={this.state.usernameValid}
                passwordValid={this.state.passwordValid}
                emailValid={this.state.emailValid}
                confirmPasswordValid={this.state.confirmPasswordValid}
                placeholderUsername="Your Scratch Username"
                placeholderPassword="Secret Password"
                placeholderConfirmPassword="Confirm Password"
                placeholderEmail="Your Email"
                onCancel={this.handleCancel}
                onChange={this.handleChange}
                onGoBack={this.handleGoBack}
                onDisplaySignUp={this.handleDisplaySignUp}
                onLogin={this.handleLogin}
                onSignUp={this.handleSignUp}
                displaySignUp={this.state.displaySignUp}
                errorMessage={this.state.errorMessage}
            />
        );
    }
}

LoginModal.propTypes = {
    onBack: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
    onBack: () => {
        dispatch(closeImportInfo());
        dispatch(openPreviewInfo());
    },
    onCancel: () => {
        dispatch(closeImportInfo());
    },
    onSuccessLogin: () => {
        dispatch(closeLoginInfo());
        dispatch(openPreviewInfo());
    },
    onSuccessSignup: () => {
        dispatch(closeLoginInfo());
        dispatch(openPresurvey());
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(LoginModal);

