import { DBConfig } from 'ngx-indexed-db';

export const dbConfig: DBConfig = {
  name: 'QuotesDB',
  version: 1,
  objectStoresMeta: [
    {
      store: 'quotes',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        {
          name: 'id',
          keypath: 'id',
          options: { unique: true },
        },
        {
          name: 'text',
          keypath: 'text',
          options: { unique: false },
        },
        {
          name: 'author',
          keypath: 'author',
          options: { unique: false },
        },
        {
          name: 'source',
          keypath: 'source',
          options: { unique: false },
        },
        {
          name: 'tags',
          keypath: 'tags',
          options: { unique: false },
        },
        {
          name: 'timestamp',
          keypath: 'timestamp',
          options: { unique: false },
        },
      ],
    },
    {
      store: 'ratings',
      storeConfig: { keyPath: 'quoteId', autoIncrement: false },
      storeSchema: [
        {
          name: 'quoteId',
          keypath: 'quoteId',
          options: { unique: true },
        },
        {
          name: 'value',
          keypath: 'value',
          options: { unique: false },
        },
        {
          name: 'timestamp',
          keypath: 'timestamp',
          options: { unique: false },
        },
      ],
    },
  ],
};

