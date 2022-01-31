import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { DataGrid } from '@mui/x-data-grid';
import { IN_PROGRESS } from '../../../../common/enrichmentStatus';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import classnames from 'classnames';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { reloadParsingResult } from './';
import { fromEnrichments, fromParsing } from '../selectors';
import datasetApi from '../api/dataset';
import Loading from '../../lib/components/Loading';
import ParsingExcerpt from './ParsingExcerpt';
import theme from '../../theme';
import { makeStyles } from '@material-ui/styles';
import { Box, Chip, CircularProgress } from '@material-ui/core';
import { TablePagination } from '@mui/material';

const COLUMN_TYPE = {
    MAIN: 'main',
    ENRICHMENT: 'enrichment',
};
const styles = {
    container: {
        position: 'relative',
        flex: '1 1 auto',
        display: 'flex',
        height: 'calc(100vh - 90px)',
    },
    header: {
        backgroundColor: theme.black.veryLight,
    },
    enrichedColumn: {
        backgroundColor: theme.green.light,
    },
    footer: {
        overflow: 'hidden',
        height: 30,
        alignItems: 'center',
        position: 'relative',
        display: 'flex',
        justifyContent: 'space-between',
        zIndex: 2,
    },
    columnToggle: {
        display: 'flex',
    },
    footerItem: {
        paddingLeft: '1rem',
        paddingRight: '1rem',
        backgroundColor: theme.black.veryLight,
        lineHeight: '30px',
        height: '100%',
        alignItems: 'center',
        display: 'flex',
    },
    footerItemText: {
        paddingRight: '1rem',
    },
    toggle: {
        cursor: 'pointer',
    },
};

const useStyles = makeStyles(styles);

export const ParsingResultComponent = props => {
    const {
        p: polyglot,
        excerptColumns,
        excerptLines,
        maxLines,
        showAddFromColumn,
        onAddField,
        dataGrid,
        enrichments,
        loadingParsingResult,
    } = props;

    const classes = useStyles();
    const [showEnrichmentColumns, setShowEnrichmentColumns] = useState(true);
    const [showMainColumns, setShowMainColumns] = useState(true);

    const [datas, setDatas] = useState([]);

    const getColumnsToShow = () => {
        if (datas.length === 0) return [];
        const enrichmentsNames = enrichments.map(enrichment => enrichment.name);

        return Object.keys(datas[0])
            .filter(key => {
                const isEnrichment = enrichmentsNames.includes(key);
                return (
                    key !== '_id' &&
                    (key === 'uri' ||
                        (showEnrichmentColumns && isEnrichment) ||
                        (showMainColumns && !enrichmentsNames.includes(key)))
                );
            })
            .map(key => {
                const isEnrichment = enrichmentsNames.includes(key);
                const isEnrichmentLoading =
                    isEnrichment &&
                    enrichments.some(
                        enrichment =>
                            enrichment.name === key &&
                            enrichment.status === IN_PROGRESS,
                    );
                return {
                    field: key,
                    headerName: key,
                    cellClassName: isEnrichment && classes.enrichedColumn,
                    width: 150,
                    sortable: typeof datas[0][key] !== 'object',
                    renderCell: params => {
                        if (isEnrichmentLoading && params.value === undefined)
                            return (
                                <CircularProgress
                                    variant="indeterminate"
                                    style={styles.progress}
                                    size={20}
                                />
                            );
                        if (params.value === undefined) {
                            return <Chip label="undefined" />;
                        }
                        if (params.value === null) {
                            return <Chip label="null" />;
                        }
                        return (
                            <div title={JSON.stringify(params.value)}>
                                {JSON.stringify(params.value)}
                            </div>
                        );
                    },
                };
            });
    };

    const columns = useMemo(
        () =>
            getColumnsToShow(
                datas,
                showEnrichmentColumns,
                showMainColumns,
                enrichments,
            ),
        [datas, showEnrichmentColumns, showMainColumns, enrichments],
    );

    const numberOfColumns = useCallback(
        columnType => {
            if (!datas || datas.length === 0 || !enrichments) return 0;
            return Object.keys(datas[0]).filter(key => {
                const isEnrichmentColumn = enrichments.some(
                    enrichment => enrichment.name === key,
                );
                switch (columnType) {
                    case COLUMN_TYPE.MAIN:
                        return !isEnrichmentColumn;
                    case COLUMN_TYPE.ENRICHMENT:
                        return isEnrichmentColumn;
                    default:
                        return false;
                }
            }).length;
        },
        [datas, enrichments],
    );

    const rows = useMemo(() => datas.map(data => ({ id: data._id, ...data })), [
        datas,
    ]);

    const [rowCount, setRowCount] = useState(0);
    const [skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(25);
    const [filter] = useState({});

    const onPageChange = page => {
        setSkip(page * limit);
    };

    useEffect(() => {
        const fetchDataset = async () => {
            const { count: datasCount, datas } = await datasetApi.getDataset({
                skip,
                limit,
                filter,
            });
            setRowCount(datasCount);
            setDatas(datas);
        };
        fetchDataset();
    }, [skip, limit, filter]);
    if (loadingParsingResult) {
        return (
            <Loading className="admin">
                {polyglot.t('loading_parsing_results')}
            </Loading>
        );
    }

    const CustomFooter = () => {
        return (
            <div className={classes.footer}>
                <div className={classes.columnToggle}>
                    <Box
                        className={classnames(
                            classes.footerItem,
                            classes.toggle,
                        )}
                        onClick={() => {
                            setShowMainColumns(!showMainColumns);
                        }}
                    >
                        <div className={classes.footerItemText}>
                            {polyglot.t('parsing_summary_columns', {
                                smart_count: numberOfColumns(COLUMN_TYPE.MAIN),
                            })}
                        </div>
                        {showMainColumns ? (
                            <VisibilityIcon />
                        ) : (
                            <VisibilityOffIcon />
                        )}
                    </Box>

                    <Box
                        className={classnames(
                            classes.enrichedColumn,
                            classes.footerItem,
                            classes.toggle,
                        )}
                        onClick={() => {
                            setShowEnrichmentColumns(!showEnrichmentColumns);
                        }}
                    >
                        <div className={classes.footerItemText}>
                            {polyglot.t('parsing_enriched_columns', {
                                smart_count: numberOfColumns(
                                    COLUMN_TYPE.ENRICHMENT,
                                ),
                            })}
                        </div>
                        {showEnrichmentColumns ? (
                            <VisibilityIcon />
                        ) : (
                            <VisibilityOffIcon />
                        )}
                    </Box>
                </div>
                <TablePagination
                    count={rowCount}
                    page={skip / limit}
                    rowsPerPage={limit}
                    onPageChange={(e, page) => onPageChange(page)}
                    rowsPerPageOptions={[25, 50, 100]}
                    labelRowsPerPage={polyglot.t('rows_per_page')}
                    onRowsPerPageChange={rpp => {
                        setLimit(rpp.target.value);
                    }}
                />
            </div>
        );
    };

    return (
        <div className={classes.container}>
            {dataGrid ? (
                <DataGrid
                    columns={columns}
                    rows={rows}
                    rowCount={rowCount}
                    disableColumnFilter
                    disableColumnMenu
                    pageSize={limit}
                    paginationMode="server"
                    onPageChange={onPageChange}
                    onPageSizeChange={setLimit}
                    rowsPerPageOptions={[10, 25, 50]}
                    disableSelectionOnClick={true}
                    components={{
                        Footer: CustomFooter,
                    }}
                />
            ) : (
                <ParsingExcerpt
                    columns={excerptColumns}
                    lines={excerptLines.slice(0, maxLines)}
                    showAddFromColumn={showAddFromColumn}
                    onAddField={onAddField}
                />
            )}
        </div>
    );
};

ParsingResultComponent.propTypes = {
    excerptColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
    excerptLines: PropTypes.arrayOf(PropTypes.object).isRequired,
    p: polyglotPropTypes.isRequired,
    handleClearParsing: PropTypes.func.isRequired,
    showAddFromColumn: PropTypes.bool.isRequired,
    onAddField: PropTypes.func,
    maxLines: PropTypes.number,
    loadingParsingResult: PropTypes.bool.isRequired,
    dataGrid: PropTypes.bool,
    enrichments: PropTypes.arrayOf(PropTypes.object),
};

ParsingResultComponent.defaultProps = {
    maxLines: 10,
    showAddFromColumn: false,
};

const mapStateToProps = state => ({
    excerptColumns: fromParsing.getParsedExcerptColumns(state),
    excerptLines: fromParsing.getExcerptLines(state),
    loadingParsingResult: fromParsing.isParsingLoading(state),
    enrichments: fromEnrichments.enrichments(state),
});

const mapDispatchToProps = {
    handleClearParsing: reloadParsingResult,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(ParsingResultComponent);
