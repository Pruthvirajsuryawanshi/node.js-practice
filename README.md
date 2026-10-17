# Node.js Practice: File Upload API with Multer & SQLite

A practical RESTful API built with **Node.js**, **Express.js**, **Multer**, and **SQLite** for handling single and multiple file uploads, managing file storage on disk, persisting file metadata in a database, and serving uploaded files.

---

## 🚀 Features

- **Single File Upload**: Upload individual files using `multer.diskStorage` with unique timestamped filenames.
- **Multiple Files Upload**: Batch upload up to 3 files simultaneously.
- **SQLite Database Persistence**: Stores record details and file paths in a local SQLite database (`database.db`).
- **File Retrieval & Streaming**: Fetch and display uploaded images dynamically by student name using `res.sendFile`.
- **File Size Validation**: Enforces a strict 5 MB file size limit to prevent storage abuse.
- **Centralized Error Handling**: Custom middleware to catch Multer errors (e.g., `LIMIT_FILE_SIZE`) and database exceptions.
- **Live Development**: Configured with `nodemon` for instant hot-reloading during development.

---

## 📂 Project Structure

```text
node.js-practice/
│
├── Practice multer/
│   ├── uploads/               # Directory where uploaded files are saved
│   ├── database.db            # SQLite database file
│   ├── index.js               # Main Express application & API routes
│   ├── script.js              # Database initialization script (table creation)
│   ├── package.json           # Project dependencies and npm scripts
│   └── package-lock.json      # Locked versions of dependencies
│
└── README.md                  # Project documentation
```

---

## 🛠️ Tech Stack & Dependencies

| Technology | Description |
| :--- | :--- |
| **Node.js** | JavaScript runtime environment |
| **Express (v5.3.0)** | Web application framework for routing and middleware |
| **Multer (v2.4.0)** | Middleware for handling `multipart/form-data` file uploads |
| **sqlite3 & sqlite** | SQLite driver and promise-based abstraction layer |
| **Nodemon** | Development tool that monitors changes and restarts the server |

---

## ⚙️ Getting Started

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed on your machine (v18.x or later recommended).

### 2. Navigate to Project Directory
```bash
cd "Practice multer"
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Initialize Database Table
If `database.db` is empty or needs table initialization, run:
```bash
node script.js
```
This script creates the `student` table with the following schema:
```sql
CREATE TABLE student (
    name VARCHAR(200),
    PHOTO_LOCATION VARCHAR(500)
);
```

### 5. Start the Server

- **Development mode (with auto-restart)**:
  ```bash
  npm run dev
  ```
- **Production mode**:
  ```bash
  npm start
  ```

The server will start listening at:
```text
http://localhost:3000
```

---

## 📡 API Endpoints

### 1. Single Photo Upload
Uploads a single photo and stores student record and photo location into SQLite.

- **URL**: `/photos`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Body Parameter**:
  - `photo` (File, required) — Image or document file (Max: 5 MB)

**cURL Example**:
```bash
curl -X POST http://localhost:3000/photos \
  -F "photo=@/path/to/your/image.png"
```

**Response** (`200 OK`):
```text
photo uploaded successfully...
```

---

### 2. Multiple Photos Upload
Uploads up to 3 photos in a single request.

- **URL**: `/photos/multiple`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Body Parameter**:
  - `photos` (Files array, max count: 3)

**cURL Example**:
```bash
curl -X POST http://localhost:3000/photos/multiple \
  -F "photos=@/path/to/image1.png" \
  -F "photos=@/path/to/image2.jpg"
```

**Response** (`200 OK`):
```text
file uploaded successfulyy
```

---

### 3. Retrieve Photo by Student Name
Fetches the photo record associated with a student and streams the image file directly to the client.

- **URL**: `/photo`
- **Method**: `GET`
- **Query Parameter**:
  - `name` (string, required) — Name of the student (e.g., `Pruthviraj`)

**cURL Example**:
```bash
curl -X GET "http://localhost:3000/photo?name=Pruthviraj" --output downloaded_photo.png
```

**Browser / Postman**:
```text
http://localhost:3000/photo?name=Pruthviraj
```

**Response**:
- Status: `200 OK`
- Body: Image binary stream (viewable in browser or image viewer)

---

## 🛡️ Error Handling

The application contains global error handling middleware for handling Multer and server errors.

When a file exceeds the 5 MB limit:
- **HTTP Status**: `400 Bad Request`
- **Response**:
  ```json
  {
    "message": "File too large",
    "code": "LIMIT_FILE_SIZE"
  }
  ```

---

## 👤 Author
- **Pruthviraj Suryawanshi**
- GitHub: [@Pruthvirajsuryawanshi](https://github.com/Pruthvirajsuryawanshi)

## 📄 License
This project is licensed under the **ISC License**.
