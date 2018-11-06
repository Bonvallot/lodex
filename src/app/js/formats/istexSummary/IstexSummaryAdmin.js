import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import updateAdminArgs from '../shared/updateAdminArgs';

const styles = {
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        width: '200%',
        justifyContent: 'space-between',
    },
    input: {
        width: '100%',
    },
};

export const yearSortDirValues = ['YEAR_DESC', 'YEAR_ASC'];

export const searchedFieldValues = [
    'host.issn',
    'host.eissn',
    'host.isbn',
    'host.eisbn',
    'host.title',
];

export const defaultArgs = {
    searchedField: searchedFieldValues[0],
    sortDir: yearSortDirValues[0],
    yearThreshold: 50,
};

export class IstexSummaryAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            searchedField: PropTypes.oneOf(searchedFieldValues),
            sortDir: PropTypes.oneOf(yearSortDirValues),
            yearThreshold: PropTypes.number,
        }),
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    static defaultProps = {
        args: defaultArgs,
    };

    setSearchedField = (event, index, searchedField) => {
        updateAdminArgs('searchedField', searchedField, this.props);
    };

    setSortDir = (event, index, sortDir) => {
        updateAdminArgs('sortDir', sortDir, this.props);
    };

    setYearThreshold = (_, yearThreshold) =>
        updateAdminArgs(
            'yearThreshold',
            parseInt(yearThreshold, 10),
            this.props,
        );

    render() {
        const {
            p: polyglot,
            args: { searchedField, sortDir, yearThreshold },
        } = this.props;

        return (
            <div style={styles.container}>
                <SelectField
                    className="searched_field"
                    floatingLabelText={polyglot.t('searched_field')}
                    onChange={this.setSearchedField}
                    style={styles.input}
                    value={searchedField}
                >
                    {searchedFieldValues.map(value => (
                        <MenuItem
                            key={value}
                            value={value}
                            primaryText={polyglot.t(value)}
                        />
                    ))}
                </SelectField>
                <SelectField
                    className="year_sort_dir"
                    floatingLabelText={polyglot.t('year_sort_dir')}
                    onChange={this.setSortDir}
                    style={styles.input}
                    value={sortDir}
                >
                    {yearSortDirValues.map(value => (
                        <MenuItem
                            key={value}
                            value={value}
                            primaryText={polyglot.t(value)}
                        />
                    ))}
                </SelectField>
                <TextField
                    className="year_threshold"
                    type="number"
                    floatingLabelText={polyglot.t('year_threshold')}
                    onChange={this.setYearThreshold}
                    style={styles.input}
                    value={yearThreshold}
                />
            </div>
        );
    }
}

export default translate(IstexSummaryAdmin);
