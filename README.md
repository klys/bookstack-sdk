# bookstacksdk

A lightweight Node.js SDK for the [BookStack API](https://demo.bookstackapp.com/api/docs).

## Installation

```bash
npm install bookstacksdk
```

## Requirements

- Node.js 18+ (uses native `fetch`)

## Quick Start

```js
import BookstackSDK from 'bookstacksdk';

const sdk = new BookstackSDK({
  apiHost: 'https://docs.your-domain.com',
  apiKey: 'your_token_id',
  apiSecret: 'your_token_secret'
});

const books = await sdk.book.list({ count: 5, sort: '-id' });
console.log(books);
```

## Configuration

You can pass credentials in the constructor or use environment variables.

### Constructor options

- `apiHost`: BookStack base URL (without trailing `/api`)
- `apiKey`: API token ID
- `apiSecret`: API token secret

### Environment variables

```bash
BOOKSTACK_API_HOST=https://docs.your-domain.com
BOOKSTACK_API_KEY=your_token_id
BOOKSTACK_API_SECRET=your_token_secret
```

## Available Resources

- `sdk.book`
- `sdk.page`
- `sdk.chapter`
- `sdk.shelf`
- `sdk.user`

Each resource supports:

- `list(params?)`
- `create(data)`
- `read(id)`
- `update(id, data)`
- `delete(id)`

## Examples

### Create a page

```js
const page = await sdk.page.create({
  book_id: 1,
  name: 'My New Page',
  markdown: '# Hello from SDK'
});
```

### Read a chapter

```js
const chapter = await sdk.chapter.read(5);
```

### Update a shelf

```js
const shelf = await sdk.shelf.update(3, {
  name: 'Updated Shelf Name'
});
```

## Error Handling

The SDK throws an `Error` when the BookStack API returns a non-2xx response.

```js
try {
  await sdk.book.read(999999);
} catch (error) {
  console.error(error.message);
}
```

## License

ISC
