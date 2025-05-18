few_shots = [
    {
        "Question": "How many patients are currently in the chronic stage?",
        "SQLQuery": "SELECT COUNT(*) FROM patient WHERE hepatitis_b_stage = 'chronic';",
        "SQLResult": "203",
        "Answer": "There are 203 patients in the chronic stage."
    },
    {
        "Question": "List all regions with more than 50 registered patients.",
        "SQLQuery": "SELECT region FROM patient GROUP BY region HAVING COUNT(*) > 50;",
        "SQLResult": "['Dodoma', 'Mwanza', 'Arusha']",
        "Answer": "Regions with more than 50 registered patients are Dodoma, Mwanza, and Arusha."
    },
    {
        "Question": "What is the average age of vaccinated patients?",
        "SQLQuery": "SELECT AVG(EXTRACT(year FROM AGE(NOW(), dob))) FROM patient WHERE vaccination_status = TRUE;",
        "SQLResult": "36.2",
        "Answer": "The average age of vaccinated patients is 36.2 years."
    },
    {
        "Question": "How many female patients were registered in 2024?",
        "SQLQuery": "SELECT COUNT(*) FROM patient WHERE gender = 'F' AND EXTRACT(YEAR FROM registration_date) = 2024;",
        "SQLResult": "78",
        "Answer": "78 female patients were registered in 2024."
    },
    {
        "Question": "Show the number of vaccinated and unvaccinated patients grouped by stage.",
        "SQLQuery": "SELECT hepatitis_b_stage, SUM(CASE WHEN vaccination_status = TRUE THEN 1 ELSE 0 END) AS vaccinated, SUM(CASE WHEN vaccination_status = FALSE THEN 1 ELSE 0 END) AS unvaccinated FROM patient GROUP BY hepatitis_b_stage;",
        "SQLResult": "[[acute, 34, 12], [chronic, 110, 90]]",
        "Answer": "Each stage includes both vaccinated and unvaccinated patient counts."
    },
    {
        "Question": "Which region has the youngest patient?",
        "SQLQuery": "SELECT region FROM patient ORDER BY dob DESC LIMIT 1;",
        "SQLResult": "Singida",
        "Answer": "The youngest patient is from Singida."
    },
    {
        "Question": "How many patients were registered in the last 7 days?",
        "SQLQuery": "SELECT COUNT(*) FROM patient WHERE registration_date >= NOW() - INTERVAL '7 days';",
        "SQLResult": "28",
        "Answer": "28 patients were registered in the last 7 days."
    },
    {
        "Question": "How many patients are between 30 and 45 years old and not vaccinated?",
        "SQLQuery": "SELECT COUNT(*) FROM patient WHERE EXTRACT(year FROM AGE(NOW(), dob)) BETWEEN 30 AND 45 AND vaccination_status = FALSE;",
        "SQLResult": "43",
        "Answer": "There are 43 unvaccinated patients aged between 30 and 45."
    },
    {
        "Question": "What percentage of all patients are female?",
        "SQLQuery": "SELECT ROUND(100.0 * (SELECT COUNT(*) FROM patient WHERE gender = 'F') / (SELECT COUNT(*) FROM patient), 2);",
        "SQLResult": "52.38",
        "Answer": "52.38% of all patients are female."
    },
    {
        "Question": "Which three regions have the highest number of vaccinated patients?",
        "SQLQuery": "SELECT region FROM patient WHERE vaccination_status = TRUE GROUP BY region ORDER BY COUNT(*) DESC LIMIT 3;",
        "SQLResult": "['Mwanza', 'Dar es Salaam', 'Dodoma']",
        "Answer": "Mwanza, Dar es Salaam, and Dodoma have the most vaccinated patients."
    },
    {
        "Question": "What regions have patients?",
        "SQLQuery": "SELECT DISTINCT region FROM patient;",
        "SQLResult": "['Dar es Salaam', 'Dodoma', 'Mwanza', 'Arusha', 'Kilimanjaro']",
        "Answer": "Patients are found in Dar es Salaam, Dodoma, Mwanza, Arusha, and Kilimanjaro."
    }
]
