#!/usr/bin/env node
/**
 * PreToolUse hook — component edits must go through the /new-component skill.
 *
 * Blocks Edit/Write on packages/design-system/src/components/*.tsx unless the
 * new-component skill has been invoked in this session. The skill carries the
 * full methodology (stories, showcase, CHANGELOG, MCP metadata, version bumps),
 * and skipping it is how phases get silently dropped.
 *
 * Reads the hook payload on stdin and answers with a PreToolUse permission
 * decision. Any internal failure allows the tool through — a broken hook must
 * not block work.
 */

import { readFileSync } from "fs";

const GUARDED_DIR = "packages/design-system/src/components/";
const SKILL_NAME = "new-component";

function allow() {
    process.exit(0);
}

function deny(reason) {
    process.stdout.write(
        JSON.stringify({
            hookSpecificOutput: {
                hookEventName: "PreToolUse",
                permissionDecision: "deny",
                permissionDecisionReason: reason,
            },
        })
    );
    process.exit(0);
}

function readStdin() {
    try {
        return readFileSync(0, "utf-8");
    } catch {
        return "";
    }
}

/** True when this session already invoked the skill (tool call or slash command). */
function skillWasInvoked(transcriptPath) {
    if (!transcriptPath) return false;

    let raw;
    try {
        raw = readFileSync(transcriptPath, "utf-8");
    } catch {
        return false;
    }

    for (const line of raw.split("\n")) {
        if (!line.trim() || !line.includes(SKILL_NAME)) continue;

        let entry;
        try {
            entry = JSON.parse(line);
        } catch {
            continue;
        }

        const content = entry?.message?.content;

        // Slash command: the user typed /new-component
        if (typeof content === "string" && content.includes(`<command-name>${SKILL_NAME}`)) {
            return true;
        }

        if (!Array.isArray(content)) continue;

        for (const block of content) {
            // Skill tool call
            if (block?.type === "tool_use" && block?.name === "Skill") {
                if (String(block?.input?.skill ?? "").includes(SKILL_NAME)) return true;
            }
            // Slash command expanded into a user text block
            if (block?.type === "text" && String(block.text ?? "").includes(`<command-name>${SKILL_NAME}`)) {
                return true;
            }
        }
    }

    return false;
}

const input = readStdin();
if (!input) allow();

let payload;
try {
    payload = JSON.parse(input);
} catch {
    allow();
}

const filePath = String(payload?.tool_input?.file_path ?? "").replace(/\\/g, "/");
const isGuarded = filePath.includes(GUARDED_DIR) && filePath.endsWith(".tsx");

if (!isGuarded) allow();

if (skillWasInvoked(payload?.transcript_path)) allow();

deny(
    `Design system component files are edited through the ${SKILL_NAME} skill, which carries the full methodology — stories, showcase, CHANGELOG, MCP metadata and version bumps — and its phase gates.\n\n` +
        `Invoke the skill first (Skill tool, skill: "${SKILL_NAME}", args: the component name), then edit ${filePath.split("/").pop()} inside its Edit Mode flow.\n\n` +
        `Blocked by .claude/hooks/require-component-skill.mjs — see docs/creating-components.md.`
);
