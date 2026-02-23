import { db } from "@/server/db";
import { Octokit } from "@octokit/rest";

function getOctokit(accessToken: string) {
  return new Octokit({ auth: accessToken });
}

export interface GitHubPullRequestFile {
  sha: string;
  filename: string;
  status:
    | "added"
    | "removed"
    | "modified"
    | "renamed"
    | "copied"
    | "changed"
    | "unchanged";
  additions: number;
  deletions: number;
  changes: number;
  patch?: string;
  previous_filename?: string;
}

export interface GitHubUser {
  login: string;
  avatar_url: string;
}

export interface GitHubPullRequest {
  id: number;
  number: number;
  title: string;
  state: "open" | "closed";
  html_url: string;
  user: GitHubUser;
  created_at: string;
  updated_at: string;
  merged_at: string | null;
  draft: boolean;
  head: {
    ref: string;
    sha: string;
  };
  base: {
    ref: string;
  };
  additions: number;
  deletions: number;
  changed_files: number;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
}

export async function getGitHubAccessToken(
  userId: string,
): Promise<string | null> {
  const account = await db.account.findFirst({
    where: {
      userId,
      providerId: "github",
    },
    select: {
      accessToken: true,
    },
  });

  return account?.accessToken ?? null;
}

export async function fetchGitHubRepos(
  accessToken: string,
): Promise<GitHubRepo[]> {
  const repos: GitHubRepo[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const response = await fetch(
      `https://api.github.com/user/repos?per_page=${perPage}&page=${page}&sort=updated`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch GitHub repos: ${response.status}`);
    }

    const data = (await response.json()) as GitHubRepo[];
    repos.push(...data);
    if (data.length < perPage) break;
    page++;
  }

  return repos;
}

export async function fetchPullRequests(
  accessToken: string,
  owner: string,
  repo: string,
  state: "open" | "closed" | "all" = "open",
): Promise<GitHubPullRequest[]> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/pulls?state=${state}&per_page=30&sort=updated&direction=desc`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  const pulls = (await response.json()) as GitHubPullRequest[];

  // The list endpoint doesn't include additions/deletions/changed_files,
  // so we fetch each PR individually to get those stats.
  const detailed = await Promise.all(
    pulls.map((pr) => fetchPullRequest(accessToken, owner, repo, pr.number)),
  );

  return detailed;
}

export async function fetchPullRequest(
  accessToken: string,
  owner: string,
  repo: string,
  prNumber: number,
): Promise<GitHubPullRequest> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  return (await response.json()) as GitHubPullRequest;
}

export async function fetchPullRequestFiles(
  accessToken: string,
  owner: string,
  repo: string,
  prNumber: number,
): Promise<GitHubPullRequestFile[]> {
  const files: GitHubPullRequestFile[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/files?per_page=${perPage}&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = (await response.json()) as GitHubPullRequestFile[];
    files.push(...data);

    if (data.length < perPage) break;
    page++;
  }

  return files;
}


interface CreateCommitInput {
  owner: string;
  repo: string;
  branch: string;
  filePath: string;
  content: string;
  message: string;
  accessToken: string;
}

export async function createCommitWithFix(
  input: CreateCommitInput,
): Promise<{ commitSha: string; branchName: string }> {
  const octokit = getOctokit(input.accessToken);

  // Get the current branch reference
  const { data: ref } = await octokit.rest.git.getRef({
    owner: input.owner,
    repo: input.repo,
    ref: `heads/${input.branch}`,
  });

  const currentCommitSha = ref.object.sha;

  // Get the current commit to get the tree
  const { data: currentCommit } = await octokit.rest.git.getCommit({
    owner: input.owner,
    repo: input.repo,
    commit_sha: currentCommitSha,
  });

  // Create a new blob with the fixed content
  const { data: blob } = await octokit.rest.git.createBlob({
    owner: input.owner,
    repo: input.repo,
    content: Buffer.from(input.content).toString("base64"),
    encoding: "base64",
  });

  // Create a new tree with the updated file
  const { data: newTree } = await octokit.rest.git.createTree({
    owner: input.owner,
    repo: input.repo,
    base_tree: currentCommit.tree.sha,
    tree: [
      {
        path: input.filePath,
        mode: "100644",
        type: "blob",
        sha: blob.sha,
      },
    ],
  });

  // Create a new commit
  const { data: newCommit } = await octokit.rest.git.createCommit({
    owner: input.owner,
    repo: input.repo,
    message: input.message,
    tree: newTree.sha,
    parents: [currentCommitSha],
  });

  // Update the branch reference
  await octokit.rest.git.updateRef({
    owner: input.owner,
    repo: input.repo,
    ref: `heads/${input.branch}`,
    sha: newCommit.sha,
  });

  return {
    commitSha: newCommit.sha,
    branchName: input.branch,
  };
}

interface GetFileContentInput {
  owner: string;
  repo: string;
  path: string;
  ref: string;
  accessToken: string;
}

export async function getFileContent(
  input: GetFileContentInput,
): Promise<string> {
  const octokit = getOctokit(input.accessToken);

  const { data } = await octokit.rest.repos.getContent({
    owner: input.owner,
    repo: input.repo,
    path: input.path,
    ref: input.ref,
  });

  if ("content" in data && data.content) {
    return Buffer.from(data.content, "base64").toString("utf-8");
  }

  throw new Error("File content not found");
}
