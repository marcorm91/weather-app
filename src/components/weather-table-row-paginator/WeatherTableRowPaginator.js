import React from 'react'
import { WeatherTableRowPaginatorStyled } from './WeatherTableRowPaginatorStyled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDoubleLeft, faAngleDoubleRight, faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'

const TablePaginator = ({ tableInstance }) => {

  const { t } = useTranslation();

  const {
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = tableInstance;

  return (
    <WeatherTableRowPaginatorStyled>
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          <FontAwesomeIcon icon={faAngleDoubleLeft} />
        </button>
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          <FontAwesomeIcon icon={faAngleRight} />
        </button>
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          <FontAwesomeIcon icon={faAngleDoubleRight} />
        </button>
        <span>
        {t("HOME.TABLE.PAGE")} {pageIndex + 1} {t("HOME.TABLE.OF")} {pageOptions.length}
        </span>
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              {t("HOME.TABLE.SHOW")} {pageSize}
            </option>
          ))}
        </select>
    </WeatherTableRowPaginatorStyled>
  );
};

export default TablePaginator;
