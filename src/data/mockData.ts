import type { Course, Assignment, Quiz } from '../App';

export const mockCourses: Course[] = [
    {
        id: '1',
        title: 'Introducere în Programare',
        description: 'Curs introductiv despre conceptele fundamentale ale programării și algoritmilor.',
        professorId: 'prof1',
        professorName: 'Prof. Dr. Maria Ionescu',
        createdAt: '2024-01-15T10:00:00Z',
        files: [
            { id: 'f1', name: 'Curs 1 - Introducere.pdf', url: '#', size: '2.4 MB' },
            { id: 'f2', name: 'Curs 2 - Variabile și Tipuri.pdf', url: '#', size: '1.8 MB' },
            { id: 'f3', name: 'Exemple de cod.zip', url: '#', size: '850 KB' },
        ],
    },
    {
        id: '2',
        title: 'Structuri de Date',
        description: 'Studiul structurilor de date fundamentale și implementarea lor în practică.',
        professorId: 'prof1',
        professorName: 'Prof. Dr. Maria Ionescu',
        createdAt: '2024-02-01T10:00:00Z',
        files: [
            { id: 'f4', name: 'Liste și Array-uri.pdf', url: '#', size: '3.1 MB' },
            { id: 'f5', name: 'Arbori și Grafuri.pdf', url: '#', size: '4.2 MB' },
        ],
    },
    {
        id: '3',
        title: 'Baze de Date',
        description: 'Concepte fundamentale despre bazele de date relaționale și SQL.',
        professorId: 'prof2',
        professorName: 'Prof. Dr. Alexandru Popescu',
        createdAt: '2024-01-20T10:00:00Z',
        files: [
            { id: 'f6', name: 'Introducere SQL.pdf', url: '#', size: '2.9 MB' },
            { id: 'f7', name: 'Normalizare.pdf', url: '#', size: '1.5 MB' },
            { id: 'f8', name: 'Exerciții SQL.pdf', url: '#', size: '1.2 MB' },
        ],
    },
];

export const mockAssignments: Assignment[] = [
    {
        id: 'a1',
        courseId: '1',
        courseName: 'Introducere în Programare',
        title: 'Tema 1 - Algoritmi de sortare',
        description: 'Implementați algoritmii Bubble Sort, Quick Sort și Merge Sort. Comparați performanțele acestora pe diferite seturi de date.',
        dueDate: '2024-12-15T23:59:00Z',
        professorId: 'prof1',
        submissions: [
            {
                id: 's1',
                studentId: 'student1',
                studentName: 'Ana Marinescu',
                content: 'Am implementat toți cei 3 algoritmi. Quick Sort este cel mai rapid pe date random, dar Merge Sort este mai stabil.',
                submittedAt: '2024-12-10T14:30:00Z',
            },
        ],
    },
    {
        id: 'a2',
        courseId: '2',
        courseName: 'Structuri de Date',
        title: 'Tema 2 - Implementare listă dublu înlănțuită',
        description: 'Creați o clasă pentru listă dublu înlănțuită cu operații de inserare, ștergere și căutare.',
        dueDate: '2024-12-20T23:59:00Z',
        professorId: 'prof1',
        submissions: [],
    },
    {
        id: 'a3',
        courseId: '3',
        courseName: 'Baze de Date',
        title: 'Proiect - Design bază de date',
        description: 'Proiectați schema unei baze de date pentru un sistem de management al unei biblioteci universitare.',
        dueDate: '2024-12-25T23:59:00Z',
        professorId: 'prof2',
        submissions: [
            {
                id: 's2',
                studentId: 'student2',
                studentName: 'Mihai Gheorghe',
                content: 'Am creat schema cu tabele pentru: cărți, utilizatori, împrumuturi, autori. Am aplicat normalizarea până la forma 3NF.',
                submittedAt: '2024-12-08T16:45:00Z',
            },
        ],
    },
];

export const mockQuizzes: Quiz[] = [
    {
        id: 'q1',
        courseId: '1',
        courseName: 'Introducere în Programare',
        title: 'Quiz 1 - Concepte de bază',
        description: 'Testează cunoștințele despre conceptele fundamentale ale programării.',
        professorId: 'prof1',
        createdAt: '2024-11-01T10:00:00Z',
        questions: [
            {
                id: 'q1-1',
                question: 'Ce este o variabilă în programare?',
                options: [
                    'Un loc în memorie unde se stochează date',
                    'O funcție care returnează valori',
                    'Un tip de bucle',
                    'O metodă de sortare',
                ],
                correctAnswer: 0,
            },
            {
                id: 'q1-2',
                question: 'Care dintre următoarele NU este un tip de date primitiv?',
                options: [
                    'Integer',
                    'String',
                    'Boolean',
                    'Array',
                ],
                correctAnswer: 3,
            },
            {
                id: 'q1-3',
                question: 'Ce face o buclă "for"?',
                options: [
                    'Creează o funcție',
                    'Repetă un bloc de cod de mai multe ori',
                    'Definește o variabilă',
                    'Compară două valori',
                ],
                correctAnswer: 1,
            },
        ],
    },
    {
        id: 'q2',
        courseId: '2',
        courseName: 'Structuri de Date',
        title: 'Quiz 2 - Liste și array-uri',
        description: 'Verifică înțelegerea conceptelor despre liste și array-uri.',
        professorId: 'prof1',
        createdAt: '2024-11-15T10:00:00Z',
        questions: [
            {
                id: 'q2-1',
                question: 'Care este complexitatea temporală a căutării într-un array nesortat?',
                options: [
                    'O(1)',
                    'O(log n)',
                    'O(n)',
                    'O(n²)',
                ],
                correctAnswer: 2,
            },
            {
                id: 'q2-2',
                question: 'Ce avantaj au listele înlănțuite față de array-uri?',
                options: [
                    'Acces mai rapid la elemente',
                    'Inserare/ștergere mai eficientă',
                    'Utilizează mai puțină memorie',
                    'Sunt mai simple de implementat',
                ],
                correctAnswer: 1,
            },
        ],
    },
    {
        id: 'q3',
        courseId: '3',
        courseName: 'Baze de Date',
        title: 'Quiz 3 - SQL de bază',
        description: 'Teste pentru comenzile SQL fundamentale.',
        professorId: 'prof2',
        createdAt: '2024-11-20T10:00:00Z',
        questions: [
            {
                id: 'q3-1',
                question: 'Ce comandă SQL este folosită pentru a prelua date?',
                options: [
                    'GET',
                    'FETCH',
                    'SELECT',
                    'RETRIEVE',
                ],
                correctAnswer: 2,
            },
            {
                id: 'q3-2',
                question: 'Ce face comanda JOIN?',
                options: [
                    'Adaugă coloane noi',
                    'Combină rânduri din două sau mai multe tabele',
                    'Șterge date',
                    'Sortează rezultatele',
                ],
                correctAnswer: 1,
            },
            {
                id: 'q3-3',
                question: 'Ce este o cheie primară?',
                options: [
                    'O parolă pentru baza de date',
                    'Prima coloană dintr-un tabel',
                    'Un identificator unic pentru fiecare rând',
                    'Un tip de index',
                ],
                correctAnswer: 2,
            },
        ],
    },
];
