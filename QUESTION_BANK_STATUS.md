# Question Bank Status

## Implemented now
- 14 subject files.
- Exact uploaded quota: 135 questions.
- 120-minute duration.
- New criminal laws: BNS, BNSS and BSA.
- One starter question for every required slot in the uploaded blueprint.
- Deterministic subject-wise daily mock generator.

## Current limitation
The current bank contains exactly 135 questions, equal to one full uploaded blueprint. Therefore every day currently contains the same 135 questions in a different deterministic order.

A genuinely different daily mock requires each subject pool to contain more questions than its daily quota. The architecture is already designed for this: add more questions to the corresponding subject file and the generator will select a different quota-preserving set for each date.

## Target
Build toward 3,000+ validated questions before calling the daily mocks genuinely different at scale.
