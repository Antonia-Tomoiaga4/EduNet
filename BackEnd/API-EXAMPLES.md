# EduNet Backend - API Documentation

## Request/Response Examples

### 1. Register User
**Request:**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123",
    "name": "Ana Marinescu",
    "role": "STUDENT"
  }'
```

**Response:**
```json
{
  "id": 1,
  "name": "Ana Marinescu",
  "email": "student@example.com",
  "role": "STUDENT"
}
```

### 2. Login
**Request:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Ana Marinescu",
    "email": "student@example.com",
    "role": "STUDENT"
  }
}
```

### 3. Create Course (Professor)
**Request:**
```bash
curl -X POST http://localhost:8080/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Introducere în Programare",
    "description": "Curs introductiv despre conceptele fundamentale",
    "professorId": 2
  }'
```

### 4. Create Assignment
**Request:**
```bash
curl -X POST http://localhost:8080/api/assignments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "courseId": 1,
    "title": "Tema 1",
    "description": "Implementați bubble sort",
    "dueDate": 1734720000000,
    "professorId": 2
  }'
```

### 5. Submit Assignment
**Request:**
```bash
curl -X POST http://localhost:8080/api/submissions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "assignmentId": 1,
    "studentId": 1,
    "content": "Am implementat algoritmul Bubble Sort..."
  }'
```

### 6. Create Quiz
**Request:**
```bash
curl -X POST http://localhost:8080/api/quizzes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "courseId": 1,
    "title": "Quiz 1 - Concepte de bază",
    "description": "Testează cunoștințele...",
    "professorId": 2,
    "questions": [
      {
        "question": "Ce este o variabilă?",
        "options": ["Un loc în memorie", "O funcție", "O buclă", "O sortare"],
        "correctAnswer": 0
      }
    ]
  }'
```

### 7. Submit Quiz
**Request:**
```bash
curl -X POST http://localhost:8080/api/quiz-results \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "quizId": 1,
    "studentId": 1,
    "answers": [0, 3, 1]
  }'
```

## Error Responses

### 401 Unauthorized
```json
{
  "timestamp": "2024-01-16T10:00:00Z",
  "status": 401,
  "error": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "timestamp": "2024-01-16T10:00:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "Course not found"
}
```

### 400 Bad Request
```json
{
  "timestamp": "2024-01-16T10:00:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Invalid request data"
}
```

## Notes
- All timestamps are in milliseconds (Unix epoch)
- Passwords are automatically hashed using BCrypt
- JWT tokens expire after 24 hours
- CORS is enabled for frontend localhost URLs
