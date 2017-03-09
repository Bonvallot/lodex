import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { bindActionCreators } from 'redux';

import {
    fromResource,
} from './selectors';
import {
    field as fieldPropTypes,
} from '../propTypes';
import CompositeProperty from './CompositeProperty';
import { languages } from '../../../../config.json';
import propositionStatus, { VALIDATED, REJECTED } from '../../../common/propositionStatus';
import ModerateButton from './ModerateButton';
import { changeFieldStatus } from './resource';
import PropertyContributor from './PropertyContributor';
import PropertyLinkedFields from './PropertyLinkedFields';
import { isLoggedIn } from '../user';

const styles = {
    container: status => ({
        display: 'flex',
        marginRight: '1rem',
        color: (status && status !== VALIDATED) ? 'grey' : 'black',
        textDecoration: status === REJECTED ? 'line-through' : 'none',
    }),
    name: {
        fontWeight: 'bold',
        marginRight: '1rem',
    },
    language: {
        marginLeft: '0.5rem',
        fontSize: '0.75em',
        color: 'grey',
    },
    scheme: {
        fontWeight: 'bold',
        fontSize: '0.75em',
        color: 'grey',
    },
};

const PropertyComponent = ({
    className,
    field,
    resource,
    fieldStatus,
    loggedIn,
    changeStatus,
}) => {
    if (!loggedIn && fieldStatus === REJECTED) {
        return null;
    }

    return (
        <div
            className={classnames('property', field.label.toLowerCase().replace(/\s/g, '_'), className)}
        >
            <dl style={styles.container(fieldStatus)}>
                <dt>
                    <div>
                        <span className="property_name" style={styles.name}>{field.label}</span>
                        {field.language &&
                            <span className="property_language" style={styles.language}>
                                ({languages.find(f => f.code === field.language).label})
                            </span>
                        }
                        <PropertyContributor fieldName={field.name} fieldStatus={fieldStatus} />
                    </div>
                </dt>
                <dd>
                    <CompositeProperty field={field} resource={resource} />
                    <PropertyLinkedFields fieldName={field.name} resource={resource} />
                </dd>
                <ModerateButton status={fieldStatus} changeStatus={changeStatus} />
            </dl>
            <div className="property_scheme" style={styles.scheme}>{field.scheme}</div>
        </div>
    );
};

PropertyComponent.propTypes = {
    className: PropTypes.string,
    field: fieldPropTypes.isRequired,
    resource: PropTypes.shape({}).isRequired,
    fieldStatus: PropTypes.oneOf(propositionStatus),
    changeStatus: PropTypes.func.isRequired,
    loggedIn: PropTypes.bool.isRequired,
};

PropertyComponent.defaultProps = {
    className: null,
    fieldStatus: null,
};

const mapStateToProps = (state, { field }) => ({
    loggedIn: isLoggedIn(state),
    fieldStatus: fromResource.getFieldStatus(state, field),
});

const mapDispatchToProps = (dispatch, { field, resource: { uri } }) => bindActionCreators({
    changeStatus: (prevStatus, status) => changeFieldStatus({
        uri,
        field: field.name,
        status,
        prevStatus,
    }),
}, dispatch);

const Property = connect(mapStateToProps, mapDispatchToProps)(PropertyComponent);

export default Property;
