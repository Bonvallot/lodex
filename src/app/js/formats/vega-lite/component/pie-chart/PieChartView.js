import { field as fieldPropTypes } from '../../../../propTypes';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import injectData from '../../../injectData';
import { connect } from 'react-redux';
import React, { useMemo, useState } from 'react';
import PieChart from '../../models/PieChart';
import { CustomActionVegaLite } from '../vega-lite-component';
import {
    convertSpecTemplate,
    VEGA_ACTIONS_WIDTH,
    VEGA_LITE_DATA_INJECT_TYPE_A,
} from '../../../chartsUtils';
import InvalidFormat from '../../../InvalidFormat';
import { useSizeObserver } from '../../../vega-utils/chartsHooks';

const styles = {
    container: {
        userSelect: 'none',
    },
};

const PieChartView = ({
    advancedMode,
    advancedModeSpec,
    field,
    data,
    tooltip,
    tooltipCategory,
    tooltipValue,
    colors,
    labels,
}) => {
    const { ref, width, height } = useSizeObserver();
    const [error, setError] = useState('');

    const spec = useMemo(() => {
        if (advancedMode) {
            try {
                return convertSpecTemplate(
                    advancedModeSpec,
                    width - VEGA_ACTIONS_WIDTH,
                    height,
                );
            } catch (e) {
                setError(e.message);
                return null;
            }
        }

        const specBuilder = new PieChart();

        // enable the orderBy in vega-lite
        let count = 1;
        data.values.forEach(entry => {
            entry.order = count++;
        });

        specBuilder.setTooltip(tooltip);
        specBuilder.setTooltipCategory(tooltipCategory);
        specBuilder.setTooltipValue(tooltipValue);
        specBuilder.setColor(colors);
        specBuilder.setLabels(labels);

        return specBuilder.buildSpec(width);
    }, [
        width,
        advancedMode,
        advancedModeSpec,
        field,
        tooltip,
        tooltipCategory,
        tooltipValue,
        colors,
        labels,
    ]);

    if (!spec) {
        return <InvalidFormat format={field.format} value={error} />;
    }

    return (
        <div style={styles.container} ref={ref}>
            <CustomActionVegaLite
                spec={spec}
                data={data}
                injectType={VEGA_LITE_DATA_INJECT_TYPE_A}
            />
        </div>
    );
};

PieChartView.propTypes = {
    field: fieldPropTypes,
    resource: PropTypes.object,
    data: PropTypes.shape({
        values: PropTypes.any.isRequired,
    }),
    colors: PropTypes.string,
    tooltip: PropTypes.bool,
    tooltipCategory: PropTypes.string,
    tooltipValue: PropTypes.string,
    labels: PropTypes.bool,
    advancedMode: PropTypes.bool,
    advancedModeSpec: PropTypes.string,
};

PieChartView.defaultProps = {
    className: null,
};

const mapStateToProps = (state, { formatData }) => {
    if (!formatData) {
        return {
            data: {
                values: [],
            },
        };
    }
    return {
        data: {
            values: formatData,
        },
    };
};

export const PieChartAdminView = connect((state, props) => {
    return {
        ...props,
        field: {
            format: 'Preview Format',
        },
        data: {
            values: props.dataset.values ?? [],
        },
    };
})(PieChartView);

export default compose(injectData(), connect(mapStateToProps))(PieChartView);
