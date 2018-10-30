'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_HOST:"/api",
  // API_ROOT:"/api",
  API_ROOT: '"http://112.74.169.46:8091"',
})
