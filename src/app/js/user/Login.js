import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { submit as submitAction, isSubmitting } from 'redux-form';
import {
    Card,
    CardActions,
    CardHeader,
    CardContent,
    Button,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import { polyglot as polyglotPropTypes } from '../propTypes';
import {
    login as loginAction,
    toggleLogin as toggleLoginAction,
    LOGIN_FORM_NAME,
} from './';
import { fromUser } from '../sharedSelectors';
import LoginForm from './LoginForm';
import ButtonWithStatus from '../lib/components/ButtonWithStatus';

const styles = {
    container: {
        marginTop: '0.5rem',
    },
};

export const LoginComponent = ({
    login,
    p: polyglot,
    submit,
    submitting,
    target = 'admin',
}) => {
    const { href, title } = useMemo(() => {
        if (target === 'root') {
            return {
                href: '/instances',
                title: 'root_panel_link',
            };
        }

        return {
            href: 'admin#/login',
            title: 'admin_panel_link',
        };
    }, [target]);

    return (
        <Card sx={styles.container}>
            <CardHeader
                title={polyglot.t('Login')}
                action={
                    <Button
                        variant="contained"
                        color="primary"
                        disableElevation
                        href={href}
                        target="_blank"
                        startIcon={<OpenInNewIcon />}
                        sx={{
                            '&:hover': {
                                color: '#fff',
                            },
                        }}
                    >
                        {polyglot.t(title)}
                    </Button>
                }
            />
            <CardContent>
                <LoginForm onSubmit={login} />
            </CardContent>
            <CardActions>
                <ButtonWithStatus
                    loading={submitting}
                    onClick={submit}
                    color="primary"
                >
                    {polyglot.t('Sign in')}
                </ButtonWithStatus>
            </CardActions>
        </Card>
    );
};

LoginComponent.propTypes = {
    login: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    submit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    target: PropTypes.oneOf(['root', 'admin']),
};

LoginComponent.defaultProps = {
    previousState: null,
};

export const mapStateToProps = state => ({
    showModal: fromUser.isUserModalShown(state),
    submitting: isSubmitting(LOGIN_FORM_NAME)(state),
});

export const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            login: values => loginAction(values),
            submit: () => submitAction(LOGIN_FORM_NAME),
            toggleLogin: toggleLoginAction,
        },
        dispatch,
    );

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(LoginComponent);
