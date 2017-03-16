import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import translate from 'redux-polyglot/translate';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import PublicationExcerpt from './PublicationExcerpt';
import FieldForm from '../fields/FieldForm';
import { polyglot as polyglotPropTypes, field as fieldPropTypes } from '../../propTypes';

const styles = {
    container: {
        display: 'flex',
        paddingBottom: '1rem',
    },
    form: {
        borderRight: '1px solid rgb(224, 224, 224)',
        marginRight: '1rem',
        paddingRight: '1rem',
        flexGrow: 1,
        maxHeight: '50vw',
        overflowY: 'auto',
    },
    modal: {
        maxWidth: '100%',
    },
    column: {
        minWidth: '10rem',
        maxWidth: '10rem',
    },
};

const PublicationEditionComponent = ({ editedColumn, lines, onExitEdition, p: polyglot }) => {
    const actions = [
        <FlatButton
            className="btn-exit-column-edition"
            label={polyglot.t('close')}
            primary
            onTouchTap={onExitEdition}
        />,
    ];

    return (
        <Dialog
            open
            actions={actions}
            title={editedColumn.label}
            contentStyle={styles.modal}
            style={styles.overlay}
        >
            <div style={styles.container}>
                <div style={styles.form}>
                    <FieldForm />
                </div>
                <PublicationExcerpt
                    className="publication-excerpt-for-edition"
                    columns={[editedColumn]}
                    lines={lines}
                    colStyle={styles.column}
                    onHeaderClick={null}
                    isPreview
                />
            </div>
        </Dialog>
    );
};

PublicationEditionComponent.propTypes = {
    editedColumn: fieldPropTypes.isRequired,
    lines: PropTypes.arrayOf(PropTypes.object).isRequired,
    onExitEdition: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

export default compose(
    withHandlers({
        onHeaderClick: ({ onHeaderClick }) => () => onHeaderClick(null),
    }),
    translate,
)(PublicationEditionComponent);
