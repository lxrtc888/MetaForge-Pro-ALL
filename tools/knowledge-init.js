#!/usr/bin/env node

/**
 * MetaForge Pro 知识库初始化工具
 * 用于创建和管理全局知识库结构
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

class KnowledgeInitializer {
  constructor() {
    this.homeDir = os.homedir();
    this.globalKnowledgeDir = path.join(this.homeDir, '.metaforge-global');
    this.version = '1.0.0';
  }

  /**
   * 主初始化流程
   */
  async initialize() {
    console.log('🚀 MetaForge Pro 知识库初始化器 v' + this.version);
    console.log('📁 全局知识库目录:', this.globalKnowledgeDir);
    
    try {
      // 检查是否已存在
      await this.checkExisting();
      
      // 创建目录结构
      await this.createDirectoryStructure();
      
      // 初始化配置文件
      await this.initializeConfig();
      
      // 创建示例文件
      await this.createExamples();
      
      // 设置权限
      await this.setupPermissions();
      
      console.log('✅ 知识库初始化完成！');
      console.log('\n📚 知识库路径:');
      console.log('   全局配置:', path.join(this.globalKnowledgeDir, 'config'));
      console.log('   最佳实践:', path.join(this.globalKnowledgeDir, 'knowledge-base/best-practices'));
      console.log('   解决方案:', path.join(this.globalKnowledgeDir, 'knowledge-base/solution-patterns'));
      console.log('   经验教训:', path.join(this.globalKnowledgeDir, 'knowledge-base/lessons-learned'));
      
    } catch (error) {
      console.error('❌ 初始化失败:', error.message);
      process.exit(1);
    }
  }

  /**
   * 检查现有安装
   */
  async checkExisting() {
    if (fs.existsSync(this.globalKnowledgeDir)) {
      console.log('⚠️  发现现有知识库，正在升级...');
      // 备份现有配置
      const backupDir = `${this.globalKnowledgeDir}_backup_${Date.now()}`;
      fs.renameSync(this.globalKnowledgeDir, backupDir);
      console.log('📦 已备份现有知识库到:', backupDir);
    }
  }

  /**
   * 创建目录结构
   */
  async createDirectoryStructure() {
    console.log('📁 创建目录结构...');
    
    const directories = [
      // 知识库核心目录
      'knowledge-base',
      'knowledge-base/best-practices',
      'knowledge-base/best-practices/by-domain',
      'knowledge-base/best-practices/by-domain/ecommerce',
      'knowledge-base/best-practices/by-domain/fintech',
      'knowledge-base/best-practices/by-domain/healthcare',
      'knowledge-base/best-practices/by-domain/education',
      'knowledge-base/best-practices/by-domain/saas',
      'knowledge-base/best-practices/by-techstack',
      'knowledge-base/best-practices/by-techstack/react-node',
      'knowledge-base/best-practices/by-techstack/vue-python',
      'knowledge-base/best-practices/by-techstack/flutter-go',
      'knowledge-base/best-practices/by-techstack/nextjs-supabase',
      'knowledge-base/best-practices/by-scale',
      'knowledge-base/best-practices/by-scale/mvp',
      'knowledge-base/best-practices/by-scale/enterprise',
      'knowledge-base/best-practices/by-scale/platform',
      
      // 解决方案模式库
      'knowledge-base/solution-patterns',
      'knowledge-base/solution-patterns/architecture',
      'knowledge-base/solution-patterns/integration',
      'knowledge-base/solution-patterns/security',
      'knowledge-base/solution-patterns/performance',
      'knowledge-base/solution-patterns/data',
      'knowledge-base/solution-patterns/ui-ux',
      
      // 经验教训库
      'knowledge-base/lessons-learned',
      'knowledge-base/lessons-learned/pitfalls',
      'knowledge-base/lessons-learned/failures',
      'knowledge-base/lessons-learned/recoveries',
      'knowledge-base/lessons-learned/success-stories',
      
      // 进化模板库
      'knowledge-base/templates-evolved',
      'knowledge-base/templates-evolved/prd-variants',
      'knowledge-base/templates-evolved/arch-patterns',
      'knowledge-base/templates-evolved/code-snippets',
      
      // 项目注册表
      'project-registry',
      'project-registry/completed',
      'project-registry/ongoing',
      'project-registry/templates',
      
      // 分析数据
      'analytics',
      'analytics/trends',
      'analytics/metrics',
      'analytics/recommendations',
      
      // 配置和工具
      'config',
      'tools',
      'cache',
      'logs'
    ];

    directories.forEach(dir => {
      const fullPath = path.join(this.globalKnowledgeDir, dir);
      fs.mkdirSync(fullPath, { recursive: true });
      console.log('   ✓', dir);
    });
  }

  /**
   * 初始化配置文件
   */
  async initializeConfig() {
    console.log('⚙️  创建配置文件...');
    
    // 主配置文件
    const mainConfig = {
      version: this.version,
      created: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      settings: {
        autoExtraction: true,
        recommendationEngine: true,
        analyticsEnabled: true,
        maxProjectHistory: 100,
        cacheSize: "1GB",
        updateFrequency: "weekly"
      },
      engines: {
        similarity: {
          algorithm: "cosine",
          threshold: 0.7
        },
        recommendation: {
          weightBestPractices: 0.4,
          weightSimilarity: 0.3,
          weightSuccess: 0.3
        }
      }
    };

    fs.writeFileSync(
      path.join(this.globalKnowledgeDir, 'config/main.json'),
      JSON.stringify(mainConfig, null, 2)
    );

    // 索引配置
    const indexConfig = {
      indices: {
        bestPractices: [],
        solutionPatterns: [],
        lessonsLearned: [],
        projects: []
      },
      lastIndexed: new Date().toISOString(),
      indexVersion: "1.0"
    };

    fs.writeFileSync(
      path.join(this.globalKnowledgeDir, 'config/index.json'),
      JSON.stringify(indexConfig, null, 2)
    );

    // 标签体系配置
    const tagsConfig = {
      domains: [
        "ecommerce", "fintech", "healthcare", "education", "saas",
        "enterprise", "startup", "platform", "mobile", "web"
      ],
      techStacks: [
        "react-node", "vue-python", "flutter-go", "nextjs-supabase",
        "angular-dotnet", "svelte-rust", "django-postgres", "spring-mysql"
      ],
      scales: ["mvp", "small", "medium", "large", "enterprise", "platform"],
      complexities: ["simple", "moderate", "complex", "expert"],
      patterns: [
        "microservices", "monolith", "serverless", "spa", "ssr",
        "cqrs", "event-sourcing", "clean-architecture", "hexagonal"
      ]
    };

    fs.writeFileSync(
      path.join(this.globalKnowledgeDir, 'config/tags.json'),
      JSON.stringify(tagsConfig, null, 2)
    );

    console.log('   ✓ 主配置文件');
    console.log('   ✓ 索引配置文件');
    console.log('   ✓ 标签体系配置');
  }

  /**
   * 创建示例文件
   */
  async createExamples() {
    console.log('📄 创建示例文件...');
    
    // 示例最佳实践
    const exampleBestPractice = `# 示例最佳实践：React状态管理优化

## 📋 基本信息
- **实践ID**: \`BP-20241201-001\`
- **创建日期**: 2024-12-01
- **创建项目**: React电商平台
- **领域分类**: 电商
- **技术栈**: React + TypeScript + Zustand
- **项目规模**: 中型
- **置信度**: ⭐⭐⭐⭐⭐

## 🎯 实践概要
**实践标题**: 使用Zustand替代Redux进行轻量级状态管理

**核心价值**: 减少样板代码，提升开发效率，降低学习成本

**适用场景**: 
- 中小型React应用
- 不需要复杂状态调试的项目
- 团队对Redux感到过度复杂的情况

## 💡 解决方案
### 核心思路
使用Zustand作为状态管理工具，相比Redux减少了60%的样板代码，同时保持了状态管理的可预测性。

### 具体实施步骤
1. **安装Zustand**: \`npm install zustand\`
2. **创建状态store**: 定义简洁的状态管理逻辑
3. **组件中使用**: 通过hook直接访问状态

## 📊 效果验证
| 指标 | 实施前 | 实施后 | 改善幅度 |
|------|--------|--------|----------|
| 代码量 | 1000行 | 400行 | -60% |
| 开发时间 | 5天 | 2天 | -60% |
| Bug数量 | 8个 | 2个 | -75% |

这是一个示例最佳实践，展示了如何记录和分享项目经验。
`;

    fs.writeFileSync(
      path.join(this.globalKnowledgeDir, 'knowledge-base/best-practices/by-techstack/react-node/example-state-management.md'),
      exampleBestPractice
    );

    // 示例解决方案模式
    const exampleSolutionPattern = `# 示例解决方案模式：微服务API网关

## 📋 模式信息
- **模式ID**: \`SP-ARCH-001\`
- **模式名称**: API网关模式
- **模式分类**: 架构
- **成熟度**: 成熟
- **复杂度**: 中等

## 🎯 模式概要
**一句话描述**: 在微服务架构中使用统一的API网关处理所有外部请求

**模式意图**: 提供统一的API入口，处理认证、限流、路由等横切关注点

## 💡 解决方案
### 核心思路
通过部署一个API网关作为所有微服务的统一入口，处理横切关注点，简化客户端调用。

这是一个示例解决方案模式，展示了如何记录架构设计模式。
`;

    fs.writeFileSync(
      path.join(this.globalKnowledgeDir, 'knowledge-base/solution-patterns/architecture/example-api-gateway.md'),
      exampleSolutionPattern
    );

    // README文件
    const readmeContent = `# MetaForge Pro 全局知识库

这是您的MetaForge Pro全局知识库，用于存储和管理跨项目的最佳实践、解决方案模式和经验教训。

## 📁 目录结构
- \`knowledge-base/\`: 核心知识库
  - \`best-practices/\`: 最佳实践库
  - \`solution-patterns/\`: 解决方案模式库
  - \`lessons-learned/\`: 经验教训库
  - \`templates-evolved/\`: 进化模板库
- \`project-registry/\`: 项目注册表
- \`analytics/\`: 分析数据
- \`config/\`: 配置文件

## 🚀 使用方法
1. 项目完成后，知识会自动提取到相应分类
2. 新项目启动时，会自动推荐相关经验
3. 可以手动添加最佳实践和解决方案模式

## ⚙️ 配置
主要配置文件位于 \`config/\` 目录下，可以根据需要调整推荐算法和提取规则。

---
生成时间: ${new Date().toISOString()}
版本: ${this.version}
`;

    fs.writeFileSync(
      path.join(this.globalKnowledgeDir, 'README.md'),
      readmeContent
    );

    console.log('   ✓ 示例最佳实践');
    console.log('   ✓ 示例解决方案模式');
    console.log('   ✓ README文档');
  }

  /**
   * 设置权限
   */
  async setupPermissions() {
    console.log('🔒 设置权限...');
    
    // 确保目录可读写
    try {
      fs.chmodSync(this.globalKnowledgeDir, 0o755);
      console.log('   ✓ 目录权限设置完成');
    } catch (error) {
      console.warn('   ⚠️  权限设置失败，但这通常不影响使用');
    }
  }

  /**
   * 清理知识库
   */
  async cleanup() {
    console.log('🧹 清理知识库...');
    
    if (fs.existsSync(this.globalKnowledgeDir)) {
      const backupDir = `${this.globalKnowledgeDir}_removed_${Date.now()}`;
      fs.renameSync(this.globalKnowledgeDir, backupDir);
      console.log('✅ 知识库已移除并备份到:', backupDir);
    } else {
      console.log('ℹ️  未发现知识库，无需清理');
    }
  }

  /**
   * 显示状态
   */
  async status() {
    console.log('📊 知识库状态检查');
    console.log('📁 知识库路径:', this.globalKnowledgeDir);
    
    if (!fs.existsSync(this.globalKnowledgeDir)) {
      console.log('❌ 知识库未初始化');
      console.log('💡 运行 `node knowledge-init.js` 进行初始化');
      return;
    }

    // 检查配置文件
    const configPath = path.join(this.globalKnowledgeDir, 'config/main.json');
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      console.log('✅ 知识库已初始化');
      console.log('📅 创建时间:', config.created);
      console.log('🔄 最后更新:', config.lastUpdated);
      console.log('📦 版本:', config.version);
    }

    // 统计内容
    const stats = {
      bestPractices: 0,
      solutionPatterns: 0,
      lessonsLearned: 0,
      projects: 0
    };

    try {
      const bpDir = path.join(this.globalKnowledgeDir, 'knowledge-base/best-practices');
      if (fs.existsSync(bpDir)) {
        stats.bestPractices = this.countMarkdownFiles(bpDir);
      }

      const spDir = path.join(this.globalKnowledgeDir, 'knowledge-base/solution-patterns');
      if (fs.existsSync(spDir)) {
        stats.solutionPatterns = this.countMarkdownFiles(spDir);
      }

      const llDir = path.join(this.globalKnowledgeDir, 'knowledge-base/lessons-learned');
      if (fs.existsSync(llDir)) {
        stats.lessonsLearned = this.countMarkdownFiles(llDir);
      }

      const prDir = path.join(this.globalKnowledgeDir, 'project-registry/completed');
      if (fs.existsSync(prDir)) {
        stats.projects = this.countMarkdownFiles(prDir);
      }

      console.log('\n📈 内容统计:');
      console.log(`   🏆 最佳实践: ${stats.bestPractices}个`);
      console.log(`   🏗️  解决方案模式: ${stats.solutionPatterns}个`);
      console.log(`   📚 经验教训: ${stats.lessonsLearned}个`);
      console.log(`   📁 注册项目: ${stats.projects}个`);
      
    } catch (error) {
      console.warn('⚠️  统计信息获取失败:', error.message);
    }
  }

  /**
   * 递归统计markdown文件数量
   */
  countMarkdownFiles(dir) {
    let count = 0;
    try {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          count += this.countMarkdownFiles(fullPath);
        } else if (item.endsWith('.md')) {
          count++;
        }
      }
    } catch (error) {
      // 忽略权限错误等
    }
    return count;
  }
}

// 命令行处理
async function main() {
  const initializer = new KnowledgeInitializer();
  const command = process.argv[2] || 'init';

  switch (command) {
    case 'init':
      await initializer.initialize();
      break;
    case 'cleanup':
      await initializer.cleanup();
      break;
    case 'status':
      await initializer.status();
      break;
    case 'help':
      console.log(`
MetaForge Pro 知识库管理工具

用法:
  node knowledge-init.js [命令]

命令:
  init     初始化知识库 (默认)
  cleanup  清理知识库
  status   查看知识库状态
  help     显示帮助信息

示例:
  node knowledge-init.js init    # 初始化知识库
  node knowledge-init.js status  # 查看状态
      `);
      break;
    default:
      console.error('❌ 未知命令:', command);
      console.log('💡 运行 `node knowledge-init.js help` 查看帮助');
      process.exit(1);
  }
}

// 运行
if (require.main === module) {
  main().catch(error => {
    console.error('💥 执行失败:', error);
    process.exit(1);
  });
}

module.exports = KnowledgeInitializer;