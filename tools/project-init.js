#!/usr/bin/env node

/**
 * MetaForge Pro 项目初始化脚本
 * 自动创建项目结构、配置文件和初始化开发环境
 * 
 * 使用方式:
 * node project-init.js my-awesome-project
 * 或
 * node project-init.js my-awesome-project --template=todo-app
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

// 颜色输出函数
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✅${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}❌${colors.reset} ${msg}`),
  step: (msg) => console.log(`${colors.cyan}🔄${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.bright}${colors.magenta}🚀 ${msg}${colors.reset}\n`)
};

// ClaudeCode增强的产品设计模板配置
const templates = {
  // 基础功能模板
  'todo-app': {
    name: 'Todo应用',
    description: '简单的任务管理应用，包含用户认证、任务CRUD、分类管理',
    techStack: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'Prisma', 'PostgreSQL'],
    features: ['用户注册登录', '任务管理', '分类管理', '搜索筛选', '响应式设计'],
    designStyle: 'modern-clean',
    prototypeTemplate: 'task-management'
  },
  'blog': {
    name: '博客系统',
    description: '现代化的博客平台，支持Markdown编辑、评论系统、SEO优化',
    techStack: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'MDX', 'Prisma'],
    features: ['文章管理', 'Markdown编辑器', '评论系统', 'SEO优化', '标签分类'],
    designStyle: 'content-focused',
    prototypeTemplate: 'content-platform'
  },
  'ecommerce': {
    name: '电商平台',
    description: '完整的电商解决方案，包含商品管理、购物车、支付集成',
    techStack: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'Stripe', 'Prisma'],
    features: ['商品管理', '购物车', '支付集成', '订单管理', '用户中心'],
    designStyle: 'commercial-professional',
    prototypeTemplate: 'commerce-platform'
  },

  // ClaudeCode专用模板
  'product-design-studio': {
    name: '产品设计工作室 (ClaudeCode增强)',
    description: '集成ClaudeCode产品设计理念的专业设计工作室，支持原型设计、版本规划',
    techStack: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'Mermaid', 'Prisma'],
    features: ['产品路线图规划', 'MVP原型设计', '版本迭代管理', '设计评审系统', '协作工具集成'],
    designStyle: 'design-studio',
    prototypeTemplate: 'design-studio',
    claudeCodeEnhanced: true
  },
  'saas-platform': {
    name: 'SaaS平台 (ClaudeCode增强)',
    description: '基于ClaudeCode理念的企业级SaaS平台，支持多租户、订阅管理',
    techStack: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'Stripe', 'Prisma', 'PostgreSQL'],
    features: ['多租户架构', '订阅管理', '用户权限管理', '数据分析', 'API管理'],
    designStyle: 'enterprise-professional',
    prototypeTemplate: 'saas-platform',
    claudeCodeEnhanced: true
  },
  'creative-workspace': {
    name: '创意工作空间 (ClaudeCode增强)',
    description: '融合ClaudeCode设计思维的创意工作平台，支持项目协作、灵感管理',
    techStack: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'Canvas API', 'Prisma'],
    features: ['项目协作', '创意画板', '版本控制', '评论系统', '导出分享'],
    designStyle: 'creative-modern',
    prototypeTemplate: 'creative-workspace',
    claudeCodeEnhanced: true
  },

  // 基础模板
  'custom': {
    name: '自定义项目',
    description: '空白项目模板，根据需求自定义功能',
    techStack: ['Next.js 15', 'TypeScript', 'Tailwind CSS'],
    features: ['基础项目结构', 'MetaForge框架集成'],
    designStyle: 'minimalist',
    prototypeTemplate: 'blank-canvas'
  }
};

// ClaudeCode原型设计风格配置
const prototypeStyles = {
  'modern-clean': {
    name: '现代简约风格',
    description: '类似Notion的设计风格，注重内容和功能',
    asciiStyle: 'minimal',
    colorScheme: 'neutral-grays'
  },
  'creative-modern': {
    name: '创意现代风格',
    description: '类似Linear的设计风格，富有创新感',
    asciiStyle: 'geometric',
    colorScheme: 'vibrant-accents'
  },
  'commercial-professional': {
    name: '商务专业风格',
    description: '类似Salesforce的企业级设计风格',
    asciiStyle: 'corporate',
    colorScheme: 'professional-blues'
  },
  'design-studio': {
    name: '设计工作室风格',
    description: '专为设计师优化的工作环境',
    asciiStyle: 'artistic',
    colorScheme: 'creative-palette'
  }
};

// 命令行参数解析
function parseArgs() {
  const args = process.argv.slice(2);
  const projectName = args[0];
  
  if (!projectName) {
    log.error('请提供项目名称: node project-init.js <project-name>');
    process.exit(1);
  }

  const options = {};
  args.slice(1).forEach(arg => {
    if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=');
      options[key] = value || true;
    }
  });

  return { projectName, options };
}

// 验证项目名称
function validateProjectName(name) {
  const validName = /^[a-zA-Z0-9-_]+$/.test(name);
  if (!validName) {
    log.error('项目名称只能包含字母、数字、短横线和下划线');
    return false;
  }
  
  if (fs.existsSync(name)) {
    log.error(`目录 ${name} 已存在`);
    return false;
  }
  
  return true;
}

// 创建项目目录结构
function createProjectStructure(projectName) {
  log.step('创建项目目录结构...');
  
  const directories = [
    projectName,
    `${projectName}/src`,
    `${projectName}/src/app`,
    `${projectName}/src/components`,
    `${projectName}/src/lib`,
    `${projectName}/src/types`,
    `${projectName}/public`,
    `${projectName}/docs`,
    `${projectName}/docs/product`,
    `${projectName}/docs/technical`,
    `${projectName}/docs/development`,
    `${projectName}/prisma`
  ];

  directories.forEach(dir => {
    fs.mkdirSync(dir, { recursive: true });
  });

  log.success('项目目录结构创建完成');
}

// 拷贝MetaForge框架文件
function copyMetaForgeFramework(projectName) {
  log.step('拷贝MetaForge Pro框架文件...');
  
  const sourcePath = path.join(__dirname, '..', '.cursor');
  const targetPath = path.join(projectName, '.cursor');
  
  if (!fs.existsSync(sourcePath)) {
    log.error('找不到MetaForge框架文件，请确保在正确的目录运行此脚本');
    process.exit(1);
  }

  // 递归拷贝.cursor目录
  function copyRecursive(src, dest) {
    const stats = fs.statSync(src);
    
    if (stats.isDirectory()) {
      fs.mkdirSync(dest, { recursive: true });
      const files = fs.readdirSync(src);
      
      files.forEach(file => {
        copyRecursive(path.join(src, file), path.join(dest, file));
      });
    } else {
      fs.copyFileSync(src, dest);
    }
  }

  copyRecursive(sourcePath, targetPath);
  log.success('MetaForge框架文件拷贝完成');
}

// 生成基础配置文件
function generateConfigFiles(projectName, projectInfo) {
  log.step('生成配置文件...');

  // 生成package.json
  const packageJson = {
    name: projectInfo.name,
    version: '0.1.0',
    description: projectInfo.description,
    private: true,
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
      lint: 'next lint',
      'type-check': 'tsc --noEmit',
      'db:generate': 'prisma generate',
      'db:push': 'prisma db push',
      'db:studio': 'prisma studio',
      test: 'jest',
      'test:watch': 'jest --watch'
    },
    dependencies: {
      'next': '^15.0.0',
      'react': '^18.2.0',
      'react-dom': '^18.2.0',
      '@prisma/client': '^5.0.0',
      'lucide-react': '^0.400.0'
    },
    devDependencies: {
      '@types/node': '^20.0.0',
      '@types/react': '^18.2.0',
      '@types/react-dom': '^18.2.0',
      'typescript': '^5.0.0',
      'eslint': '^8.0.0',
      'eslint-config-next': '^15.0.0',
      'tailwindcss': '^3.4.0',
      'postcss': '^8.4.0',
      'autoprefixer': '^10.4.0',
      'prisma': '^5.0.0'
    }
  };

  fs.writeFileSync(
    path.join(projectName, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );

  // ClaudeCode增强的README.md生成
  let claudeCodeBadge = '';
  if (templates[projectInfo.template].claudeCodeEnhanced) {
    claudeCodeBadge = ' ✨ *ClaudeCode增强版*';
  }

  const readme = `# ${projectInfo.displayName || projectInfo.name}${claudeCodeBadge}

> ${projectInfo.description}

## 🚀 快速开始

### 1. 安装依赖
\`\`\`bash
npm install
\`\`\`

### 2. 配置环境变量
\`\`\`bash
cp .env.example .env
# 编辑 .env 文件，配置你的环境变量
\`\`\`

### 3. 启动开发服务器
\`\`\`bash
npm run dev
\`\`\`

### 4. 开始MetaForge协作开发
在Cursor中打开项目，然后输入：
\`\`\`
开始 MetaForge 协作开发，我需要进一步完善这个项目。
\`\`\`

## 🎨 设计风格配置

**原型设计风格**: ${prototypeStyles[projectInfo.designStyle || templates[projectInfo.template].designStyle]?.name || '现代简约风格'}
**ASCII设计风格**: ${prototypeStyles[projectInfo.designStyle || templates[projectInfo.template].designStyle]?.asciiStyle || 'minimal'}
**配色方案**: ${prototypeStyles[projectInfo.designStyle || templates[projectInfo.template].designStyle]?.colorScheme || 'neutral-grays'}

## 🛠 技术栈

${templates[projectInfo.template].techStack.map(tech => `- ${tech}`).join('\n')}

## ✨ 功能特性

${templates[projectInfo.template].features.map(feature => `- ${feature}`).join('\n')}

## 📚 开发指南

### 使用MetaForge Pro + ClaudeCode融合框架
1. 项目已集成MetaForge Pro + ClaudeCode融合框架
2. 在Cursor中激活AI协作开发
3. 遵循框架的角色和工作流程
4. 利用质量门禁确保代码质量

### ClaudeCode增强功能
${templates[projectInfo.template].claudeCodeEnhanced ? `
- ✅ 产品路线图自动生成
- ✅ MVP原型设计支持
- ✅ 版本规划智能助手
- ✅ 架构设计蓝图生成
- ✅ 实现计划自动制定
- ✅ ASCII原型图设计
- ✅ Mermaid流程图支持` : '此模板为标准版，如需ClaudeCode增强功能请选择对应的模板。'}

### 可用救援指令
在开发过程中，你可以使用以下ClaudeCode增强的救援指令：
- \`🕵️ 逻辑检查\` - 启动逻辑侦探模式，检查需求模糊点
- \`📋 版本规划\` - 启动版本规划师模式，制定产品路线图
- \`🎨 设计顾问\` - 启动设计顾问模式，获取UI/UX建议
- \`⚡ 快速评估\` - 快速评估项目现状和改进建议

---

*由 MetaForge Pro + ClaudeCode 融合框架生成 - 赋能AI协作开发* 🚀✨
`;

  fs.writeFileSync(path.join(projectName, 'README.md'), readme);

  log.success('配置文件生成完成');
}

// 显示完成信息
function showCompletion(projectName, projectInfo) {
  log.title('🎉 项目创建成功！');
  
  console.log(`${colors.green}✨ ${projectInfo.displayName || projectInfo.name} 项目已创建完成！${colors.reset}\n`);
  
  console.log(`${colors.bright}📁 项目位置:${colors.reset} ${path.resolve(projectName)}`);
  console.log(`${colors.bright}🎯 项目模板:${colors.reset} ${templates[projectInfo.template].name}`);
  
  console.log(`\n${colors.bright}🚀 下一步操作:${colors.reset}`);
  console.log(`${colors.cyan}1.${colors.reset} 进入项目目录: ${colors.yellow}cd ${projectName}${colors.reset}`);
  console.log(`${colors.cyan}2.${colors.reset} 安装依赖: ${colors.yellow}npm install${colors.reset}`);
  console.log(`${colors.cyan}3.${colors.reset} 用Cursor打开项目: ${colors.yellow}cursor .${colors.reset}`);
  console.log(`${colors.cyan}4.${colors.reset} 在Cursor中输入: ${colors.yellow}"开始 MetaForge 协作开发"${colors.reset}`);
  
  console.log(`\n${colors.bright}${colors.green}祝你使用 MetaForge Pro 开发愉快！ 🚀${colors.reset}\n`);
}

// 主函数
async function main() {
  try {
    log.title('MetaForge Pro 项目初始化工具');
    
    const { projectName, options } = parseArgs();
    
    // 验证项目名称
    if (!validateProjectName(projectName)) {
      process.exit(1);
    }
    
    // ClaudeCode增强的模板选择
    let template = options.template || 'custom';
    if (!templates[template]) {
      log.warning(`模板 ${template} 不存在，使用默认模板`);
      template = 'custom';
    }

    const projectInfo = { ...templates[template], template };

    // ClaudeCode原型设计风格选择
    if (!options.skipPrototype) {
      console.log(`\n${colors.bright}${colors.cyan}🎨 ClaudeCode 原型设计配置${colors.reset}\n`);

      // 显示ClaudeCode增强标识
      if (templates[template].claudeCodeEnhanced) {
        console.log(`${colors.green}✨ 此模板已集成ClaudeCode产品设计理念！${colors.reset}\n`);
      }

      // 显示原型设计风格信息
      const designStyle = templates[template].designStyle;
      if (designStyle && prototypeStyles[designStyle]) {
        const styleInfo = prototypeStyles[designStyle];
        console.log(`${colors.yellow}🎯 推荐设计风格:${colors.reset} ${styleInfo.name}`);
        console.log(`${colors.yellow}📝 风格描述:${colors.reset} ${styleInfo.description}\n`);
      }

      // ClaudeCode增强功能提示
      if (templates[template].claudeCodeEnhanced) {
        console.log(`${colors.magenta}🚀 ClaudeCode增强功能:${colors.reset}`);
        console.log(`  • 产品路线图自动生成`);
        console.log(`  • MVP原型设计支持`);
        console.log(`  • 版本规划智能助手`);
        console.log(`  • 架构设计蓝图生成`);
        console.log(`  • 实现计划自动制定\n`);
      }

      // 询问是否需要自定义原型设计风格
      if (!options.yes) {
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });

        await new Promise((resolve) => {
          rl.question(`${colors.cyan}❓ 是否需要自定义原型设计风格？(y/N): ${colors.reset}`, (answer) => {
            if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
              console.log(`\n${colors.bright}可用的设计风格:${colors.reset}`);
              Object.entries(prototypeStyles).forEach(([key, style], index) => {
                console.log(`  ${index + 1}. ${style.name} - ${style.description}`);
              });

              rl.question(`\n${colors.cyan}请选择设计风格编号 (1-${Object.keys(prototypeStyles).length}): ${colors.reset}`, (styleChoice) => {
                const styleIndex = parseInt(styleChoice) - 1;
                const styleKeys = Object.keys(prototypeStyles);
                if (styleIndex >= 0 && styleIndex < styleKeys.length) {
                  const selectedStyle = styleKeys[styleIndex];
                  projectInfo.designStyle = selectedStyle;
                  console.log(`${colors.green}✅ 已选择: ${prototypeStyles[selectedStyle].name}${colors.reset}\n`);
                } else {
                  console.log(`${colors.yellow}⚠️ 无效选择，使用默认风格${colors.reset}\n`);
                }
                rl.close();
                resolve();
              });
            } else {
              rl.close();
              resolve();
            }
          });
        });
      }
    }

    // 更新projectInfo，包含ClaudeCode增强信息
    projectInfo.name = projectName;
    projectInfo.displayName = projectName;
    projectInfo.template = template;
    
    // 创建项目
    createProjectStructure(projectName);
    copyMetaForgeFramework(projectName);
    generateConfigFiles(projectName, projectInfo);
    
    // 显示完成信息
    showCompletion(projectName, projectInfo);
    
  } catch (error) {
    log.error(`项目创建失败: ${error.message}`);
    process.exit(1);
  }
}

// 运行主函数
if (require.main === module) {
  main();
}

module.exports = {
  main,
  templates,
  validateProjectName,
  createProjectStructure,
  copyMetaForgeFramework
};