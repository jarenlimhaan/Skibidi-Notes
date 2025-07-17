# Installing dependencies
install:
	@echo "Installing dependencies..."
	@pip install pipx
	@pipx install poetry --force
	@pipx ensurepath
	@echo "If it fails just reopen the terminal and rerun make install"
	@cd backend && poetry install
	@cd frontend && npm install
	@echo "Dependencies installed successfully!✅"

# Update dependencies 
update:
	@echo "Updating dependencies..."
	@cd backend && poetry install
	@cd frontend && npm install
	@echo "Dependencies updated successfully!✅"

# Run BE
run-be:
	@echo "Starting FastAPI Server..."
	@cd backend && poetry run python main.py
	@echo "Sucessfully ran FastAPI Server🚀"

# Run FE
run-fe:
	@echo "Starting NextJS Application..."
	@cd frontend && HOST=0.0.0.0 npm run dev
	@echo "Sucessfully ran NextJS Application🚀"

# Run Redis 
run-redis:
	@echo "Starting Redis Server..."
	@cd backend && poetry run celery -A src.modules.generator.runner.base worker --loglevel=info
	@echo "Sucessfully ran Redis Server🚀"

# Run both FE & BE
run:
	@echo "Starting FastAPI Server and NextJS Application..."
	@$(MAKE) run-be &
	@$(MAKE) run-fe &
	@$(MAKE) run-redis 
	@echo "Sucessfully ran NextJS Application & FastAPI Server🚀"