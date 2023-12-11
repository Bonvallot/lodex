import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import {
    Box,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Switch,
} from '@mui/material';

import { polyglot as polyglotPropTypes } from '../../../../propTypes';
import updateAdminArgs from '../../../shared/updateAdminArgs';
import RoutineParamsAdmin from '../../../shared/RoutineParamsAdmin';
import ColorPickerParamsAdmin from '../../../shared/ColorPickerParamsAdmin';
import { MULTICHROMATIC_DEFAULT_COLORSET } from '../../../colorUtils';
import VegaToolTips from '../../../vega-utils/components/VegaToolTips';
import PieChart from '../../models/PieChart';
import VegaAdvancedMode from '../../../vega-utils/components/VegaAdvancedMode';
import {
    VegaChartParamsFieldSet,
    VegaDataParamsFieldSet,
} from '../../../vega-utils/components/VegaFieldSet';
import VegaFieldPreview from '../../../vega-utils/components/VegaFieldPreview';
import { PieChartAdminView } from './PieChartView';
import { StandardIdValue } from '../../../vega-utils/dataSet';

export const defaultArgs = {
    params: {
        maxSize: 200,
        orderBy: 'value/asc',
    },
    advancedMode: false,
    advancedModeSpec: null,
    colors: MULTICHROMATIC_DEFAULT_COLORSET,
    tooltip: false,
    tooltipCategory: 'Category',
    tooltipValue: 'Value',
    labels: false,
};

const PieChartAdmin = props => {
    const {
        p: polyglot,
        args,
        showMaxSize,
        showMaxValue,
        showMinValue,
        showOrderBy,
    } = props;

    const {
        advancedMode,
        advancedModeSpec,
        params,
        tooltip,
        tooltipCategory,
        tooltipValue,
        labels,
    } = args;

    const colors = useMemo(() => {
        return args.colors || defaultArgs.colors;
    }, [args.colors]);

    const spec = useMemo(() => {
        if (!advancedMode) {
            return null;
        }

        if (advancedModeSpec !== null) {
            return advancedModeSpec;
        }

        const specBuilder = new PieChart();

        specBuilder.setTooltip(tooltip);
        specBuilder.setTooltipCategory(tooltipCategory);
        specBuilder.setTooltipValue(tooltipValue);
        specBuilder.setColor(colors);
        specBuilder.setLabels(labels);

        return JSON.stringify(specBuilder.buildSpec(), null, 2);
    }, [advancedMode, advancedModeSpec]);

    // Save the new spec when we first use the advanced mode or when we reset the generated spec
    // details: Update advancedModeSpec props arguments when spec is generated or regenerated
    useEffect(() => {
        if (!advancedMode) {
            return;
        }
        updateAdminArgs('advancedModeSpec', spec, props);
    }, [advancedMode, advancedModeSpec]);

    const toggleAdvancedMode = () => {
        updateAdminArgs('advancedMode', !advancedMode, props);
    };

    const handleAdvancedModeSpec = newSpec => {
        updateAdminArgs('advancedModeSpec', newSpec, props);
    };

    const clearAdvancedModeSpec = () => {
        updateAdminArgs('advancedModeSpec', null, props);
    };

    const handleParams = params => updateAdminArgs('params', params, props);

    const handleColors = colors => {
        updateAdminArgs('colors', colors || defaultArgs.colors, props);
    };

    const toggleLabels = () => {
        updateAdminArgs('labels', !labels, props);
    };

    const toggleTooltip = () => {
        updateAdminArgs('tooltip', !tooltip, props);
    };

    const handleTooltipCategory = tooltipCategory => {
        updateAdminArgs('tooltipCategory', tooltipCategory, props);
    };

    const handleTooltipValue = tooltipValue => {
        updateAdminArgs('tooltipValue', tooltipValue, props);
    };

    return (
        <Box
            display="flex"
            flexWrap="wrap"
            justifyContent="space-between"
            gap={2}
        >
            <VegaDataParamsFieldSet>
                <RoutineParamsAdmin
                    params={params || defaultArgs.params}
                    onChange={handleParams}
                    polyglot={polyglot}
                    showMaxSize={showMaxSize}
                    showMaxValue={showMaxValue}
                    showMinValue={showMinValue}
                    showOrderBy={showOrderBy}
                />
            </VegaDataParamsFieldSet>
            <VegaChartParamsFieldSet>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={advancedMode}
                                onChange={toggleAdvancedMode}
                            />
                        }
                        label={polyglot.t('advancedMode')}
                    />
                </FormGroup>
                {advancedMode ? (
                    <VegaAdvancedMode
                        value={spec}
                        onClear={clearAdvancedModeSpec}
                        onChange={handleAdvancedModeSpec}
                    />
                ) : (
                    <>
                        <VegaToolTips
                            checked={tooltip}
                            onChange={toggleTooltip}
                            onCategoryTitleChange={handleTooltipCategory}
                            categoryTitle={tooltipCategory}
                            onValueTitleChange={handleTooltipValue}
                            valueTitle={tooltipValue}
                            polyglot={polyglot}
                            thirdValue={false}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    onChange={toggleLabels}
                                    checked={labels}
                                />
                            }
                            label={polyglot.t('toggle_labels')}
                        />
                        <ColorPickerParamsAdmin
                            colors={colors}
                            onChange={handleColors}
                            polyglot={polyglot}
                        />
                    </>
                )}
            </VegaChartParamsFieldSet>
            <VegaFieldPreview
                args={args}
                PreviewComponent={PieChartAdminView}
                datasets={[StandardIdValue]}
                showDatasetsSelector={false}
            />
        </Box>
    );
};

PieChartAdmin.defaultProps = {
    args: defaultArgs,
    showMaxSize: true,
    showMaxValue: true,
    showMinValue: true,
    showOrderBy: true,
};

PieChartAdmin.propTypes = {
    args: PropTypes.shape({
        params: PropTypes.shape({
            maxSize: PropTypes.number,
            maxValue: PropTypes.number,
            minValue: PropTypes.number,
            orderBy: PropTypes.string,
        }),
        advancedMode: PropTypes.bool,
        advancedModeSpec: PropTypes.string,
        colors: PropTypes.string,
        tooltip: PropTypes.bool,
        tooltipCategory: PropTypes.string,
        tooltipValue: PropTypes.string,
        labels: PropTypes.bool,
    }),
    onChange: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    showMaxSize: PropTypes.bool.isRequired,
    showMaxValue: PropTypes.bool.isRequired,
    showMinValue: PropTypes.bool.isRequired,
    showOrderBy: PropTypes.bool.isRequired,
};

export default translate(PieChartAdmin);
