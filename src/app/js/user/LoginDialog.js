import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { submit, isSubmitting } from 'redux-form';

import { login as loginAction, toggleLogin as toggleLoginAction, LOGIN_FORM_NAME } from './reducers';
import LoginForm from './LoginForm';

class LoginDialog extends Component {
    handleSubmit = (values) => {
        this.props.login(values);
    }

    handleSubmitButtonClick = () => {
        this.props.submit(LOGIN_FORM_NAME);
    }

    render() {
        const { showModal, submitting, toggleLogin } = this.props;

        return (
            <Dialog
                className="dialog-login"
                title="Sign in"
                actions={[
                    <FlatButton
                        label="Cancel"
                        onTouchTap={toggleLogin}
                    />,
                    <FlatButton
                        label="Sign in"
                        disabled={submitting}
                        primary
                        onTouchTap={this.handleSubmitButtonClick}
                    />,
                ]}
                modal
                open={showModal}
                onRequestClose={toggleLogin}
            >
                <LoginForm onSubmit={this.handleSubmit} />
            </Dialog>
        );
    }
}

LoginDialog.propTypes = {
    showModal: PropTypes.bool.isRequired,
    login: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    toggleLogin: PropTypes.func.isRequired,
};

export const mapStateToProps = state => ({
    showModal: state.user.showModal,
    submitting: isSubmitting(LOGIN_FORM_NAME)(state),
});

export const mapDispatchToProps = ({
    login: loginAction,
    submit,
    toggleLogin: toggleLoginAction,
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginDialog);
