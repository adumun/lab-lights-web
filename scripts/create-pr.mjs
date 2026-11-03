import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const TARGET = 'adumun/lab-lights-web';
const BASE = 'master';
const BRANCH_PATTERN = /^(?:feat|fix|docs|test|chore|refactor|build|ci)\/([A-Z][A-Z0-9]*-\d+)-gh([1-9]\d*)-[a-z0-9][a-z0-9-]*$/;

function command(program, args, options = {}) {
  return execFileSync(program, args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    ...options,
  }).trim();
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function cleanTree() {
  assert(command('git', ['status', '--porcelain', '--untracked-files=all']) === '',
    'El árbol Git contiene cambios sin commitear. Haz commit o guárdalos antes de crear el PR.');
}

function parseGitHubRemote(url) {
  const match = url.match(/^(?:https:\/\/github\.com\/|git@github\.com:|ssh:\/\/git@github\.com\/)([^/]+)\/([^/]+)\/?$/i);
  assert(match, 'El remoto debe ser un repositorio de github.com accesible con SSH o HTTPS.');
  return {
    owner: match[1],
    name: match[2].replace(/\.git$/i, ''),
  };
}

function main() {
  assert(command('git', ['rev-parse', '--is-inside-work-tree']) === 'true', 'Ejecuta esto en un repositorio Git.');
  const branch = command('git', ['branch', '--show-current']);
  assert(branch && branch !== BASE, 'No se puede publicar un PR desde master ni desde un HEAD desacoplado.');

  const naming = BRANCH_PATTERN.exec(branch);
  assert(naming, 'Rama inválida. Usa, por ejemplo, chore/LAB-23-gh5-local-verify-pr.');
  const [, jiraKey, issueNumber] = naming;
  cleanTree();

  const remote = process.env.PR_REMOTE || 'origin';
  assert(/^[a-zA-Z0-9._-]+$/.test(remote), 'PR_REMOTE contiene caracteres no válidos.');
  const source = parseGitHubRemote(command('git', ['remote', 'get-url', '--push', remote]));
  assert(source.name.toLowerCase() === 'lab-lights-web', 'El remoto elegido no corresponde a lab-lights-web.');
  const head = source.owner.toLowerCase() === 'adumun' ? branch : `${source.owner}:${branch}`;

  command('gh', ['auth', 'status', '--hostname', 'github.com']);
  const issue = JSON.parse(command('gh', ['issue', 'view', issueNumber, '--repo', TARGET, '--json', 'number,state,body']));
  assert(issue.state === 'OPEN', `GitHub Issue #${issueNumber} no está abierto.`);
  assert(issue.body?.includes(jiraKey), `GitHub Issue #${issueNumber} no referencia ${jiraKey}.`);

  const subject = command('git', ['log', '-1', '--pretty=%s']);
  assert(subject.includes(jiraKey) && subject.includes(`#${issueNumber}`),
    'El último commit debe referenciar el Jira y el Issue GitHub.');

  const existing = JSON.parse(command('gh', [
    'pr', 'list', '--repo', TARGET, '--state', 'open', '--head', head,
    '--json', 'number,url', '--limit', '100',
  ]));
  assert(existing.length === 0, `Ya existe un PR abierto para esta rama: ${existing[0]?.url ?? ''}`);

  const shaBefore = command('git', ['rev-parse', 'HEAD']);
  console.log(`Verificando ${jiraKey} / Issue #${issueNumber} en ${shaBefore.slice(0, 12)} ...`);
  // Every failure from Make stops execution before the first network write.
  execFileSync('make', ['verify'], { stdio: 'inherit' });
  cleanTree();
  assert(command('git', ['branch', '--show-current']) === branch &&
    command('git', ['rev-parse', 'HEAD']) === shaBefore,
  'La rama o HEAD cambió durante la verificación. Ejecuta el comando otra vez.');

  console.log(`Validaciones locales satisfactorias. Publicando ${remote}/${branch} (sin force)...`);
  execFileSync('git', ['push', '-u', remote, `HEAD:refs/heads/${branch}`], { stdio: 'inherit' });

  const dir = mkdtempSync(join(tmpdir(), 'adumun-pr-'));
  const bodyFile = join(dir, 'pr-template.md');
  try {
    writeFileSync(bodyFile, `Jira: https://adumun.atlassian.net/browse/${jiraKey}
Closes #${issueNumber}

## Alcance implementado
- [ ] Describir los cambios reales y lo que queda fuera.

## Preflight de dependencias
- [ ] Declarar repositorios y resultado actual (PASS/BLOCKED) con evidencia.

## Validación local
- [x] \`make verify\` — PASS local para commit \`${shaBefore}\` (Node ${process.version})
- [ ] Comportamiento afectado y limitaciones verificadas.

## Compatibilidad, revisión y pendientes
- [ ] Compatibilidad/migraciones y deuda residual.
- [ ] Confirmar responsable de revisión. No marcar como integrado antes del merge.

Nota: estas son validaciones locales del autor, no checks CI alojados.
`, 'utf8');
    console.log('Se abrirá un editor para completar título y descripción; el PR se creará como borrador.');
    execFileSync('gh', [
      'pr', 'create', '--repo', TARGET, '--base', BASE, '--head', head,
      '--draft', '--editor', '--template', bodyFile,
    ], { stdio: 'inherit' });
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

try {
  main();
} catch (error) {
  const details = error?.stderr?.toString()?.trim();
  console.error(`create-pr: ${details || error.message}`);
  process.exitCode = 1;
}
