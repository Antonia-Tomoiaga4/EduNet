# EduNet Backend - Java Spring Boot API

Backend REST API pentru platforma EduNet de management al cursurilor academice.

## Structura Proiectului

```
src/
├── main/
│   ├── java/com/edunet/
│   │   ├── controller/      # REST Controllers
│   │   ├── service/         # Business logic
│   │   ├── repository/      # Data access
│   │   ├── entity/          # JPA Entities
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── security/        # JWT & Security
│   │   └── EduNetBackendApplication.java
│   └── resources/
│       └── application.yml  # Configuration
└── test/
```

## Setup & Installation

### Prerequisite
- Java 17+
- Maven 3.9+
- MySQL 8.0+

### 1. Setup Database
```sql
CREATE DATABASE edunet CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Configure Application
Edit `src/main/resources/application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/edunet?useSSL=false&serverTimezone=UTC
    username: root
    password: your_password
```

### 3. Build Project
```bash
mvn clean install
```

### 4. Run Application
```bash
mvn spring-boot:run
```

API va fi disponibil la: `http://localhost:8080/api`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Înregistrare utilizator
- `POST /api/auth/login` - Login
- `GET /api/auth/user/{id}` - Get user by ID
- `GET /api/auth/user/email/{email}` - Get user by email

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/{id}` - Get course by ID
- `POST /api/courses` - Create course (Professor only)
- `GET /api/courses/professor/{professorId}` - Get professor's courses
- `GET /api/courses/student/{studentId}` - Get student's courses
- `POST /api/courses/{courseId}/enroll/{studentId}` - Enroll student
- `DELETE /api/courses/{id}` - Delete course

### Assignments
- `POST /api/assignments` - Create assignment
- `GET /api/assignments/{id}` - Get assignment
- `GET /api/assignments/course/{courseId}` - Get course assignments
- `GET /api/assignments/student/{studentId}` - Get student's assignments
- `DELETE /api/assignments/{id}` - Delete assignment

### Submissions
- `POST /api/submissions` - Submit assignment
- `GET /api/submissions/assignment/{assignmentId}` - Get all submissions
- `GET /api/submissions/assignment/{assignmentId}/student/{studentId}` - Get student submission
- `POST /api/submissions/{submissionId}/grade` - Grade submission

### Quizzes
- `POST /api/quizzes` - Create quiz
- `GET /api/quizzes/{id}` - Get quiz
- `GET /api/quizzes/course/{courseId}` - Get course quizzes
- `GET /api/quizzes/student/{studentId}` - Get student's quizzes
- `DELETE /api/quizzes/{id}` - Delete quiz

### Quiz Results
- `POST /api/quiz-results` - Submit quiz answers
- `GET /api/quiz-results/{quizId}/student/{studentId}` - Get student's quiz result

## Authentication

API uses JWT tokens. Include in header:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

## Database Schema

### Users
```sql
- id (PK)
- email (UNIQUE)
- password (hashed)
- name
- role (STUDENT/PROFESSOR)
- created_at
```

### Courses
```sql
- id (PK)
- title
- description
- professor_id (FK)
- created_at
- students (many-to-many)
```

### Assignments
```sql
- id (PK)
- course_id (FK)
- title
- description
- due_date
- professor_id (FK)
- created_at
```

### Quizzes
```sql
- id (PK)
- course_id (FK)
- title
- description
- professor_id (FK)
- created_at
```

## Technologies Used
- Spring Boot 3.2
- Spring Data JPA
- Spring Security
- JWT (JSON Web Tokens)
- MySQL
- Lombok
- Maven

## License
MIT
