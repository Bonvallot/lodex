import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import { Box, MenuItem, TextField } from '@mui/material';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import updateAdminArgs from '../utils/updateAdminArgs';
import RoutineParamsAdmin from '../utils/components/admin/RoutineParamsAdmin';
import VegaAdvancedMode from '../utils/components/admin/VegaAdvancedMode';
import {
    FormatChartParamsFieldSet,
    FormatDataParamsFieldSet,
} from '../utils/components/field-set/FormatFieldSets';
import VegaFieldPreview from '../utils/components/admin/VegaFieldPreview';
import { VegaLiteAdminView } from './VegaLiteView';
import { ASPECT_RATIO_16_9, ASPECT_RATIOS } from '../utils/aspectRatio';

export const defaultArgs = {
    params: {
        maxSize: 200,
        orderBy: 'value/asc',
    },
    specTemplate: JSON.stringify({
        width: 'container',
        height: 'container',
        autosize: { type: 'fit', contains: 'padding' },
        mark: 'bar',
        encoding: {
            x: { field: '_id', type: 'ordinal' },
            y: { field: 'value', type: 'quantitative' },
        },
        data: { name: 'values' },
    }),
    aspectRatio: ASPECT_RATIO_16_9,
};

const VegaLiteAdmin = props => {
    const {
        args,
        p,
        showMaxSize,
        showMaxValue,
        showMinValue,
        showOrderBy,
    } = props;
    const { specTemplate, aspectRatio, params } = args;

    const formattedSpecTemplate = useMemo(() => {
        try {
            return JSON.stringify(JSON.parse(specTemplate), null, 2);
        } catch (e) {
            return specTemplate;
        }
    }, [specTemplate]);

    const handleParams = params => {
        updateAdminArgs('params', params, props);
    };

    const handleSpecTemplate = value => {
        updateAdminArgs('specTemplate', value, props);
    };

    const handleAspectRatio = event => {
        updateAdminArgs('aspectRatio', event.target.value, props);
    };

    return (
        <Box
            display="flex"
            flexWrap="wrap"
            justifyContent="space-between"
            gap={2}
        >
            <FormatDataParamsFieldSet>
                <RoutineParamsAdmin
                    params={params || defaultArgs.params}
                    polyglot={p}
                    onChange={handleParams}
                    showMaxSize={showMaxSize}
                    showMaxValue={showMaxValue}
                    showMinValue={showMinValue}
                    showOrderBy={showOrderBy}
                />
            </FormatDataParamsFieldSet>
            <FormatChartParamsFieldSet>
                <VegaAdvancedMode
                    value={formattedSpecTemplate}
                    onChange={handleSpecTemplate}
                />
                <TextField
                    fullWidth
                    select
                    label={p.t('aspect_ratio')}
                    onChange={handleAspectRatio}
                    value={aspectRatio}
                >
                    {ASPECT_RATIOS.map(aspectRatio => (
                        <MenuItem key={aspectRatio} value={aspectRatio}>
                            {aspectRatio}
                        </MenuItem>
                    ))}
                </TextField>
            </FormatChartParamsFieldSet>
            <VegaFieldPreview
                args={args}
                PreviewComponent={VegaLiteAdminView}
            />
        </Box>
    );
};

VegaLiteAdmin.defaultProps = {
    args: defaultArgs,
    showMaxSize: true,
    showMaxValue: true,
    showMinValue: true,
    showOrderBy: true,
};

VegaLiteAdmin.propTypes = {
    args: PropTypes.shape({
        params: PropTypes.shape({
            maxSize: PropTypes.number,
            maxValue: PropTypes.number,
            minValue: PropTypes.number,
            orderBy: PropTypes.string,
        }),
        specTemplate: PropTypes.string,
        aspectRatio: PropTypes.string,
    }),
    onChange: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    showMaxSize: PropTypes.bool.isRequired,
    showMaxValue: PropTypes.bool.isRequired,
    showMinValue: PropTypes.bool.isRequired,
    showOrderBy: PropTypes.bool.isRequired,
};

export default translate(VegaLiteAdmin);
