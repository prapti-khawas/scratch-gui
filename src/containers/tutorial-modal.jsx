import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

import TutorialModalComponent from '../components/tutorial-modal/tutorial-modal.jsx';

import {
    closeTutorial,
    openPreviewInfo,
    openLoginInfo
} from '../reducers/modals';


class TutorialModal extends React.Component {
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
        //localStorage.setItem("tutorial","completed");
        this.props.onDone();
    }
    handleCancel () {
        this.props.onCancel();
    }
    handleSkip () {
        //localStorage.setItem("tutorial","completed");
        this.props.onDone();
    }
    render () {
        return (
            <TutorialModalComponent
                onCancel={this.handleCancel}
                onDone={this.handleDone}
                onSkip={this.handleSkip}
            />
        );
    }

}

TutorialModal.propTypes = {
    onBack: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onDone: PropTypes.func.isRequired,
};

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
    onBack: () => {
        dispatch(closeTutorial());
        dispatch(openPreviewInfo());
    },
    onCancel: () => {
        dispatch(closeTutorial());
    },
    onDone: () => {
        dispatch(closeTutorial());
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TutorialModal);
