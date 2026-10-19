# Agent Guidelines — Tidewise Maritime Intelligence

- Keep voyage defaults, port identifiers, numeric constraints, and payload normalization in the shared maritime model module (`src/components/maritime/model.ts`) so the form and constraint tests adhere to the same contract.
- Keep prediction requests strictly in the frontend; results display only returned model values from the FastAPI inference engine (`http://localhost:8000/predict`), and report exports use those values without client-side mock inferences.
