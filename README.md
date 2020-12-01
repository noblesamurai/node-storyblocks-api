# Storyblocks API (Version 2) [![Build Status](https://travis-ci.org/noblesamurai/node-storyblocks-api.svg?branch=master)](https://travis-ci.org/noblesamurai/node-storyblocks-api)

> [Storyblocks API](https://documentation.storyblocks.com/) wrapper for node.js

## Installation

This module is installed via npm:

``` bash
$ npm install storyblocks-api
```

## API

Create the authorised API service you need (audioblocks or videoblocks).

```js
const credentials = {
  privateKey: '...',
  publicKey: '...'
};
const { audioblocks, videoblocks } = require('storyblocks-api')(credentials);
```

Then start making your requests to Storyblocks
```js
const params = {
  keywords: 'mountain aerial',
  page: 1,
  numResults: 5
};
const search = await videoblocks.search(params);
// search = { results: [...], totalResults: 4652 };
```

#### Parameters

The parameters argument combines both the URI parameters and the Query parameters
shown in the [docs](https://documentation.storyblocks.com/).

All parameter keys can be defined in camel case to be consistent with code styling
practices.  All keys will be converted back to snake case for the acutal request
to Storyblocks.

#### Response

Response objects also have their keys converted back to camel case (from the
mostly, but not entirely, snake case values returned from Storyblocks).

### Audioblocks

#### Search Audio
```js
const results = await audioblocks.search(params);
```
For a list of parameters see the [docs](https://documentation.storyblocks.com/#e4fbb5b0-0864-4e2a-8281-6c12b50f9a3e).

#### List Categories
```js
const results = await audioblocks.categories(params);
```
For a list of parameters see the [docs](https://documentation.storyblocks.com/#fec2f320-b587-443f-9a97-d839f311c429).

#### Get Audio Details
```js
const results = await audioblocks.audio(params);
```
For a list of parameters see the [docs](https://documentation.storyblocks.com/#b401c4b9-c0a6-4751-97c7-5a33c57c73c3).

#### Get Similar Audio
```js
const results = await audioblocks.similar(params);
```
For a list of parameters see the [docs](https://documentation.storyblocks.com/#44a1b6bc-0634-47fc-8f87-cf3ba0cc2216).

#### Download Audio
```js
const results = await audioblocks.download(params);
```
For a list of parameters see the [docs](https://documentation.storyblocks.com/#191f9e61-a96c-4bde-8e71-7ba0d662baaf).

#### List Collections
```js
const results = await audioblocks.collections(params);
```
For a list of parameters see the [docs](https://documentation.storyblocks.com/#98493935-a86e-426b-8165-c78197373059).

#### Get Collections
```js
const results = await audioblocks.collection(params);
```
For a list of parameters see the [docs](https://documentation.storyblocks.com/#4d2905f5-cafd-461a-881a-e0702bfc7cb2).

### Videoblocks

#### Search Videos
```js
const results = await videoblocks.search(params);
```
For a list of parameters see the [docs](https://documentation.storyblocks.com/#51b6b1b7-c95c-450c-b61d-c323a5b7c472).

#### List Categories
```js
const results = await videoblocks.categories(params);
```
For a list of parameters see the [docs](https://documentation.storyblocks.com/#c4aecae5-579f-4be8-b093-6b424635bc27)

#### Get Video Details
```js
const results = await videoblocks.video(params);
```
For a list of parameters see the [docs](https://documentation.storyblocks.com/#e4d549f5-711b-4a2a-a97d-50d1f487b433).

#### Get Similar Videos
```js
const results = await videoblocks.similar(params);
```
For a list of parameters see the [docs](https://documentation.storyblocks.com/#b29d52d2-c230-4167-8fb2-a9d307f746e9).

#### Download Video
```js
const results = await videoblocks.download(params);
```
For a list of parameters see the [docs](https://documentation.storyblocks.com/#430e0ff6-7e8d-4e92-be79-6a7a8a18c9dc).

#### List Collections
```js
const results = await videoblocks.collections(params);
```
For a list of parameters see the [docs](https://documentation.storyblocks.com/#1debad1c-2135-4163-8a1c-73e662ce3a2b).

#### Get Collections
```js
const results = await videoblocks.collection(params);
```
For a list of parameters see the [docs](https://documentation.storyblocks.com/#f60c7ed5-4c16-4c06-a992-04883c2838ba).

## Tests

Some tests use [nock.back](https://github.com/nock/nock#nock-back). These are tests that will record network
traffic the first time they are run and then use those recordings as fixtures for subsequent runs.

When recording tests a valid storyblocks private and public key is required. These are set using the
`STORYBLOCKS_PRIVATE_KEY` and `STORYBLOCKS_PUBLIC_KEY` environment variables. The simplest way to do this
is with a `.env` file which will be automatically loaded by the nock.back tests. Note that `.env` files
have been added to the `.gitignore` so they are never committed.

Fixtures are stored in `/test/fixtures`. If you need to re-record a test the simplest way is to just remove
the recorded fixture and run the tests again.

## License

The BSD License

Copyright (c) 2019, Andrew Harris

All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice, this
  list of conditions and the following disclaimer in the documentation and/or
  other materials provided with the distribution.

* Neither the name of the Andrew Harris nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
