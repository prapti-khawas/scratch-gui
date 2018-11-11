import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import VM from 'scratch-vm';
import {connect} from 'react-redux';

import analytics from '../lib/analytics';
import ControlsComponent from '../components/controls/controls.jsx';

import { defaultVM } from '../reducers/vm';
import { checkCode } from '../reducers/improvable';

const SERVER_URL = 'https://userdataservice.cfapps.io/'
//const SERVER_URL = 'http://localhost:8080/'

const rand = Math.floor(Math.random() * 1000000);

class Controls extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleGreenFlagClick',
            'handleStopAllClick'
        ]);
    }
    componentDidMount () {
        window.showMessage = false;
        setInterval(function(){window.showMessage = true;}, 300000);
    }
    handleGreenFlagClick (e) {
        e.preventDefault();

        var data = defaultVM.toJSON();
        var emptyProject = true;
        var project = JSON.parse(data);
        project.targets.forEach(function(e){
            if(JSON.stringify(e.blocks) !== JSON.stringify({})){
                emptyProject = false;
            }
        });
        if(!emptyProject && showMessage){
            window.showMessage = false;
            var token = sessionStorage.getItem("jwt");
            window.projectID = (window.location.hash == "")? ((document.getElementById("projectTitle").value == "Scratch Project")? document.getElementById("projectTitle").value+rand : document.getElementById("projectTitle").value) : window.location.hash.substring(1);
            fetch(SERVER_URL + 'save-project', {
                method: 'POST',
                headers: {'Accept': 'application/json', 'Content-Type':'application/json', 'Authorization': token},
                body: JSON.stringify({username: window.userID, projectId: window.projectID , projectJson: data})
            })
              .then(res => {
                console.log("done");
              })
              .catch(err => {
                console.error(err);
              }) 
            checkCode();
        }

        if (e.shiftKey) {
            this.props.vm.setTurboMode(!this.props.turbo);
        } else {
            this.props.vm.greenFlag();
            analytics.event({
                category: 'general',
                action: 'Green Flag'
            });
        }
    }
    handleStopAllClick (e) {
        e.preventDefault();
        this.props.vm.stopAll();
        analytics.event({
            category: 'general',
            action: 'Stop Button'
        });
    }
    render () {
        const {
            vm, // eslint-disable-line no-unused-vars
            projectRunning,
            turbo,
            ...props
        } = this.props;
        return (
            <ControlsComponent
                {...props}
                active={projectRunning}
                turbo={turbo}
                onGreenFlagClick={this.handleGreenFlagClick}
                onStopAllClick={this.handleStopAllClick}
            />
        );
    }
}

Controls.propTypes = {
    projectRunning: PropTypes.bool.isRequired,
    turbo: PropTypes.bool.isRequired,
    vm: PropTypes.instanceOf(VM)
};

const mapStateToProps = state => ({
    projectRunning: state.scratchGui.vmStatus.running,
    turbo: state.scratchGui.vmStatus.turbo
});
// no-op function to prevent dispatch prop being passed to component
const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Controls);
