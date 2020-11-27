import React from 'react';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { Field, FieldArray } from 'redux-form';
import PropTypes from 'prop-types';
import { MenuItem } from '@material-ui/core';

import Step from './Step';
import FormSelectField from '../../lib/components/FormSelectField';
import FieldLanguageInput from '../FieldLanguageInput';
import FieldLabelInput from '../FieldLabelInput';
import {
    polyglot as polyglotPropTypes,
    field as fieldPropTypes,
} from '../../propTypes';

import ClassList from '../ClassList';

export const StepIdentityComponent = ({ field, p: polyglot, ...props }) => (
    <Step id="step-identity" label="field_wizard_step_identity" {...props}>
        <FieldLabelInput />
        <Field
            name="cover"
            component={FormSelectField}
            label={polyglot.t('select_cover')}
            fullWidth
        >
            <MenuItem value="dataset">{polyglot.t('cover_dataset')}</MenuItem>
            <MenuItem value="collection">
                {polyglot.t('cover_collection')}
            </MenuItem>
        </Field>
        <FieldArray name="classes" component={ClassList} type="classes" />
        <FieldLanguageInput field={field} />
    </Step>
);

StepIdentityComponent.propTypes = {
    field: fieldPropTypes.isRequired,
    p: polyglotPropTypes.isRequired,
    filter: PropTypes.string,
};

export default compose(translate)(StepIdentityComponent);
