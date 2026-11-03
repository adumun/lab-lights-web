# ADÜMÜN LAB — local quality gates and guarded Pull Request creation
# Requires GNU Make, Node.js 24, npm and (for create-pr) Git + GitHub CLI.
.DEFAULT_GOAL := help

.PHONY: help lint typecheck test build verify create-pr

help:
	@echo "make verify     - Run local quality gates (lint, typecheck, test, build)"
	@echo "make create-pr  - Verify, push branch/fork, and open a draft PR for review"
	@echo "make lint       - Run ESLint"
	@echo "make typecheck  - Run TypeScript checks"
	@echo "make test       - Run Vitest"
	@echo "make build      - Build production assets"

lint:
	npm run lint

typecheck:
	npm run typecheck

test:
	npm run test

build:
	npm run build

verify: lint typecheck test build

create-pr:
	node scripts/create-pr.mjs
