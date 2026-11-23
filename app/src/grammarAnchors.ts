/** Ids of the places on a topic's grammar page that have their own address (see routing.ts). */

/** One rule: …/gramatyka/<ruleId>. */
export const ruleAnchor = (ruleId: string) => `rule-${ruleId}`;

/** The group of tasks in the test that check one rule. */
export const tasksAnchor = (ruleId: string) => `task-group-${ruleId}`;

/** One task of the test: …/gramatyka/test/<taskId>. */
export const taskAnchor = (taskId: string) => `task-${taskId}`;

/** The whole test: …/gramatyka/test. */
export const TEST_ANCHOR = 'grammar-test';
