import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Handoff Documentation',
      collapsible: true,
      collapsed: false,
      items: ['handoff/overview', 'handoff/progress', 'handoff/next-steps'],
    },
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      collapsible: true,
      collapsed: false,
      link: {type: 'doc', id: 'getting-started'},
      items: [
        'getting-started/prerequisites',
        'getting-started/installation',
        'getting-started/environment-variables',
        'getting-started/running-locally',
      ],
    },
    'authentication',
    {
      type: 'category',
      label: 'Frontend',
      collapsible: true,
      collapsed: false,
      items: [
        'frontend/project-structure',
        'frontend/website-layout',
        'frontend/features',
      ],
    },
    {
      type: 'category',
      label: 'Backend',
      collapsible: true,
      collapsed: false,
      items: ['backend/project-structure', 'backend/implementation'],
    },
    {
      type: 'category',
      label: 'Deployment',
      collapsible: true,
      collapsed: false,
      items: [
        'deployment/overview',
        'deployment/aws',
        'deployment/aws-operations',
        'deployment/firebase',
        'deployment/resend',
      ],
    },
  ],
};

export default sidebars;
