# GST Mitra Scrutiny UI

`GST Mitra Scrutiny UI` is a React-based desktop-style frontend for the GST scrutiny workflow used by CGST & CX, Bhilai. It helps users enter a GSTIN, choose a return type, upload the required source files, generate scrutiny reports, and review the generated report set from a single interface.

The application is built with React, Chakra UI, and a custom theme layer, and is designed to work with a local backend service running on `http://localhost:8000`.

## What the app does

- Captures a GSTIN and validates its format before enabling key actions.
- Supports multiple GST return and related document types from a single intake flow.
- Enforces file-type rules per return type before upload.
- Lists uploaded files for the selected GSTIN and return type.
- Triggers report generation with an optional `ASMT-10` report toggle.
- Displays generated report filenames and opens the report folder through the backend.
- Includes light/dark mode support and keyboard-accessible navigation.

## Supported return types

- `GSTR-1`
- `GSTR-2A`
- `GSTR-2B`
- `GSTR-3B`
- `GSTR-9`
- `GSTR-9C`
- `EWB-IN`
- `EWB-OUT`
- `BO comparison summary`

## File format rules

- `GSTR-3B`, `GSTR-9`, `GSTR-9C`: PDF only (`.pdf`)
- `GSTR-1`, `GSTR-2A`, `GSTR-2B`, `BO comparison summary`: Excel only (`.xlsx`)
- `EWB-IN`, `EWB-OUT`: Excel legacy format (`.xls`)

## Backend integration

The frontend expects a backend server on `http://localhost:8000` with endpoints used by the UI:

- `POST /upload/`
- `GET /files/`
- `DELETE /delete/`
- `POST /generate_reports/`
- `GET /reports/`
- `GET /check-open-reports/`
- `POST /open-reports-folder/`

The UI will not function correctly unless this service is running and these endpoints are available.

## Tech stack

- React 19
- Chakra UI
- Emotion
- Framer Motion
- React Scripts (Create React App toolchain)
- `xlsx`
- `axios`

## Project structure

```text
src/
  App.js
  index.js
  index.css
  theme.js
  components/
    Topbar.js
    Rail.js
    IdentityStrip.js
    UploadPanel.js
    UploadedFiles.js
    GenerateReportsAction.js
    Reports.js
    Footer.js
```

## Getting started

### Prerequisites

- Node.js 18 or later recommended
- npm
- Local GST Mitra backend running on `http://localhost:8000`

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm start
```

The app will open in development mode at `http://localhost:3000`.

## Available scripts

### `npm start`

Runs the app in development mode.

### `npm test`

Starts the test runner in watch mode.

### `npm run build`

Creates a production build in the `build/` directory.

### `npm run eject`

Ejects the Create React App configuration. This is irreversible and usually not needed.

## Typical workflow

1. Start the backend service on `localhost:8000`.
2. Run the frontend with `npm start`.
3. Enter a valid GSTIN.
4. Select the relevant return type.
5. Upload the required files for that return type.
6. Optionally enable the `ASMT-10` report toggle.
7. Generate reports.
8. Open the reports folder or review the generated report list in the UI.

## Notes

- Upload and report generation actions stay disabled until the GSTIN is valid.
- Switching the return type clears the current file selection so the format rules remain consistent.
- Report generation checks whether report files are already open to reduce permission-related failures.

## Ownership

Designed and developed by `CGST & CX, Bhilai`.
