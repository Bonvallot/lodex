import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { CardHeader, CardText } from 'material-ui/Card';

import PublicationExcerpt from './PublicationExcerpt';
import { getPublicationFields, editField } from '../fields';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { getPublicationPreview } from './';
import Card from '../../lib/Card';

export const PublicationPreviewComponent = ({ columns, lines, editColumn, p: polyglot }) => (
    <Card initiallyExpanded className="publication-preview">
        <CardHeader
            actAsExpander
            showExpandableButton
            title={polyglot.t('publication_preview')}
        />

        <CardText expandable initiallyExpanded>
            <PublicationExcerpt
                columns={columns}
                lines={lines}
                onHeaderClick={editColumn}
            />
        </CardText>
    </Card>
);

PublicationPreviewComponent.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.string).isRequired,
    lines: PropTypes.arrayOf(PropTypes.object).isRequired,
    p: polyglotPropTypes.isRequired,
    editColumn: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    columns: getPublicationFields(state),
    lines: getPublicationPreview(state),
});

const mapDispatchToProps = {
    editColumn: editField,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(PublicationPreviewComponent);
