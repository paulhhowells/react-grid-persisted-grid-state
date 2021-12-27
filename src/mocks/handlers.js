// src/mocks/handlers.js
import { rest } from 'msw';

const makes = [
  {make: 'Toyota', path: 'Toyota' },
  {make: 'Ford', path: 'Ford' },
  {make: 'Porsche', path: 'Porsche' },
];
const toyota = [
  {make: 'Toyota', model: 'Celica', price: 35000, path: 'Toyota/Celica'},
  {make: 'Toyota', model: 'Avensis', price: 42000, path: 'Toyota/Avensis'},
	{make: 'Toyota', model: 'Delica', price: 42000, path: 'Toyota/Delica'},
];
const porsche = [
  {make: 'Porsche', model: 'Boxter', price: 72000, path: 'Porsche/Boxter'},
  {make: 'Porsche', model: '911', price: 89000, path: 'Porsche/911'},
];
const ford = [
  {make: 'Ford', model: 'Mondeo', price: 32000, path: 'Ford/Mondeo'},
  {make: 'Ford', model: 'F150 Lightning', price: 39000, path: 'Ford/F150 Lightning'},
];

export const handlers = [
  rest.get('/api', (req, res, ctx) => {
    // const makes = req.url.searchParams.getAll('makes')

		const results = [
			...makes,
			...toyota,
			...ford,
			...porsche,
		];

    return res(
      ctx.status(200),
      ctx.json({
        results,
      }),
    );
  }),
];
