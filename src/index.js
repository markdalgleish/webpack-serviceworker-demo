require('file?name=manifest.json!./manifest.json');

import React from 'react';
import { render } from 'react-dom';
import { renderToString } from 'react-dom/server';

import App from './App';

// Client render
if (typeof document !== 'undefined') {
  const register = require("serviceworker!./service-worker.js");
  register({ scope: '/' })
    .then(() => console.log('It worked!'))
    .catch(err => console.log('It didnt work!', err));

  const outlet = document.getElementById('outlet');
  render(<App />, outlet);
}

// Render function for static-site-generator-webpack-plugin
export default ({ path, template, assets }, done) => {
  const html = renderToString(<App />);
  done(null, template({ html, assets }));
};
