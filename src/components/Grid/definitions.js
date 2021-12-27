export const columnDefs = [
  { field: 'make' },
  { field: 'model' },
  { field: 'price', type: 'numericColumn' }
];

export const defaultColDef = {
  flex: 1,
  resizable: true,
  sortable: true,
};

export const autoGroupColumnDef = {
	headerName: 'Grouping',
	cellRendererParams: {
			suppressCount: true
	},
};
