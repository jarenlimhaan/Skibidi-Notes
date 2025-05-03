# Installing dependencies
install-dep:
	@echo "Installing dependencies..."
	@pip install pipx
	@pipx install poetry --force
	@pipx ensurepath
	@echo "If it fails just reopen the terminal and rerun make install-dep!"
	@cd backend && poetry install
	@cd frontend && npm install
	@echo "Dependencies installed successfully!✅"

# Run BE
run-be:
	@echo "Starting FastAPI Server..."
	@cd backend && poetry run python main.py
	@echo "Sucessfully ran FastAPI Server🚀"

# Run FE
run-fe:
	@echo "Starting NextJS Application..."
	@cd frontend && npm run dev
	@echo "Sucessfully ran NextJS Application🚀"

# Start DB
db-up:
	@docker compose up -d
	@echo "Database started!"

# Stop DB
db-down:
	@docker compose down
	@echo "Database stopped!"

# Seed the DB 

# Run both FE & BE
run:
	@echo "Starting FastAPI Server and NextJS Application..."
	@$(MAKE) run-be &
	@$(MAKE) run-fe
	@echo "Sucessfully ran NextJS Application & FastAPI Server🚀"