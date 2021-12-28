export const columnDefs = [
  { field: 'make' },
  { field: 'model' },
  {
		field: 'price',
		type: 'numericColumn',
		filter: 'agNumberColumnFilter',
	}
];

export const defaultColDef = {
  flex: 1,
  resizable: true,
  sortable: true,
	rowGroup: true,
	enableRowGroup: true,
	filter: 'agTextColumnFilter',
	menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
};

export const autoGroupColumnDef = {
	headerName: 'Grouping',
	lockPosition: true,
	cellRendererParams: {
		suppressCount: true
	},
};
