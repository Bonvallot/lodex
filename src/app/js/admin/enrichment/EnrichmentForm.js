import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import translate from 'redux-polyglot/translate';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { withRouter } from 'react-router';
import { reduxForm, Field } from 'redux-form';

import {
    createEnrichment,
    updateEnrichment,
    deleteEnrichment,
    launchEnrichment,
} from '.';
import { fromEnrichments, fromParsing } from '../selectors';
import FormTextField from '../../lib/components/FormTextField';
import FormSelectField from '../../lib/components/FormSelectField';
import ButtonWithStatus from '../../lib/components/ButtonWithStatus';
import {
    Box,
    FormControlLabel,
    makeStyles,
    MenuItem,
    Snackbar,
    Switch,
} from '@material-ui/core';
import Alert from '../../lib/components/Alert';
import { PENDING, FINISHED } from '../../../../common/enrichmentStatus';
import EnrichmentSidebar from './EnrichmentSidebar';

import { EnrichmentContext } from './EnrichmentContext';

const useStyles = makeStyles({
    enrichmentPageContainer: {
        display: 'flex',
        flexDirection: 'row',
    },
    enrichmentFormContainer: {
        display: 'flex',
        justifyContent: 'center',
        flex: 2,
        marginRight: 20,
    },
    enrichmentForm: {
        width: '100%',
        maxWidth: '700px',
    },
    switchMode: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    simplifiedRules: {
        border: '1px solid rgb(95, 99, 104, 0.5)',
        borderRadius: 4,
        padding: 20,
    },
    valuesContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: 20,
    },
});

export const EnrichmentFormComponent = ({
    isLoading,
    onAddEnrichment,
    onUpdateEnrichment,
    onDeleteEnrichment,
    onLaunchEnrichment,
    p: polyglot,
    history,
    isEdit,
    initialValues,
    excerptColumns,
    errorEnrichment,
}) => {
    const classes = useStyles();
    const [advancedMode, setAdvancedMode] = useState(
        initialValues?.advancedMode || false,
    );
    const [openSnackBar, setOpenSnackBar] = useState(false);

    useEffect(() => {
        setOpenSnackBar(!!errorEnrichment);
    }, [errorEnrichment]);

    const handleSubmit = e => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        let payload = {
            name: formData.get('name'),
            advancedMode,
            status: initialValues?.status || PENDING,
        };

        if (!advancedMode) {
            payload = {
                ...payload,
                webServiceUrl: formData.get('webServiceUrl'),
                sourceColumn: formData.get('sourceColumn'),
                subPath: formData.get('subPath'),
            };
        } else {
            payload = {
                ...payload,
                rule: formData.get('rule'),
            };
        }

        if (isEdit) {
            onUpdateEnrichment({
                enrichment: { _id: initialValues._id, ...payload },
            });
        } else {
            onAddEnrichment({
                enrichment: payload,
                callback: id => history.push(`/data/enrichment/${id}`),
            });
        }
    };

    const handleDeleteEnrichment = e => {
        e.preventDefault();

        if (isEdit) {
            onDeleteEnrichment({
                id: initialValues._id,
            });
        }
    };

    const handleAdvancedMode = () => {
        setAdvancedMode(!advancedMode);
    };

    const handleLaunchEnrichment = () => {
        onLaunchEnrichment({
            id: initialValues._id,
            action: initialValues?.status === FINISHED ? 'relaunch' : 'launch',
        });
    };

    const getRuleFields = () => {
        const columnItems = excerptColumns.map(column => (
            <MenuItem key={column} value={column}>
                {column}
            </MenuItem>
        ));

        return (
            <Box>
                <div className={classes.switchMode}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={advancedMode}
                                onChange={handleAdvancedMode}
                                color="primary"
                                name="advancedMode"
                            />
                        }
                        label={polyglot.t('advancedMode')}
                    />
                </div>
                {advancedMode ? (
                    <Field
                        name="rule"
                        component={FormTextField}
                        label={polyglot.t('expand_rules')}
                        multiline
                        fullWidth
                        rows={30}
                        variant="outlined"
                    />
                ) : (
                    <Box className={classes.simplifiedRules}>
                        <Field
                            name="webServiceUrl"
                            component={FormTextField}
                            label={polyglot.t('webServiceUrl')}
                            fullWidth
                            style={{ marginBottom: 16 }}
                        />

                        <div className={classes.valuesContainer}>
                            <Field
                                name="sourceColumn"
                                component={FormSelectField}
                                label={polyglot.t('sourceColumn')}
                                fullWidth
                                style={{ marginBottom: 20 }}
                            >
                                <MenuItem key={null} value={null}>
                                    {polyglot.t('none')}
                                </MenuItem>
                                {columnItems}
                            </Field>

                            <div style={{ fontSize: 24, marginLeft: 12 }}>
                                •
                            </div>
                            <Field
                                name="subPath"
                                component={FormTextField}
                                label={polyglot.t('subPath')}
                                fullWidth
                                style={{ marginLeft: 12 }}
                                helperText={polyglot.t('subPathHelper')}
                            />
                        </div>
                    </Box>
                )}
            </Box>
        );
    };

    return (
        <div className={classes.enrichmentPageContainer}>
            <div className={classes.enrichmentFormContainer}>
                <form
                    id="enrichment_form"
                    onSubmit={handleSubmit}
                    className={classes.enrichmentForm}
                >
                    <Field
                        name="name"
                        component={FormTextField}
                        label={polyglot.t('fieldName')}
                        autoFocus
                        fullWidth
                        style={{ marginBottom: 24 }}
                    />
                    {getRuleFields()}
                    <ButtonWithStatus
                        raised
                        key="save"
                        color="primary"
                        type="submit"
                        loading={isLoading}
                        style={{ marginTop: 24 }}
                        name="submit-enrichment"
                    >
                        {polyglot.t('save')}
                    </ButtonWithStatus>
                </form>

                <Snackbar
                    open={openSnackBar}
                    autoHideDuration={3000}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    onClose={() => setOpenSnackBar(!openSnackBar)}
                >
                    <Alert variant="filled" severity="success">
                        {polyglot.t('error')}: {errorEnrichment}
                    </Alert>
                </Snackbar>
            </div>
            <EnrichmentContext.Provider
                value={{
                    isEdit,
                    enrichment: initialValues,
                    handleLaunchEnrichment,
                    handleDeleteEnrichment,
                }}
            >
                <EnrichmentSidebar />
            </EnrichmentContext.Provider>
        </div>
    );
};

EnrichmentFormComponent.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    onAddEnrichment: PropTypes.func.isRequired,
    onUpdateEnrichment: PropTypes.func.isRequired,
    onDeleteEnrichment: PropTypes.func.isRequired,
    onLaunchEnrichment: PropTypes.func.isRequired,
    isEdit: PropTypes.bool,
    p: polyglotPropTypes.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
    }),
    excerptColumns: PropTypes.arrayOf(PropTypes.string),
    initialValues: PropTypes.any,
    errorEnrichment: PropTypes.string,
};

const mapStateToProps = (state, { match }) => ({
    excerptColumns: fromParsing.getParsedExcerptColumns(state),
    isLoading: fromEnrichments.isLoading(state),
    enrichments: fromEnrichments.enrichments(state),
    initialValues: fromEnrichments
        .enrichments(state)
        .find(enrichment => enrichment._id === match.params.enrichmentId),
    errorEnrichment: fromEnrichments.getError(state),
});

const mapDispatchToProps = {
    onAddEnrichment: createEnrichment,
    onUpdateEnrichment: updateEnrichment,
    onDeleteEnrichment: deleteEnrichment,
    onLaunchEnrichment: launchEnrichment,
};

const validate = (values, { p: polyglot }) => {
    const errors = ['name', 'rule'].reduce((currentErrors, field) => {
        if (!values[field]) {
            return {
                ...currentErrors,
                [field]: polyglot.t('required'),
            };
        }
        return currentErrors;
    }, {});

    return errors;
};

export default compose(
    translate,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
    reduxForm({
        form: 'ENRICHMENT_FORM',
        validate,
    }),
)(EnrichmentFormComponent);
