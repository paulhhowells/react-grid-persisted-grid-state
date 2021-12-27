import React from 'react';

// TODO: migrate state ?
const gridPersistenceVersion = '1.0';

export const useGridState = ({persistedState, persistState}) => {
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
			const initialState = {
				...appState.grid,
				version: gridPersistenceVersion, // this overwrites, there should be a default, but handle migration
			};

			return initialState;
		}
	);

	React.useEffect(() => {
		persistState('grid', gridState)
	}, [gridState, persistState]);

	return {
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
		//
		onFilterChanged,
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

		// Deprecated: use applyColumnState instead
		// if (sortModel) {
		// 	params.api.setSortModel(sortModel);
		// }
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
