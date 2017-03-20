import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { Field } from 'redux-form';
import MenuItem from 'material-ui/MenuItem';

import SchemeAutoComplete from '../../lib/SchemeAutoComplete';
import {
    fromPublication,
} from '../selectors';
import FormTextField from '../../lib/FormTextField';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import FormSelectField from '../../lib/FormSelectField';

const required = value => (value ? undefined : 'Required');
const uniqueField = fields => value =>
    (fields.find(({ label }) => label === value) ? 'Field already exists' : undefined);

export const AddFieldDetailComponent = ({
    collectionFields,
    documentFields,
    isNewField,
    p: polyglot,
}) => (

    <div>
        <Field
            className="field-label"
            name="field.label"
            validate={[
                required,
                uniqueField([...documentFields, ...collectionFields]),
            ]}
            disabled={!isNewField}
            component={FormTextField}
            label={polyglot.t('fieldLabel')}
            fullWidth
        />
        <Field
            className="field-value"
            name="field.value"
            validate={required}
            component={FormTextField}
            label={polyglot.t('fieldValue')}
            fullWidth
        />
        <Field
            className="field-cover"
            name="field.cover"
            component={FormSelectField}
            label={polyglot.t('select_cover')}
            fullWidth
            disabled
        >
            <MenuItem value="document" primaryText={polyglot.t('cover_document')} />
        </Field>
        <SchemeAutoComplete
            disabled={!isNewField}
            name="field.scheme"
            className="field-scheme"
        />
    </div>
);

AddFieldDetailComponent.propTypes = {
    collectionFields: PropTypes.arrayOf(PropTypes.object).isRequired,
    documentFields: PropTypes.arrayOf(PropTypes.object).isRequired,
    isNewField: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = (state, { isNewField }) => ({
    collectionFields: fromPublication.getCollectionFields(state),
    documentFields: fromPublication.getDocumentFields(state),
    isNewField,
});

const mapDispatchToProps = {};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(AddFieldDetailComponent);
