import React from 'react';
import GroupingGrid from '../GroupingGrid';
import TreeDataGrid from '../TreeDataGrid';

function Main () {
	const [grid, setGrid] = React.useState('grouping');

  return (
    <section className="main">
      <h1>React Grid Persisted Grid State</h1>
			<button
				type="button"
				onClick={toggleGrid}>
				Show { (grid === 'treeData') ? 'Grouping Grid' : 'Tree Data Grid' }
			</button>
			{
				(grid === 'treeData')
					? <TreeDataGrid />
					: <GroupingGrid />
			}
    </section>
  );

	function toggleGrid () {
		const newGrid = (grid === 'treeData') ? 'grouping' : 'treeData';

		setGrid(newGrid);
	}
}

export default Main;
