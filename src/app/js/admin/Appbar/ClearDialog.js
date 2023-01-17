import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import {
    Dialog,
    Button,
    TextField,
    DialogContent,
    DialogActions,
    DialogTitle,
} from '@material-ui/core';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import ButtonWithStatus from '../../lib/components/ButtonWithStatus';

import {
    clearDataset as clearDatasetAction,
    clearPublished as clearPublishedAction,
} from '../clear';

import { fromClear } from '../selectors';
import { getHost } from '../../../../common/uris';
import fieldApi from '../api/field';
import { toast } from 'react-toastify';
import { loadField } from '../../fields';

const baseUrl = getHost();

const TRANSLATION_KEY = new Map([
    ['dataset', 'clear_dataset'],
    ['published', 'clear_publish'],
    ['model', 'clear_model'],
]);

const ClearDialogComponent = props => {
    const [validName, setValidName] = React.useState(false);
    const {
        type,
        p: polyglot,
        onClose,
        isLoading,
        hasFailed,
        succeeded,
        loadField,
    } = props;

    useEffect(() => {
        if (succeeded) {
            if (type === 'dataset') {
                window.location.replace(
                    window.location.origin + '/admin#/data/existing',
                );
            }
            window.location.reload();
        }
    }, [succeeded]);

    const getInstanceName = () => /\/\/([a-z0-9-]+)./.exec(baseUrl)[1];

    const handleChangeField = e => {
        const instanceName = getInstanceName();
        setValidName(e.target.value === instanceName);
    };

    const handleClear = type =>
        (type === 'dataset' && handleClearDataset) ||
        (type === 'published' && handleClearPublished) ||
        (type === 'model' && handleClearModel);

    const handleClearDataset = () => {
        props.clearDataset();
    };

    const handleClearPublished = () => {
        props.clearPublished();
    };

    const handleClearModel = async () => {
        const result = await fieldApi.clearModel();
        if (result.message) {
            toast(polyglot.t('model_cleared'), {
                type: toast.TYPE.SUCCESS,
            });
            onClose();
            loadField();
        } else {
            toast(polyglot.t('model_not_cleared'), {
                type: toast.TYPE.ERROR,
            });
        }
    };

    const handleKeyPress = (e, type) => {
        if (e.key !== 'Enter' || !validName) {
            return null;
        }

        switch (type) {
            case 'dataset':
                return handleClearDataset();
            case 'published':
                return handleClearPublished();
            default:
                return null;
        }
    };
    const actions = [
        <ButtonWithStatus
            raised
            key="submit"
            className="btn-save"
            onClick={handleClear(type)}
            color="primary"
            error={hasFailed}
            disabled={!validName}
            loading={isLoading}
        >
            {polyglot.t('confirm')}
        </ButtonWithStatus>,
        <Button
            key="cancel"
            color="secondary"
            variant="text"
            className="btn-cancel"
            onClick={onClose}
        >
            {polyglot.t('cancel')}
        </Button>,
    ];

    return (
        <Dialog open onClose={onClose}>
            <DialogTitle>{polyglot.t(TRANSLATION_KEY.get(type))}</DialogTitle>
            <DialogContent>
                <b>
                    {type === 'model'
                        ? polyglot.t('listen_up_model')
                        : polyglot.t('listen_up')}
                </b>
                <br />
                <br />
                <div>
                    {polyglot.t('enter_name')} :<b> {getInstanceName()}</b>
                    <TextField
                        name="field-name-instance"
                        placeholder={polyglot.t('instance_name')}
                        fullWidth
                        onChange={handleChangeField}
                        onKeyPress={e => handleKeyPress(e, type)}
                        error={hasFailed && polyglot.t('error')}
                    />
                </div>
            </DialogContent>
            <DialogActions>{actions}</DialogActions>
        </Dialog>
    );
};

ClearDialogComponent.propTypes = {
    type: PropTypes.string.isRequired,
    succeeded: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
    onClose: PropTypes.func.isRequired,
    clearDataset: PropTypes.func.isRequired,
    clearPublished: PropTypes.func.isRequired,
    reloadParsing: PropTypes.func,
    isLoading: PropTypes.bool.isRequired,
    hasFailed: PropTypes.bool.isRequired,
    loadField: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    succeeded: fromClear.hasClearSucceeded(state),
    hasFailed: fromClear.hasClearFailed(state),
    isLoading: fromClear.getIsLoading(state),
});

const mapDispatchToProps = {
    clearDataset: clearDatasetAction,
    clearPublished: clearPublishedAction,
    loadField: loadField,
};

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
)(ClearDialogComponent);
