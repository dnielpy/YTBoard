---
description: Describe when these instructions should be loaded
# applyTo: 'Describe when these instructions should be loaded' # when provided, instructions will automatically be added to the request context when the pattern matches an attached file
---

# Global Assistant Rules (for Cascade)

## IMPORTANT

You have acces to Context7 MCP. Before suggesting any code changes, you must check the Context7 MCP for documentation of the technologies, frameworks you will use.

## 0. Scope

These rules apply globally unless a workspace rule overrides them.
Every time you use one of these rules, you will display a message in your response that says something like "Rule used: <rule_name>"

---

## 1. Analyze before suggesting or writing code

- Before proposing changes, **search the repository** for existing implementations of the same behavior.
- If matching files exist, **follow their standards, conventions, and structure**.
- **Do not introduce new architectural patterns** unless the exact pattern already exists in the codebase.
- If you are unsure whether a pattern exists, list the files you checked.

---

## 2. Handling base components used in multiple places

- If a base component (A) is used by multiple consumers (B, C, D):
  1. **Never modify A** to work around a single failing consumer (D) without justification.
  2. Investigate why D fails with A and produce **two explicit options**:
     - **Option 1:** Fix D so it conforms to A (describe changes required in D).
     - **Option 2:** Explain why A and D are incompatible (list concrete incompatibilities) and propose a safe alternative (e.g., extend A or create a new component).
  3. When recommending Option 2, include migration cost and risks.

---

## 3. Creating new components

- Before creating a new component, **state the goal** in one sentence.
- **Search for similar components or behaviors** in the project; if found, prefer reuse or extension.
- If reusing is impossible, explain briefly why and outline the minimal new component interface and tests.

---

## 4. Explaining concepts and code (response template)

When asked "explain this", follow this exact output structure:

1. **One-line concept summary** (same technology as the project).
2. **Short illustrative example** (minimal, same tech).
3. **What the error/issue is** (one short paragraph).
4. **Why it happens** (concise root cause).
5. **Why the proposed solution is better** and **how it follows project standards** (short list).
6. **Exact code changes or steps** needed (diff sketch or bullet list).

---

## 5. Performance and tooling

- **Never run the project linter automatically** (e.g., ESLint, Prettier, TypeScript checks, or similar), as it consumes unnecessary resources.
- Only refer to linting issues if they are explicitly visible in the code being edited.
- Do not trigger builds or tests automatically unless I request it.

## 6. Translation messages

- Whenever I tell you “add the texts to the translation JSONs,” you will look for all hardcoded texts in the file, add them to es.json and en.json, ensuring they are placed in the correct section. If the section doesn’t exist, create it. Then you’ll go to the file, import the translation function, and replace the hardcoded texts with the translation function.
