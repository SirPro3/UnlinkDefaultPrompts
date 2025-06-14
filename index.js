import { PromptManager, chatCompletionDefaultPrompts } from '../../PromptManager.js';

// A set of the default prompt identifiers for quick lookups
const defaultPromptIdentifiers = new Set(chatCompletionDefaultPrompts.prompts.map(p => p.identifier));

// Override the original isPromptDeletionAllowed method
PromptManager.prototype.isPromptDeletionAllowed = function(prompt) {
    // Original logic is: return false === prompt.system_prompt;
    // We will change it to always return true, allowing all prompts to be deleted/unlinked.
    return true;
};

// Store the original detachPrompt method
const originalDetachPrompt = PromptManager.prototype.detachPrompt;

// Override the detachPrompt method
PromptManager.prototype.detachPrompt = function(prompt, character) {
    // Call the original method
    originalDetachPrompt.call(this, prompt, character);

    // If the prompt was a system prompt, mark it as a user prompt so it appears in the dropdown
    if (defaultPromptIdentifiers.has(prompt.identifier)) {
        prompt.system_prompt = false;
    }
};

// Store the original appendPrompt method
const originalAppendPrompt = PromptManager.prototype.appendPrompt;

// Override the appendPrompt method
PromptManager.prototype.appendPrompt = function(prompt, character) {
    // Call the original method
    originalAppendPrompt.call(this, prompt, character);

    // If the prompt is a default prompt, mark it as a system prompt again so it's removed from the dropdown
    if (defaultPromptIdentifiers.has(prompt.identifier)) {
        prompt.system_prompt = true;
    }
};