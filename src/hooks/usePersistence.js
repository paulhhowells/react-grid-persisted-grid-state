import React from 'react';

const APP_NAME = process.env.REACT_APP_NAME;
const USER_NAME = 'me';
const PERSISTENCE_NAMESPACE = APP_NAME + '.' + USER_NAME;

export const usePersistence = () => {
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
		localStorage.setItem(PERSISTENCE_NAMESPACE, currentStateString)
	}, [currentStateString]);

	const persistState = React.useCallback((key, value) => dispatch({ key, value }), []);

	return { persistedState, persistState, currentState };

	function initState () {
		const defaultState = {};
		const state = localStorage.getItem(PERSISTENCE_NAMESPACE);
		const initialState = (state !== null && state !== undefined)
			? JSON.parse(state)
			: defaultState;

		return initialState;
	}
};
