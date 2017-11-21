import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';

import { field as fieldPropTypes } from '../../propTypes';
import { getViewComponent } from '../';
import { PropType } from 'redux-polyglot';

const UL = ({ className, children }) => (
    <ul className={className}>{children}</ul>
);

UL.propTypes = {
    className: PropTypes.string,
    children: PropType.any.isRequired,
};

const OL = ({ className, children }) => (
    <ol className={className}>{children}</ol>
);

OL.propTypes = {
    className: PropTypes.string,
    children: PropType.any.isRequired,
};

const ListView = ({ className, resource, field }) => {
    const values = resource[field.name];
    const type = get(field, 'format.args.type', 'unordered');
    const subFormat = get(field, 'format.args.subFormat');
    const subFormatOptions = get(field, 'format.args.subFormatOptions');
    const SubViewComponent = getViewComponent(subFormat, true);

    const List = type === 'ordered' ? OL : UL;

    return (
        <List className={className}>
            {values.map((value, index) => (
                <li key={value}>
                    {SubViewComponent ? (
                        <SubViewComponent
                            resource={values}
                            field={{
                                ...field,
                                name: index,
                                format: {
                                    name: subFormat,
                                    args: subFormatOptions,
                                },
                            }}
                        />
                    ) : (
                        value
                    )}
                </li>
            ))}
        </List>
    );
};

ListView.propTypes = {
    className: PropTypes.string,
    field: fieldPropTypes.isRequired,
    linkedResource: PropTypes.object, // eslint-disable-line
    resource: PropTypes.object.isRequired, // eslint-disable-line
};

ListView.defaultProps = {
    className: null,
};

export default ListView;
