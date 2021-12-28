import React from 'react';

const APP_NAME = process.env.REACT_APP_NAME;
const USER_NAME = 'me';

export const usePersistence = (ID) => {
	const persistenceNamespace = (ID)
		? APP_NAME + '.' + USER_NAME + '.' + ID
		: APP_NAME + '.' + USER_NAME;

	const { current: persistedState } = React.useRef(initState());

	const [currentState, dispatch] = React.useReducer(
		function reducer (state, action) {
			const { key, value } = action;

			if (key !== undefined && value !== undefined) {
				const newState = {
					...state,
					[key]: value,
				};

				return newState;
			}

			return state;
		},
		persistedState,
	);

	const currentStateString = JSON.stringify(currentState);
	React.useEffect(() => {
		localStorage.setItem(persistenceNamespace, currentStateString)
	}, [currentStateString, persistenceNamespace]);

	const persistState = React.useCallback((key, value) => dispatch({ key, value }), []);

	return { persistedState, persistState, currentState };

	function initState () {
		const defaultState = {};
		const state = localStorage.getItem(persistenceNamespace);
		const initialState = (state !== null && state !== undefined)
			? JSON.parse(state)
			: defaultState;

		return initialState;
	}
};
