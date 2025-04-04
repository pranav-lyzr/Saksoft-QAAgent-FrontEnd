// const API_BASE_URL = 'http://localhost:8001';
const API_BASE_URL = 'https://saksoft-qa-agent.lyzr.app';

// Project APIs
export const createProject = async (name: string) => {
  const response = await fetch(`${API_BASE_URL}/create_project`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  });
  
  if (!response.ok) {
    throw new Error('Failed to create project');
  }
  
  return response.json();
};

export const addGithubRepo = async (projectId: string, githubUrl: string) => {
  const response = await fetch(`${API_BASE_URL}/project/${projectId}/repo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ github_url: githubUrl })
  });
  
  if (!response.ok) {
    throw new Error('Failed to add repository');
  }
  
  return response.json();
};

export const getProject = async (projectId: string) => {
  const response = await fetch(`${API_BASE_URL}/project/${projectId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch project');
  }
  
  return response.json();
};

export const getProjects = async () => {
  const response = await fetch(`${API_BASE_URL}/projects`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch projects');
  }
  
  return response.json();
};

// User Stories APIs
export const createUserStory = async (projectId: string, text: string) => {
  const response = await fetch(`${API_BASE_URL}/project/${projectId}/user_story`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  
  if (!response.ok) {
    throw new Error('Failed to create user story');
  }
  
  return response.json();
};

export const analyzeUserStories = async (projectId: string) => {
  const response = await fetch(`${API_BASE_URL}/project/${projectId}/analyze_stories`, {
    method: 'POST'
  });
  
  if (!response.ok) {
    throw new Error('Failed to analyze user stories');
  }
  
  return response.json();
};

export const getUserStories = async (projectId: string) => {
  const response = await fetch(`${API_BASE_URL}/project/${projectId}/user_stories`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch user stories');
  }
  
  return response.json();
};

export const getUserStoryMetadata = async (projectId: string) => {
  const response = await fetch(`${API_BASE_URL}/project/${projectId}/user_stories/metadata`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch user story metadata');
  }
  
  return response.json();
};

export const searchUserStories = async (projectId: string, searchParams: any) => {
  const response = await fetch(`${API_BASE_URL}/project/${projectId}/search_stories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(searchParams)
  });
  
  if (!response.ok) {
    throw new Error('Failed to search user stories');
  }
  
  return response.json();
};

// Technical Insights APIs
export const createTechnicalInsight = async (projectId: string, text: string) => {
  const response = await fetch(`${API_BASE_URL}/project/${projectId}/technical_insight`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  
  if (!response.ok) {
    throw new Error('Failed to create technical insight');
  }
  
  return response.json();
};

export const analyzeTechnicalInsights = async (projectId: string) => {
  const response = await fetch(`${API_BASE_URL}/project/${projectId}/analyze_insights`, {
    method: 'POST'
  });
  
  if (!response.ok) {
    throw new Error('Failed to analyze technical insights');
  }
  
  return response.json();
};

export const getTechnicalInsights = async (projectId: string, analyzed?: boolean) => {
  let url = `${API_BASE_URL}/project/${projectId}/technical_insights`;
  if (analyzed !== undefined) {
    url += `?analyzed=${analyzed}`;
  }
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch technical insights');
  }
  
  return response.json();
};

// Test Plan Generation
export const generateTestPlan = async (projectId: string) => {
  const response = await fetch(`${API_BASE_URL}/generate-test-plan?project_id=${projectId}`);
  
  if (!response.ok) {
    throw new Error('Failed to generate test plan');
  }
  
  return response.json();
};

export const getTestPlans = async (projectId: string) => {
  const response = await fetch(`${API_BASE_URL}/project/${projectId}/test-plans`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch test plans');
  }
  
  return response.json();
};


export const processPRD = async (projectId: string, prdText: string) => {
  const response = await fetch(`${API_BASE_URL}/project/${projectId}/process_prd`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prd_text: prdText })
  });
  
  if (!response.ok) {
    throw new Error('Failed to process PRD document');
  }
  
  return response.json();
};

export const processArchitectureDoc = async (projectId: string, docText: string) => {
  const response = await fetch(`${API_BASE_URL}/project/${projectId}/process_arch_doc`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ doc_text: docText })
  });
  
  if (!response.ok) {
    throw new Error('Failed to process architecture document');
  }
  
  return response.json();
};

export const generateTests = async (projectId: string, testType: string) => {
  const response = await fetch(`${API_BASE_URL}/project/${projectId}/generate_tests?test_type=${testType}`, {
    method: 'POST'
  });
  
  if (!response.ok) {
    throw new Error(`Failed to generate ${testType} tests`);
  }
  
  return response.json();
};


export const connectNotionIntegration = async (projectId: string, databaseId: string, internalToken: string) => {
  const response = await fetch(`${API_BASE_URL}/project/${projectId}/notion/connect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      database_id: databaseId, 
      internal_token: internalToken 
    })
  });
  
  if (!response.ok) {
    throw new Error('Failed to connect Notion integration');
  }
  
  return response.json();
};

export const getNotionPages = async (projectId: string) => {
  const response = await fetch(`${API_BASE_URL}/project/${projectId}/notion/pages`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch Notion pages');
  }
  
  return response.json();
};

export const getNotionPageContent = async (projectId: string, pageId: string) => {
  const response = await fetch(`${API_BASE_URL}/project/${projectId}/notion/pages/${pageId}/content`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch Notion page content');
  }
  
  return response.json();
};


export const analyzeNotionPage = async (projectId: string, pageId: string) => {
  const response = await fetch(`${API_BASE_URL}/project/${projectId}/notion/pages/${pageId}/analyze`, {
    method: 'POST'
  });
  
  if (!response.ok) {
    throw new Error('Failed to analyze Notion page');
  }
  
  return response.json();
};


export const addJiraToken = async (projectId: string, email: string, apiToken: string, jiraUrl: string) => {
  const response = await fetch(`${API_BASE_URL}/project/${projectId}/jira/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      email,
      api_token: apiToken,
      jira_url: jiraUrl
    })
  });
  
  if (!response.ok) {
    throw new Error('Failed to add Jira token');
  }
  
  return response.json();
};

export const syncJiraIssues = async (projectId: string, syncRequest: any) => {
  const response = await fetch(`${API_BASE_URL}/project/${projectId}/jira/sync`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(syncRequest)
  });
  
  if (!response.ok) {
    throw new Error('Failed to sync Jira issues');
  }
  
  return response.json();
};

export const getJiraIssues = async (projectId: string) => {
  const response = await fetch(`${API_BASE_URL}/project/${projectId}/jira/issues`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch Jira issues');
  }
  
  return response.json();
};

export const removeJiraToken = async (projectId: string) => {
  const response = await fetch(`${API_BASE_URL}/project/${projectId}/jira/token`, {
    method: 'DELETE'
  });
  
  if (!response.ok) {
    throw new Error('Failed to remove Jira integration');
  }
  
  return response.json();
};
