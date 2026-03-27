# FAQ Chatbot (Django + Vanilla JS Widget)

A lightweight, development-ready FAQ chatbot with a Django REST API backend and a drop‑in frontend widget. Type a question, the API finds the best matching FAQ using simple keyword logic, and responds instantly. Ideal for rapid prototyping and local demos.

---

## Features
- Simple Django REST API endpoint: `/api/v1/chat/`
- FAQ model with keywords for quick matching
- Vanilla JS widget you can embed in any static page
- CORS enabled for local development
- Chat history persisted per tab via `sessionStorage`
- Widget starts closed (bubble only); opens on bubble click

---

## Quickstart

### 1) Clone and enter the project
```bash
git clone <your-repo-url>
cd faq-chatbot
```

### 2) Create and activate a virtual environment (recommended)
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3) Install dependencies
```bash
pip install -r requirements.txt
```

### 4) Apply migrations
```bash
python manage.py migrate
```

### 5) (Optional) Create a superuser to access Django Admin
```bash
python manage.py createsuperuser
```

### 6) Run the development server
```bash
python manage.py runserver
```

Backend is now live at `http://127.0.0.1:8000/`.

---

## Seed some FAQs
Use the Django Admin or the shell to create FAQs so the chatbot can answer.

### Using Django Admin
1. Visit `http://127.0.0.1:8000/admin/`
2. Log in with your superuser
3. Add entries under `FAQs`
   - Question: e.g., "How do I reset my password?"
   - Answer: e.g., "Go to Settings → Security → Reset Password."
   - Keywords (comma-separated): e.g., `reset,password,account`

### Using Django Shell
```bash
python manage.py shell
```
```python
from api.models import FAQ
FAQ.objects.create(
    question="How do I reset my password?",
    answer="Go to Settings → Security → Reset Password.",
    keywords="reset,password,account"
)
```

---

## Try the Frontend Widget

1. Start the backend: `python manage.py runserver`
2. Open `frontend-widget/index.html` in your browser (double-click to open or drag into a tab)
3. Click the chat bubble (bottom-right) to open the window, type a question, hit Send

The widget posts to `http://127.0.0.1:8000/api/v1/chat/` and renders the answer. CORS is enabled for dev.

Tip: Keep your browser console open to see network logs and any errors.

---

## Widget behavior
- Initial state: only the bubble is visible; the chat window stays hidden until clicked.
- Close behavior: clicking × hides the window and shows the bubble again.
- Persistence: messages are saved in `sessionStorage` and restored on reload within the same tab/session.
- Fallback handling: if the question isn’t found in the FAQ, the widget shows a fallback response (e.g., ticket creation) and stays open. Conversation history is preserved.

---

## Commands Overview

```bash
# Create venv
python3 -m venv venv

# Activate venv (macOS/Linux)
source venv/bin/activate

# Install deps
pip install -r requirements.txt

# DB setup
python manage.py migrate

# Run server
python manage.py runserver

# (Optional) Create admin user
python manage.py createsuperuser
```

---

## Project Structure

```
faq-chatbot/
  api/                 # Django app (models, views, serializers, urls)
  backend/             # Django project settings and root urls
  frontend-widget/     # Drop-in HTML/CSS/JS widget
  manage.py            # Django CLI entry point
  requirements.txt     # Python dependencies
```

---

## Notes for Development
- This project is configured for local development: `DEBUG=True`, permissive CORS.
- The matching is keyword-based and simplistic; punctuation and multi-word phrases may need refinement.
- The widget controls the bubble/window visibility itself; avoid adding duplicate click/submit handlers elsewhere.

---

## Troubleshooting
- If you see a CORS or network error, confirm the server is running at `127.0.0.1:8000`.
- If responses are always the default, check your FAQ `keywords` and add more entries.
- If the chat window closes/minimizes unexpectedly:
  - Hard refresh with cache bypass (Cmd/Ctrl+Shift+R).
  - Ensure there are no duplicate event listeners or scripts re-rendering `#chatbot-container`.
  - Check for global key/click handlers in your host page that might hide elements.
  - Clear `sessionStorage` for the tab and retry.
- Check the browser console for fetch errors and the Django server logs for request traces.

---

## License
For development and prototyping. Customize and adapt as needed.

