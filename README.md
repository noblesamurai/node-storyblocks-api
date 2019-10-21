# Storyblocks API [![Build Status](https://travis-ci.org/noblesamurai/node-storyblocks-api.svg?branch=master)](https://travis-ci.org/noblesamurai/node-storyblocks-api)

> storyblocks API wrapper for node.js

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

Then start making your requests to storyblocks
```js
const params = {
  keywords: 'mountain aerial',
  page: 1,
  numResults: 5
};
const results = await videoblocks.search(params);
// results = { info: [...], totalSearchResults: 4652 };
```

#### Parameters

The parameters argument combines both the URI parameters and the Query parameters
shown in the [docs](https://developer.storyblocks.com/docs/v1/index.html).

All parameter keys can be defined in camel case to be consistent with code styling
practices.  All keys will be converted back to snake case for the acutal request
to storyblocks.

### Audioblocks

#### Search Audio
```js
const results = await audioblocks.search(params);
```
For a list of parameters see the [docs](https://developer.storyblocks.com/docs/v1/index.html#/?id=search-audio).

#### List Categories
```js
const results = await audioblocks.categories(params);
```
For a list of parameters see the [docs](https://developer.storyblocks.com/docs/v1/index.html#/?id=list-categories-2).

#### List Subcategories
```js
const results = await audioblocks.subcategories(params);
```
For a list of parameters see the [docs](https://developer.storyblocks.com/docs/v1/index.html#/?id=list-subcategories).

#### Get Audio
```js
const results = await audioblocks.audio(params);
```
For a list of parameters see the [docs](https://developer.storyblocks.com/docs/v1/index.html#/?id=get-audio).

#### Get Similar Audio
```js
const results = await audioblocks.similar(params);
```
For a list of parameters see the [docs](https://developer.storyblocks.com/docs/v1/index.html#/?id=get-similar-audio).

#### Download Audio
```js
const results = await audioblocks.download(params);
```
For a list of parameters see the [docs](https://developer.storyblocks.com/docs/v1/index.html#/?id=download-audio).

#### List Collections
```js
const results = await audioblocks.collections(params);
```
For a list of parameters see the [docs](https://developer.storyblocks.com/docs/v1/index.html#/?id=list-collections-2).

#### Get Collections
```js
const results = await audioblocks.collection(params);
```
For a list of parameters see the [docs](https://developer.storyblocks.com/docs/v1/index.html#/?id=get-collection-2).

### Videoblocks

#### Search Videos
```js
const results = await videoblocks.search(params);
```
For a list of parameters see the [docs](https://developer.storyblocks.com/docs/v1/index.html#/?id=search-videos).

#### List Categories
```js
const results = await videoblocks.categories(params);
```
For a list of parameters see the [docs](https://developer.storyblocks.com/docs/v1/index.html#/?id=list-categories).

#### Get Video
```js
const results = await videoblocks.video(params);
```
For a list of parameters see the [docs](https://developer.storyblocks.com/docs/v1/index.html#/?id=get-video).

#### Get Similar Videos
```js
const results = await videoblocks.similar(params);
```
For a list of parameters see the [docs](https://developer.storyblocks.com/docs/v1/index.html#/?id=get-similar-videos).

#### Download Video
```js
const results = await videoblocks.download(params);
```
For a list of parameters see the [docs](https://developer.storyblocks.com/docs/v1/index.html#/?id=download-video).

#### List Collections
```js
const results = await videoblocks.collections(params);
```
For a list of parameters see the [docs](https://developer.storyblocks.com/docs/v1/index.html#/?id=list-collections).

#### Get Collections
```js
const results = await videoblocks.collection(params);
```
For a list of parameters see the [docs](https://developer.storyblocks.com/docs/v1/index.html#/?id=get-collection).

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
