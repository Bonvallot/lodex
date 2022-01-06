import {
    Box,
    Button,
    CircularProgress,
    Fade,
    LinearProgress,
    Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useState } from 'react';
import theme from '../../theme';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { io } from 'socket.io-client';
import translate from 'redux-polyglot/dist/translate';
import { publishSuccess } from '../publish';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { PENDING } from '../../../../common/progressStatus';
import classNames from 'classnames';
import { Cancel } from '@material-ui/icons';
import jobsApi from '../api/job';
import CancelPublicationDialog from './CancelPublicationDialog';
import { publicationCleared } from '../publication';

const useStyles = makeStyles({
    progress: {
        width: '100%',
        display: 'flex',
        margin: '0 4px 0',
    },
    colorPrimary: { backgroundColor: theme.white.light },
    barColorPrimary: { backgroundColor: theme.white.primary },
    progressContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginLeft: 'auto',
        marginRight: '20px',
        width: '250px',
    },
    progressLabelContainer: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    progressLabel: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    cancelButton: {
        display: 'flex',
        minWidth: '0',
        padding: '0',
    },
});

const JobProgressComponent = props => {
    const classes = useStyles();
    const {
        p: polyglot,
        handlePublishSuccess,
        handleCancelPublication,
    } = props;
    const [progress, setProgress] = useState();
    const [
        isCancelPublicationDialogOpen,
        setIsCancelPublicationDialogOpen,
    ] = useState(false);

    useEffect(() => {
        const socket = io();
        socket.on('progress', data => {
            data.isJobProgress =
                data.status !== PENDING &&
                (data.type === 'enrichment' || data.type === 'publisher');
            setProgress(data);
        });

        socket.on('publisher', data => {
            if (data.success) {
                handlePublishSuccess();
            }
        });
        return () => socket.disconnect();
    }, []);

    return (
        <>
            <Fade
                in={progress && progress.isJobProgress}
                out={progress && !progress.isJobProgress}
            >
                <Box
                    className={classNames(
                        classes.progressContainer,
                        'progress-container',
                    )}
                >
                    <div className={classes.progressLabelContainer}>
                        <CircularProgress
                            variant="indeterminate"
                            color="inherit"
                            size={20}
                        />
                        <div className={classes.progressLabel}>
                            {progress?.label && (
                                <Typography variant="subtitle2">
                                    {polyglot.t(
                                        progress?.label || 'publishing',
                                    )}
                                </Typography>
                            )}
                            {progress &&
                                progress?.type === 'publisher' &&
                                progress.status && (
                                    <Typography variant="caption">
                                        {polyglot.t(progress.status)}
                                    </Typography>
                                )}

                            {progress?.type === 'enrichment' && (
                                <Typography variant="caption">
                                    {progress.subLabel}
                                </Typography>
                            )}
                        </div>

                        {progress?.type === 'publisher' && (
                            <Button
                                className={classes.cancelButton}
                                color="inherit"
                                onClick={() => {
                                    setIsCancelPublicationDialogOpen(true);
                                }}
                            >
                                <Cancel />
                            </Button>
                        )}
                    </div>
                    <LinearProgress
                        classes={{
                            root: classes.progress,
                            colorPrimary: classes.colorPrimary,
                            barColorPrimary: classes.barColorPrimary,
                        }}
                        variant="determinate"
                        value={
                            progress && progress.target
                                ? (progress.progress / progress.target) * 100
                                : 0
                        }
                    />
                </Box>
            </Fade>
            <CancelPublicationDialog
                isOpen={isCancelPublicationDialogOpen}
                title={'cancelPublicationTitle'}
                content={'cancelPublicationContent'}
                onCancel={() => {
                    setIsCancelPublicationDialogOpen(false);
                }}
                onConfirm={() => {
                    jobsApi.cancelJob('publisher');
                    handleCancelPublication();
                    setIsCancelPublicationDialogOpen(false);
                }}
            />
        </>
    );
};
JobProgressComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
    handlePublishSuccess: PropTypes.func.isRequired,
    handleCancelPublication: PropTypes.func.isRequired,
};
const mapDispatchToProps = {
    handlePublishSuccess: () => publishSuccess(),
    handleCancelPublication: () => publicationCleared(),
};
export default compose(
    connect(undefined, mapDispatchToProps),
    translate,
)(JobProgressComponent);
