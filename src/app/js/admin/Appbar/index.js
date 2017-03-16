import React, { PropTypes } from 'react';
import AppBar from 'material-ui/AppBar';
import CircularProgress from 'material-ui/CircularProgress';

import SignOutButton from './SignOutButton';
import SignInButton from './SignInButton';
import PublicationButton from '../publish/PublicationButton';
import ModelMenu from './ModelMenu';
import UploadButton from '../upload/UploadButton';

const styles = {
    appBar: {
        zIndex: 1,
        height: 54,
        lineHeight: 'normal',
    },
    linkToHome: {
        color: 'white',
        textDecoration: 'none',
    },
    loading: {
        margin: 8,
    },
    buttons: {
        display: 'flex',
    },
};

const AppbarComponent = ({ isLoading, isLoggedIn }) => {
    const LeftElement = isLoading
        ? <CircularProgress color="#fff" size={30} thickness={2} style={styles.loading} />
        : <span />;

    const RightElement = (
        <div style={styles.buttons}>
            {isLoggedIn && <UploadButton />}
            {isLoggedIn ? <ModelMenu /> : <SignInButton />}
            {isLoggedIn && <SignOutButton />}
            {isLoggedIn && <PublicationButton /> }
        </div>
    );

    return (
        <AppBar
            className="appbar"
            title={<a style={styles.linkToHome} href="/">Lodex</a>}
            iconElementLeft={LeftElement}
            iconElementRight={RightElement}
            style={styles.appBar}
        />
    );
};

AppbarComponent.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
};

export default AppbarComponent;
