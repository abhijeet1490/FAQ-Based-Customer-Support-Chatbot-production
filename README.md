# FAQ-Based Customer Support Chatbot

A robust, production-ready Django API tailored to provide instant, automated customer support. The system efficiently parses incoming queries, retrieves relevant Frequently Asked Questions using keyword matching, and dynamically handles unresolvable queries by automatically creating and assigning support tickets to human agents.

## 🚀 Features
- **Intelligent Query Matching:** Processes user inputs against predefined, localized FAQs.
- **Automated Ticket Generation:** Generates a persistent database record for unmatched queries to ensure no inquiry is missed.
- **RESTful Architecture:** Built on Django REST Framework (DRF) for clean, composable JSON API endpoints.
- **Production Tuned:** Configured with `WhiteNoise` for efficient static file serving, `python-dotenv` for secure 12-factor configuration, and `Gunicorn` as a rock-solid WSGI server.
- **Interactive Web Client:** Includes a vanilla HTML/CSS/JS frontend widget for seamless testing and demonstration.

## 💻 Tech Stack
- **Backend Core:** Python 3.10, Django 5.1.x, Django REST Framework
- **Frontend Integrations:** Vanilla HTML5, CSS3, JavaScript
- **DevOps & Infrastructure:** Gunicorn, WhiteNoise, bash script automation
- **Database:** SQLite (Configured to quickly migrate to PostgreSQL via `dj-database-url` in standard deployments)

---

## 🛠 Local Setup

### Prerequisites
- Python 3.10+
- Git

### Installation
1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd FAQ-Based-Customer-Support-Chatbot-production
   ```

2. **Create a virtual environment and install dependencies:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. **Configure Environment Variables:**
   See the [Environment Variables Setup](#-environment-variables-setup) section below.

4. **Run Database Migrations:**
   ```bash
   python manage.py migrate
   ```

5. **Start the Development Server:**
   ```bash
   python manage.py runserver
   ```
   *The interactive widget is accessible by opening the `./frontend-widget/index.html` file in your browser.*

---

## 🔐 Environment Variables Setup

Create a `.env` file in the root repository directory. This ensures the protection of secrets on production servers.

```bash
# Keep this key strictly confidential!
SECRET_KEY=your_secure_randomly_generated_long_string

# For Local Development set to 'True'. Ensure it is 'False' in production.
DEBUG=False

# Optional: Add DATABASE_URL to migrate off SQLite (PostgreSQL URL expected)
# DATABASE_URL=postgres://user:password@hostname:5432/dbname
```

---

## ☁️ Render Deployment Steps

Deploying to [Render.com](https://render.com) is quick and highly automated in this project.

### Option A: Infrastructure as Code (Recommended)
This repository includes a `render.yaml` configuration that allows Render to auto-configure itself.
1. Push this code to a new repository on GitHub.
2. Log in to the Render Dashboard.
3. Click **New** -> **Blueprint**.
4. Connect your GitHub repository.
5. Render will detect the Web Service structure, provision the container, use the local `./build.sh` script, and gracefully start the server via Gunicorn. 

### Option B: Manual Setup via Render UI
1. Go to the Render Dashboard and click **New** -> **Web Service**.
2. Connect your GitHub repository.
3. Configure the essential details:
    - **Language:** Python 3
    - **Build Command:** `./build.sh`
    - **Start Command:** `gunicorn backend.wsgi:application`
4. Expand **Environment Variables** and add:
    - `PYTHON_VERSION` : `3.10.13`
    - `SECRET_KEY` : *(Generate a long, random string of characters)*
    - `DEBUG` : `False`
5. Click **Deploy Web Service**.

> **Note on Render Persistence:** Free tier machines use ephemeral storage. Modifying `backend/settings.py` to accept PostgreSQL using `dj-database-url` is highly recommended for persistent data in a production scale.

---

## 📡 Example API Usage

The backend API handles all the heavy lifting and can be utilized independently as a microservice.

### `POST /api/v1/chat/`
Send a user inquiry inside a JSON payload body to receive the correct response from the chatbot or trigger a support ticket.

**Request:**
```bash
curl -X POST http://127.0.0.1:8000/api/v1/chat/ \
     -H "Content-Type: application/json" \
     -d '{"message": "What are your business hours?"}'
```

**Response (Successful Match):**
```json
{
    "answer": "Our business hours are Monday through Friday, 9:00 AM to 5:00 PM EST."
}
```

**Response (Fallback - Auto-generated Ticket):**
```json
{
    "answer": "I couldn't find an answer for your question. I have created a support ticket for you. Your ticket number is: 1ab8e2ef... A human agent will get back to you shortly."
}
```
