#!/bin/bash

# MetaForge Pro 自动安装脚本 (macOS/Linux)
# 版本: 1.0
# 作者: MetaForge Pro Team

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# 检查系统要求
check_system() {
    log "检查系统环境..."
    
    # 检查操作系统
    if [[ "$OSTYPE" == "darwin"* ]]; then
        OS="macos"
        log "检测到 macOS 系统"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        OS="linux"
        log "检测到 Linux 系统"
    else
        error "不支持的操作系统: $OSTYPE"
    fi
    
    # 检查必需工具
    command -v curl >/dev/null 2>&1 || error "需要安装 curl"
    command -v unzip >/dev/null 2>&1 || error "需要安装 unzip"
    
    log "系统环境检查完成"
}

# 检查Cursor编辑器
check_cursor() {
    log "检查 Cursor 编辑器..."
    
    if command -v cursor >/dev/null 2>&1; then
        CURSOR_VERSION=$(cursor --version 2>/dev/null | head -n 1 || echo "unknown")
        log "检测到 Cursor: $CURSOR_VERSION"
    elif [[ "$OS" == "macos" ]] && [[ -d "/Applications/Cursor.app" ]]; then
        log "检测到 Cursor.app 在 Applications 目录"
    elif [[ "$OS" == "linux" ]] && command -v code >/dev/null 2>&1; then
        log "检测到 VS Code，建议安装 Cursor 以获得最佳体验"
    else
        warn "未检测到 Cursor 编辑器"
        echo "请从以下地址下载安装 Cursor:"
        echo "https://cursor.sh/"
        read -p "已安装 Cursor？ (y/n): " cursor_installed
        if [[ $cursor_installed != "y" ]]; then
            error "请先安装 Cursor 编辑器"
        fi
    fi
}

# 提示用户选择安装方式
choose_install_method() {
    echo
    echo -e "${BLUE}选择安装方式:${NC}"
    echo "1) 新项目安装 (创建新项目目录)"
    echo "2) 现有项目安装 (在当前目录安装)"
    echo "3) 自定义路径安装"
    echo
    read -p "请选择 (1-3): " install_choice
    
    case $install_choice in
        1)
            install_mode="new_project"
            read -p "请输入项目名称: " project_name
            if [[ -z "$project_name" ]]; then
                error "项目名称不能为空"
            fi
            PROJECT_DIR="$PWD/$project_name"
            ;;
        2)
            install_mode="existing_project"
            PROJECT_DIR="$PWD"
            ;;
        3)
            install_mode="custom_path"
            read -p "请输入安装路径: " custom_path
            PROJECT_DIR="$custom_path"
            ;;
        *)
            error "无效选择"
            ;;
    esac
}

# 下载MetaForge框架
download_metaforge() {
    log "下载 MetaForge Pro 框架..."
    
    TEMP_DIR=$(mktemp -d)
    DOWNLOAD_URL="https://github.com/your-org/MetaForge-Pro/archive/main.zip"
    
    # 尝试下载
    if ! curl -L -o "$TEMP_DIR/metaforge.zip" "$DOWNLOAD_URL" --connect-timeout 30; then
        error "下载失败，请检查网络连接"
    fi
    
    # 解压文件
    log "解压框架文件..."
    if ! unzip -q "$TEMP_DIR/metaforge.zip" -d "$TEMP_DIR"; then
        error "解压失败"
    fi
    
    METAFORGE_SOURCE="$TEMP_DIR/MetaForge-Pro-main"
    
    if [[ ! -d "$METAFORGE_SOURCE" ]]; then
        error "框架文件结构异常"
    fi
    
    success "框架下载完成"
}

# 安装框架到项目目录
install_framework() {
    log "安装 MetaForge Pro 框架到 $PROJECT_DIR..."
    
    # 创建项目目录 (如果需要)
    if [[ "$install_mode" == "new_project" ]] || [[ "$install_mode" == "custom_path" ]]; then
        if [[ -d "$PROJECT_DIR" ]]; then
            warn "目录 $PROJECT_DIR 已存在"
            read -p "是否继续安装？ (y/n): " continue_install
            if [[ $continue_install != "y" ]]; then
                error "安装取消"
            fi
        else
            mkdir -p "$PROJECT_DIR" || error "创建目录失败: $PROJECT_DIR"
        fi
    fi
    
    # 复制.cursor目录
    log "复制 MetaForge 核心文件..."
    cp -r "$METAFORGE_SOURCE/.cursor" "$PROJECT_DIR/" || error "复制 .cursor 目录失败"
    
    # 复制README文件作为参考
    if [[ ! -f "$PROJECT_DIR/README.md" ]]; then
        cp "$METAFORGE_SOURCE/README.md" "$PROJECT_DIR/MetaForge-README.md" || warn "复制 README 失败"
    fi
    
    # 复制示例文件 (可选)
    read -p "是否复制示例项目？ (y/n): " copy_examples
    if [[ $copy_examples == "y" ]]; then
        mkdir -p "$PROJECT_DIR/examples"
        cp -r "$METAFORGE_SOURCE/examples/"* "$PROJECT_DIR/examples/" 2>/dev/null || warn "复制示例失败"
    fi
    
    # 复制文档 (可选)
    read -p "是否复制框架文档？ (y/n): " copy_docs
    if [[ $copy_docs == "y" ]]; then
        mkdir -p "$PROJECT_DIR/docs/metaforge"
        cp -r "$METAFORGE_SOURCE/docs/"* "$PROJECT_DIR/docs/metaforge/" 2>/dev/null || warn "复制文档失败"
    fi
    
    success "框架文件安装完成"
}

# 创建项目配置文件
create_project_config() {
    log "创建项目配置文件..."
    
    # 创建.env.example文件
    cat > "$PROJECT_DIR/.env.example" << 'EOF'
# MetaForge Pro 项目配置
METAFORGE_PROJECT_NAME=your-project-name
METAFORGE_VERSION=1.0
METAFORGE_AUTHOR=your-name

# 开发环境配置 (根据需要取消注释)
# NODE_ENV=development
# DATABASE_URL=postgresql://localhost:5432/mydb
# REDIS_URL=redis://localhost:6379
# NEXTAUTH_SECRET=your-secret-key
# NEXTAUTH_URL=http://localhost:3000

# API Keys (根据需要添加)
# OPENAI_API_KEY=your-openai-key
# GOOGLE_CLIENT_ID=your-google-client-id
# GOOGLE_CLIENT_SECRET=your-google-client-secret
EOF

    # 创建基础的README.md (如果不存在)
    if [[ ! -f "$PROJECT_DIR/README.md" ]]; then
        cat > "$PROJECT_DIR/README.md" << EOF
# ${project_name:-My Project}

> 使用 MetaForge Pro 框架开发的项目

## 🚀 快速开始

### 1. 配置环境
\`\`\`bash
cp .env.example .env
# 编辑 .env 文件，配置你的环境变量
\`\`\`

### 2. 启动 MetaForge 协作
在 Cursor 中打开项目，然后输入：
\`\`\`
开始 MetaForge 协作开发
\`\`\`

### 3. 开始开发
按照 AI 的引导，完成产品概念定义、需求规划、技术架构设计和开发实施。

## 📁 项目结构

\`\`\`
${project_name:-project}/
├── .cursor/                    # MetaForge Pro 框架
├── docs/                       # 项目文档
├── src/                        # 源代码 (将自动创建)
├── .env                        # 环境配置
└── README.md                   # 项目说明
\`\`\`

## 📚 相关资源

- [MetaForge Pro 文档](docs/metaforge/)
- [快速开始指南](docs/metaforge/getting-started.md)
- [最佳实践](docs/metaforge/best-practices.md)

---

*Generated by MetaForge Pro - The Ultimate AI Collaboration Framework*
EOF
    fi
    
    # 创建.gitignore文件 (如果不存在)
    if [[ ! -f "$PROJECT_DIR/.gitignore" ]]; then
        cat > "$PROJECT_DIR/.gitignore" << 'EOF'
# 依赖
node_modules/
.pnp
.pnp.js

# 生产构建
/build
/dist
/.next/
/out/

# 运行时数据
pids
*.pid
*.seed
*.pid.lock

# 环境变量
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# 日志
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# 运行时缓存
.nuxt
.cache
.parcel-cache

# 测试覆盖率
/coverage
/.nyc_output

# 编辑器
.vscode/
.idea/
*.swp
*.swo
*~

# 操作系统
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# 临时文件
*.tmp
*.temp
.tmp/
.temp/

# 数据库
*.db
*.sqlite
*.sqlite3

# 其他
.vercel
.netlify
EOF
    fi
    
    success "项目配置文件创建完成"
}

# 验证安装
verify_installation() {
    log "验证安装结果..."
    
    # 检查关键目录和文件
    local check_items=(
        ".cursor"
        ".cursor/roles"
        ".cursor/templates"
        ".cursor/rules"
        ".cursor/workflows"
    )
    
    for item in "${check_items[@]}"; do
        if [[ -d "$PROJECT_DIR/$item" ]] || [[ -f "$PROJECT_DIR/$item" ]]; then
            log "✓ $item"
        else
            error "✗ $item 缺失"
        fi
    done
    
    # 检查核心文件
    local core_files=(
        ".cursor/roles/pm-product-concept.md"
        ".cursor/rules/metaforge-workflow.mdc"
        ".cursor/templates/core-concepts-template.md"
    )
    
    for file in "${core_files[@]}"; do
        if [[ -f "$PROJECT_DIR/$file" ]]; then
            log "✓ $file"
        else
            warn "✗ $file 缺失"
        fi
    done
    
    success "安装验证完成"
}

# 显示下一步指导
show_next_steps() {
    echo
    echo -e "${BLUE}🎉 MetaForge Pro 安装完成！${NC}"
    echo
    echo -e "${GREEN}下一步操作:${NC}"
    echo "1. 进入项目目录:"
    echo "   cd $PROJECT_DIR"
    echo
    echo "2. 配置环境变量:"
    echo "   cp .env.example .env"
    echo "   # 编辑 .env 文件，设置你的配置"
    echo
    echo "3. 用 Cursor 打开项目:"
    echo "   cursor ."
    echo
    echo "4. 在 Cursor 中开始 AI 协作:"
    echo "   输入: '开始 MetaForge 协作开发'"
    echo
    echo -e "${YELLOW}📚 学习资源:${NC}"
    if [[ -d "$PROJECT_DIR/docs/metaforge" ]]; then
        echo "- 快速开始: docs/metaforge/getting-started.md"
        echo "- 最佳实践: docs/metaforge/best-practices.md"
    fi
    echo "- 在线文档: https://docs.metaforge-pro.com"
    echo "- 社区支持: https://community.metaforge-pro.com"
    echo
    echo -e "${GREEN}祝你使用 MetaForge Pro 开发愉快! 🚀${NC}"
}

# 清理临时文件
cleanup() {
    if [[ -n "$TEMP_DIR" ]] && [[ -d "$TEMP_DIR" ]]; then
        rm -rf "$TEMP_DIR"
    fi
}

# 主函数
main() {
    echo -e "${BLUE}"
    echo "=================================="
    echo "  MetaForge Pro 自动安装脚本"
    echo "=================================="
    echo -e "${NC}"
    
    # 设置清理陷阱
    trap cleanup EXIT
    
    # 执行安装步骤
    check_system
    check_cursor
    choose_install_method
    download_metaforge
    install_framework
    create_project_config
    verify_installation
    show_next_steps
    
    success "安装流程全部完成"
}

# 命令行参数处理
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            echo "MetaForge Pro 安装脚本"
            echo "用法: $0 [选项]"
            echo "选项:"
            echo "  -h, --help     显示帮助信息"
            echo "  -v, --version  显示版本信息"
            echo "  --no-examples  不安装示例项目"
            echo "  --no-docs      不安装文档"
            exit 0
            ;;
        -v|--version)
            echo "MetaForge Pro 安装脚本 v1.0"
            exit 0
            ;;
        --no-examples)
            NO_EXAMPLES=true
            shift
            ;;
        --no-docs)
            NO_DOCS=true
            shift
            ;;
        *)
            error "未知参数: $1"
            ;;
    esac
done

# 运行主函数
main