/** Ids of the places on a topic's grammar page that have their own address (see routing.ts). */

/** One rule: …/gramatyka/<ruleId>. */
export const ruleAnchor = (ruleId: string) => `rule-${ruleId}`;

/** The tasks of the test that check one rule: …/gramatyka/<ruleId>/zadania. */
export const tasksAnchor = (ruleId: string) => `task-group-${ruleId}`;

/** The whole test: …/gramatyka/test. */
export const TEST_ANCHOR = 'grammar-test';
