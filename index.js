const { serve } = require('./server/main');

const app = serve({ dirname: __dirname, name: 'bhere-sso', port: 3010 });
