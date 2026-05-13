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
    'intro',
    'getting-started',
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
        'frontend/deployment',
      ],
    },
    {
      type: 'category',
      label: 'Backend',
      collapsible: true,
      collapsed: false,
      items: [
        'backend/project-structure',
        'backend/implementation',
        'backend/deployment',
      ],
    },
    {
      type: 'category',
      label: 'Handoff Documentation',
      collapsible: true,
      collapsed: false,
      items: ['handoff/overview', 'handoff/progress', 'handoff/next-steps'],
    },
  ],
};

export default sidebars;
