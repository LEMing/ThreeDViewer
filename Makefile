# Makefile

# Variables
SHELL := /bin/bash
PACKAGE_MANAGER := npm
NODE_MODULES := node_modules
DIST := dist

# Targets
.PHONY: all install clean build test dev preview help

all: install build test

install: $(NODE_MODULES)

$(NODE_MODULES): package.json
	$(PACKAGE_MANAGER) install
	@touch $(NODE_MODULES)

clean:
	rm -rf $(NODE_MODULES) $(DIST)

build: install
	$(PACKAGE_MANAGER) run build

test: install
	$(PACKAGE_MANAGER) test

dev: install
	$(PACKAGE_MANAGER) run dev

publish: build test
	$(PACKAGE_MANAGER) publish

help:
	@echo "Available commands:"
	@echo "  make install  - Install dependencies"
	@echo "  make clean    - Remove node_modules and dist directories"
	@echo "  make build    - Build the project"
	@echo "  make test     - Run tests"
	@echo "  make dev      - Start development server"
	@echo "  make publish  - Build, test, and publish to npm"
	@echo "  make help     - Show this help message"
