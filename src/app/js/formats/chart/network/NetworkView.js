import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { polyglot as polyglotPropTypes } from '../../../propTypes';
import {
    InteractiveForceGraph,
    ForceGraphNode,
    ForceGraphLink,
    createSimulation,
} from 'react-vis-force';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import { scaleLinear } from 'd3-scale';

import injectData from '../../injectData';
import MouseIcon from '../../utils/components/MouseIcon';
import FormatFullScreenMode from '../../utils/components/FormatFullScreenMode';

const simulationOptions = {
    animate: true,
    strength: {
        charge: ({ radius }) => -radius * 100,
    },
};

const labelOffset = {
    x: ({ radius }) => radius * Math.cos(Math.PI / 4),
    y: ({ radius }) => radius * Math.sin(Math.PI / 4) + 6,
};

const styles = {
    container: {
        overflow: 'hidden',
        userSelect: 'none',
    },
};

const zoomOptions = { minScale: 0.25, maxScale: 16 };

class Network extends Component {
    mouseIcon = '';
    createSimulation = (options) => {
        // extends react-vis-force createSimulation to get a reference on the simulation
        this.simulation = createSimulation(options);

        return this.simulation;
    };

    componentDidUpdate(prevProps) {
        if (isEqual(prevProps, this.props)) {
            return;
        }

        this.simulation.alpha(1).restart(); // reset simulation alpha and restart it to fix animation on node change
    }

    UNSAFE_componentWillUpdate() {
        // if the tooltip content is available before componentDidMount, the content prints weirdly in a corner of the page
        this.mouseIcon = <MouseIcon polyglot={this.props.p} />;
    }

    render() {
        const { nodes, links, colorSet } = this.props;

        return (
            <FormatFullScreenMode>
                <div style={styles.container}>
                    <InteractiveForceGraph
                        simulationOptions={simulationOptions}
                        zoom
                        showLabels
                        zoomOptions={zoomOptions}
                        labelAttr="label"
                        labelOffset={labelOffset}
                        highlightDependencies
                        createSimulation={this.createSimulation}
                    >
                        {nodes.map((node) => (
                            <ForceGraphNode
                                key={node.id}
                                node={node}
                                fill={colorSet[0]}
                            />
                        ))}
                        {links.map((link, index) => (
                            <ForceGraphLink
                                key={`${link.source}_${link.target}_${index}`}
                                link={link}
                            />
                        ))}
                    </InteractiveForceGraph>

                    <div>{this.mouseIcon}</div>
                </div>
            </FormatFullScreenMode>
        );
    }
}

Network.propTypes = {
    colorSet: PropTypes.arrayOf(PropTypes.string),
    nodes: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            label: PropTypes.string,
            radius: PropTypes.number,
        }),
    ).isRequired,
    links: PropTypes.arrayOf(
        PropTypes.shape({
            source: PropTypes.string,
            target: PropTypes.string,
            weight: PropTypes.number,
        }),
    ).isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = (state, { formatData }) => {
    if (!formatData) {
        return {
            nodes: [],
            links: [],
        };
    }

    const sanitizedFormatData = formatData.filter(
        ({ source, target }) => source && target,
    );

    const nodesDic = sanitizedFormatData.reduce(
        (acc, { source, target }) => ({
            ...acc,
            [source]: {
                id: source,
                label: source,
                radius: get(acc, [source, 'radius'], 0) + 1,
            },
            [target]: {
                id: target,
                label: target,
                radius: get(acc, [target, 'radius'], 0) + 1,
            },
        }),
        {},
    );

    const nodes = Object.values(nodesDic);
    const radiusList = nodes.map(({ radius }) => radius);
    const max = Math.max(...radiusList);
    const min = Math.min(...radiusList);

    const nodeScale = scaleLinear()
        .domain([min, max])
        .range([min === max ? 50 : 10, 50]);

    const weightList = sanitizedFormatData.map(({ weight }) => weight);
    const maxWeight = Math.max(...weightList);
    const minWeight = Math.min(...weightList);

    const linkScale = scaleLinear()
        .domain([minWeight, maxWeight])
        .range([1, 20]);

    return {
        nodes: nodes.map((node) => ({
            ...node,
            radius: nodeScale(node.radius),
        })),
        links: sanitizedFormatData.map(({ source, target, weight }) => ({
            source,
            target,
            value: linkScale(weight),
        })),
    };
};

export default compose(injectData(), connect(mapStateToProps))(Network);
