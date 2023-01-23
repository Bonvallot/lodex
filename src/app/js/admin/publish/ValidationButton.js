import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import withState from 'recompose/withState';
import { List, Popover, IconButton, Tooltip } from '@material-ui/core';

import { fromFields } from '../../sharedSelectors';
import ValidationField from './ValidationField';

import {
    validationField as validationFieldPropType,
    polyglot as polyglotPropTypes,
} from '../../propTypes';
import { SCOPE_DOCUMENT } from '../../../../common/scope';
import translate from 'redux-polyglot/translate';
import { useHistory } from 'react-router-dom';
import ValidationIcon from './ValidationIcon';

const anchorOrigin = { horizontal: 'right', vertical: 'top' };
const targetOrigin = { horizontal: 'right', vertical: 'bottom' };
const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        marginRight: '1rem',
    },
};

const ValidationButtonComponent = ({
    handleEditField,
    fields,
    handleHideErrors,
    handleShowErrorsClick,
    popover,
    p: polyglot,
}) => {
    const history = useHistory();
    // @TODO: Find a better way to handle fix error from data tab
    const redirectAndHandleEditField = (...args) => {
        const field = fields.find(({ name }) => name === args[0]);
        handleEditField();
        const redirectUrl =
            field?.scope === SCOPE_DOCUMENT
                ? `/display/${SCOPE_DOCUMENT}/${field?.subresourceId ||
                      'main'}/edit/${field?.name}`
                : `/display/${field?.scope || SCOPE_DOCUMENT + '/main'}/edit/${
                      field?.name
                  }`;
        history.push(redirectUrl);
    };

    return (
        <div style={styles.container}>
            <Tooltip title={polyglot.t(`show_publication_errors`)}>
                <IconButton
                    color="secondary"
                    variant="contained"
                    onClick={handleShowErrorsClick}
                    className={'validation-button'}
                >
                    <ValidationIcon sx={{ fontSize: '30px' }} />
                </IconButton>
            </Tooltip>
            <Popover
                open={popover.show}
                anchorEl={popover.anchorEl}
                anchorOrigin={anchorOrigin}
                targetOrigin={targetOrigin}
                onClose={handleHideErrors}
            >
                <List className="validation">
                    {fields.map(field => (
                        <ValidationField
                            key={field.name}
                            field={field}
                            onEditField={redirectAndHandleEditField}
                        />
                    ))}
                </List>
            </Popover>
        </div>
    );
};

ValidationButtonComponent.propTypes = {
    popover: PropTypes.object,
    handleEditField: PropTypes.func.isRequired,
    fields: PropTypes.arrayOf(validationFieldPropType).isRequired,
    handleHideErrors: PropTypes.func.isRequired,
    handleShowErrorsClick: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};
ValidationButtonComponent.defaultProps = {
    popover: { show: false },
};

const mapStateToProps = state => ({
    fields: fromFields.getInvalidFields(state),
});

export default compose(
    connect(mapStateToProps),
    withState('popover', 'setShowPopover', { show: false }),
    withHandlers({
        handleShowErrorsClick: ({ setShowPopover }) => event => {
            event.preventDefault();
            setShowPopover({ anchorEl: event.currentTarget, show: true });
        },
        handleHideErrors: ({ setShowPopover }) => () => {
            setShowPopover({ show: false });
        },
        handleEditField: ({ setShowPopover }) => () => {
            setShowPopover({ show: false });
        },
    }),
    translate,
)(ValidationButtonComponent);
