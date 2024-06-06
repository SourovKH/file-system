#! /bin/bash

setup () {
  npm install
  node --test
}

setup