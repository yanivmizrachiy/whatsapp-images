import test from 'node:test';
import assert from 'node:assert/strict';
import { readTarget, parseGithubRemote, verifyIdentity } from '../scripts/verify-project-target.mjs';

const target = { repository: 'yanivmizrachiy/whatsapp-images', vercelProjectId: 'prj_rTFamNlfAl9aup8xQW6fUKjLUAMn', productionDomain: 'harut-new.vercel.app' };
const ssot = '<!-- PROJECT_TARGET_GUARD_V1\n' + JSON.stringify(target) + '\n-->';

test('reads exactly one target from the authoritative SSOT', () => {
  assert.deepEqual(readTarget(ssot), target);
  assert.throws(() => readTarget(ssot + '\n' + ssot), /exactly one/);
  assert.throws(() => readTarget('no declaration'), /exactly one/);
});
test('recognizes HTTPS and SSH GitHub origins', () => {
  assert.equal(parseGithubRemote('https://github.com/yanivmizrachiy/whatsapp-images.git'), target.repository);
  assert.equal(parseGithubRemote('git@github.com:yanivmizrachiy/whatsapp-images.git'), target.repository);
  assert.equal(parseGithubRemote('https://example.com/yanivmizrachiy/whatsapp-images'), null);
});
test('accepts the actual matching repository and Vercel project', () => {
  const result = verifyIdentity(target, { GITHUB_REPOSITORY: target.repository, VERCEL_PROJECT_ID: target.vercelProjectId }, null, true);
  assert.equal(result.repositoryVerified, true);
  assert.equal(result.checks.length, 2);
});
test('blocks the legacy harut repo even if the project ID appears valid', () => {
  assert.throws(() => verifyIdentity(target, { GITHUB_REPOSITORY: 'yanivmizrachiy/harut', VERCEL_PROJECT_ID: target.vercelProjectId }, null, true), /different project/);
});
test('blocks a misrouted Vercel project and conflicting git origin', () => {
  assert.throws(() => verifyIdentity(target, { GITHUB_REPOSITORY: target.repository, VERCEL_PROJECT_ID: 'prj_wrong' }, null, true), /VERCEL_PROJECT_ID/);
  assert.throws(() => verifyIdentity(target, { GITHUB_REPOSITORY: target.repository }, 'git@github.com:yanivmizrachiy/harut.git', true), /git origin/);
});
test('does not pretend an unidentifiable working copy is verified', () => {
  assert.equal(verifyIdentity(target, {}, null, false).repositoryVerified, false);
  assert.throws(() => verifyIdentity(target, {}, null, true), /identity unavailable/);
});
