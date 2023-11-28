import { CustomActionVegaLite } from '../vega-lite-component';
import { VEGA_LITE_DATA_INJECT_TYPE_A } from '../../../chartsUtils';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

const LdaChart = ({ data, title, colors }) => {
    const spec = useMemo(() => {
        return {
            $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
            config: { legend: { disable: true } },
            title: title,
            encoding: {
                y: { field: 'word', type: 'nominal', sort: null },
                x: { field: 'word_weight', type: 'quantitative' },
            },
            layer: [
                {
                    mark: 'bar',
                    encoding: {
                        color: {
                            field: 'word_weight',
                            scale: { range: colors.split(' ') },
                        },
                    },
                },
                {
                    mark: {
                        type: 'text',
                        align: 'left',
                        baseline: 'middle',
                        dx: 3,
                    },
                    encoding: {
                        text: {
                            field: 'word_weight',
                            type: 'quantitative',
                            format: '.2f',
                        },
                    },
                },
            ],
            width: 'container',
            height: { step: 20 },
        };
    }, [data, title, colors]);
    return (
        <CustomActionVegaLite
            spec={spec}
            data={{
                values: data,
            }}
            injectType={VEGA_LITE_DATA_INJECT_TYPE_A}
        />
    );
};

LdaChart.propTypes = {
    data: PropTypes.any.isRequired,
    title: PropTypes.string.isRequired,
    colors: PropTypes.string.isRequired,
};

export default LdaChart;
