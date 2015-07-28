SHELL := /bin/bash

.PHONY: test

all: test

install:
	rm -rf node_modules
	npm i

test:
	npm test