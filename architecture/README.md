# Architecture SOPs

This folder contains **Layer 1: Technical SOPs** written in Markdown.

## Purpose
Define goals, inputs, tool logic, and edge cases for each system component.

## Golden Rule
**If logic changes, update the SOP before updating the code.**

## Template for Each SOP

Create one `.md` file for each major system component:

```markdown
# [Component Name] SOP

## Goal
[What does this component accomplish?]

## Inputs
[What data does it receive?]

## Process
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Outputs
[What does it produce?]

## Edge Cases
- [Case 1]: [How to handle]
- [Case 2]: [How to handle]

## Tools Used
- `tools/[script_name].py`

## Dependencies
- [External API or service]
- [Environment variables needed]

## Error Handling
[How failures are caught and resolved]

## Last Updated
YYYY-MM-DD by [Name]
```
