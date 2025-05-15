# 🧱 FastAPI Backend Architecture

This project uses **FastAPI** with a structure inspired by **NestJS**, following modular and layered design patterns to create clean, scalable, and maintainable backend code.
---

## 🧠 Design Patterns Used

### 1. **Modular Architecture**
- Code is grouped by domain (e.g., `users`, `auth`) rather than by type (e.g., all models in one folder).
- Promotes separation of concerns and scalability.

---

### 2. **Controller-Service Pattern**
- Inspired by the layered architecture (also known as Onion or Clean Architecture).
- Components:
  - **Controller (Router)**: Handles HTTP requests and delegates to services.
  - **Service**: Contains core business logic.
  - **Model**: Handles DB interactions.

---

### 3. **Dependency Injection (DI)**
- Uses FastAPI's `Depends()` to inject service classes into routes.
- Improves modularity and makes testing easier (e.g., mocking services).

### 4. DTO Pattern (Data Transfer Objects) with Pydantic
- All request and response payloads are defined using Pydantic models.
- Ensures input validation and output serialization.

```python
# Example
class UserCreate(BaseModel):
    username: str
    email: EmailStr

class UserOut(BaseModel):
    id: int
    username: str
```

## Control Flow 
- Client sends POST /users
- Controller (users/controller.py) receives and validates the request.
- Service (users/service.py) handles business logic.
- Model (users/model.py) interacts with the DB.
- Schema (users/schema.py) defines input/output validation and serialization.

## 🛠️ Technologies
1. FastAPI – Web framework
2. Pydantic – Data validation
3. SQLAlchemy / ORM – Database interaction
4. Uvicorn – ASGI server
5. Dependency Injection – Using FastAPI's `Depends`

