import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import translate from 'redux-polyglot/translate';
import {
    Table,
    TableHeader,
    TableHeaderColumn,
    TableRow,
} from 'material-ui/Table';

import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../propTypes';
import { changePosition } from '../';
import OntologyFieldList from './OntologyFieldList';

const styles = {
    table: {
        tableLayout: 'auto',
        width: 'auto',
        minWidth: '100%',
        overflowX: 'auto',
        display: 'block',
    },
};

class OntologyTable extends Component {
    onSortEnd = ({ oldIndex, newIndex }, _, fields, handleChangePosition) => {
        handleChangePosition({ newPosition: newIndex, oldPosition: oldIndex });
    };

    render() {
        const { title, fields, handleChangePosition, p: polyglot } = this.props;

        return (
            <div>
                <h4>{polyglot.t(title)}</h4>
                <Table fixedHeader={false} style={styles.table}>
                    <TableHeader
                        displaySelectAll={false}
                        adjustForCheckbox={false}
                    >
                        <TableRow>
                            <TableHeaderColumn />
                            <TableHeaderColumn>
                                {polyglot.t('identifier')}
                            </TableHeaderColumn>
                            <TableHeaderColumn>
                                {polyglot.t('label')}
                            </TableHeaderColumn>
                            <TableHeaderColumn>
                                {polyglot.t('cover')}
                            </TableHeaderColumn>
                            <TableHeaderColumn>
                                {polyglot.t('scheme')}
                            </TableHeaderColumn>
                            <TableHeaderColumn>
                                {polyglot.t('count_of_field')}
                            </TableHeaderColumn>
                            <TableHeaderColumn>
                                {polyglot.t('language')}
                            </TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <OntologyFieldList
                        lockAxis="y"
                        useDragHandle
                        items={fields}
                        onSortEnd={(oldIndex, newIndex) =>
                            this.onSortEnd(
                                oldIndex,
                                newIndex,
                                fields,
                                handleChangePosition,
                            )
                        }
                    />
                </Table>
            </div>
        );
    }
}

OntologyTable.propTypes = {
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    handleChangePosition: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapDispatchToProps = {
    changePositionAction: changePosition,
};

export default compose(
    connect(null, mapDispatchToProps),
    withHandlers({
        handleChangePosition: ({ changePositionAction }) => field => {
            changePositionAction(field);
        },
    }),
    translate,
)(OntologyTable);
