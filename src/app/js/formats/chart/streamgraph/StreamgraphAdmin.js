import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@mui/material';
import translate from 'redux-polyglot/translate';

import { polyglot as polyglotPropTypes } from '../../../propTypes';
import updateAdminArgs from '../../shared/updateAdminArgs';
import RoutineParamsAdmin from '../../shared/RoutineParamsAdmin';
import ColorPickerParamsAdmin from '../../shared/ColorPickerParamsAdmin';
import { MULTICHROMATIC_DEFAULT_COLORSET_STREAMGRAPH } from '../../colorUtils';
import {
    FormatChartParamsFieldSet,
    FormatDataParamsFieldSet,
} from '../../utils/components/FormatFieldSets';
import FormatGroupedFieldSet from '../../utils/components/FormatGroupedFieldSet';

export const defaultArgs = {
    params: {
        maxSize: 200,
        orderBy: 'value/desc',
    },
    colors: MULTICHROMATIC_DEFAULT_COLORSET_STREAMGRAPH,
    maxLegendLength: 30,
    height: 300,
};

class StreamgraphAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            params: PropTypes.shape({
                maxSize: PropTypes.number,
                maxValue: PropTypes.number,
                minValue: PropTypes.number,
                orderBy: PropTypes.string,
            }),
            colors: PropTypes.string,
            maxLegendLength: PropTypes.number,
            height: PropTypes.number.isRequired,
        }),
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
        showMaxSize: PropTypes.bool.isRequired,
        showMaxValue: PropTypes.bool.isRequired,
        showMinValue: PropTypes.bool.isRequired,
        showOrderBy: PropTypes.bool.isRequired,
    };

    static defaultProps = {
        args: defaultArgs,
        showMaxSize: true,
        showMaxValue: false,
        showMinValue: false,
        showOrderBy: true,
    };

    constructor(props) {
        super(props);
        this.setColors = this.setColors.bind(this);
        this.state = {
            colors: this.props.args.colors || defaultArgs.colors,
        };
    }

    setParams = params => updateAdminArgs('params', params, this.props);

    setColors(colors) {
        updateAdminArgs('colors', colors || defaultArgs.colors, this.props);
    }

    setMaxLegendLength = e => {
        updateAdminArgs('maxLegendLength', e.target.value, this.props);
    };

    setHeight = e => {
        updateAdminArgs('height', e.target.value, this.props);
    };

    render() {
        const {
            p: polyglot,
            args: { params, maxLegendLength, height },
            showMaxSize,
            showMaxValue,
            showMinValue,
            showOrderBy,
        } = this.props;

        return (
            <FormatGroupedFieldSet>
                <FormatDataParamsFieldSet>
                    <RoutineParamsAdmin
                        params={params || defaultArgs.params}
                        polyglot={polyglot}
                        onChange={this.setParams}
                        showMaxSize={showMaxSize}
                        showMaxValue={showMaxValue}
                        showMinValue={showMinValue}
                        showOrderBy={showOrderBy}
                    />
                </FormatDataParamsFieldSet>
                <FormatChartParamsFieldSet>
                    <ColorPickerParamsAdmin
                        colors={this.state.colors}
                        onChange={this.setColors}
                        polyglot={polyglot}
                    />
                    <TextField
                        label={polyglot.t('max_char_number_in_legends')}
                        onChange={this.setMaxLegendLength}
                        value={maxLegendLength}
                        fullWidth
                    />
                    <TextField
                        label={polyglot.t('height_px')}
                        onChange={this.setHeight}
                        value={height}
                        fullWidth
                    />
                </FormatChartParamsFieldSet>
            </FormatGroupedFieldSet>
        );
    }
}

export default translate(StreamgraphAdmin);
