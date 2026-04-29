# AICord Age Attestation Module (AAAM)

## Privacy is a Human Right. Age Verification shouldn't be Surveillance.
AAAM is a client-side, privacy-preserving age estimation module built for AICord's web application. It allows fulfilling "Highly Effective Age Assurance" (HEAA) requirements (UK Online Safety Act / EU Digital Services Act / US State Laws) without ever collecting, storing, or transmitting biometric data.

## The Philosophy
Traditional age verification is a border checkpoint. It requires users to surrender their ID or face-data to centralized honeypots. AICord rejects this.

* Zero-Knowledge: We verify that you are an adult, not who you are.

* Local Execution: 100% of the facial inference happens in the user's browser (WebAssembly/TensorFlow.js).

* Ephemeral: The video stream never leaves the device's RAM and is destroyed instantly upon verification.

* Open Source: We provide the source code so users can verify that no "backdoor" surveillance is taking place. Contributions or ideas are also welcome.

## Technical Architecture
This module utilizes `face-api.js` to perform local, in-browser biometric inference.

* Local Estimation: The browser loads pre-trained weights to estimate age based on facial landmarks.

* Server-Side Attestation: The age estimation result is sent to a secure backend route.

## SHA-256 Checksum of module
`fdf37286b09d33f9dad287ed810bc22465ad2f0dd9be865ce3044290fe8f90f3`

