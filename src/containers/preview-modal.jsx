import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

import tabletFullScreen from '../lib/tablet-full-screen';

import PreviewModalComponent from '../components/preview-modal/preview-modal.jsx';

import {
    closePreviewInfo,
    openImportInfo,
    openPresurvey
} from '../reducers/modals';

const SERVER_URL = 'https://userdataservice.cfapps.io/'

class PreviewModal extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleTryIt',
            'handleCancel',
            'handleViewProject'
        ]);

        this.state = {
            previewing: false
        };
    }
    componentWillMount () {
        window.userID = localStorage.getItem("userID");
        if(window.userID == null) {
            window.userID = "ScratchUser" + Math.floor(Math.random() * 1000000);
            localStorage.setItem("userID", window.userID);
            localStorage.setItem("pw", "scratch123");
        } 
        mixpanel.track("Page visited",{
            "userID": window.userID
        });
    }
    handleTryIt () {
        this.setState({previewing: true});
        //automatic false signup and login
        const user = {username: window.userID, password: "scratch123", role: 'user'};
        fetch(SERVER_URL + 'sign-up', {
                method: 'POST',
                headers: {'Accept': 'application/json', 'Content-Type':'application/json'},
                body: JSON.stringify(user)
            })
            .then(res => {
                const user = {username: window.userID, password: "scratch123"};
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
                    }else{
                        this.setState({open: true});
                    }
                })
                .catch(err => {
                    console.error(err);
                }) 
            })
            .catch(err => {
                console.error(err);
            }) 
        // try to run in fullscreen mode on tablets.
        tabletFullScreen();
        this.props.onTryIt();
        mixpanel.track("Clicked Try it",{
            "userID": window.userID
        });
    }
    handleCancel () {
        const projectLink = document.createElement('a');
        document.body.appendChild(projectLink);
        projectLink.href = `#217520988`;
        projectLink.click();
        document.body.removeChild(projectLink);
        this.props.onTryIt();
        mixpanel.track("Clicked Sample project",{
            "userID": window.userID
        });
    }
    handleViewProject () {
        this.props.onViewProject();
        mixpanel.track("Clicked View 2.0 project",{
            "userID": window.userID
        });
    }
    render () {
        return (
            <PreviewModalComponent
                isRtl={this.props.isRtl}
                previewing={this.state.previewing}
                onCancel={this.handleCancel}
                onTryIt={this.handleTryIt}
                onViewProject={this.handleViewProject}
            />
        );
    }
}

PreviewModal.propTypes = {
    isRtl: PropTypes.bool,
    onTryIt: PropTypes.func,
    onViewProject: PropTypes.func
};

const mapStateToProps = state => ({
    isRtl: state.locales.isRtl
});

const mapDispatchToProps = dispatch => ({
    onTryIt: () => {
        dispatch(closePreviewInfo());
        dispatch(openPresurvey());
    },
    onViewProject: () => {
        dispatch(closePreviewInfo());
        dispatch(openImportInfo());
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PreviewModal);
