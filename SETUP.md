# 🔧 MetaForge Pro 安装配置指南

> **详细的安装配置步骤，确保框架正确运行**

## 📋 系统要求

### 必需环境
- **Cursor编辑器** v0.38+ - [下载地址](https://cursor.sh/)
- **操作系统**: Windows 10+, macOS 12+, 或 Linux (Ubuntu 20.04+)
- **内存**: 最少8GB RAM (推荐16GB+)
- **存储**: 至少2GB可用空间

### 可选环境 (用于开发项目)
- **Node.js** v18+ - JavaScript项目开发
- **Python** v3.8+ - Python项目开发  
- **Git** v2.30+ - 版本控制
- **Docker** - 容器化部署 (可选)

## ⚡ 快速安装

### 方法1: 自动安装脚本 (推荐)

**macOS/Linux:**
```bash
curl -fsSL https://raw.githubusercontent.com/your-org/MetaForge-Pro/main/tools/setup.sh | bash
```

**Windows PowerShell:**
```powershell
iwr -useb https://raw.githubusercontent.com/your-org/MetaForge-Pro/main/tools/setup.bat | iex
```

### 方法2: 手动安装

**Step 1: 下载框架**
```bash
# Git方式
git clone https://github.com/your-org/MetaForge-Pro.git

# 或下载ZIP
curl -L https://github.com/your-org/MetaForge-Pro/archive/main.zip -o MetaForge-Pro.zip
unzip MetaForge-Pro.zip
```

**Step 2: 拷贝到项目**
```bash
# 创建新项目
mkdir my-project
cd my-project

# 拷贝框架核心
cp -r /path/to/MetaForge-Pro/.cursor .
cp /path/to/MetaForge-Pro/README.md ./MetaForge-README.md
```

**Step 3: 验证安装**
```bash
# 用Cursor打开项目
cursor .

# 在Cursor中输入测试指令
# "检查MetaForge框架配置状态"
```

## 🔧 详细配置

### Cursor编辑器配置

**1. 启用AI功能**
- 确保Cursor的AI功能已启用
- 设置合适的AI模型 (推荐GPT-4或Claude-3.5-Sonnet)
- 配置API密钥 (如需要)

**2. 工作区设置**
```json
// .vscode/settings.json (Cursor会自动读取)
{
  "files.associations": {
    "*.mdc": "markdown"
  },
  "markdown.preview.breaks": true,
  "markdown.preview.typographer": true
}
```

**3. 扩展推荐**
- Markdown Preview Enhanced
- Mermaid Preview
- GitLens (git项目)
- Prettier (代码格式化)

### 环境变量配置

**创建 `.env.example`**
```bash
# MetaForge Pro 配置
METAFORGE_PROJECT_NAME=your-project-name
METAFORGE_VERSION=1.0
METAFORGE_AUTHOR=your-name

# 开发环境配置 (可选)
NODE_ENV=development
DATABASE_URL=postgresql://localhost:5432/mydb
NEXTAUTH_SECRET=your-secret-key
```

**拷贝并配置**
```bash
cp .env.example .env
# 编辑 .env 文件，填入你的配置
```

## 📁 目录结构配置

### 标准项目结构
```
your-project/
├── 📁 .cursor/                    # MetaForge核心 (必需)
│   ├── 📁 roles/                  # AI角色定义
│   ├── 📁 templates/              # 文档模板
│   ├── 📁 rules/                  # 规则引擎
│   └── 📁 workflows/              # 工作流程
├── 📁 docs/                       # 项目文档 (自动创建)
│   ├── 📁 product/                # 产品文档
│   ├── 📁 technical/              # 技术文档
│   └── 📁 development/            # 开发文档
├── 📁 src/                        # 源码目录 (自动创建)
├── 📄 .env                        # 环境配置
└── 📄 README.md                   # 项目说明
```

### 目录权限设置
```bash
# 确保目录权限正确
chmod -R 755 .cursor/
chmod -R 755 docs/
chmod 644 .env
```

## 🔍 安装验证

### 基础验证清单
- [ ] Cursor编辑器正常打开项目
- [ ] `.cursor`目录及子目录完整
- [ ] AI可以识别MetaForge角色和规则
- [ ] 文档模板可以正常加载
- [ ] 工作流程可以正常执行

### 功能验证脚本
在Cursor中运行以下命令验证：

```
## 验证框架状态
检查MetaForge Pro框架配置

## 验证AI角色
列出所有可用的AI角色

## 验证模板系统  
显示所有文档模板

## 验证工作流程
展示开发工作流程

## 验证质量门禁
检查质量门禁配置
```

## 🛠️ 高级配置

### 团队协作配置

**1. Git配置 (团队项目)**
```bash
# 初始化Git仓库
git init
git add .cursor/
git commit -m "Add MetaForge Pro framework"

# 设置.gitignore
echo "node_modules/" >> .gitignore
echo ".env" >> .gitignore
echo "dist/" >> .gitignore
```

**2. 团队规范配置**
```bash
# 拷贝团队规范模板
cp .cursor/templates/team-guidelines-template.md docs/team-guidelines.md
```

### 自定义配置

**1. 角色定制**
```bash
# 拷贝角色模板进行自定义
cp .cursor/roles/ai-full-stack-engineer.md .cursor/roles/custom-developer.md
# 根据团队需求修改
```

**2. 工作流定制**
```bash
# 创建自定义工作流
cp .cursor/workflows/development-execution.md .cursor/workflows/custom-workflow.md
# 根据项目需求调整
```

**3. 质量标准定制**
```bash
# 自定义质量门禁
cp .cursor/rules/quality-gate.mdc .cursor/rules/custom-quality.mdc
# 根据质量要求调整
```

## 🐛 常见问题解决

### 问题1: Cursor无法识别.mdc文件
**解决方案:**
```json
// 在Cursor设置中添加
{
  "files.associations": {
    "*.mdc": "markdown"
  }
}
```

### 问题2: AI不遵循MetaForge流程
**解决方案:**
```
1. 检查.cursor/rules/目录是否完整
2. 重新加载Cursor工作区
3. 明确指令: "请激活MetaForge Pro框架"
```

### 问题3: 模板文件格式错误
**解决方案:**
```bash
# 检查文件编码
file .cursor/templates/*.md

# 转换为UTF-8编码
iconv -f gbk -t utf-8 filename.md > filename_utf8.md
```

### 问题4: 权限错误
**解决方案:**
```bash
# 修复目录权限
sudo chown -R $USER:$USER .cursor/
chmod -R 755 .cursor/
```

## 🔄 升级与维护

### 框架升级
```bash
# 备份当前配置
cp -r .cursor .cursor-backup

# 下载新版本
git pull origin main
# 或重新下载ZIP

# 合并配置
# 手动对比和合并自定义配置
```

### 定期维护
```bash
# 每月检查一次
1. 清理临时文件
2. 更新文档链接
3. 检查AI角色性能
4. 优化质量门禁标准
```

## 📞 技术支持

### 获取帮助
- 📧 **邮件支持**: support@metaforge-pro.com
- 💬 **在线社区**: https://community.metaforge-pro.com
- 📖 **文档中心**: https://docs.metaforge-pro.com
- 🐛 **问题报告**: https://github.com/your-org/MetaForge-Pro/issues

### 支持等级
- **社区支持**: 免费，48小时响应
- **专业支持**: 付费，4小时响应
- **企业支持**: 付费，1小时响应

---

## ✅ 安装完成检查清单

安装完成后，请确认以下项目：

- [ ] Cursor编辑器正常工作
- [ ] MetaForge框架目录完整
- [ ] AI可以识别和使用框架
- [ ] 文档模板正常加载
- [ ] 工作流程可以执行
- [ ] 质量门禁配置正确
- [ ] 示例项目可以访问
- [ ] 环境变量配置正确

**恭喜！MetaForge Pro已成功安装配置完成！** 🎉

现在你可以开始使用这个世界级的AI协作开发框架了。

**下一步**: 阅读[快速开始指南](docs/getting-started.md)开始你的第一个项目！