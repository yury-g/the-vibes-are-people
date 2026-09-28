# Contributing records and corrections

1. Identify the person and exact role: author, co-creator, educator, resident, student, exhibitor, fund recipient, or another supported relationship.
2. Link the source and state what it supports. Keep dates unspecified if the evidence does not give them. Do not infer collaboration from shared institutions or awards from exhibition participation.
3. Add checked relationships to `research/checked-relationships.json`. Recipe attribution belongs in `dist/notes/ingredients/technique-provenance.json`; an affiliation alone does not establish technique authorship.
4. Rebuild with `node scripts/build-connections.mjs` and `node scripts/export-research.mjs`. Commit the generated files as well as the source edit.
5. Run the data checks in the README. Run browser checks when changing presentation or navigation.

New names are matched exactly; investigate aliases rather than merging similar names automatically. Keep external-source evidence and imported claims distinguishable. Do not contribute private alumni-list contents, unpublished correspondence, credentials or personal records.

Issues and pull requests are public. Application-language drafts are project documentation and require editorial review before submission.
