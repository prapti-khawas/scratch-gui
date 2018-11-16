import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

import PostsurveyModalComponent from '../components/postsurvey-modal/postsurvey-modal.jsx';

import {
    closePostsurvey,
    openPreviewInfo,
    openLoginInfo
} from '../reducers/modals';

const SERVER_URL = 'https://userdataservice.cfapps.io/'
//const SERVER_URL = 'http://localhost:8080/'

class PostsurveyModal extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleDone',
            'handleSkip'
        ]);

        this.state = {
            completed: false
        };
        this.handleDone = this.handleDone.bind(this);

    }
    handleDone (event) {
        this.setState({completed: true});
        if (event.data) {
                if (event.data === 'closeQSIWindow') {
                    console.log(event);
                    const token = sessionStorage.getItem("jwt");
                    localStorage.setItem("survey","completed");
                    //this.props.onDone();
                }
        }
    }
    handleCancel () {
        this.props.onCancel();
    }
    handleSkip () {
        this.props.onDone();
    }
    render () {
        return (
            <PostsurveyModalComponent
                onCancel={this.handleCancel}
                onDone={this.handleDone}
                onSkip={this.handleSkip}
            />
        );
    }

    componentDidMount () {
        if (this.props.onDone) window.addEventListener("message", this.handleDone);
    }

    componentWillUnmount () {
        if (this.props.onDone) window.removeEventListener("message", this.handleDone);
    }
}

PostsurveyModal.propTypes = {
    onBack: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onDone: PropTypes.func.isRequired,
};

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
    onBack: () => {
        dispatch(closePostsurvey());
    },
    onCancel: () => {
        dispatch(closePostsurvey());
    },
    onDone: () => {
        dispatch(closePostsurvey());
        window.close();
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PostsurveyModal);
