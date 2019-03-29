# Sample Web App : Fabulous Faucet

Steps:

1. modify the codes in /src

2. npm install

3. npm run build

4. npm start

5. open chrome to localhost:8080


Tools:

1. [ESlint](https://eslint.org/) : A javascript linter
   
    

2. [npm](https://www.npmjs.com/) : A node module manager


3. [prettier](https://github.com/prettier/prettier) A code formatter 

4. [travis ci](https://docs.travis-ci.com/user/customizing-the-build/) A unit/integration test schedulor

5. [webpack](https://webpack.js.org/) A javascript bundler(make multiple js files together)

6. [expressjs](https://expressjs.com/) A totally awesome webapp framework

7. [babeljs](https://babeljs.io/) A javascript compiler

8. [react bootstrap]

9. [react native]

## Steps

npm install --save-dev @babel/core@^7.0.0-0

### Design the logic



### Write the codes


1. Use express / react to create a simple web App. Create a server.js in the root folder. Add run script to package.json. Use **npm start** as the main start script.

```js

import express from 'express';
import path from 'path';

const port = process.env.PORT || 8080;
const app = express();

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist/index.html'));
});
console.log(`Listening on port ${port}`);
app.listen(port);

```


2. 



### Bundle the js

1. Define webpack.config.js
2. Run webpack to create bundle.js
3. embed the bundle.js into page.html

### Configure run command

1. Install babeljs to run the js codes

```sh

npm install --save-dev @babel/core @babel/node @babel/preset-react 

```
2. Install webpack to bundle the js sourc

```sh

npm install --save-dev webpack webpack-cli

```

3. Istall babel loader for webpack bundle

```sh

npm install --save-dev babel-loader

```

4. Install eslint 

```sh

npm install eslint-loader eslint  --save-dev

```

5. Install flowJs for babel

```sh

npm install --save-dev babel-cli babel-preset-flow


```