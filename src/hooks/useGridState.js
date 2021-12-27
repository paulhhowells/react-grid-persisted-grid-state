import React from 'react';

const gridPersistenceVersion = '1.0';

export const useGridState = ({persistedState, persistState, columnDefs}) => {
	let timeoutId = null;

	const [gridState, dispatch] = React.useReducer(
		function gridStateReducer (state = {}, action) {
			const { type, payload } = action;

			if (type !== undefined && payload !== undefined) {
				return {
					...state,
					[type]: payload
				};
			}

			return state;
		},
		persistedState,
		function gridStateInit (appState) {
			const { grid } = appState;
			let { version = gridPersistenceVersion } = appState;

			// TODO: migrate state:
			// Developers should change the version string when they change column definitions.
			// Users do not want to lose their persisted settings whenever the app is updated.
			// What might change?
			// Column Defs might have a different set of columns, so update columnState,
			// and remove columns as needed from filterModel.
			if ( version !== gridPersistenceVersion ) {
				// Then migrate if needed.

				// Compare to colDefs, & find new and removed columns.
				// Gracefully remove deprecated columns from columnState & filterModel.
				// Gracefully add new columns base on siblings in colDefs, else insert at colDef index.

				version = gridPersistenceVersion;
			}

			const initialState = {
				...grid,
				version,
			};

			return initialState;
		}
	);

	React.useEffect(() => {
		persistState('grid', gridState)
	}, [gridState, persistState]);

	return {
		onFilterChanged,
		onFirstDataRendered,

		// Use onGridColumnStateChanged for:
		// onColumnMoved
		// onColumnPinned
		// onColumnPivotChanged
		// onColumnResized
		// onColumnRowGroupChanged
		// onColumnValueChanged // A value column was added or removed.
		// onColumnVisible
		// onSortChanged
		onGridColumnStateChanged,

		// Note that params.api.setSortModel(sortModel) has been deprecated,
		// and params.api.applyColumnState should be used instead.

		// Apply as an attribute to <AgGridReact /> whenever toggleGroupingUI is used.
		// agGridReactKey: 1,
		// toggleGroupingUI: () => {},
	};

	function onFirstDataRendered (params) {
		const { columnState, columnGroupState, filterModel } = gridState;

		if (columnState) {
			params.columnApi.applyColumnState({
				state: columnState,
				applyOrder: true, // Needed to persist column order.
			});
		}

		if (columnGroupState) {
			// type columnGroupState = { groupId: string; open: boolean; }[]
			params.columnApi.setColumnGroupState(columnGroupState);
		}

		if (filterModel) {
			params.api.setFilterModel(filterModel);
		}
	}

	function onGridColumnStateChanged (params) {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}

		// Crude buffering:
		timeoutId = setTimeout(() => {
			const columnState = params.columnApi.getColumnState();
			const columnGroupState = params.columnApi.getColumnGroupState();

			dispatch({ type: 'columnState', payload: columnState });
			dispatch({ type: 'columnGroupState', payload: columnGroupState });
		}, 200)
	}

	function onFilterChanged (params) {
		const filterModel = params.api.getFilterModel();

		dispatch({ type: 'filterModel', payload: filterModel });
	}
};
