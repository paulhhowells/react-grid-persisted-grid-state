import React from 'react';
import { ModuleRegistry } from '@ag-grid-community/core'; // @ag-grid-community/core will always be implicitly available
import { AgGridReact } from '@ag-grid-community/react';
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";
import '@ag-grid-community/core/dist/styles/ag-grid.css';
import '@ag-grid-community/core/dist/styles/ag-theme-alpine.css';
import {
	useGridState,
	usePersistence,
} from '../../hooks';
import {
	autoGroupColumnDef,
	columnDefs,
	defaultColDef,
} from './definitions';

ModuleRegistry.registerModules([
	ClientSideRowModelModule,
  RowGroupingModule,
]);

function getDataPath (datum) {
	return datum.path.split('/');
}

function TreeDataGrid () {
	const [rowData, setRowData] = React.useState([]);

	React.useEffect(() => {
		const root = 'http://localhost:3000';
		const path = '/tree';
		const url = new URL(root + path);

		fetch(url, {
				method: 'get',
				headers: { 'Content-Type': 'application/json; charset=utf-8' }
			})
			.then(httpResponse => httpResponse.json())
			.then(response => {
				const { results: rows } = response;

				setRowData(rows);
			})
			.catch(error => {
				console.error(error);
			});
	}, []);

	const {persistedState, persistState} = usePersistence('tree-demo');
	const {
		onFirstDataRendered,
		onGridColumnStateChanged,
		onFilterChanged,
	} = useGridState({persistedState, persistState});

  return (
		<>
			<h2>Tree Data Grid</h2>
			<div className="ag-theme-alpine grid">
				<AgGridReact
					columnDefs={columnDefs}
					defaultColDef={defaultColDef}
					rowData={rowData}
					width="100%"
					height="100%"
					//
					treeData
					getDataPath={getDataPath}
					groupDefaultExpanded={1}
					autoGroupColumnDef={autoGroupColumnDef}
					//
					onFirstDataRendered={onFirstDataRendered}
					onFilterChanged={onFilterChanged}
					onSortChanged={onGridColumnStateChanged}
					onColumnMoved={onGridColumnStateChanged}
					onColumnPinned={onGridColumnStateChanged}
					onColumnPivotChanged={onGridColumnStateChanged}
					onColumnResized={onGridColumnStateChanged}
					onColumnRowGroupChanged={onGridColumnStateChanged}
					onColumnValueChanged ={onGridColumnStateChanged}
					onColumnVisible={onGridColumnStateChanged}
					//
					suppressColumnMoveAnimation
					suppressDragLeaveHidesColumns
				/>
			</div>
		</>
  );
}

export default TreeDataGrid;
