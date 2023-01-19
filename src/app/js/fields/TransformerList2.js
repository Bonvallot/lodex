import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import pure from 'recompose/pure';

import colorsTheme from './../../custom/colorsTheme';

import { polyglot as polyglotPropTypes } from '../propTypes';

import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    DragIndicator as DragIndicatorIcon,
} from '@mui/icons-material';

import { CSS } from '@dnd-kit/utilities';

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import memoize from 'lodash.memoize';
import {
    getTransformerMetas,
    hasRegistredTransformer,
} from '../../../common/transformers';
import { Box, Button, Typography } from '@mui/material';
import TransformerUpsertDialog from './TransformerUpsertDialog';

const TransformerItem = ({ transformer, id, show, onRemove, onEdit }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const dragStyle = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    if (!show) {
        return null;
    }

    return (
        <Box
            ref={setNodeRef}
            style={{ ...dragStyle }}
            {...attributes}
            {...listeners}
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 1,
                marginBottom: 2,
                borderRadius: 1,
                backgroundColor: colorsTheme.black.veryLight,
                '&:hover': {
                    backgroundColor: colorsTheme.black.lighter,
                },
            }}
        >
            <Box
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <DragIndicatorIcon sx={{ cursor: 'grab', marginRight: 1 }} />
                <Typography noWrap>
                    {transformer?.operation}
                    {transformer?.args &&
                        `(${Array.prototype.map
                            .call(transformer?.args, arg => arg.value)
                            .toString()})`}
                </Typography>
            </Box>
            <Box
                style={{
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <EditIcon sx={{ cursor: 'pointer' }} onClick={() => onEdit()} />
                <DeleteIcon
                    sx={{
                        cursor: 'pointer',
                        color: colorsTheme.orange.primary,
                    }}
                    onClick={() => {
                        onRemove();
                    }}
                />
            </Box>
        </Box>
    );
};

TransformerItem.propTypes = {
    transformer: PropTypes.object,
    id: PropTypes.string.isRequired,
    show: PropTypes.bool.isRequired,
    onRemove: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
};

const showTransformer = memoize(
    (operation, type) =>
        !type ||
        !operation ||
        /**
         * We need to display the transformer in case it doesn't exist anymore
         * This way we can change it for legacy model imports
         */
        !hasRegistredTransformer(operation) ||
        getTransformerMetas(operation).type === type,
    (operation, type) => `${operation}_${type}`,
);

const TransformerList2 = ({
    fields,
    meta: { touched, error },
    type,
    hideFirstTransformers,
    p: polyglot,
}) => {
    const [fieldsToDrag, setFieldsToDrag] = useState(
        fields.map(fieldName => fieldName),
    );

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [indexFieldToEdit, setIndexFieldToEdit] = useState(null);

    useEffect(() => {
        setFieldsToDrag(fields.map(fieldName => fieldName));
    }, [fields]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const handleDragEnd = event => {
        const { active, over } = event;
        let oldItemIndex;
        let newItemIndex;
        fields.map((fieldName, index) => {
            if (fieldName === active.id) {
                oldItemIndex = index;
            }
            if (fieldName === over.id) {
                newItemIndex = index;
            }
        });

        fields.move(oldItemIndex, newItemIndex);
        setFieldsToDrag(fieldsToDrag => {
            return arrayMove(fieldsToDrag, oldItemIndex, newItemIndex);
        });
    };
    return (
        <Box>
            <Typography>{polyglot.t('transformers')}</Typography>
            {touched && error && <span>{error}</span>}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={fieldsToDrag}
                    strategy={verticalListSortingStrategy}
                >
                    {fieldsToDrag?.map((fieldName, index) => (
                        <TransformerItem
                            key={fieldName}
                            id={fieldName}
                            transformer={fields.get(index)}
                            operation={fields.get(index)?.operation}
                            args={fields.get(index)?.args}
                            onRemove={() => {
                                fields.remove(index);
                            }}
                            onEdit={() => {
                                setIndexFieldToEdit(index);
                                setIsDialogOpen(true);
                            }}
                            show={
                                showTransformer(
                                    fields.get(index)?.operation,
                                    type,
                                ) &&
                                (!hideFirstTransformers ||
                                    index >= hideFirstTransformers)
                            }
                        />
                    ))}
                </SortableContext>
            </DndContext>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    color="primary"
                    sx={{ borderWidth: '2px', borderStyle: 'dashed' }}
                    onClick={() => {
                        setIndexFieldToEdit(null);
                        setIsDialogOpen(true);
                    }}
                >
                    {polyglot.t('add_transformer')}
                </Button>
            </Box>

            {isDialogOpen && (
                <TransformerUpsertDialog
                    isOpen={isDialogOpen}
                    handleClose={() => setIsDialogOpen(false)}
                    indexFieldToEdit={indexFieldToEdit}
                    fields={fields}
                    type={type}
                />
            )}
        </Box>
    );
};

TransformerList2.propTypes = {
    hideFirstTransformers: PropTypes.number,
    fields: PropTypes.shape({
        map: PropTypes.func.isRequired,
        get: PropTypes.func.isRequired,
        remove: PropTypes.func.isRequired,
        push: PropTypes.func.isRequired,
        move: PropTypes.func.isRequired,
        getAll: PropTypes.func.isRequired,
    }).isRequired,
    meta: PropTypes.shape({
        touched: PropTypes.bool,
        error: PropTypes.string,
    }).isRequired,
    p: polyglotPropTypes.isRequired,
    type: PropTypes.string,
};

TransformerList2.defaultProps = {
    type: null,
};

export default compose(translate, pure)(TransformerList2);
