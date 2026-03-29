-- Sample Data for Testing (PostgreSQL/Supabase)

-- Insert Users
INSERT INTO users (email, password, name, role) VALUES
('prof.maria@edunet.ro', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm', 'Prof. Dr. Maria Ionescu', 'PROFESSOR'),
('prof.alex@edunet.ro', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm', 'Prof. Dr. Alexandru Popescu', 'PROFESSOR'),
('student.ana@edunet.ro', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm', 'Ana Marinescu', 'STUDENT'),
('student.mihai@edunet.ro', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm', 'Mihai Gheorghe', 'STUDENT'),
('student.ion@edunet.ro', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm', 'Ion Popescu', 'STUDENT');

-- Insert Courses
INSERT INTO courses (title, description, professor_id) VALUES
('Introducere în Programare', 'Curs introductiv despre conceptele fundamentale ale programării și algoritmilor.', 1),
('Structuri de Date', 'Studiul structurilor de date fundamentale și implementarea lor în practică.', 1),
('Baze de Date', 'Concepte fundamentale despre bazele de date relaționale și SQL.', 2);

-- Insert Course Files
INSERT INTO course_files (course_id, name, url, size) VALUES
(1, 'Curs 1 - Introducere.pdf', 'https://example.com/curs1.pdf', '2.4 MB'),
(1, 'Curs 2 - Variabile și Tipuri.pdf', 'https://example.com/curs2.pdf', '1.8 MB'),
(1, 'Exemple de cod.zip', 'https://example.com/cod.zip', '850 KB'),
(2, 'Liste și Array-uri.pdf', 'https://example.com/liste.pdf', '3.1 MB'),
(2, 'Arbori și Grafuri.pdf', 'https://example.com/arbori.pdf', '4.2 MB'),
(3, 'Introducere SQL.pdf', 'https://example.com/sql.pdf', '2.9 MB');

-- Insert Course Enrollments (Students)
INSERT INTO course_enrollments (course_id, student_id) VALUES
(1, 3), (1, 4), (1, 5),
(2, 3), (2, 4),
(3, 4), (3, 5);

-- Insert Assignments
INSERT INTO assignments (course_id, title, description, due_date, professor_id) VALUES
(1, 'Tema 1 - Algoritmi de sortare', 'Implementați algoritmii Bubble Sort, Quick Sort și Merge Sort. Comparați performanțele acestora.', 1734720000000, 1),
(2, 'Tema 2 - Implementare listă dublu înlănțuită', 'Creați o clasă pentru listă dublu înlănțuită cu operații de inserare, ștergere și căutare.', 1734892800000, 1),
(3, 'Proiect - Design bază de date', 'Proiectați schema unei baze de date pentru un sistem de management al unei biblioteci universitare.', 1735065600000, 2);

-- Insert Submissions
INSERT INTO submissions (assignment_id, student_id, content) VALUES
(1, 3, 'Am implementat toți cei 3 algoritmi. Quick Sort este cel mai rapid pe date random, dar Merge Sort este mai stabil.'),
(1, 4, 'Implementare completă cu test cases.'),
(3, 4, 'Am creat schema cu tabele pentru: cărți, utilizatori, împrumuturi, autori. Am aplicat normalizarea până la forma 3NF.');

-- Update some submissions with grades
UPDATE submissions SET grade = 9.5, feedback = 'Excelent! Cod bine structurat și eficient.' WHERE id = 1;
UPDATE submissions SET grade = 8.5, feedback = 'Bun, dar poți optimiza mai mult.' WHERE id = 2;
UPDATE submissions SET grade = 9.0, feedback = 'Schema foarte bună, bine normalizată!' WHERE id = 3;

-- Insert Quizzes
INSERT INTO quizzes (course_id, title, description, professor_id) VALUES
(1, 'Quiz 1 - Concepte de bază', 'Testează cunoștințele despre conceptele fundamentale ale programării.', 1),
(2, 'Quiz 2 - Liste și array-uri', 'Verifică înțelegerea conceptelor despre liste și array-uri.', 1);

-- Insert Questions
INSERT INTO questions (quiz_id, question, options, correct_answer) VALUES
(1, 'Ce este o variabilă în programare?', '["Un loc în memorie unde se stochează date", "O funcție care returnează valori", "Un tip de bucle", "O metodă de sortare"]', 0),
(1, 'Care dintre următoarele NU este un tip de date primitiv?', '["Integer", "String", "Boolean", "Array"]', 3),
(1, 'Ce face o buclă "for"?', '["Creează o funcție", "Repetă un bloc de cod de mai multe ori", "Definește o variabilă", "Compară două valori"]', 1),
(2, 'Care este complexitatea temporală a căutării într-un array nesortat?', '["O(1)", "O(log n)", "O(n)", "O(n²)"]', 2),
(2, 'Ce este o lista înlănțuită?', '["O structură de date statică", "O structură de date dinamică unde elementele sunt conectate prin pointeri", "Un tip de array", "O funcție"]', 1);

-- Insert Quiz Results
INSERT INTO quiz_results (quiz_id, student_id, answers, score, total_questions) VALUES
(1, 3, '[0, 3, 1]', 3, 3),
(1, 4, '[0, 3, 0]', 2, 3),
(2, 3, '[2, 1]', 2, 2);

-- Verify data
SELECT COUNT(*) as users_count FROM users;
SELECT COUNT(*) as courses_count FROM courses;
SELECT COUNT(*) as students_enrolled FROM course_enrollments;
SELECT COUNT(*) as assignments_count FROM assignments;
SELECT COUNT(*) as submissions_count FROM submissions;
SELECT COUNT(*) as quizzes_count FROM quizzes;
