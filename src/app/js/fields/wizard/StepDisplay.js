import React, { Component } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { connect } from 'react-redux';
import { change, getFormValues } from 'redux-form';

import Step from './Step';
import FieldFormatInput from '../FieldFormatInput';
import FieldOverviewInput from '../FieldOverviewInput';
import FieldDisplayInListInput from '../FieldDisplayInListInput';
import FieldDisplayInResourceInput from '../FieldDisplayInResourceInput';
import FieldDisplayInGraphInput from '../FieldDisplayInGraphInput';
import FieldDisplayInHomeInput from '../FieldDisplayInHomeInput';
import {
    polyglot as polyglotPropTypes,
    field as fieldPropTypes,
} from '../../propTypes';
import { FIELD_FORM_NAME } from '../';
import { fromFields } from '../../sharedSelectors';
import FieldWidthInput from '../FieldWidthInput';

export class StepDisplayComponent extends Component {
    componentWillReceiveProps(nextProps) {
        if (
            nextProps.transformers.find(t => t.operation === 'LINK') &&
            !nextProps.format
        ) {
            this.props.updateField(FIELD_FORM_NAME, 'format', {
                name: 'uri',
                args: { type: 'value' },
            });
        }
    }

    render() {
        const { field, p: polyglot, ...props } = this.props;

        return (
            <Step label="field_wizard_step_display" {...props}>
                <FieldDisplayInListInput />
                <FieldDisplayInResourceInput />
                {field.cover === 'dataset' && <FieldDisplayInGraphInput />}
                {field.cover === 'dataset' && <FieldDisplayInHomeInput />}
                <FieldOverviewInput />
                <FieldFormatInput />
                <FieldWidthInput />
            </Step>
        );
    }
}

StepDisplayComponent.propTypes = {
    transformers: PropTypes.arrayOf(PropTypes.object).isRequired,
    field: fieldPropTypes.isRequired,
    format: PropTypes.object, // eslint-disable-line
    p: polyglotPropTypes.isRequired,
    updateField: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
    const values = getFormValues(FIELD_FORM_NAME)(state);

    return {
        fields: fromFields.getFields(state),
        format: values && values.format,
        transformers: values ? values.transformers : [],
    };
};

const mapDispatchToProps = { updateField: change };

export default compose(connect(mapStateToProps, mapDispatchToProps), translate)(
    StepDisplayComponent,
);
