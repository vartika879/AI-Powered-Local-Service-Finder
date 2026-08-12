# 📍 Local Service Finder

A location-aware local service discovery application that helps users find relevant nearby services through a combination of **manually stored service data and external AI/web search APIs**.

The system first checks its local service database. If a matching service is available, it returns the stored information. If no suitable result is found, the application falls back to **Groq and Serper APIs** to discover additional service information.

---

## 🎯 Problem Statement

Finding local services such as tutors, mechanics, electricians, salons, doctors, repair services, etc. often requires searching across multiple platforms.

This project explores a simple but practical approach to solving this problem by combining:

* A local service dataset
* API-based web search
* AI-powered processing
* Location-based service discovery

The goal is to provide users with relevant service results through a single interface.

---

## ⚙️ How It Works

The application follows a **local-first + API fallback architecture**.

```text
                    User Query
                        │
                        ▼
               ┌─────────────────┐
               │  Search Request  │
               └────────┬────────┘
                        │
                        ▼
               ┌─────────────────┐
               │ Local Service   │
               │     Data        │
               └────────┬────────┘
                        │
                 Match Found?
                   /          \
                 YES           NO
                  │             │
                  ▼             ▼
          ┌─────────────┐   ┌─────────────┐
          │ Return      │   │ Serper API  │
          │ Local Data  │   └──────┬──────┘
          └──────┬──────┘          │
                 │                 ▼
                 │          ┌─────────────┐
                 │          │  Groq API   │
                 │          └──────┬──────┘
                 │                 │
                 └────────┬────────┘
                          ▼
                  ┌───────────────┐
                  │ Display       │
                  │ Service       │
                  │ Results       │
                  └───────────────┘
```

### Local-First Approach

The application does not immediately call external APIs for every search.

It first checks the manually stored service data.

If relevant information exists:

> The application returns the locally stored service information.

If no suitable service is found:

> The application uses Serper for web search and Groq for AI-based processing of the retrieved information.

This reduces unnecessary external API calls and provides a fallback mechanism when local data is insufficient.

---

## ✨ Key Features

### 🔎 Local Service Search

Users can search for different types of local services based on their requirements.

### 🗃️ Local Service Dataset

A manually created dataset is used as the first source of service information.

### 🔄 API Fallback

When a suitable local result is not available, the application falls back to external APIs.

### 🌐 Web Search with Serper

Serper API is used to retrieve relevant web search results when local data does not contain a suitable match.

### 🧠 AI Processing with Groq

Groq is used to process and structure the retrieved information before presenting it to the user.

### 📍 Location-Oriented Discovery

The application is designed around discovering services relevant to a particular location.

### 📱 Service Information

Service results may contain information such as:

* Service name
* Category
* Location
* Description
* Contact information

> **Note:** The contact numbers displayed in the current version are dummy/demo numbers and should not be treated as real contact information.

---

## 🏗️ Architecture

```text
┌───────────────────────┐
│        Frontend       │
│   HTML / CSS / JS     │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│    Search Request     │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│   Local Service Data  │
└───────────┬───────────┘
            │
       Match Found?
       /           \
     YES            NO
      │              │
      │              ▼
      │       ┌──────────────┐
      │       │ Serper API   │
      │       └──────┬───────┘
      │              │
      │              ▼
      │       ┌──────────────┐
      │       │  Groq API    │
      │       └──────┬───────┘
      │              │
      └──────┬───────┘
             ▼
      ┌───────────────┐
      │ Search Results│
      └───────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

* HTML
* CSS
* JavaScript

### AI / APIs

* Groq API
* Serper API

### Data

* Manually stored local service data

### Development

* VS Code
* Git
* GitHub

---

## 🔐 API Security

External API credentials should be stored using environment variables.

Example:

```env
GROQ_API_KEY=your_api_key
SERPER_API_KEY=your_api_key
```

The `.env` file should **never be committed to GitHub**.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone YOUR_REPOSITORY_URL
cd local-service-finder
```

### 2. Install dependencies

Install the dependencies required by the project.

```bash
pip install -r requirements.txt
```

> If the project uses a different dependency setup, follow the project's configuration.

### 3. Configure environment variables

Create a `.env` file and add your API credentials:

```env
GROQ_API_KEY=your_api_key
SERPER_API_KEY=your_api_key
```

### 4. Run the application

Start the application using the appropriate command for the project.

---

## 🧪 Current Project Limitations

The current version is primarily a prototype and has some limitations:

* Local service information is manually stored.
* External API results depend on the availability and quality of search results.
* Contact numbers shown in the prototype are dummy numbers.
* The application does not currently verify service providers.
* Google Maps API is not integrated yet.
* The system does not currently provide real-time service availability.

These limitations are intentionally documented to distinguish the current prototype from a production-ready service marketplace.

---

## 🔮 Future Improvements

The project can be evolved into a more production-grade service discovery platform.

### 🗺️ Google Maps Integration

Integrate Google Maps APIs to provide:

* Real service locations
* Accurate coordinates
* Distance calculation
* Directions
* Map-based discovery

### 🤖 AI-Based Query Understanding

Use an LLM to understand natural-language queries such as:

```text
"I need an affordable electrician near Gomti Nagar
who is available today."
```

The system could extract:

```text
Service → Electrician
Location → Gomti Nagar
Preference → Affordable
Availability → Today
```

### 🎯 Intelligent Ranking

Rank services using multiple factors:

```text
Relevance
+ Distance
+ User Preferences
+ Rating
+ Availability
```

### 🔍 Verified Service Providers

Introduce provider verification instead of relying entirely on web search results.

### 🧠 Semantic Search

Replace simple matching with embedding-based semantic retrieval for the local service dataset.

### 🤖 Agentic Architecture

The system could eventually use an AI agent that decides when to:

```text
Search Local Data
       ↓
Search Web
       ↓
Extract Service Information
       ↓
Verify Information
       ↓
Rank Results
       ↓
Return Final Recommendations
```

---

## 📌 Project Status

**Current Status:** Prototype

The current version demonstrates a **local-first service discovery system with an API fallback mechanism using Serper and Groq**.

The architecture is designed so that additional capabilities such as Google Maps, semantic search, service verification, and AI agents can be integrated in future versions.

---

## 👩‍💻 Author

### Vartika Gupta

Interested in building practical systems in:

* Generative AI
* AI Agents
* LangChain
* LangGraph
* RAG
* Data Analytics

---

## ⭐ Future Vision

The long-term vision is to transform this prototype into a **production-grade AI-powered local service discovery agent** that can search, verify, rank, and recommend relevant service providers using real-world location and service data.
