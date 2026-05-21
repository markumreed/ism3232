# ISM3232

# Business Application Development for Information Systems

**Course Outline | 16 Weeks | Hybrid | Undergraduate | Python + OOP + SQL + Streamlit + GenAI**

---

## Course Information

| Item                          | Description                                                                  |
| ----------------------------- | ---------------------------------------------------------------------------- |
| Course                        | ISM3232: Business Application Development                                    |
| Credits                       | 3 credit hours                                                               |
| Level                         | Junior/Senior undergraduate                                                  |
| Format                        | Hybrid: in-person coding studio + asynchronous online support                |
| Duration                      | 16 weeks                                                                     |
| Primary Language              | Python                                                                       |
| Required Programming Paradigm | Object-Oriented Programming                                                  |
| Data Language                 | SQL                                                                          |
| Main Business Tool Framework  | Streamlit                                                                    |
| API Framework                 | FastAPI, limited conceptual unit                                             |
| Optional Enrichment           | Flet                                                                         |
| AI Component                  | GenAI-assisted development and one GenAI-supported business workflow feature |
| Final Product                 | A working business information system / automation prototype                 |

---

# Course Overview

This course teaches students how to design and build practical business information systems using **Python, object-oriented programming, SQL, Streamlit, GitHub, and responsible GenAI workflows**.

Students begin by reviewing and rebuilding foundational computing and programming skills from ISM2411: files, folders, directory trees, paths, command line navigation, running scripts, variables, conditionals, loops, lists, dictionaries, functions, debugging, and basic project organization. These skills are re-taught because many students enter the course with limited programming and command-line experience.

Students then move into business application development through object-oriented programming, SQL databases, file and document automation, Streamlit-based internal tools, API concepts through FastAPI, and GenAI-assisted workflow support.

By the end of the course, students will build a working business application prototype that:

1. Supports a clear business process.
2. Uses Python business logic.
3. Includes object-oriented design.
4. Stores and queries records using SQL.
5. Provides a Streamlit interface.
6. Includes one automation feature.
7. Includes one responsible GenAI-supported feature.
8. Is documented and submitted through GitHub.

---

# Course Identity

This is **not primarily an analytics course**.

This is **not a full-stack web engineering course**.

This is:

> **A business information systems development course where students learn to build small internal tools, automation scripts, SQL-backed business systems, and AI-supported workflow prototypes.**

The central course question is:

> **How do we turn a business process into a working information system?**

---

# Required Texts and Resources

| Abbr.            | Resource                                              | Role in Course                                                                                        |
| ---------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| ATBS             | *Automate the Boring Stuff with Python*               | Primary applied reading for Python scripting, automation, files, SQL, and business productivity tools |
| ATBS-WB          | *Automate the Boring Stuff Workbook*                  | Assignments, practice exercises, quiz preparation, code tracing, debugging drills, and mini-projects  |
| TP               | *Think Python*                                        | Conceptual support and primary OOP reference                                                          |
| Instructor Notes | SQL, Streamlit, FastAPI, GenAI policy, business cases | Covers course-specific BIS applications                                                               |
| Streamlit Docs   | Streamlit documentation                               | Reference for building internal business tools                                                        |
| FastAPI Docs     | FastAPI documentation                                 | Reference for API/backend concepts                                                                    |

## Core Reading Strategy

| Resource                      | Main Use                                                                                                                                                      |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Automate the Boring Stuff** | Practical Python, scripting, automation, files, folders, regex, command-line programs, SQLite, documents, spreadsheets, scheduling, and email/text automation |
| **Automate Workbook**         | Weekly practice, quizzes, short coding drills, applied exercises                                                                                              |
| **Think Python**              | Deeper conceptual explanation, especially functions, iteration, dictionaries, files, classes, methods, objects, and inheritance                               |

---

# Major Course Themes

| Theme                 | Course Meaning                                                                                     |
| --------------------- | -------------------------------------------------------------------------------------------------- |
| Computing foundations | Students understand files, folders, paths, terminal commands, and project structure                |
| Python scripting      | Students write scripts that solve business problems                                                |
| OOP                   | Students model business entities using classes, objects, attributes, and methods                   |
| SQL                   | Students store, query, update, and report on business records                                      |
| Automation            | Students automate repetitive information work                                                      |
| Streamlit             | Students turn scripts into usable business tools                                                   |
| FastAPI               | Students understand how systems expose functionality through APIs                                  |
| GenAI                 | Students use AI as explainer, debugger, documentation assistant, tester, and final-project feature |
| GitHub                | Students document, version, and present their work professionally                                  |

---

# Assessment

| Component                           | Weight | Notes                                                                             |
| ----------------------------------- | -----: | --------------------------------------------------------------------------------- |
| Weekly Coding Assignments + Quizzes |    35% | Short weekly assignments and comprehension quizzes; one lowest grade dropped      |
| GitHub Portfolio Checkpoints        |    10% | Repo structure, README quality, commit history, screenshots                       |
| Midterm Practical                   |    20% | Cumulative over all re-taught ISM2411 foundation material covered before the exam |
| Business Application Capstone       |    30% | OOP + SQL + Streamlit + automation + GenAI feature                                |
| Participation / In-Class Work       |     5% | Live coding, peer review, AI literacy activities, final demo participation        |

---

# Weekly Quiz Policy

| Item                | Policy                                                                                         |
| ------------------- | ---------------------------------------------------------------------------------------------- |
| Format              | 5-10 questions per week                                                                        |
| Question Types      | Multiple choice, code tracing, SQL tracing, OOP concept checks, debugging interpretation       |
| Delivery            | Canvas or paper                                                                                |
| Time Limit          | 10-15 minutes                                                                                  |
| Notes               | Closed notes unless otherwise stated                                                           |
| Purpose             | Low-stakes comprehension check                                                                 |
| Retakes             | No retakes                                                                                     |
| Drop Policy         | One lowest weekly assignment/quiz grade dropped                                                |
| Midterm Connection  | Any re-taught ISM2411 foundation material covered before the midterm may appear on the midterm |
| Capstone Connection | Weeks 10-15 concepts support the final project                                                 |

## Revised Midterm-Eligible Policy

Weekly quizzes are cumulative. Questions from any **ISM2411 foundation material re-taught, reviewed, practiced, assigned, or assessed in ISM3232 before the midterm** may appear on the midterm verbatim or with minor variation.

This includes:

* Files, folders, directories, and paths
* Directory trees and project organization
* Command line basics
* Python setup and running scripts
* Variables and data types
* Strings, numbers, booleans
* Input and output
* Operators and expressions
* Conditionals
* Loops
* Lists
* Dictionaries
* Functions
* Debugging and tracebacks
* Basic file reading/writing, if reviewed before the exam
* GitHub basics, if reviewed before the exam
* AI use policy and debugging workflow
* Any OOP or SQL topic only if explicitly taught before the midterm

---

# Unit 1: Computing and Python Foundations

**Weeks 1-4 | Build technical confidence before application development**

---

## Week 1: Computers, Files, Folders, and Directory Trees

| Category            | Details                                                                                              |
| ------------------- | ---------------------------------------------------------------------------------------------------- |
| Main Question       | Where does my code live, and how does my computer organize files?                                    |
| Topics              | Computers, files, folders, directories, paths, file extensions, project structure, what a program is |
| Reading             | TP Ch. 1; instructor notes                                                                           |
| Workbook / Practice | Instructor-created file/path practice                                                                |
| GenAI Role          | No GenAI yet; students need basic environment confidence first                                       |
| Student Output      | Create course folder structure and explain directory tree                                            |
| Assignment          | Submit screenshot of organized ISM3232 folder structure                                              |

Suggested folder structure:

```text
ism3232/
  week01/
  week02/
  projects/
  data/
  notes/
```

---

## Week 2: Command Line, Python Setup, and Running Scripts

| Category            | Details                                                                                              |
| ------------------- | ---------------------------------------------------------------------------------------------------- |
| Main Question       | How do I move around my computer and run a program?                                                  |
| Topics              | Terminal, `cd`, `ls` / `dir`, `pwd`, `mkdir`, relative paths, absolute paths, running Python scripts |
| Reading             | ATBS Ch. 1; ATBS Ch. 12 selected sections                                                            |
| Workbook / Practice | ATBS-WB Ch. 1; selected Ch. 12 practice                                                              |
| GenAI Role          | No code generation; AI may explain terminal vocabulary only                                          |
| Student Output      | Run first Python script from terminal                                                                |
| Assignment          | Create, run, and submit first Python business script                                                 |

Example:

```python
print("Welcome to ISM3232")
print("This script ran successfully.")
```

---

## Week 3: Variables, Data Types, Input, and Output

| Category            | Details                                                                         |
| ------------------- | ------------------------------------------------------------------------------- |
| Main Question       | How does a program store and display business information?                      |
| Topics              | Variables, strings, integers, floats, booleans, `print()`, `input()`, f-strings |
| Reading             | ATBS Ch. 1; TP Ch. 2                                                            |
| Workbook / Practice | ATBS-WB Ch. 1                                                                   |
| GenAI Role          | AI as explainer for syntax errors only                                          |
| Student Output      | Business calculator                                                             |
| Assignment          | Build a price, quantity, and total cost calculator                              |

Example:

```python
product_name = "Laptop"
price = 899.99
quantity = 3
total = price * quantity

print(f"{product_name} total: ${total:.2f}")
```

---

## Week 4: Operators, Conditionals, and Business Rules

| Category            | Details                                                                             |
| ------------------- | ----------------------------------------------------------------------------------- |
| Main Question       | How do programs make business decisions?                                            |
| Topics              | Arithmetic operators, comparison operators, logical operators, `if`, `elif`, `else` |
| Reading             | ATBS Ch. 2; TP Ch. 5 selected sections                                              |
| Workbook / Practice | ATBS-WB Ch. 2                                                                       |
| GenAI Role          | AI may explain conditional logic after students attempt the problem                 |
| Student Output      | Approval or eligibility checker                                                     |
| Assignment          | Build a business rule checker for discounts, approvals, or eligibility              |

Example:

```python
request_amount = 1200

if request_amount > 1000:
    print("Manager approval required")
else:
    print("Auto-approved")
```

---

# Unit 2: Python Business Logic and Structured Programs

**Weeks 5-8 | Write scripts that process business records and introduce AI responsibly**

---

## Week 5: Loops, Lists, and Repeated Business Processes

| Category            | Details                                                                        |
| ------------------- | ------------------------------------------------------------------------------ |
| Main Question       | How do programs process many records instead of one?                           |
| Topics              | Lists, `for` loops, `while` loops, `break`, `continue`, totals, counts         |
| Reading             | ATBS Ch. 3 and Ch. 6; TP Ch. 7 and Ch. 9                                       |
| Workbook / Practice | ATBS-WB Ch. 3 and Ch. 6                                                        |
| GenAI Role          | AI can explain loop output after student code tracing                          |
| Student Output      | Process a list of business transactions                                        |
| Assignment          | Calculate totals, counts, and flags from a list of requests, sales, or tickets |

---

## Week 6: Dictionaries and Business Records

| Category            | Details                                                                                |
| ------------------- | -------------------------------------------------------------------------------------- |
| Main Question       | How do we represent a business record in code?                                         |
| Topics              | Dictionaries, key-value pairs, nested records, lists of dictionaries, updating records |
| Reading             | ATBS Ch. 7; TP Ch. 10                                                                  |
| Workbook / Practice | ATBS-WB Ch. 7                                                                          |
| GenAI Role          | AI may explain dictionary errors and key lookup problems                               |
| Student Output      | Create and process business records                                                    |
| Assignment          | Build a list of request, ticket, product, or customer records                          |

Example:

```python
request = {
    "id": 101,
    "requester": "Taylor",
    "category": "Travel",
    "amount": 1200,
    "status": "Pending"
}
```

---

## Week 7: Functions, Modules, Debugging, and AI Literacy

| Category            | Details                                                                             |
| ------------------- | ----------------------------------------------------------------------------------- |
| Main Question       | How do we organize code into reusable business logic?                               |
| Topics              | Functions, parameters, return values, modules, tracebacks, debugging with `print()` |
| Reading             | ATBS Ch. 4 and Ch. 5; TP Ch. 3 and Ch. 6                                            |
| Workbook / Practice | ATBS-WB Ch. 4 and Ch. 5                                                             |
| GenAI Role          | Formal AI literacy activity: Debug First, Then Ask                                  |
| Student Output      | Reusable business functions and debugging reflection                                |
| Assignment          | Fix a broken business script and submit AI reflection                               |

Required AI activity:

```text
Debug First, Then Ask

Step 1: Try to debug independently using traceback and print statements.
Step 2: Ask AI to explain the error message only.
Step 3: Fix the code yourself.
Step 4: Write what was wrong, what AI explained, and how you tested the fix.
```

---

## Week 8: Files, GitHub, README Files, and Midterm Review

| Category            | Details                                                                                                                                         |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Main Question       | How do we organize code projects and prepare for cumulative assessment?                                                                         |
| Topics              | Basic file reading/writing, project folders, GitHub repositories, README files, commit messages, screenshots, AI use statements, midterm review |
| Reading             | ATBS Ch. 10, Ch. 11, Ch. 12 selected sections; TP Ch. 13 selected                                                                               |
| Workbook / Practice | ATBS-WB Ch. 10, Ch. 11, selected Ch. 12                                                                                                         |
| GenAI Role          | AI may help draft README text, but student must edit and disclose use                                                                           |
| Student Output      | First complete GitHub project                                                                                                                   |
| Assignment          | Submit a GitHub repo with Python script, README, screenshots, and AI use statement                                                              |

Required repo structure:

```text
business-rule-checker/
  README.md
  main.py
  data/
  screenshots/
  reflection.md
```

---

# Midterm Practical Exam

**Administered around Week 9**

## Midterm Purpose

The midterm ensures students have the foundational computing and programming skills needed for the second half of the course.

Because ISM3232 re-teaches foundational ISM2411 material, the midterm may include **any re-taught ISM2411 content covered before the exam**, even if that material is technically prerequisite review.

## Midterm Coverage

| Area                                   | Included                                        |
| -------------------------------------- | ----------------------------------------------- |
| Files, folders, paths, directory trees | Yes                                             |
| Command line basics                    | Yes                                             |
| Python setup and running scripts       | Yes                                             |
| Variables and data types               | Yes                                             |
| Strings, numbers, booleans             | Yes                                             |
| Input and output                       | Yes                                             |
| Operators and expressions              | Yes                                             |
| Conditionals                           | Yes                                             |
| Loops                                  | Yes                                             |
| Lists                                  | Yes                                             |
| Dictionaries                           | Yes                                             |
| Functions                              | Yes                                             |
| Debugging and tracebacks               | Yes                                             |
| Basic file reading/writing             | Yes, if reviewed before exam                    |
| GitHub basics                          | Yes, if reviewed before exam                    |
| AI use policy and debugging workflow   | Yes                                             |
| OOP                                    | Only if explicitly taught before midterm        |
| SQL                                    | Only if explicitly taught before midterm        |
| Streamlit                              | No, unless explicitly introduced before midterm |

## Midterm Structure

| Section                                     | Weight | Description                                                                 |
| ------------------------------------------- | -----: | --------------------------------------------------------------------------- |
| Section A: Multiple Choice / Concept Checks |    30% | Files, folders, paths, command line, Python concepts, GitHub, AI use policy |
| Section B: Code Tracing                     |    25% | Predict the output of Python snippets                                       |
| Section C: Fix the Bug                      |    25% | Read an error, identify the issue, and correct a small program              |
| Section D: Short Coding Prompt              |    20% | Write or complete a small business-focused Python program                   |

---

# Unit 3: Object-Oriented Business Application Design

**Weeks 10-11 | Model business entities using classes and objects**

---

## Week 10: OOP I — Classes, Objects, Attributes, and Methods

| Category            | Details                                                                                       |
| ------------------- | --------------------------------------------------------------------------------------------- |
| Main Question       | How do we model real business entities in code?                                               |
| Topics              | Classes, objects, attributes, methods, `__init__`, object state                               |
| Reading             | TP Ch. 14 and Ch. 15                                                                          |
| Workbook / Practice | Instructor OOP practice                                                                       |
| GenAI Role          | AI may explain class/object relationships; no generated class submissions without explanation |
| Student Output      | Business entity class                                                                         |
| Assignment          | Create a class such as `BusinessRequest`, `Ticket`, `Product`, or `Application`               |

Example:

```python
class BusinessRequest:
    def __init__(self, request_id, requester, category, amount):
        self.request_id = request_id
        self.requester = requester
        self.category = category
        self.amount = amount
        self.status = "Pending"

    def approve(self):
        self.status = "Approved"

    def requires_manager_review(self):
        return self.amount > 1000
```

---

## Week 11: OOP II — Composition, Manager Classes, and Light Inheritance

| Category            | Details                                                                                                       |
| ------------------- | ------------------------------------------------------------------------------------------------------------- |
| Main Question       | How do objects work together inside a business system?                                                        |
| Topics              | Composition, manager classes, lists of objects, light inheritance, object methods that enforce business rules |
| Reading             | TP Ch. 16 and selected Ch. 17                                                                                 |
| Workbook / Practice | Instructor OOP practice                                                                                       |
| GenAI Role          | AI may review class design after the student writes the first version                                         |
| Student Output      | Multi-class business system                                                                                   |
| Assignment          | Build a manager class that stores and processes business objects                                              |

Example:

```python
class RequestManager:
    def __init__(self):
        self.requests = []

    def add_request(self, request):
        self.requests.append(request)

    def list_pending_requests(self):
        return [request for request in self.requests if request.status == "Pending"]

    def total_requested_amount(self):
        return sum(request.amount for request in self.requests)
```

---

# Unit 4: Files, Text, Automation, and SQL

**Weeks 12-14 | Automate information work and store business records**

---

## Week 12: Strings, Regular Expressions, Files, and Business Automation

| Category            | Details                                                                                                                                 |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Main Question       | How do business systems process, validate, and automate information work?                                                               |
| Topics              | Strings, string methods, regular expressions, reading/writing files, organizing files, CSV/JSON/XML, selected Excel/PDF/Word automation |
| Reading             | ATBS Ch. 8, Ch. 9, Ch. 10, Ch. 11, Ch. 14, Ch. 17, Ch. 18 selected sections; TP Ch. 8 and Ch. 13 selected                               |
| Workbook / Practice | Selected ATBS-WB chapters                                                                                                               |
| GenAI Role          | AI may help explain regex patterns, draft test cases, or suggest processing steps                                                       |
| Student Output      | Business automation script                                                                                                              |
| Assignment          | Choose one automation: file organizer, CSV processor, Excel report, PDF/Word extractor, or JSON processor                               |

---

## Week 13: SQL and SQLite Foundations

| Category            | Details                                                                                     |
| ------------------- | ------------------------------------------------------------------------------------------- |
| Main Question       | How do business systems store records reliably?                                             |
| Topics              | Databases, tables, rows, columns, primary keys, `CREATE TABLE`, `INSERT`, `SELECT`, `WHERE` |
| Reading             | ATBS Ch. 16; TP Ch. 13 selected                                                             |
| Workbook / Practice | ATBS-WB Ch. 16 selected                                                                     |
| GenAI Role          | AI may explain SQL queries, but students must verify results                                |
| Student Output      | SQLite database for business records                                                        |
| Assignment          | Create a database for requests, tickets, products, applications, or compliance items        |

Example:

```sql
CREATE TABLE requests (
    id INTEGER PRIMARY KEY,
    requester TEXT,
    category TEXT,
    amount REAL,
    status TEXT
);
```

---

## Week 14: Python + SQL Integration and Operational Reports

| Category            | Details                                                                                                |
| ------------------- | ------------------------------------------------------------------------------------------------------ |
| Main Question       | How does Python read and write records in a database?                                                  |
| Topics              | Python `sqlite3`, parameterized queries, add/search/update records, filters, aggregates, basic reports |
| Reading             | ATBS Ch. 16; instructor SQL notes                                                                      |
| Workbook / Practice | ATBS-WB Ch. 16 selected                                                                                |
| GenAI Role          | AI may suggest test data and edge cases                                                                |
| Student Output      | Python functions that interact with SQLite                                                             |
| Assignment          | Build database functions for add, view, update, search, and report                                     |

Example operational query:

```sql
SELECT status, COUNT(*) AS total_requests
FROM requests
GROUP BY status;
```

---

# Unit 5: Business Tool Prototyping, APIs, and GenAI Features

**Weeks 15-16 | Turn the system into a usable business tool**

---

## Week 15: Streamlit Business Tool + FastAPI Concepts

| Category            | Details                                                                                                                               |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Main Question       | How do we turn scripts into usable business tools and expose functionality through APIs?                                              |
| Topics              | Streamlit forms, buttons, tables, filters, status messages, SQLite integration, FastAPI routes, JSON, `GET`, `POST`, request/response |
| Reading             | Streamlit docs; FastAPI selected docs; instructor notes                                                                               |
| Workbook / Practice | Instructor app-building assignment                                                                                                    |
| GenAI Role          | AI may improve user-facing text and generate test scenarios                                                                           |
| Student Output      | Streamlit business tool prototype and simple FastAPI demonstration                                                                    |
| Assignment          | Build a Streamlit interface for the SQL-backed business system                                                                        |

Minimum Streamlit features:

```text
1. Add a record
2. View records
3. Filter records
4. Update status
5. Display an operational report
```

FastAPI is introduced conceptually, not as the primary final-project requirement:

```python
@app.get("/requests")
def get_requests():
    return {"message": "Return all requests"}
```

---

## Week 16: GenAI Feature, Capstone Demos, and Portfolio Submission

| Category            | Details                                                                                                                            |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Main Question       | How can GenAI responsibly support a business workflow?                                                                             |
| Topics              | GenAI summaries, classifications, drafts, checklists, missing-field detection, privacy, hallucination, human review, AI disclosure |
| Reading             | Instructor GenAI policy and examples                                                                                               |
| Workbook / Practice | Capstone                                                                                                                           |
| GenAI Role          | Required final-project feature                                                                                                     |
| Student Output      | Final business information system prototype                                                                                        |
| Assignment          | Final GitHub repo, README, Streamlit app, SQL database, OOP classes, GenAI feature, presentation                                   |

---

# GenAI-Assisted Development Curriculum

GenAI is threaded through the course rather than isolated in one week.

| Stage   | Weeks | AI Role                                     | Student Responsibility                                                   |
| ------- | ----: | ------------------------------------------- | ------------------------------------------------------------------------ |
| Stage 1 |   3-6 | Explainer                                   | Ask AI to explain syntax, errors, and concepts after attempting the work |
| Stage 2 |     7 | Debugging assistant                         | Debug first, ask AI for explanation second, fix independently            |
| Stage 3 |  8-14 | Documentation, testing, refactoring support | Use AI for README drafts, test cases, edge cases, and explanations       |
| Stage 4 | 15-16 | Application feature                         | Build one controlled AI-supported feature into the business tool         |

Acceptable AI uses:

```text
Explain this error message without giving me the corrected code.
Explain what this function does line by line.
Suggest test cases for this approval rule.
Draft a README section for this project.
Suggest edge cases for this SQL query.
Summarize this business request using only the fields provided.
Classify this ticket as low, medium, or high urgency and explain why.
```

Not acceptable:

```text
Write the entire assignment for me.
Fix this code and give me the final answer.
Create my final project.
Generate code I cannot explain.
Use private or sensitive data in a public AI tool.
```

Required AI Use Statement for major assignments:

```text
AI Use Statement

1. I used AI for:
2. The prompts I used were:
3. I accepted these suggestions:
4. I changed or rejected these suggestions:
5. I tested the final result by:
6. I can explain the submitted code:
```

---

# Capstone Project

## Capstone Identity

The final project is a **business information system prototype**, not an analytics notebook.

Students build a small internal business tool that includes:

1. Python business logic
2. Object-oriented design
3. SQL database
4. Streamlit interface
5. One automation feature
6. One GenAI-supported feature
7. GitHub documentation
8. Final code walkthrough

---

## Approved Capstone Options

| Project                              | Business Workflow                               | Required Classes                              | GenAI Feature                                       |
| ------------------------------------ | ----------------------------------------------- | --------------------------------------------- | --------------------------------------------------- |
| Internship Application Tracker       | Submit, review, approve internship applications | `InternshipApplication`, `ApplicationManager` | Summarize application and flag missing requirements |
| Helpdesk Ticket System               | Create, assign, update, close support tickets   | `Ticket`, `TicketManager`                     | Classify urgency and draft response                 |
| Procurement Request Tracker          | Submit, review, approve purchase requests       | `PurchaseRequest`, `ApprovalWorkflow`         | Generate approval checklist                         |
| Inventory Reorder Tool               | Track products and low-stock items              | `Product`, `InventoryManager`                 | Explain reorder risk                                |
| Compliance Checklist Tool            | Track documentation and evidence                | `ComplianceItem`, `ComplianceTracker`         | Summarize missing evidence                          |
| Student Research Application Tracker | Manage applicants and review status             | `ResearchApplication`, `ReviewManager`        | Summarize applicant fit                             |

---

## Required Capstone Repo Structure

```text
final-project/
  README.md
  app.py
  models.py
  database.py
  ai_feature.py
  automation.py
  requirements.txt
  data/
  screenshots/
  reflection.md
```

---

## Required Capstone Features

| Requirement       | Description                                                                |
| ----------------- | -------------------------------------------------------------------------- |
| Business workflow | The app supports a clear business process                                  |
| OOP               | At least two custom classes                                                |
| SQL               | SQLite database with at least one main table                               |
| Streamlit         | User interface for adding, viewing, filtering, and updating records        |
| Automation        | File, report, document, email, scheduling, or CSV/JSON automation          |
| GenAI             | One controlled AI-supported workflow feature                               |
| GitHub            | Clean repo with commit history                                             |
| README            | Setup instructions, feature summary, screenshots                           |
| AI Use Statement  | Clear disclosure of AI use                                                 |
| Code Walkthrough  | Student explains major files, functions, classes, database, and AI feature |

---

## Capstone Rubric

| Criterion                                 | Weight |
| ----------------------------------------- | -----: |
| Functional business workflow              |    15% |
| OOP design and implementation             |    15% |
| Python code quality and organization      |    10% |
| SQL database design and queries           |    15% |
| Streamlit interface usability             |    15% |
| Automation feature                        |    10% |
| GenAI feature and responsible AI controls |    10% |
| GitHub repo, README, and documentation    |     5% |
| Final presentation and code walkthrough   |     5% |

---

# Recommended Teaching Rhythm

Each week should follow the same pattern:

```text
1. Business problem
2. Technical concept
3. Instructor live coding
4. Student code-along
5. Small modification task
6. Debugging or AI-assisted reflection
7. GitHub commit or submission
8. Short quiz
```

This structure matters because students are entering with limited programming and command-line experience. Repetition is not a weakness in this course; it is the core teaching strategy.

---

# Clean Course Description

**ISM3232: Business Application Development for Information Systems** teaches students how to build practical business information systems using Python, object-oriented programming, SQL, Streamlit, GitHub, and responsible GenAI workflows. Students learn how to organize files and folders, run scripts, write reusable business logic, model business entities with classes, store and query records, automate information tasks, build usable internal tools, understand API concepts, and incorporate GenAI responsibly into business workflows. The course culminates in a working business application prototype and professional GitHub portfolio.

---

# Final Course Spine

```text
Files and folders
→ command line
→ Python scripts
→ business rules
→ lists and dictionaries
→ functions
→ debugging and AI literacy
→ GitHub
→ cumulative midterm over re-taught ISM2411 foundations
→ OOP business entities
→ files/text/document automation
→ SQL databases
→ Python + SQL integration
→ Streamlit business tool
→ FastAPI concepts
→ GenAI workflow feature
→ final business information system prototype
```


