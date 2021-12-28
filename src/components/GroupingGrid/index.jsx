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
	columnDefs,
	defaultColDef,
} from './definitions';

ModuleRegistry.registerModules([
	ClientSideRowModelModule,
  RowGroupingModule,
]);

function GroupingGrid () {
	const [rowData, setRowData] = React.useState([]);

	React.useEffect(() => {
		const root = 'http://localhost:3000';
		const path = '/api';
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

	const {persistedState, persistState} = usePersistence('grouping-demo');
	const {
		onFirstDataRendered,
		onGridColumnStateChanged,
		onFilterChanged,
	} = useGridState({persistedState, persistState});

	// When using Grouping it may be desirable to toggle the appearance of
	// the Row Group Panel UI by using rowGroupPanelShow.  This example
	// demonstrates how this may be done using a key.
	const [gridKey, setGridKey] = React.useState(0);
	const [showRowGroupPanel, setShowRowGroupPanel] = React.useState('always');

  return (
		<>
			<button type="button" onClick={toggleShowRowGroupPanel}>
				Group Panel : { (showRowGroupPanel ===  'always') ? 'on' : 'off' }
			</button>
			<h2>Grouping Grid</h2>
			<div className="ag-theme-alpine grid">
				<AgGridReact
					columnDefs={columnDefs}
					defaultColDef={defaultColDef}
					rowData={rowData}
					width="100%"
					height="100%"
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
					groupDefaultExpanded={2}
					suppressColumnMoveAnimation
					suppressDragLeaveHidesColumns
					rowGroupPanelShow={showRowGroupPanel}
					key={gridKey}
				/>
			</div>
		</>
  );

	function toggleShowRowGroupPanel () {
		const newState = (showRowGroupPanel ===  'always') ? '' : 'always';

		setShowRowGroupPanel(newState);

		// AgGridReact does not respond when the rowGroupPanelShow prop is updated,
		// so hack to reset react component.
		setGridKey((gridKey === 0) ? 1 : 0);
	}
}

export default GroupingGrid;
