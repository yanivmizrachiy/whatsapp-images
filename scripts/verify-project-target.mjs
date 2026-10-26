import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const fail = (message) => { throw new Error('PROJECT TARGET BLOCKED: ' + message); };

export function readTarget(markdown) {
  const matches = [...markdown.matchAll(/<!-- PROJECT_TARGET_GUARD_V1\s*([\s\S]*?)\s*-->/g)];
  if (matches.length !== 1) fail('expected exactly one identity declaration in SOURCE_OF_TRUTH.md');
  let target;
  try { target = JSON.parse(matches[0][1]); }
  catch { fail('invalid identity JSON in SOURCE_OF_TRUTH.md'); }
  if (!/^[\w.-]+\/[\w.-]+$/.test(target.repository || '') ||
      !/^prj_[\w]+$/.test(target.vercelProjectId || '') ||
      !/^[a-z0-9.-]+\.vercel\.app$/.test(target.productionDomain || '')) {
    fail('invalid canonical project identity fields');
  }
  return target;
}

export function parseGithubRemote(remote) {
  if (!remote) return null;
  const value = remote.trim().replace(/^git@github\.com:/, 'https://github.com/');
  try {
    const url = new URL(value);
    if (url.hostname.toLowerCase() !== 'github.com') return null;
    const parts = url.pathname.replace(/\/$/, '').replace(/\.git$/i, '').split('/').filter(Boolean);
    return parts.length === 2 ? parts.join('/') : null;
  } catch { return null; }
}

export function verifyIdentity(target, env, remote, strict = false) {
  const checked = [];
  let repositoryVerified = false;
  const check = (label, actual, expected, establishesRepository = false) => {
    if (!actual) return;
    if (String(actual).toLowerCase() !== expected.toLowerCase()) {
      fail(label + ' points to a different project (expected ' + expected + ')');
    }
    checked.push(label);
    if (establishesRepository) repositoryVerified = true;
  };
  check('GITHUB_REPOSITORY', env.GITHUB_REPOSITORY, target.repository, true);
  if (remote) {
    const parsed = parseGithubRemote(remote);
    if (!parsed) fail('origin is not an unambiguous GitHub repository URL');
    check('git origin', parsed, target.repository, true);
  }
  const [owner, slug] = target.repository.split('/');
  check('VERCEL_GIT_REPO_OWNER', env.VERCEL_GIT_REPO_OWNER, owner);
  check('VERCEL_GIT_REPO_SLUG', env.VERCEL_GIT_REPO_SLUG, slug);
  if (env.VERCEL_GIT_REPO_OWNER && env.VERCEL_GIT_REPO_SLUG) repositoryVerified = true;
  check('VERCEL_PROJECT_ID', env.VERCEL_PROJECT_ID, target.vercelProjectId);
  if (strict && !repositoryVerified) fail('repository identity unavailable; refusing to start a change');
  if (env.GITHUB_ACTIONS === 'true' && !repositoryVerified) fail('GitHub Actions lacks repository identity');
  return { repositoryVerified, checks: checked };
}

export function run(env = process.env, strict = false) {
  const target = readTarget(readFileSync(resolve(root, 'SOURCE_OF_TRUTH.md'), 'utf8'));
  let remote = null;
  try {
    remote = execFileSync('git', ['remote', 'get-url', 'origin'], {
      cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], timeout: 2000
    }).trim();
  } catch { /* An exported working tree may legitimately have no git origin. */ }
  const result = verifyIdentity(target, env, remote, strict);
  const status = result.repositoryVerified ? 'VERIFIED' : 'UNVERIFIED (not an approval to edit or deploy)';
  console.log('Project identity: ' + status + '; checks: ' + (result.checks.join(', ') || 'none'));
  console.log('Expected repository: ' + target.repository + '; deployment: ' + target.productionDomain);
  console.log('Live deployment ownership must still be checked through Vercel before publishing.');
  return result;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { run(process.env, process.argv.includes('--strict')); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
