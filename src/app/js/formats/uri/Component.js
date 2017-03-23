import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { field as fieldPropTypes } from '../../propTypes';

const UriView = ({ className, linkedResource, resource, field, fields }) => {
    const uri = resource[field.name];
    let label = resource[field.name];

    if (field.format && field.format.args && field.format.args.type) {
        switch (field.format.args.type) {
        case 'text':
            label = field.format.args.value;
            break;

        case 'column': {
            if (linkedResource) {
                const fieldForLabel = fields.find(f => f.label === field.format.args.value);
                label = linkedResource[fieldForLabel.name];
            }
            break;
        }

        default:
            label = resource[field.name];
            break;
        }
    }

    return <Link className={className} to={`/resource?uri=${encodeURIComponent(uri)}`}>{label}</Link>;
};

UriView.propTypes = {
    className: PropTypes.string,
    field: fieldPropTypes.isRequired,
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    linkedResource: PropTypes.object, // eslint-disable-line
    resource: PropTypes.object.isRequired, // eslint-disable-line
};

UriView.defaultProps = {
    className: null,
};

export default UriView;
